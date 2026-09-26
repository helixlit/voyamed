"use client";

import { useEffect, useState } from "react";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";

type CheckoutStatus = "success" | "cancelled";

/** Confirms the result of a Stripe checkout (`?checkout=success|cancelled` on return). */
export default function CheckoutNotice() {
  const [status, setStatus] = useState<CheckoutStatus | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout !== "success" && checkout !== "cancelled") return;

    setStatus(checkout);
    setOrderNumber(params.get("order"));
    // Drop the parameter so a reload doesn't show the notice again.
    window.history.replaceState(null, "", window.location.pathname);
    if (checkout !== "success") return;

    // The saved cart is restored asynchronously; clear it only once that has happened.
    const clearCart = () => useShoppingCartStore.getState().clearCart();
    if (useShoppingCartStore.persist.hasHydrated()) {
      clearCart();
      return;
    }
    return useShoppingCartStore.persist.onFinishHydration(clearCart);
  }, []);

  if (!status) return null;

  return (
    <div className="px-3 pt-4 sm:px-5">
      <div
        role="status"
        className={`mx-auto flex max-w-6xl items-start justify-between gap-4 rounded-2xl p-4 text-sm shadow-sm ring-1 ring-foreground/10 ${status === "success" ? "bg-prim/40" : "bg-highlight/15"}`}
      >
        <div>
          <p className="font-semibold">
            {status === "success" ? "Vielen Dank für deine Bestellung!" : "Die Zahlung wurde abgebrochen."}
          </p>
          <p className="mt-1 text-foreground/75">
            {status === "success"
              ? `${orderNumber ? `Bestellnummer ${orderNumber}. ` : ""}Deine Zahlung ist eingegangen und eine Bestätigung ist per E-Mail unterwegs. Die Antonius-Apotheke prüft deine Bestellung jetzt und meldet sich bei Rückfragen.`
              : "Dein Warenkorb ist noch da – du kannst jederzeit zur Kasse zurückkehren."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus(null)}
          aria-label="Hinweis schließen"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg hover:bg-foreground/5"
        >
          ×
        </button>
      </div>
    </div>
  );
}
