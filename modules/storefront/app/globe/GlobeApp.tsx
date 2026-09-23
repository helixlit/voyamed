"use client"

import { useEffect, useState } from "react";
import Search from "./Search";
import WorldGlobe from "./WorldGlobe";
import { Feature, FeatureCollection } from "geojson";
import { countries as CountriesDetails } from "@/data/konfigurator/countries.json";
import { Activity, Country } from "@/utils/types";
import ActivitySelector from "@/components/activity-selector";
import BundleDisplay from "@/components/bundle-display";
import { getAvailableActivities } from "@/lib/travel-kit";

export default function GlobeContext() {
    const [countries, setCountries] = useState<FeatureCollection | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);

    const [selectedActivity, setSelectedActivity] = useState<Activity | "">("");

    const [countryDetails, setCountryDetails] = useState<Country>();

    useEffect(() => {
        const country = CountriesDetails.find(c => c.iso3 === selectedCountry?.id);
        setCountryDetails(country);
        setSelectedActivity("");
    }, [selectedCountry]);

    return (
        <div className="h-full grid relative">
            <Search
                countries={countries}
                setCountries={setCountries}
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
                <div className="absolute right-0 m-3 p-2 rounded-xl bg-highlight text-background max-w-[31%]">
                    <div className="flex items-center gap-4">
                        Reiseziel: {countryDetails?.name}
                        <ActivitySelector
                            selectedActivity={selectedActivity}
                            setSelectedActivity={setSelectedActivity}
                            availableActivities={getAvailableActivities(countryDetails ? { id: countryDetails.code, ...countryDetails } : null)}
                        />
                    </div>
                    <BundleDisplay
                        country={{ id: countryDetails.code, ...countryDetails }}
                        activity={selectedActivity}
                        displayArticles={false}
                    />
                </div>
            )}
        </div>
    );
}
