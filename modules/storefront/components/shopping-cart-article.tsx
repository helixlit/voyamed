import {
  ShoppingCartArticle as ShoppingCartArticleType,
  useShoppingCartStore,
} from "../lib/state/shopping-cart-state";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatUnitPrice } from "@/lib/article-price";

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
  const [imageSrc, setImageSrc] = useState(`/articles/${article.article.pzn}.jpg`);
  const unitPrice = formatUnitPrice(article.article);
  const total = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    article.article.priceCents * article.quantity / 100,
  );

  useEffect(() => {
    setQuantity(article.quantity);
  }, [article.quantity]);

  return (
    <div className="rounded-xl bg-foreground/5 px-3 py-3">
      <div className="flex h-full gap-3 sm:items-center">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
          <Image src={imageSrc} alt="" fill sizes="64px" className="object-contain p-1" onError={() => setImageSrc("/articles/placeholder.svg")} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-medium">{article.article.name}</p>
          <p className="mt-1 text-xs text-foreground/60">PZN {article.article.pzn}</p>
          {unitPrice && <p className="mt-1 text-xs font-medium text-highlight">{unitPrice}</p>}
        </div>
        <div className="flex min-w-[9.5rem] flex-col items-end gap-2">
          <span className="min-w-0 text-right text-sm">
            <span className="block text-xs text-foreground/60">Summe</span>
            <span className="font-semibold">{total}</span>
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
