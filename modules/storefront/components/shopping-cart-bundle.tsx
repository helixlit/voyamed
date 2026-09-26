import { ShoppingCartBundle, useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import { useEffect, useState } from "react";

interface Props {
  bundle: ShoppingCartBundle,
}
export default function ShoppingCartBundleComponent({ bundle }: Props) {
  const { changeBundleQuantity, setBundleQuantity, setArticleQuantity } = useShoppingCartStore(state => state);
  const [quantity, setQuantity] = useState(bundle.quantity);


  const [showBundleArticles, setShowBundleArticles] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(bundle.quantity)
  }, [bundle.quantity]);

  const price = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

  return (
    <section className="rounded-2xl border border-foreground/10 bg-foreground/[0.035] p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-medium text-highlight-ink">Reisekit</p><h3 className="mt-0.5 font-semibold">{bundle.name}</h3><p className="mt-1 text-sm text-foreground/65">{bundle.articles.length} Arzneimittel · {price.format(bundle.priceCents / 100)} pro Kit</p></div>
        <strong className="shrink-0">{price.format((bundle.priceCents * bundle.quantity) / 100)}</strong>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="flex h-fit items-center gap-2 text-sm">
          <span>Menge</span>
          <span className="flex rounded-full border border-foreground/15 bg-background">
            <button
              onClick={() =>
                setQuantity(
                  changeBundleQuantity(bundle.name, -1),
                )
              }
              aria-label="Ein Kit weniger"
              className="px-3 py-1.5"
            >
              <div className="flex items-center">-</div>
            </button>
            <form
              className="w-10 flex items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                setBundleQuantity(bundle.name, quantity);
              }}
            >
              <input
                aria-label="Kit-Menge"
                className="w-full bg-transparent text-center outline-none"
                name="quantity"
                value={quantity}
                onChange={(e) => {
                  if (e.target.value === "" || Number(e.target.value) === 0) {
                    setQuantity(0);
                    return;
                  }
                  const newQuantity = Number(e.target.value);
                  if (!newQuantity) return;
                  setQuantity(newQuantity);
                }}
                onBlur={() =>
                  setBundleQuantity(
                    bundle.name,
                    quantity,
                  )
                }
              ></input>
            </form>
            <button
              aria-label="Ein Kit mehr"
              className="px-3 py-1.5"
              onClick={() => {
                setQuantity(
                  changeBundleQuantity(bundle.name, 1),
                );
              }}
            >
              <div className="flex items-center">+</div>
            </button>
          </span>
        </span>
        <button type="button" className="rounded-full border border-foreground/15 px-3 py-2 text-sm font-medium hover:bg-background" onClick={() => setShowBundleArticles((value) => !value)}>{showBundleArticles ? "Ausblenden" : "Inhalt anpassen"}</button>
      </div>
      {showBundleArticles && (
        <div className="mt-4 overflow-hidden rounded-xl border border-foreground/10 bg-background text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_2rem] gap-3 border-b border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-xs font-semibold text-foreground/60"><span>Arzneimittel</span><span>Menge</span><span>Preis</span><span className="sr-only">Entfernen</span></div>
          {bundle.articles.map(({ article, quantity: articleQuantity }) => (
            <div key={article.pzn} className="grid grid-cols-[minmax(0,1fr)_auto_auto_2rem] items-center gap-3 px-3 py-2">
              <span className="line-clamp-2">{article.name}</span>
              <span>{articleQuantity * bundle.quantity}×</span>
              <span>{price.format(article.priceCents * articleQuantity * bundle.quantity / 100)}</span>
              {/* Letting people drop what they already own keeps a large kit from being all-or-nothing. */}
              <button
                type="button"
                onClick={() => setArticleQuantity(bundle.name, article.pzn, 0)}
                aria-label={`${article.name} aus dem Kit entfernen`}
                title="Aus dem Kit entfernen"
                className="grid h-8 w-8 place-items-center rounded-full text-base text-foreground/50 transition-colors hover:bg-tertiary/10 hover:text-tertiary focus-visible:outline-2 focus-visible:outline-highlight"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )

}
