"use client";

import { useEffect, useState } from "react";
import Article from "./article";
import { ShopArticle } from "@voyamed/catalog/contract";
import { ArticleWithId } from "@/utils/types";
import Link from "next/link";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";

export default function ArticleBrowser() {
  const [query, setQuery] = useState<string>("");

  const [queriedArticles, setQueriedArticles] = useState<Array<ArticleWithId>>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const selectedBundleName = useShoppingCartStore((state) => state.selectedBundleName);

  const take = 100;
  const quickSearches = ["Sonnenschutz", "Mückenschutz", "Durchfall", "Wunde", "Husten", "Schmerz"];

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await fetch(`/api/shop-articles?query=${encodeURIComponent(query)}&take=${take}&skip=0`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const shopArticles: Array<ShopArticle> = await response.json();
        setQueriedArticles(shopArticles.map((s) => ({ id: s.pzn, ...s.article })));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setLoadError("Artikel konnten gerade nicht geladen werden. Bitte erneut versuchen.");
          setQueriedArticles([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, query ? 250 : 0);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  return (
    <section className="w-full overflow-hidden rounded-3xl bg-secondary text-background shadow-sm">
      <div className="border-b border-background/15 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-highlight">Arzneimittel individuell ergänzen</p>
            <h2 className="mt-1 text-2xl font-semibold">Deine Reiseapotheke</h2>
            <p className="mt-1 text-sm text-background/75">Durchsuche alle Produkte, vergleiche Packungs- und Grundpreise und ergänze sie gezielt zu deinem Kit.</p>
          </div>
          <div className={`rounded-2xl px-4 py-3 text-sm ${selectedBundleName ? "bg-prim text-foreground" : "bg-background/10 text-background"}`}>
            {selectedBundleName ? <><span className="block text-xs font-medium opacity-70">Aktives Reisekit</span><span className="font-semibold">{selectedBundleName}</span></> : <><span className="font-semibold">Zuerst ein Reisekit auswählen.</span><Link href="/" className="ml-2 underline underline-offset-2">Kit zusammenstellen</Link></>}
          </div>
        </div>
        <label className="relative mt-5 block">
          <span className="sr-only">Arzneimittel suchen</span>
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-background/45">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Produkt, Kategorie, Hersteller oder PZN suchen" className="min-h-12 w-full rounded-2xl bg-background px-11 py-3 text-sm text-foreground shadow-sm outline-none transition-shadow placeholder:text-foreground/45 focus:ring-2 focus:ring-highlight" />
        </label>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
        <button type="button" onClick={() => setQuery("")} className={`min-h-9 shrink-0 rounded-full px-3 text-sm transition ${query === "" ? "bg-highlight text-foreground" : "bg-background/15 hover:bg-background/25"}`}>Alle</button>
        {quickSearches.map((term) => (
          <button key={term} type="button" onClick={() => setQuery(term)} className={`min-h-9 shrink-0 rounded-full px-3 text-sm transition ${query === term ? "bg-highlight text-foreground" : "bg-background/15 hover:bg-background/25"}`}>{term}</button>
        ))}
      </div>
      <div className="min-h-72 bg-white/15 p-3 sm:p-5">
        {isLoading ? (
          <div className="grid min-h-60 place-items-center text-sm text-background/75">
            <span className="animate-pulse">Artikel werden geladen …</span>
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-xl bg-tertiary/25 p-4 text-sm">{loadError}</div>
        ) : queriedArticles && (
          <ul className="grid max-h-[min(65dvh,46rem)] gap-3 overflow-y-auto pr-1 sm:gap-4 sm:pr-2 [scrollbar-width:thin]">
            {queriedArticles.length > 0 ? (
              queriedArticles.map((a) => {
                const article = { pzn: a.id, ...a };
                return <Article article={article} key={article.pzn} />;
              })
            ) : (
              <li key="li-no-results" className="rounded-xl bg-background/10 p-5 text-center text-sm text-background/80">Keine passenden Artikel gefunden.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}
