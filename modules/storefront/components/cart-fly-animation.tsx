"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Flight = {
  id: number;
  imageSrc: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const CART_FLY_EVENT = "voyamed:cart-fly";

export function triggerCartFly(origin: HTMLElement, imageSrc = "/shoppingCart.svg") {
  const bounds = origin.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent(CART_FLY_EVENT, {
    detail: {
      imageSrc,
      from: { x: bounds.left + bounds.width / 2 - 24, y: bounds.top + bounds.height / 2 - 24 },
    },
  }));
}

export default function CartFlyAnimation() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const startFlight = (event: Event) => {
      const detail = (event as CustomEvent<{ imageSrc: string; from: { x: number; y: number } }>).detail;
      const cartBounds = document.getElementById("shopping-cart-button")?.getBoundingClientRect();
      const to = cartBounds
        ? { x: cartBounds.left + cartBounds.width / 2 - 24, y: cartBounds.top + cartBounds.height / 2 - 24 }
        : { x: window.innerWidth - 72, y: 18 };
      setFlights((current) => [...current, { id: Date.now() + Math.random(), imageSrc: detail.imageSrc, from: detail.from, to }]);
    };

    window.addEventListener(CART_FLY_EVENT, startFlight);
    return () => window.removeEventListener(CART_FLY_EVENT, startFlight);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {flights.map((flight) => (
        <motion.div
          key={flight.id}
          initial={{ x: flight.from.x, y: flight.from.y, scale: 1, opacity: 1 }}
          animate={{ x: flight.to.x, y: flight.to.y, scale: 0.28, opacity: 0.15 }}
          transition={{ duration: 0.62, ease: [0.2, 0.8, 0.2, 1] }}
          onAnimationComplete={() => setFlights((current) => current.filter((item) => item.id !== flight.id))}
          className="absolute left-0 top-0 grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-background p-1 shadow-xl ring-2 ring-highlight"
        >
          <img src={flight.imageSrc} alt="" className="h-full w-full object-contain" />
        </motion.div>
      ))}
    </div>
  );
}
