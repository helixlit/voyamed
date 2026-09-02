import ShoppingCart from "@/components/shopping-cart";
import { useModalStore } from "@/utils/ModalState";

export default function ShoppingCartModal() {
  const isOpen = useModalStore((state) => state.modals.shoppingCart.open);
  const beginClose = useModalStore(
    (state) => state.modals.shoppingCart.beginClose,
  );
  const close = useModalStore((state) => state.close);

  return (
    <div>
      {isOpen && (
        <div
          className={`z-100 w-full md:w-100 h-screen bg-background
                absolute right-0 top-0 border-l-2 animated-fade-in transition-transform duration-250 translate-0 pointer-events-auto
                        ${beginClose ? "translate-x-105" : ""}`}
        >
          <div className="flex flex-col h-full">
            <div
              className={`flex justify-between border-b-2 p-4
                    text-cs transition-all `}
            >
              <span className="select-none">Warenkorb</span>
              <button
                onClick={() => {
                  close("shoppingCart");
                }}
                className=" text-foreground/80 hover:text-foreground hover:text-shadow-[0_100px_100px_(--bg-highlight)] cursor-pointer"
              >
                ✖
              </button>
            </div>

            <ShoppingCart />

            <div className="px-5 border-t-2 py-4 text-cxs">
              <div className="flex justify-between pb-2 px-2">
                <p>Gesamt</p>
                <p>0$</p>
              </div>
              <button className="bg-foreground rounded-full w-full text-background p-2">
                Zur Kasse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
