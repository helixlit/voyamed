"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";
import GlobeCanvas from "./GlobeCanvas";

type Props = {
    countries: FeatureCollection | null;
    setCountries: (value: FeatureCollection | null) => void;

    selectedCountry: Feature | null;
    setSelectedCountry: (value: Feature | null) => void;
}

export default function WorldGlobe({
    countries, setCountries, selectedCountry, setSelectedCountry
}: Props) {

    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const controller = new AbortController();
        fetch(
            'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
            , { signal: controller.signal }
        )
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch((error) => { if (error.name !== "AbortError") console.error("Globus konnte nicht geladen werden", error); });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const next = { width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) };
            setSize((current) => current.width === next.width && current.height === next.height ? current : next);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef.current]);


    return (
        <div ref={containerRef} className=" relative min-h-0 bg-background pointer-events-auto">
            <GlobeCanvas
                countries={countries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                width={size.width}
                height={size.height}
            />
        </div>
    );
}
