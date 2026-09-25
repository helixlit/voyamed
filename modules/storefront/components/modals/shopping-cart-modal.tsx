"use client";

import { createStripeCeckout } from "@/lib/stripe/stripe";
import ShoppingCart from "@/components/shopping-cart";
import { useModalStore } from "@/utils/ModalState";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import { useMemo, useState } from "react";

const price = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export default function ShoppingCartModal() {
  const isOpen = useModalStore((state) => state.modals.shoppingCart.open);
  const beginClose = useModalStore((state) => state.modals.shoppingCart.beginClose);
  const close = useModalStore((state) => state.close);
  const bundles = useShoppingCartStore((state) => state.bundles);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { total, itemCount, checkoutItems } = useMemo(() => {
    const items = bundles.flatMap((bundle) => bundle.articles.map((item) => ({
      ...item,
      quantity: item.quantity * bundle.quantity,
    })));
    return {
      total: bundles.reduce((sum, bundle) => sum + bundle.priceCents * bundle.quantity, 0),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      checkoutItems: items,
    };
  }, [bundles]);

  async function startCheckout() {
    if (checkoutItems.length === 0 || isCheckingOut) return;
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const url = await createStripeCeckout(checkoutItems);
      window.location.assign(url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Der Checkout konnte nicht gestartet werden.");
      setIsCheckingOut(false);
    }
  }

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Warenkorb"
      className={`fixed inset-y-0 right-0 z-100 flex h-dvh w-full max-w-md flex-col border-l border-foreground/15 bg-background shadow-2xl ${beginClose ? "translate-x-full" : "animated-fade-in"}`}
    >
      <header className="flex items-center justify-between border-b border-foreground/15 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">Warenkorb</h2>
          <p className="text-sm text-foreground/65">{itemCount === 0 ? "Noch keine Artikel" : `${itemCount} Artikel`}</p>
        </div>
        <button
          type="button"
          onClick={() => close("shoppingCart")}
          aria-label="Warenkorb schließen"
          className="grid min-h-11 min-w-11 place-items-center rounded-full text-xl text-foreground/65 transition-colors hover:bg-foreground/8 hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
        >
          ×
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <ShoppingCart />
      </div>

      <footer className="safe-bottom border-t border-foreground/15 bg-background px-5 pt-4 sm:px-6">
        {/* All costs are visible before checkout: unexpected extra costs are the top reason carts get abandoned. */}
        <div className="mb-1 flex items-baseline justify-between gap-4 text-sm text-foreground/70">
          <span>Versand</span>
          <span>kostenlos</span>
        </div>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <span className="text-sm text-foreground/70">Gesamt <span className="text-xs">inkl. MwSt.</span></span>
          <strong className="text-xl">{price.format(total / 100)}</strong>
        </div>
        {checkoutError && <p role="alert" className="mb-3 rounded-xl bg-tertiary/12 px-3 py-2 text-sm text-tertiary">{checkoutError}</p>}
        <button
          type="button"
          onClick={startCheckout}
          disabled={checkoutItems.length === 0 || isCheckingOut}
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-5 py-3 font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
        >
          {isCheckingOut ? "Checkout wird geöffnet …" : "Sicher zur Kasse"}
        </button>
        <p className="flex items-center justify-center gap-1.5 pt-3 text-center text-xs text-foreground/60">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M17 9V7A5 5 0 0 0 7 7v2H5v12h14V9h-2ZM9 7a3 3 0 0 1 6 0v2H9V7Z" /></svg>
          Sichere Zahlung über Stripe · Versand innerhalb Deutschlands
        </p>
      </footer>
    </aside>
  );
}
