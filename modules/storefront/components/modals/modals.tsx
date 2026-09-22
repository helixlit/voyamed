"use client";

import { useIsAnyModalOpen, useModalStore } from "@/utils/ModalState";
import ShoppingCartModal from "@/components/modals/shopping-cart-modal";
import { useEffect } from "react";

export default function Modals() {
  const isBlurred = useIsAnyModalOpen();
  const close = useModalStore((state) => state.closeAll);

  useEffect(() => {
    document.body.style.overflow = isBlurred ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isBlurred]);

  return (
    <div>
      {isBlurred && (
        <button
          type="button"
          aria-label="Warenkorb schließen"
          className="fixed inset-0 z-50 cursor-default bg-foreground/45 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => {
            close();
          }}
        ></button>
      )}
      <ShoppingCartModal />
    </div>
  );
}
