"use client";

import Search from "@/components/search";
import { Activity, CountryKit } from "@/utils/types";
import { useEffect, useState } from "react";

import countries from "@/data/konfigurator/countries.json"
import ActivitySelector from "@/components/activity-selector";
import BundleDisplay from "@/components/bundle-display";



export default function BundleBrowser() {
  const [query, setQuery] = useState<string>("");

  const [selectedCountry, setSelectedCountry] =
    useState<CountryKit | null>(null);

  const [filteredCountries, setFilteredCountries]
    = useState<Array<CountryKit> | null>
      (countries.countries.map(c => ({ id: c.code, ...c })));

  const [selectedActivity, setSelectedActivity] = useState<Activity | "">("");

  const queryPrisma = async (query: string) => {
    const filter =
      countries.countries.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    return filter.map(c => ({ id: c.code, ...c }));
  };

  useEffect(() => {
    const run = async () => {
      setFilteredCountries(await queryPrisma(query));
    }
    run();
  }, [query])

  useEffect(() => {
    console.debug(`Current Kit: ${selectedCountry?.name} -> ${selectedActivity}`)
  }, [selectedActivity, selectedCountry])
  return (
    <section className="grid  w-full place-content-center place-items-center-safe py-10 px-5 gap-5">
      <h1 className="text-wrap">Gib dein Reisziel + Aktivität an!</h1>
      <div className="flex gap-2 flex-wrap justify-center">
        <div>
          <Search<CountryKit>
            placeholder="Suche nach Reiseziel..."
            query={query}
            setQuery={setQuery}
            selectedItem={selectedCountry}
            setSelectedItem={setSelectedCountry}
            filteredItems={filteredCountries}
            divClassName="flex flex-col gap-2 pointer-events-auto w-full items-start justify-left relative"
            inputClassName="py-1.5 px-4 focus:outline-0 bg-highlight rounded-full"
            ulClassName="absolute top-10 z-50 rounded-[20px] py-2 px-4 bg-highlight/90 text-foreground/90 w-fit text-nowrap min-w-full"
            liClassName=""
            selectedLiClassName=""
          />
        </div>
        <ActivitySelector
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
        />
      </div>
      <BundleDisplay
        country={selectedCountry}
        activity={selectedActivity}
        displayArticles={true}
      />
    </section>
  )
}