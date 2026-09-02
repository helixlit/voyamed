import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import { ArticleClient } from "@/utils/types";

type Props = {
  article: ArticleClient;
};

export default function Article({ article }: Props) {
  const addArticleToBundel = useShoppingCartStore(
    (state) => state.addArticleToBundle,
  );

  const bundels = useShoppingCartStore((state) => state.bundles);

  return (
    <div className="flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="100%"
        viewBox="0 -960 960 960"
        width="100%"
        fill="#e3e3e3"
        className="flex-1"
      >
        <path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm56-97h489L578-473 446-302l-93-127-117 152Zm-56 97v-600 600Z" />
      </svg>
      <ul className="flex-2 flex flex-col py-[clamp(2px,3vw,10rem)]">
        <li>name: {article.name}</li>
        <li>PZN: {article.pzn}</li>
        <li>supplier: {article.supplier}</li>
        <li>price: {article.price}</li>
        <li>
          quantity: {article.purchaseUnit}
          {article.unit}
        </li>
        <li className="grow flex flex-col justify-end">
          <div className="@container flex items-center gap-2 w-full">
            <button
              className="h-fit flex cursor-pointer bg-background rounded-full p-4"
              onClick={() => {
                addArticleToBundel("default", article, 1);
                console.debug(bundels);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                viewBox="0 -960 960 960"
                fill="#001219"
                className="h-cm"
              >
                <path d="M440-720h-80q-17 0-28.5-11.5T320-760q0-17 11.5-28.5T360-800h80v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80h80q17 0 28.5 11.5T640-760q0 17-11.5 28.5T600-720h-80v80q0 17-11.5 28.5T480-600q-17 0-28.5-11.5T440-640v-80ZM223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM120-800H80q-17 0-28.5-11.5T40-840q0-17 11.5-28.5T80-880h66q11 0 21 6t15 17l159 337h280l145-260q5-10 14-15t20-5q23 0 34.5 19.5t.5 39.5L692-482q-11 20-29.5 31T622-440H324l-44 80h440q17 0 28.5 11.5T760-320q0 17-11.5 28.5T720-280H280q-45 0-68.5-39t-1.5-79l54-98-144-304Z" />
              </svg>
              <p className="flex @[200px]:flex w-full items-center text-foreground text-cs whitespace-nowrap">
                In den Warenkorb
              </p>
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}
