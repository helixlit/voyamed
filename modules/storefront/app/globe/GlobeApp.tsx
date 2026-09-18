"use client"

import { useEffect, useState } from "react";
import Search from "./Search";
import WorldGlobe from "./WorldGlobe";
import { Feature, FeatureCollection } from "geojson";

export default function GlobeContext() {
    const [countries, setCountries] = useState<FeatureCollection | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null);

    useEffect(() => {

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
        </div>
    );
}