"use client";
import ShoppingCartArticle from "@/components/shopping-cart-article";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";

export default function Suitcase() {
  const bundles = useShoppingCartStore((state) => state.bundles);
  return (
    <div className="rounded-2xl bg-highlight w-full text-background">
      <h3 className="text-cm p-4">Dein Koffer</h3>
      <div className="bg-white/15 w-full">
        <div className="text-center text-6xl p-6 w-full">🧳</div>
        <ul className="p-6">
          {bundles.map((bundle) => {
            if (bundle.name == "default")
              return (
                <li key={bundle.name}>
                  <ul className="">
                    {bundle.articles.map((article) => (
                      <ShoppingCartArticle
                        article={article}
                        bundleName={bundle.name}
                        key={article.article.pzn}
                      />
                    ))}
                  </ul>
                </li>
              );
            return (
              <li key={bundle.name}>
                {bundle.name}
                <ul className="pl-10">
                  {bundle.articles.map((article) => (
                    <li key={article.article.pzn}>
                      <div> {article.article.name}</div>
                      <div>Anzahl: {article.quantity}</div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
