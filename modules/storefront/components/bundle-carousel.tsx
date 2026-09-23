"use client";

import Image from "next/image";
import { useRef } from "react";
import { bundles } from "@/utils/Bundles";

export default function BundleCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => track.current?.scrollBy({ left: direction * 360, behavior: "smooth" });

  return (
    <section aria-label="Beliebte Reisekits" className="w-full max-w-6xl">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Beliebte Reisekits</h2>
          <p className="text-sm text-foreground/65">Inspiration für Reiseart und Klima. Danach stellst du dein persönliches Kit zusammen.</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" aria-label="Vorherige Kits" onClick={() => scroll(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background text-lg hover:bg-foreground/5">‹</button>
          <button type="button" aria-label="Nächste Kits" onClick={() => scroll(1)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background text-lg hover:bg-foreground/5">›</button>
        </div>
      </div>
      <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {bundles.map((bundle) => (
          <article key={bundle.name} className="relative h-56 min-w-[17rem] snap-start overflow-hidden rounded-2xl bg-foreground text-background shadow-sm sm:min-w-[20rem]">
            <Image src={bundle.img} alt="" fill sizes="(max-width: 640px) 272px, 320px" className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-lg font-semibold">{bundle.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-background/80">{bundle.beschreibung}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
