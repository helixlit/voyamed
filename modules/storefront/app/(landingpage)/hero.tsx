"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/hero1.jpg",
    title1: "Für die ganze Famile.",
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
          alt="...loading"
          fill
          priority
          className={`
            object-cover text-center transition-opacity duration-1500 brightness-80
            ${i === index ? "opacity-0" : "opacity-100"}
          `}
        />
      ))}

      <div className="relative flex flex-col w-full h-full">
        <div className="h-[clamp(20rem,40vw,50rem)] relative text-background gap-5 z-50 flex flex-col items-center justify-center w-fit m-auto text-[clamp(1rem,8vw,5rem)] pb-10 dark:text-foreground">
          <div className=" z-50 w-full text-center [text-shadow:0_1px_10px_rgba(0,0,0,0.3)] overflow-visible">
            <h1
              key={slides[index].title1}
              className="text-fade-in text-background"
            >
              {slides[index].title1}
            </h1>
            <h1
              key={slides[index].title2}
              className="text-fade-in text-highlight"
            >
              {slides[index].title2}
            </h1>
          </div>
          <Link
            href="/globe"
            className=" text-background/90 dark:text-background/90 shadow-[0_0_20px_5px_rgba(0,0,0,0.6)] border-3 border-background/10 hover:border-to-background/80 text-center bg-highlight/30 rounded-4xl p-3 backdrop-blur-[3px] transition-all duration-400 hover:bg-highlight/80 text-[clamp(1rem,6vw,4rem)]"
          >
            <h1>Hier bestellen</h1>
          </Link>
        </div>
        <ul className="z-50 relative bottom-0 p-4 left-0 flex gap-10 w-screen justify-center align-middle">
          {slides.map((slide, i) => (
            <li
              key={slide.title1}
              onClick={() => {
                if (index != i) setIndex(i);
              }}
              className={`w-10 h-2.5 bg-background dark:bg-foreground rounded-full hover:w-20 transition-all duration-400
              ${i === index ? "opacity-100 w-20 !hover:bg-foreground" : "opacity-50 hover:bg-highlight"}
            `}
            ></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
