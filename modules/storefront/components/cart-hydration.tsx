"use client";

import { useEffect } from "react";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";

/** Restores the saved cart after the first render (see `skipHydration` in the cart store). */
export default function CartHydration() {
  useEffect(() => {
    void useShoppingCartStore.persist.rehydrate();
  }, []);

  return null;
}
