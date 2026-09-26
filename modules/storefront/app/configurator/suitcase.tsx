"use client";

import ShoppingCartArticle from "@/components/shopping-cart-article";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";

export default function Suitcase() {
  const bundles = useShoppingCartStore((state) => state.bundles);
  const defaultBundle = bundles.find((bundle) => bundle.name === "default");
  const items = defaultBundle?.articles ?? [];

  return (
    <aside className="w-full self-start overflow-hidden rounded-3xl bg-highlight text-background shadow-sm xl:sticky xl:top-24 xl:w-[23rem]">
      <header className="border-b border-background/20 px-5 py-5">
        <p className="text-sm text-background/75">Persönliche Auswahl</p>
        <h2 className="mt-1 text-2xl font-semibold">Dein Koffer</h2>
        <p className="mt-2 text-sm leading-relaxed text-background/80">Suche rechts nach einzelnen Produkten. Bilder und Packungsgrößen helfen dir beim Vergleichen.</p>
      </header>
      <div className="bg-background/95 p-3 text-foreground">
        {items.length ? (
          <ul className="flex flex-col gap-3">
            {items.map((article) => (
              <li key={article.article.pzn}>
                <ShoppingCartArticle article={article} bundleName="default" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid min-h-52 place-items-center rounded-2xl border border-dashed border-foreground/20 px-6 text-center">
            <div>
              <div aria-hidden="true" className="text-4xl">🧳</div>
              <p className="mt-3 font-medium">Dein Koffer ist noch leer</p>
              <p className="mt-1 text-sm text-foreground/65">Suche nach einem Produkt oder wähle ein Reisekit.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
