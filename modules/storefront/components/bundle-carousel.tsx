"use client";

import Image from "next/image";
import { useRef } from "react";
import { bundles } from "@/utils/Bundles";
import type { Activity } from "@/utils/types";

const quickSelections: Record<string, { countryCode: string; activity: Activity; label: string }> = {
  "Wüstenkit": { countryCode: "EG", activity: "wuestenreise", label: "Ägypten · Wüstenreise" },
  "Tropen Kit": { countryCode: "TH", activity: "safari_dschungel", label: "Thailand · Tropen & Dschungel" },
  "Monsun Kit": { countryCode: "IN", activity: "backpacking_rundreise", label: "Indien · Rundreise" },
  "Hochgebirgs Kit": { countryCode: "NP", activity: "wandern_trekking", label: "Nepal · Trekking" },
  "Kaltklima Kit": { countryCode: "NO", activity: "wintersport", label: "Norwegen · Wintersport" },
  "Wander Kit": { countryCode: "AT", activity: "wandern_trekking", label: "Österreich · Wandern" },
  "Städte Reisen Kit": { countryCode: "DE", activity: "staedtetrip", label: "Deutschland · Städtetrip" },
  "Welten Kit": { countryCode: "DE", activity: "backpacking_rundreise", label: "Deutschland · Rundreise" },
};

type Props = {
  onSelect: (countryCode: string, activity: Activity) => void;
  selectedCountryCode?: string;
  selectedActivity?: Activity | "";
};

export default function BundleCarousel({ onSelect, selectedCountryCode, selectedActivity }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (direction: 1 | -1) => track.current?.scrollBy({ left: direction * 360, behavior: "smooth" });

  return (
    <section aria-label="Beliebte Reisekits" className="w-full max-w-6xl">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Reisekit direkt auswählen</h2>
          <p className="text-sm text-foreground/65">Wähle ein Kit – danach siehst du alle enthaltenen Arzneimittel und kannst es anpassen.</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" aria-label="Vorherige Kits" onClick={() => scroll(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background text-lg hover:bg-foreground/5">‹</button>
          <button type="button" aria-label="Nächste Kits" onClick={() => scroll(1)} className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 bg-background text-lg hover:bg-foreground/5">›</button>
        </div>
      </div>
      <div ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]">
        {bundles.map((bundle) => {
          const selection = quickSelections[bundle.name];
          const isSelected = selection?.countryCode === selectedCountryCode && selection.activity === selectedActivity;
          return (
          <button
            key={bundle.name}
            type="button"
            onClick={() => selection && onSelect(selection.countryCode, selection.activity)}
            aria-pressed={isSelected}
            className={`group relative h-56 min-w-[17rem] snap-start overflow-hidden rounded-2xl bg-foreground text-left text-background shadow-sm transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight sm:min-w-[20rem] ${isSelected ? "ring-4 ring-highlight" : "hover:-translate-y-1 hover:shadow-lg"}`}
          >
            <Image src={bundle.img} alt="" fill sizes="(max-width: 640px) 272px, 320px" className="object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="text-lg font-semibold">{bundle.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-background/80">{bundle.beschreibung}</p>
              <span className="mt-3 inline-flex rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground transition group-hover:bg-highlight">{isSelected ? "Ausgewählt" : selection?.label}</span>
            </div>
          </button>
          );
        })}
      </div>
    </section>
  );
}
