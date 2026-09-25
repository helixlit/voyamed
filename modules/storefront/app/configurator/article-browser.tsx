"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Article from "./article";
import { ShopArticle } from "@voyamed/catalog/contract";
import { ArticleWithId } from "@/utils/types";
import Link from "next/link";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import MedicineNotice from "@/components/medicine-notice";

const take = 100;
const quickSearches = ["Sonnenschutz", "Mückenschutz", "Durchfall", "Wunde", "Husten", "Schmerz"];

export default function ArticleBrowser() {
  // `searchInput` follows the text field, `query` is what is actually fetched.
  const [searchInput, setSearchInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const [queriedArticles, setQueriedArticles] = useState<Array<ArticleWithId>>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [supplier, setSupplier] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "name">("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const activeFilterCount = [maxPrice !== "all", supplier !== "all", sortBy !== "recommended"].filter(Boolean).length;
  const selectedBundleName = useShoppingCartStore((state) => state.selectedBundleName);
  const resultCache = useRef(new Map<string, Array<ArticleWithId>>());
  const listRef = useRef<HTMLUListElement>(null);

  // Only typing is debounced — the quick filters apply their query immediately.
  useEffect(() => {
    if (searchInput === query) return;
    const timeout = window.setTimeout(() => setQuery(searchInput), 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput, query]);

  function applyQuickSearch(term: string) {
    setSearchInput(term);
    setQuery(term);
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });

    const cached = resultCache.current.get(query);
    if (cached) {
      setQueriedArticles(cached);
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    // Previous results stay visible while the next ones load, so the list never collapses.
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(null);
    fetch(`/api/shop-articles?query=${encodeURIComponent(query)}&take=${take}&skip=0`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const shopArticles: Array<ShopArticle> = await response.json();
        const articles = shopArticles.map((s) => ({ id: s.pzn, ...s.article }));
        resultCache.current.set(query, articles);
        setQueriedArticles(articles);
      })
      .catch((error) => {
        if ((error as Error).name === "AbortError") return;
        setLoadError("Artikel konnten gerade nicht geladen werden. Bitte erneut versuchen.");
        setQueriedArticles([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  const suppliers = useMemo(
    () => Array.from(new Set(queriedArticles.map((article) => article.supplier).filter(Boolean))).sort(),
    [queriedArticles],
  );
  const displayedArticles = useMemo(() => {
    const maxPriceCents = maxPrice === "all" ? Number.POSITIVE_INFINITY : Number(maxPrice) * 100;
    const articles = queriedArticles.filter((article) =>
      (supplier === "all" || article.supplier === supplier) && article.priceCents <= maxPriceCents,
    );
    return articles.sort((a, b) => {
      if (sortBy === "price-asc") return a.priceCents - b.priceCents;
      if (sortBy === "price-desc") return b.priceCents - a.priceCents;
      if (sortBy === "name") return a.name.localeCompare(b.name, "de");
      return 0;
    });
  }, [maxPrice, queriedArticles, sortBy, supplier]);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-foreground/10 bg-background p-4 shadow-sm lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
        <div className="flex items-start justify-between gap-3 lg:mb-4">
          <div>
            <p className="text-sm font-medium text-highlight">Katalogfilter</p>
            <h2 className="mt-1 text-xl font-semibold">Passend auswählen</h2>
            <p className="mt-1 hidden text-sm text-foreground/65 lg:block">Filtere nach Preis und Hersteller. Alle angezeigten Artikel sind im Katalog verfügbar.</p>
          </div>
          {/* On small screens the filters collapse so the products come first. */}
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            aria-expanded={showFilters}
            aria-controls="catalog-filters"
            className="min-h-10 shrink-0 rounded-full border border-foreground/15 px-4 text-sm font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight lg:hidden"
          >
            {showFilters ? "Ausblenden" : activeFilterCount > 0 ? `Filter (${activeFilterCount})` : "Filter"}
          </button>
        </div>
        <div id="catalog-filters" className={`${showFilters ? "mt-4 grid" : "hidden"} gap-4 lg:grid`}>
          <label className="grid gap-1.5 text-sm font-medium">
            Bis zu welchem Preis?
            <select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="min-h-11 rounded-xl border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-highlight">
              <option value="all">Alle Preise</option>
              <option value="5">bis 5 €</option>
              <option value="10">bis 10 €</option>
              <option value="20">bis 20 €</option>
              <option value="40">bis 40 €</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Marke / Hersteller
            <select value={supplier} onChange={(event) => setSupplier(event.target.value)} className="min-h-11 rounded-xl border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-highlight">
              <option value="all">Alle Hersteller</option>
              {suppliers.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Sortieren nach
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="min-h-11 rounded-xl border border-foreground/15 bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-highlight">
              <option value="recommended">Empfohlene Reihenfolge</option>
              <option value="price-asc">Preis: niedrig zuerst</option>
              <option value="price-desc">Preis: hoch zuerst</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
          <div className="rounded-2xl bg-prim/25 p-3 text-xs text-foreground/75"><span className="font-semibold">Verfügbarkeit</span><br />Live-Bestand wird vor dem Versand durch die Apotheke bestätigt.</div>
        </div>
      </aside>
    <section className="w-full overflow-hidden rounded-3xl bg-secondary text-background shadow-sm">
      <div className="border-b border-background/15 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-highlight">Arzneimittel individuell ergänzen</p>
            <h1 className="mt-1 text-2xl font-semibold">Deine Reiseapotheke</h1>
            <p className="mt-1 text-sm text-background/75">Durchsuche alle Produkte, vergleiche Packungs- und Grundpreise und ergänze sie gezielt zu deinem Kit.</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 text-sm ${selectedBundleName ? "bg-prim text-foreground" : "bg-background/10 text-background"}`}>
            {selectedBundleName ? <><span className="block text-xs font-medium opacity-70">Aktives Reisekit</span><span className="font-semibold">{selectedBundleName}</span></> : <><span className="font-semibold">Zuerst ein Reisekit auswählen.</span><Link href="/" className="ml-2 underline underline-offset-2">Kit zusammenstellen</Link></>}
          </div>
        </div>
        <label className="relative mt-5 block">
          <span className="sr-only">Arzneimittel suchen</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45">⌕</span>
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Produkt, Beschwerde oder PZN" className="min-h-12 w-full rounded-2xl bg-background px-11 py-3 text-sm text-foreground shadow-sm outline-none transition-shadow placeholder:text-foreground/45 focus:ring-2 focus:ring-highlight" />
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
        <button type="button" onClick={() => applyQuickSearch("")} aria-pressed={query === ""} className={`min-h-9 shrink-0 rounded-full px-3 text-sm transition-colors ${query === "" ? "bg-highlight text-foreground" : "bg-background/15 hover:bg-background/25"}`}>Alle</button>
        {quickSearches.map((term) => (
          <button key={term} type="button" onClick={() => applyQuickSearch(term)} aria-pressed={query === term} className={`min-h-9 shrink-0 rounded-full px-3 text-sm transition-colors ${query === term ? "bg-highlight text-foreground" : "bg-background/15 hover:bg-background/25"}`}>{term}</button>
        ))}
      </div>
      <div className="min-h-72 bg-white/15 p-3 sm:p-5">
        {isLoading && queriedArticles.length === 0 && !loadError ? (
          <div className="grid min-h-60 place-items-center text-sm text-background/75">
            <span className="animate-pulse">Artikel werden geladen …</span>
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-xl bg-tertiary/25 p-4 text-sm">{loadError}</div>
        ) : (
          <ul ref={listRef} aria-busy={isLoading} className={`grid max-h-[min(65dvh,46rem)] gap-3 overflow-y-auto pr-1 transition-opacity duration-200 sm:gap-4 sm:pr-2 [scrollbar-width:thin] ${isLoading ? "opacity-60" : "opacity-100"}`}>
            {displayedArticles.length > 0 ? (
              displayedArticles.map((a) => {
                const article = { pzn: a.id, ...a };
                return <Article article={article} key={article.pzn} />;
              })
            ) : (
              <li key="li-no-results" className="rounded-xl bg-background/10 p-5 text-center text-sm text-background/80">Keine passenden Artikel gefunden.</li>
            )}
          </ul>
        )}
        <MedicineNotice className="mt-4 text-background/85" />
      </div>
    </section>
    </div>
  );
}
