"use client"

import { useEffect, useState } from "react";
import Search from "./Search";
import dynamic from "next/dynamic";
import { Feature, FeatureCollection } from "geojson";
import countriesData from "@/data/konfigurator/countries.json";
import { Activity, Country } from "@/utils/types";
import ActivitySelector from "@/components/activity-selector";
import BundleDisplay from "@/components/bundle-display";
import { getAvailableActivities } from "@/lib/travel-kit";
import { getClimate } from "@/lib/travel-kit";

const CountriesDetails = countriesData.countries;

// three.js and the globe are ~450 KB of JavaScript: load them after the page is usable instead of blocking it.
const WorldGlobe = dynamic(() => import("./WorldGlobe"), {
    ssr: false,
    loading: () => <div aria-hidden="true" className="m-auto aspect-square w-[min(70vw,60vh)] animate-pulse rounded-full bg-foreground/5" />,
});

export default function GlobeContext() {
    const [countries, setCountries] = useState<FeatureCollection | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);

    const [selectedActivity, setSelectedActivity] = useState<Activity | "">("");

    const [countryDetails, setCountryDetails] = useState<Country>();
    const [showKit, setShowKit] = useState(false);

    useEffect(() => {
        const country = CountriesDetails.find(c => c.iso3 === selectedCountry?.id);
        setCountryDetails(country);
        setSelectedActivity("");
        setShowKit(false);
    }, [selectedCountry]);

    return (
        <div className="h-full grid relative overflow-hidden bg-background">
            <h1 className="sr-only">Reiseziel auf dem Globus wählen</h1>
            <Search
                countries={countries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
            />
            <WorldGlobe
                countries={countries}
                setCountries={setCountries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
            />
            {selectedCountry !== null && countryDetails && (
                <aside className="absolute right-3 top-20 z-40 w-[min(25rem,calc(100vw-1.5rem))] rounded-2xl bg-background p-4 text-foreground shadow-2xl ring-1 ring-foreground/10 sm:right-5 sm:top-24 lg:top-5">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-xs font-medium text-highlight-ink">Ausgewähltes Reiseziel</p><h2 className="mt-1 text-xl font-semibold">{countryDetails.name}</h2><p className="mt-1 text-sm text-foreground/65">{getClimate({ id: countryDetails.code, ...countryDetails })?.beschreibung}</p></div>
                      <button type="button" onClick={() => setSelectedCountry(null)} aria-label="Reiseziel schließen" className="grid h-9 w-9 place-items-center rounded-full text-lg hover:bg-foreground/5">×</button>
                    </div>
                    <div className="mt-4">
                        <ActivitySelector
                            selectedActivity={selectedActivity}
                            setSelectedActivity={setSelectedActivity}
                            availableActivities={getAvailableActivities(countryDetails ? { id: countryDetails.code, ...countryDetails } : null)}
                        />
                    </div>
                    {selectedActivity && <button type="button" onClick={() => setShowKit((value) => !value)} className="mt-4 min-h-11 w-full rounded-full bg-foreground px-4 text-sm font-medium text-background">{showKit ? "Kit-Details schließen" : "Passendes Kit anzeigen"}</button>}
                </aside>
            )}
            {showKit && countryDetails && <div className="absolute inset-x-3 bottom-3 z-40 mx-auto max-h-[45dvh] max-w-6xl lg:max-h-[56dvh] overflow-y-auto rounded-3xl bg-background shadow-2xl ring-1 ring-foreground/10 sm:inset-x-5 sm:bottom-5"><BundleDisplay country={{ id: countryDetails.code, ...countryDetails }} activity={selectedActivity} displayArticles={false} /></div>}
        </div>
    );
}
