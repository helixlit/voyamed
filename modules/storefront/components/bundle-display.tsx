"use client";

import type { Article as TArticle } from "@voyamed/catalog/contract";
import Article from "@/app/configurator/article";
import TravelAdvice from "@/components/travel-advice";
import MedicineNotice from "@/components/medicine-notice";
import PackingList from "@/components/packing-list";
import { pharmacy } from "@/lib/pharmacy";
import { buildKitPzns, getActivity, getClimate } from "@/lib/travel-kit";
import { ShoppingCartBundle, useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import { triggerCartFly } from "@/components/cart-fly-animation";
import { getShopArticleByPZN } from "@/utils/fetch-api";
import type { Activity, CountryKit } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

interface Props {
  country: CountryKit | null;
  activity: Activity | "";
  displayArticles: boolean;
}

export default function BundleDisplay({ country, activity, displayArticles }: Props) {
  const [articles, setArticles] = useState<TArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const addBundle = useShoppingCartStore((state) => state.addBundle);
  const selectBundle = useShoppingCartStore((state) => state.selectBundle);
  const router = useRouter();
  const selectedActivity = getActivity(activity);
  const climate = getClimate(country);

  const kitPriceCents = articles.reduce((sum, article) => sum + article.priceCents, 0);

  const kitPzns = useMemo(
    () => country && activity ? buildKitPzns(country, activity) : [],
    [country, activity],
  );

  useEffect(() => {
    let cancelled = false;
    if (!country || !activity || !selectedActivity || !climate) {
      setArticles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all(kitPzns.map(async (pzn) => {
      try {
        const result = await getShopArticleByPZN(pzn);
        return result?.article as TArticle | undefined;
      } catch {
        return undefined;
      }
    })).then((results) => {
      if (!cancelled) setArticles(results.filter((article): article is TArticle => Boolean(article)));
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [country, activity, selectedActivity, climate, kitPzns]);

  function addBundleToCart(event: React.MouseEvent<HTMLButtonElement>) {
    if (!country || !activity || !selectedActivity || articles.length === 0) return;
    const name = `${country.name} · ${selectedActivity.name}`;
    addBundle(new ShoppingCartBundle(name, 1, articles.map((article) => ({ article, quantity: 1 }))));
    selectBundle(name);
    triggerCartFly(event.currentTarget, `/articles/${articles[0].pzn}.jpg`);
    router.push("/configurator");
  }

  if (!country || !activity || !selectedActivity || !climate) {
    return <p className="w-full max-w-6xl rounded-2xl border border-dashed border-foreground/20 px-5 py-6 text-foreground/65">Wähle ein Land und eine passende Aktivität, damit wir dein Reisekit zusammenstellen können.</p>;
  }

  return (
    <section id="bundle-display" className="w-full max-w-6xl rounded-3xl bg-foreground/5 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-highlight">Dein Vorschlag</p>
          <h2 className="mt-1 text-2xl font-semibold">{country.name} · {selectedActivity.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">{climate.beschreibung} {selectedActivity.beschreibung}</p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          {/* The price is shown before choosing the kit — surprise costs are the top reason to abandon a purchase. */}
          <p className="text-sm text-foreground/70 sm:text-right" aria-live="polite">
            {isLoading || articles.length === 0 ? "Preis wird berechnet …" : (
              <>
                {articles.length} Produkte · <strong className="text-lg text-foreground">{euro.format(kitPriceCents / 100)}</strong>
                <span className="block text-xs">inkl. MwSt. · Produkte im Warenkorb abwählbar</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <PackingList title={`${country.name} · ${selectedActivity.name}`} articles={articles} disabled={articles.length === 0 || isLoading} />
            <button
              type="button"
              onClick={addBundleToCart}
              disabled={articles.length === 0 || isLoading}
              className="min-h-12 rounded-full bg-foreground px-5 font-medium text-background transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLoading ? "Kit wird geladen …" : "Kit auswählen & bearbeiten"}
            </button>
          </div>
        </div>
      </div>
      {/* The kit doesn't ask who travels — say so, and hand those cases to the pharmacy. */}
      <p className="mt-4 rounded-2xl bg-background/70 px-4 py-3 text-sm text-foreground/75 ring-1 ring-foreground/10">
        <span className="font-semibold text-foreground">Mit Kindern, in der Schwangerschaft oder mit Vorerkrankungen unterwegs?</span>{" "}
        Der Vorschlag ist für Erwachsene ohne Besonderheiten gedacht. Lass ihn vor der Bestellung kurz von der Apotheke prüfen:{" "}
        <a href={pharmacy.phoneHref} className="font-medium text-foreground underline underline-offset-2">{pharmacy.phone}</a>
      </p>
      <TravelAdvice country={country} activity={activity} />
      {displayArticles && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold">Produkte im Kit</h3>
          {isLoading ? <p className="mt-3 text-sm text-foreground/65">Produkte werden geladen …</p> : (
            <ul className="mt-3 grid gap-3 lg:grid-cols-2">
              {articles.map((article) => <li key={article.pzn}><Article article={article} mode="included" /></li>)}
            </ul>
          )}
          {!isLoading && articles.length === 0 && <p className="mt-3 text-sm text-foreground/65">Für diese Auswahl sind im aktuellen Katalog noch keine Artikel hinterlegt.</p>}
        </div>
      )}
      <MedicineNotice className="mt-4 text-foreground/70" />
    </section>
  );
}
