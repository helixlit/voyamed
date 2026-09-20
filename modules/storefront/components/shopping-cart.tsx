"use client";

import { useShoppingCartStore } from "../lib/state/shopping-cart-state";
import ShoppingCartArticle from "./shopping-cart-article";
import ShoppingCartBundleComponent from "./shopping-cart-bundle";

export default function ShoppingCart() {
  const bundles = useShoppingCartStore((state) => state.bundles);
  if (bundles.length > 0)
    return (
      <div className="grow m-auto text-cs text-foreground/80 w-full">
        <ul className="">
          {bundles.map((bundle) => {
            if (!(bundle.name == "default"))
              return (
                <li key={bundle.name} className="pl-4">
                  <ShoppingCartBundleComponent bundle={bundle} />
                  <ul>
                    {bundle.articles.map((article) => (
                      <li key={article.article.pzn} className="pl-4 border-l">
                        <ShoppingCartArticle
                          article={article}
                          bundleName={bundle.name}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              );
            if (bundle.articles.length <= 0 && bundles.length <= 1)
              return (
                <li key="no-articles" className="flex justify-center">
                  Noch keine Artikel im Warenkorb...
                </li>
              );
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
    <div className="grow m-auto pt-2 text-cs text-foreground/80">
      Noch keine Artikel im Warenkorb...
    </div>
  );
}
