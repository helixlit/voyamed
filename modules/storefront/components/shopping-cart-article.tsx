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
    <div className="@container py-1 px-3">
      <div className="cursor-default flex @max-[500px]:flex-col h-full gap-4 justify-between py-1 items-center  w-full">
        <div className=" @min-[500px]:w-2/3 w-full flex items-center justify-between @max-[500px]:justify-left">
          {article.article.name}
        </div>
        <div className="@max-[500px]:border-b @min-[500px]:w-1/3 flex gap-4 items-center justify-between select-none h-fit @max-[500px]:w-full pb-2">
          <span className="flex gap-3 justify-center items-center w-full">
            <span className="">UVP:</span>
            <span className="font-semibold flex justify-between w-full">
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
          <span className=" flex">
            <p className="text-nowrap">Menge: &nbsp;</p>
            <span className="bg-background rounded-full border cursor-pointer flex">
              <button
                onClick={() =>
                  setQuantity(
                    changeArticleQuantity(bundleName, article.article.pzn, -1),
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
                  setArticleQuantity(bundleName, article.article.pzn, quantity);
                }}
              >
                <input
                  className="select-auto border-background px-4 bg-highlight rounded-full field-sizing-content min-w-fit w-15 text-center"
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
                className="cursor-pointer text-foreground px-2"
                onClick={() => {
                  setQuantity(
                    changeArticleQuantity(bundleName, article.article.pzn, 1),
                  );
                }}
              >
                <div className="flex items-center">+</div>
              </button>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
