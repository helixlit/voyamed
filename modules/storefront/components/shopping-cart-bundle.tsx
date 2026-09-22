import { ShoppingCartBundle, useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import { useEffect, useState } from "react";
import ShoppingCartArticle from "./shopping-cart-article";

interface Props {
  bundle: ShoppingCartBundle,
}
export default function ShoppingCartBundleComponent({ bundle }: Props) {
  const { changeBundleQuantity, setBundleQuantity } = useShoppingCartStore(state => state);
  const [quantity, setQuantity] = useState(bundle.quantity);


  const [showBundleArticles, setShowBundleArticles] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(bundle.quantity)
  }, [bundle.quantity]);

  return (
    <div className="grid gap-2">
      {bundle.name}

      <div className="flex justify-between pr-4">
        <span className="flex h-fit">
          <p className="text-nowrap">Menge: &nbsp;</p>
          <span className="bg-background rounded-full border cursor-pointer flex">
            <button
              onClick={() =>
                setQuantity(
                  changeBundleQuantity(bundle.name, -1),
                )
              }
              className="cursor-pointer text-foreground px-2"
            >
              <div className="flex items-center">-</div>
            </button>
            <form
              className="min-w-fit w-15 flex items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                setBundleQuantity(bundle.name, quantity);
              }}
            >
              <input
                className="select-auto border-background px-4 bg-highlight rounded-full field-sizing-content min-w-fit w-15 text-center"
                name="quantity"
                defaultValue={bundle.quantity}
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
              className="cursor-pointer text-foreground px-2"
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
        {showBundleArticles ? (
          <button
            className="cursor-pointer"
            onClick={() => { setShowBundleArticles(false) }}
          >- weniger anzeigen</button>
        ) : (
          <button
            className="cursor-pointer"
            onClick={() => { setShowBundleArticles(true) }}
          >+ mehr anzeigen</button>
        )}
      </div>
      <ul>
        {showBundleArticles && bundle.articles.map((article) => (
          <li key={article.article.pzn} className="pl-4 border-l">
            <ShoppingCartArticle
              article={article}
              bundleName={bundle.name}
            />
          </li>
        ))}
      </ul>
    </div >
  )

}