"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/hero1.jpg",
    title1: "Für die ganze Familie.",
    title2: "Sorglos verreisen.",
  },
  {
    image: "/hero2.jpg",
    title1: "Abenteuer erleben.",
    title2: "Bestens vorbereitet.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [index]);

  return (
    <section className="relative  select-none bg-black">
      {slides.map((slide, i) => (
        <Image
          key={slide.image}
          src={slide.image}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`
            object-cover transition-opacity duration-1500 brightness-80
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}
      {/* Keeps the headline readable on bright parts of the photos. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/50" />

      <div className="relative flex flex-col w-full h-full">
        <div className="min-h-[clamp(24rem,42vw,50rem)] relative text-background gap-6 z-10 flex flex-col items-center justify-center w-full max-w-3xl m-auto px-5 py-12 pb-6">
          <div className="w-full text-center [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] overflow-visible">
            <h1 aria-live="polite" className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              <span
                key={slides[index].title1}
                className="block text-fade-in text-background"
              >
                {slides[index].title1}
              </span>
              <span
                key={slides[index].title2}
                className="block text-fade-in text-highlight"
              >
                {slides[index].title2}
              </span>
            </h1>
            {/* Say what the product is right away — the first glance decides whether visitors stay. */}
            <p className="mx-auto mt-4 max-w-xl text-base text-background/90 sm:text-lg">
              Deine Reiseapotheke passend zu Reiseziel und Aktivität – in wenigen Schritten zusammengestellt, geprüft von der Antonius-Apotheke.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/globe"
              className="rounded-full bg-highlight px-7 py-4 text-lg font-semibold text-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
            >
              Reiseapotheke zusammenstellen
            </Link>
            <Link
              href="#so-funktionierts"
              className="rounded-full px-5 py-3 text-base font-medium text-background underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
            >
              So funktioniert&apos;s
            </Link>
          </div>
        </div>
        <div className="z-10 relative bottom-0 p-4 left-0 flex gap-10 w-full justify-center">
          {slides.map((slide, i) => (
            <button
              key={slide.title1}
              type="button"
              aria-label={`Bild ${i + 1} von ${slides.length} anzeigen`}
              aria-current={i === index}
              onClick={() => {
                if (index != i) setIndex(i);
              }}
              className={`h-2.5 rounded-full bg-background transition-all duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight
              ${i === index ? "w-20 opacity-100" : "w-10 opacity-50 hover:w-20 hover:bg-highlight"}
            `}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
