import {
  ShoppingCartArticle as ShoppingCartArticleType,
  useShoppingCartStore,
} from "../lib/state/shopping-cart-state";
import { useEffect, useState } from "react";

type Props = {
  article: ShoppingCartArticleType;
  bundleName: string;
};

export default function ShoppingCartArticle({ article, bundleName }: Props) {
  const changeArticleQuantity = useShoppingCartStore(
    (state) => state.changeArticleQuantity,
  );
  const setArticleQuantity = useShoppingCartStore(
    (state) => state.setArticleQuantity,
  );

  const [quantity, setQuantity] = useState(article.quantity);

  useEffect(() => {
    setQuantity(article.quantity);
  }, [article.quantity]);

  return (
    <div className="rounded-xl bg-foreground/5 px-3 py-3">
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 sm:w-1/2">
          <p className="line-clamp-2 text-sm font-medium">{article.article.name}</p>
          <p className="mt-1 text-xs text-foreground/60">PZN {article.article.pzn}</p>
        </div>
        <div className="flex items-center justify-between gap-3 sm:w-1/2">
          <span className="min-w-0 text-right text-sm">
            <span className="block text-xs text-foreground/60">Summe</span>
            <span className="font-semibold">
              {(article.article.priceCents * article.quantity / 100).toLocaleString(
                "de-De",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
              €
            </span>
          </span>
          <span className="flex items-center rounded-full border border-foreground/15 bg-background">
            <button
              type="button"
              aria-label={`${article.article.name}: Menge verringern`}
              onClick={() =>
                setQuantity(
                  changeArticleQuantity(bundleName, article.article.pzn, -1),
                )
              }
              className="grid min-h-10 min-w-10 place-items-center rounded-full text-lg transition-colors hover:bg-foreground/8 text-foreground"
            >
              <div className="flex items-center">-</div>
            </button>
            <form
              className="w-11"
              onSubmit={(e) => {
                e.preventDefault();
                setArticleQuantity(bundleName, article.article.pzn, quantity);
              }}
            >
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="20"
                aria-label={`${article.article.name}: Menge`}
                className="min-h-10 w-11 rounded-full bg-highlight text-center text-sm font-medium outline-none"
                name="quantity"
                defaultValue={article.quantity}
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
                  setArticleQuantity(
                    bundleName,
                    article.article.pzn,
                    quantity,
                  )
                }
              ></input>
            </form>
            <button
              type="button"
              aria-label={`${article.article.name}: Menge erhöhen`}
              className="grid min-h-10 min-w-10 place-items-center rounded-full text-lg transition-colors hover:bg-foreground/8 text-foreground"
              onClick={() => {
                setQuantity(
                  changeArticleQuantity(bundleName, article.article.pzn, 1),
                );
              }}
            >
              <div className="flex items-center">+</div>
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
