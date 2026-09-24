"use client";

import { useShoppingCartStore } from "../../lib/state/shopping-cart-state";
import { Article as ArticleClient } from "../../../catalog/src/contract";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

type Props = {
  article: ArticleClient;
};

export default function Article({ article }: Props) {
  const addArticleToBundel = useShoppingCartStore(
    (state) => state.addArticleToBundle,
  );

  const [justAdded, setJustAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(`/articles/${article.pzn}.jpg`);

  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(article.priceCents / 100);

  const formattedPiecePrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format((article.priceCents / article.purchaseUnit) / 100);

  function addToCart() {
    addArticleToBundel("default", article, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <Link
      className="group flex gap-4 rounded-2xl bg-background p-3 text-foreground shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-4"
      key={article.pzn}
      href={`/articles/${article.pzn}`}
    >
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-white sm:h-32 sm:w-32">
        <Image
          src={imageSrc}
          alt={article.name}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageSrc("/articles/placeholder.svg")}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium leading-snug">{article.name}</p>
        <p className="mt-1 text-xs text-foreground/60">PZN {article.pzn}{article.supplier ? ` · ${article.supplier}` : ""}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">
              {formattedPrice}
              <span className="text-xs text-foreground/60 px-1">
                {formattedPiecePrice}/{article.unit}
              </span>
            </p>
            <p className="text-xs text-foreground/60">{article.purchaseUnit} {article.unit}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`${article.name} in den Warenkorb`}
              onClick={(e) => {
                e.stopPropagation()
                addToCart()
              }}
              className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight ${justAdded ? "bg-prim text-foreground" : "bg-foreground text-background hover:-translate-y-0.5 hover:shadow-lg"}`}
            >
              <span aria-hidden="true">{justAdded ? "✓" : "+"}</span>
              {justAdded ? "Hinzugefügt" : "In den Warenkorb"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
