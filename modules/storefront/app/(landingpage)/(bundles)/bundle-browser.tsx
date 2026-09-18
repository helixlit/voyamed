"use client";

import Search from "@/components/search";
import { Activity, CountryKit } from "@/utils/types";
import { useEffect, useState } from "react";

import countries from "@/data/konfigurator/countries.json"
import ActivitySelector from "./activity-selector";
import BundleDisplay from "./bundle-display";



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
    <section className="grid  w-full place-items-center py-10 px-5">
      <h1>Gib dein Reisziel + Aktivität an!</h1>
      <div className="flex gap-2">
        <Search<CountryKit>
          placeholder="Suche nach Reiseziel..."
          query={query}
          setQuery={setQuery}
          selectedItem={selectedCountry}
          setSelectedItem={setSelectedCountry}
          filteredItems={filteredCountries}
          queryPrisma={queryPrisma}
          divClassName="w-1/3 flex flex-col gap-2 pointer-events-auto w-full items-start justify-left relative"
          inputClassName="py-1.5 px-4 focus:outline-0 bg-highlight rounded-full"
          ulClassName="absolute top-10 z-50 rounded-[20px] py-2 px-4 bg-highlight/90 text-foreground/90 w-fit text-nowrap min-w-full"
          liClassName=""
          selectedLiClassName=""
        />
        <ActivitySelector
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
        />
      </div>
      <BundleDisplay
        country={selectedCountry}
        activity={selectedActivity}
      />
    </section>
  )
}