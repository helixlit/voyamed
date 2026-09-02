"use client";

import { useIsAnyModalOpen, useModalStore } from "@/utils/ModalState";
import ShoppingCartModal from "./shopping-cart-modal";

export default function Modals() {
  const isBlurred = useIsAnyModalOpen();
  const close = useModalStore((state) => state.closeAll);

  return (
    <div>
      <div
        className={`z-100 top-0 absolute w-screen h-screen 
${isBlurred ? "bg-black/60" : "bg-black/0"} pointer-events-none transition-all duration-300 
          `}
      ></div>
      {isBlurred && (
        <button
          className="z-100 top-0 absolute w-screen h-screen"
          onClick={() => {
            close();
          }}
        ></button>
      )}
      <ShoppingCartModal />
    </div>
  );
}
