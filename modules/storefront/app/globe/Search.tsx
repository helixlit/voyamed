"use client"

import { Feature, FeatureCollection } from "geojson";
import React, { useEffect, useMemo, useState } from "react";
import countriesData from "@/data/konfigurator/countries.json";

const countryDetails = countriesData.countries;


type Props = {
  countries: FeatureCollection | null;

  selectedCountry: Feature | null;
  setSelectedCountry: (value: Feature | null) => void;
}




export default function Search({
  countries, selectedCountry, setSelectedCountry
}: Props) {

  const [query, setQuery] = useState("");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.toLowerCase().replace(/\s/g, "");
    const selectableCountries = countries?.features ?? countryDetails.map((country) => ({
      type: "Feature" as const,
      id: country.iso3,
      properties: { name: country.name_en },
      geometry: null,
    } as unknown as Feature));
    return selectableCountries.filter((country) => {
      const name = country.properties?.name;
      const detail = countryDetails.find((item) => item.iso3 === country.id);
      const searchableName = [name, detail?.name, detail?.name_en].filter(Boolean).join(" ").toLowerCase().replace(/\s/g, "");
      return searchableName.includes(normalizedQuery);
    }).slice(0, 8);
  }, [countries, query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!filteredCountries) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedCountryIndex((prev) => (
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        ));
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedCountryIndex((prev) => (
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        ));
        break;

      case "Enter": {
        if (!query) return;
        e.preventDefault();
        const country = filteredCountries[selectedCountryIndex]
        if (!country) return;
        setSelectedCountry(country);
        break;
      }
    }
  }

  useEffect(() => {
    setSelectedCountryIndex(0);
  }, [query]);

  useEffect(() => {
    if (!selectedCountry || !selectedCountry.properties) return;
    setQuery(countryDetails.find((item) => item.iso3 === selectedCountry.id)?.name ?? selectedCountry.properties.name);
  }, [selectedCountry]);

  const handleSelect = (country: Feature) => {
    setSelectedCountry(country);
    if (!country.properties) return;
    setQuery(country.properties.name);
  };

  return (
    <div className="absolute left-3 top-3 z-50 w-[min(26rem,calc(100vw-1.5rem))] pointer-events-none sm:left-5 sm:top-5" >
      <div className="flex flex-col gap-1 rounded-2xl border border-background/25 bg-foreground/90 p-2 shadow-xl backdrop-blur pointer-events-auto">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Suche nach einem Land..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-11 w-full rounded-xl bg-background px-4 text-foreground outline-none ring-2 ring-transparent placeholder:text-foreground/45 focus:ring-highlight"
        />
        {
          query && (
            <ul className={"max-h-60 overflow-y-auto rounded-xl bg-foreground p-1 text-background"}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => {
                  if (!country.properties) return;
                  return (
                    <li
                      key={country.properties.name}
                      onClick={() => handleSelect(country)}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-sm
                        ${index === selectedCountryIndex
                          ? "text-highlight"
                          : "text-background"}
                      `}
                    >
                      {countryDetails.find((item) => item.iso3 === country.id)?.name ?? country.properties.name}
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-2 text-sm">Keine Ergebnisse</li>
              )}
            </ul>
          )
        }
      </div>
    </div >
  );
}
