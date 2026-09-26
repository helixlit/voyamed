"use client";

import Link from "next/link";
import { useShoppingCartStore } from "../lib/state/shopping-cart-state";
import { useModalStore } from "@/utils/ModalState";
import ShoppingCartArticle from "./shopping-cart-article";
import ShoppingCartBundleComponent from "./shopping-cart-bundle";

export default function ShoppingCart() {
  const bundles = useShoppingCartStore((state) => state.bundles);
  const close = useModalStore((state) => state.close);
  const hasItems = bundles.some((bundle) => bundle.name !== "default" || bundle.articles.length > 0);

  if (hasItems)
    return (
      <div className="grow m-auto w-full text-sm text-foreground/80">
        <ul className="grid gap-3">
          {bundles.map((bundle) => {
            if (!(bundle.name == "default"))
              return (
                <li key={bundle.name}>
                  <ShoppingCartBundleComponent
                    bundle={bundle}
                  />
                </li>
              );
            if (bundle.articles.length <= 0) return null;
            return (
              <li key={bundle.name} className="">
                <ul className="flex flex-col gap-3">
                  {bundle.articles.map((article) => (
                    <li key={article.article.pzn} className="bg-foreground/10">
                      <ShoppingCartArticle
                        article={article}
                        bundleName={bundle.name}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  return (
    <div className="grid place-items-center gap-4 px-4 py-12 text-center">
      <p className="text-foreground/70">Dein Warenkorb ist noch leer.</p>
      <Link
        href="/globe"
        onClick={() => close("shoppingCart")}
        className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
      >
        Reisekit zusammenstellen
      </Link>
    </div>
  );
}
