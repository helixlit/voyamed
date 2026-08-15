"use client"

import { Feature, FeatureCollection } from "geojson";
import React, { useEffect, useState } from "react";


type Props = {
  countries: FeatureCollection | null;
  setCountries: (value: FeatureCollection | null) => void;

  selectedCountry: Feature | null;
  setSelectedCountry: (value: Feature | null) => void;
}




export default function Search({
  countries, setCountries, selectedCountry, setSelectedCountry
}: Props) {

  const [query, setQuery] = useState("");
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  let filteredCountries: Feature[];

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

      case "Enter":
        if (!query) return;
        e.preventDefault();
        const country = filteredCountries[selectedCountryIndex]
        if (!country) return;
        setSelectedCountry(country);
        break;
    }
  }

  useEffect(() => {
    setSelectedCountryIndex(0);
  }, [query]);

  useEffect(() => {
    if (!selectedCountry || !selectedCountry.properties) return;
    setQuery(selectedCountry.properties.name);
  }, [selectedCountry]);

  if (!countries?.features) return;
  filteredCountries = countries.features.filter((country) => {
    if (!country.properties) return;
    return country.properties.name.toLowerCase().replace(/\s/g, "").includes(query.toLowerCase().replace(/\s/g, ""));
  }).slice(0, 10);


  const handleSelect = (country: Feature) => {
    setSelectedCountry(country);
    if (!country.properties) return;
    setQuery(country.properties.name);
  };

  return (
    <div className=" absolute top-0 z-50 w-screen flex flex-row justify-center pointer-events-none" >
      <div className="p-2 w-1/3 flex flex-col gap-1 pointer-events-auto">
        <input
          type="text"
          onKeyDown={handleKeyDown}
          placeholder="Suche nach einem Land..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="z-50 w-full rounded-xl border-2 p-2 bg-foreground text-background
          focus:outline-0
          "
        />
        {
          query && (
            <ul className={"z-50 border-2 rounded-xl p-2 bg-foreground text-background"}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => {
                  if (!country.properties) return;
                  return (
                    <li
                      key={country.properties.name}
                      onClick={() => handleSelect(country)}
                      className={`cursor-pointer
                        ${index === selectedCountryIndex
                          ? "text-highlight"
                          : "text-background"}
                      `}
                    >
                      {country.properties.name}
                    </li>
                  );
                })
              ) : (
                <li className="">Keine Ergebnisse</li>
              )}
            </ul>
          )
        }
      </div>
    </div >
  );
}