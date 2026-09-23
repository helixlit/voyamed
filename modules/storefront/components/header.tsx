"use client";
import { useModalStore } from "@/utils/ModalState";
import { useShoppingCartStore } from "@/lib/state/shopping-cart-state";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const open = useModalStore((state) => state.open);
  const cartCount = useShoppingCartStore((state) => state.bundles.reduce(
    (total, bundle) => total + bundle.articles.reduce(
      (bundleTotal, item) => bundleTotal + item.quantity * bundle.quantity,
      0,
    ),
    0,
  ));

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground/15 bg-background/95 px-4 py-3 font-outfit backdrop-blur-md sm:px-6 select-none">
      <div className="mx-auto flex max-w-360 items-center justify-between gap-3">
      <div className="flex items-center">
        <Link href={"/"}>
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              src={"/logo.png"}
              alt=""
              width={42}
              height={42}
              className="hidden sm:block"
            />
            <h1 className="text-2xl leading-none sm:text-3xl">
              Voya<span className="text-highlight">med</span>
            </h1>
          </div>
        </Link>
      </div>
      <nav className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <Link href={"/configurator"}>
            <span className="rounded-full px-3 py-2 text-xs font-medium transition-colors hover:bg-foreground/8 sm:text-sm">Konfigurator</span>
          </Link>
        </div>
        <div className="flex items-center">
          <button
            id="shopping-cart-button"
            type="button"
            onClick={() => open("shoppingCart")}
            aria-label={`Warenkorb öffnen${cartCount ? `, ${cartCount} Artikel` : ""}`}
            className="relative grid min-h-11 min-w-11 place-items-center rounded-full transition-all hover:bg-foreground/8 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
          >
            <Image
              src="/shoppingCart.svg"
              alt=""
              width={24}
              height={24}
              className="opacity-85"
            />
            {cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-highlight px-1 text-[11px] font-bold text-foreground">{cartCount > 99 ? "99+" : cartCount}</span>}
          </button>
        </div>
      </nav>
      </div>
    </header>
  );
}
