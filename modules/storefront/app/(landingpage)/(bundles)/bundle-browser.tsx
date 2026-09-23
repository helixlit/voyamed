"use client";

import Search from "@/components/search";
import { Activity, CountryKit } from "@/utils/types";
import { useEffect, useState } from "react";

import countries from "@/data/konfigurator/countries.json"
import ActivitySelector from "@/components/activity-selector";
import BundleDisplay from "@/components/bundle-display";
import BundleCarousel from "@/components/bundle-carousel";
import { getAvailableActivities } from "@/lib/travel-kit";



export default function BundleBrowser() {
  const [query, setQuery] = useState<string>("");

  const [selectedCountry, setSelectedCountry] =
    useState<CountryKit | null>(null);

  const [filteredCountries, setFilteredCountries]
    = useState<Array<CountryKit> | null>
      (countries.countries.map(c => ({ id: c.code, ...c })));

  const [selectedActivity, setSelectedActivity] = useState<Activity | "">("");

  const availableActivities = getAvailableActivities(selectedCountry);

  const queryPrisma = async (query: string) => {
    const filter =
      countries.countries.filter(c => {
        const normalize = (value: string) => value
          .toLocaleLowerCase("de-DE")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const normalizedQuery = normalize(query);
        return [c.name, c.name_en, c.code, c.iso3].some((value) => normalize(value).includes(normalizedQuery));
      }).slice(0, 8);
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

  function selectQuickKit(countryCode: string, activity: Activity) {
    const country = countries.countries.find((item) => item.code === countryCode);
    if (!country) return;
    setSelectedCountry({ id: country.code, ...country });
    setSelectedActivity(activity);
    setQuery(country.name);
    window.setTimeout(() => {
      document.getElementById("bundle-display")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  useEffect(() => {
    if (selectedActivity && !availableActivities.includes(selectedActivity)) {
      setSelectedActivity("");
    }
  }, [selectedActivity, selectedCountry?.code]);

  return (
    <section className="grid w-full place-items-center gap-6 px-5 py-10">
      <BundleCarousel
        onSelect={selectQuickKit}
        selectedCountryCode={selectedCountry?.code}
        selectedActivity={selectedActivity}
      />
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">Gib dein Reiseziel &amp; deine Aktivität an</h1>
        <p className="mt-1 text-foreground/65">Oder wähle oben ein Reisekit als schnellen Einstieg.</p>
      </div>
      <div className="flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-start">
        <Search<CountryKit>
          placeholder="Suche nach Reiseziel..."
          query={query}
          setQuery={setQuery}
          selectedItem={selectedCountry}
          setSelectedItem={setSelectedCountry}
          filteredItems={filteredCountries}
          queryPrisma={queryPrisma}
          divClassName="relative flex min-w-0 flex-1 flex-col gap-2"
          inputClassName="min-h-12 w-full rounded-full bg-highlight px-5 text-foreground outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-foreground/30"
          ulClassName="absolute top-14 z-50 max-h-72 w-full overflow-y-auto rounded-2xl bg-background p-2 text-foreground shadow-xl ring-1 ring-black/10"
          liClassName="rounded-xl px-3 py-2 hover:bg-foreground/5"
          selectedLiClassName="rounded-xl px-3 py-2 font-medium hover:bg-foreground/5"
        />
        <ActivitySelector
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          availableActivities={availableActivities}
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
