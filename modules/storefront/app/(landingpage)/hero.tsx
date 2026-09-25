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

      <div className="relative flex flex-col w-full h-full">
        <div className="h-[clamp(20rem,40vw,50rem)] relative text-background gap-5 z-10 flex flex-col items-center justify-center w-fit m-auto text-[clamp(1rem,8vw,5rem)] pb-10">
          <div className="w-full text-center [text-shadow:0_1px_10px_rgba(0,0,0,0.3)] overflow-visible">
            <h1 aria-live="polite">
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
          </div>
          <Link
            href="/globe"
            className="text-background/90 shadow-[0_0_20px_5px_rgba(0,0,0,0.6)] border-3 border-background/10 text-center bg-highlight/30 rounded-4xl p-3 backdrop-blur-[3px] transition-all duration-400 hover:bg-highlight/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background"
          >
            <span className="block text-[2rem] font-medium">Hier bestellen</span>
          </Link>
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
