"use client";

import { useShoppingCartStore } from "../../lib/state/shopping-cart-state";
import { Article as ArticleClient } from "../../../catalog/src/contract";
import Image from "next/image";
import { useState } from "react";
import { formatPackageLabel, formatUnitPrice } from "@/lib/article-price";
import { triggerCartFly } from "@/components/cart-fly-animation";
import { getIndication } from "@/lib/product-info";

type Props = {
  article: ArticleClient;
  mode?: "catalog" | "included";
};

export default function Article({ article, mode = "catalog" }: Props) {
  const addArticleToBundel = useShoppingCartStore(
    (state) => state.addArticleToBundle,
  );
  const selectedBundleName = useShoppingCartStore((state) => state.selectedBundleName);

  const [justAdded, setJustAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(`/articles/${article.pzn}.jpg`);
  const formattedPrice = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(article.priceCents / 100);
  const unitPrice = formatUnitPrice(article);
  const indication = getIndication(article.pzn);

  function addToKit(event: React.MouseEvent<HTMLButtonElement>) {
    if (!selectedBundleName) return;
    addArticleToBundel(selectedBundleName, article, 1);
    triggerCartFly(event.currentTarget, imageSrc);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="group flex gap-4 rounded-2xl bg-background p-3 text-foreground shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
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
        {indication && <p className="mb-1 inline-flex rounded-full bg-prim/40 px-2 py-0.5 text-xs font-medium text-secondary">{indication}</p>}
        <p className="line-clamp-2 font-medium leading-snug">{article.name}</p>
        <p className="mt-1 text-xs text-foreground/60">PZN {article.pzn}{article.supplier ? ` · ${article.supplier}` : ""}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">{formattedPrice}</p>
            <p className="text-xs text-foreground/60">{formatPackageLabel(article)}</p>
            {unitPrice && <p className="mt-0.5 text-xs font-medium text-highlight-ink">{unitPrice}</p>}
          </div>
          {mode === "included" ? (
            <span className="rounded-full bg-prim/40 px-3 py-2 text-xs font-medium">Im Reisekit enthalten</span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                // The accessible name starts with the visible label, so voice control ("click Zum Kit") works.
                aria-label={justAdded ? `Hinzugefügt: ${article.name}` : selectedBundleName ? `Zum Kit: ${article.name} hinzufügen` : "Kit wählen – zuerst ein Reisekit auswählen"}
                title={selectedBundleName ? `Zu ${selectedBundleName} hinzufügen` : "Wähle zuerst ein Reisekit aus"}
                disabled={!selectedBundleName}
                onClick={addToKit}
                className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:bg-foreground/15 disabled:text-foreground/55 ${justAdded ? "bg-prim text-foreground" : "bg-foreground text-background enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:active:scale-95"}`}
              >
                <span aria-hidden="true">{justAdded ? "✓" : "+"}</span>
                {justAdded ? "Hinzugefügt" : selectedBundleName ? "Zum Kit" : "Kit wählen"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
