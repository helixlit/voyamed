//@ts-nocheck
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Feature, FeatureCollection } from "geojson";
import { MeshBasicMaterial } from "three";
import { area, centroid, polygon } from "@turf/turf";

const Globe = dynamic(() => import("react-globe.gl"),
    { ssr: false }
);


function getCenter(feature: Feature) {
    const geometry = feature.geometry;
    if (!geometry) return null;

    if (geometry.type === 'Polygon') {
        return centroid(geometry).geometry.coordinates;
    }
    if (geometry.type === 'MultiPolygon') {
        const largestPolygon = polygon(geometry.coordinates.sort((a, b) =>
            area(polygon(b)) - area(polygon(a)))[0]);
        return centroid(largestPolygon).geometry.coordinates;
    }

    return centroid(geometry).geometry.coordinates;
}

function isSelectableFeature(value: unknown): value is Feature {
    return Boolean(value && typeof value === "object" && (value as Feature).type === "Feature" && (value as Feature).geometry && (value as Feature).id);
}

type Props = {
    countries: FeatureCollection | null;
    setCountries: (value: FeatureCollection | null) => void;

    selectedCountry: Feature | null;
    setSelectedCountry: (value: Feature | null) => void;
}

export default function WorldGlobe({
    countries, setCountries, selectedCountry, setSelectedCountry
}: Props) {

    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hoveredCountryId = useRef<string | number | null>(null);

    const [size, setSize] = useState({ width: 0, height: 0 });

    const [hoveredCountry, setHoveredCountry] = useState<Feature | null>(null);

    const [loading, setLoading] = useState(true);
    const [animateLoad, setAnimateLoad] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetch(
            'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
            , { signal: controller.signal }
        )
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch((error) => { if (error.name !== "AbortError") console.error("Globus konnte nicht geladen werden", error); });

        const showAnimation = window.setTimeout(() => {
            setAnimateLoad(true);
        }, 250);

        const hideLoader = window.setTimeout(() => {
            setLoading(false);
        }, 750);
        return () => { controller.abort(); window.clearTimeout(showAnimation); window.clearTimeout(hideLoader); };
    }, []);

    useEffect(() => {
        if (!selectedCountry) return;
        const globe = globeRef.current;
        const center = getCenter(selectedCountry);
        if (!center) return;
        const [lng, lat] = center;

        globe.pointOfView({
            lat, lng, altitude: 0.9
        }, 750);
    }, [selectedCountry]);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const next = { width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) };
            setSize((current) => current.width === next.width && current.height === next.height ? current : next);
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [containerRef.current]);


    useEffect(() => {
        if (!globeRef.current) return;
        const globe = globeRef.current;


        if (!globe.controls) return;

        const controls = globe.controls();

        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.enableDamping = true;


        controls.minPolarAngle = 0.35;
        controls.maxPolarAngle = Math.PI - 0.1;

        controls.minDistance = 150;
        controls.maxDistance = 300;

        controls.dampingFactor = 0.08;
        controls.zoomSpeed = 0.65;

        return;

    }, []);

    const globeMaterial = useMemo(() => new MeshBasicMaterial({ color: "#5896fc" }), []);
    const handlePolygonHover = useCallback((country: unknown) => {
        const nextCountry = isSelectableFeature(country) ? country : null;
        const nextId = nextCountry?.id ?? null;
        if (hoveredCountryId.current === nextId) return;
        hoveredCountryId.current = nextId;
        setHoveredCountry(nextCountry);
    }, []);

    return (
        <div ref={containerRef} className=" relative min-h-0 bg-background pointer-events-auto">
            <Globe
                ref={globeRef}

                width={size.width}
                height={size.height}
                onGlobeReady={() => globeRef.current?.pointOfView({ altitude: 1.65 }, 0)}

                enablePointerInteraction={true}

                rendererConfig={{
                    antialias: false,
                    alpha: true,
                }}

                polygonsData={countries?.features}
                polygonCapColor={(object) => {
                    if (!isSelectableFeature(object)) return "rgba(37,99,235,1)";
                    const country = object;

                    if (selectedCountry && selectedCountry.id == country.id) return "rgba(34,197,94,0.8)";

                    if (hoveredCountry && hoveredCountry.id == country.id) return "rgba(255,215,0,0.9)";

                    return "rgba(37,99,235,1)"
                }
                }

                polygonStrokeColor={() => "#ffffff"}


                onPolygonClick={(object) => {
                    if (!isSelectableFeature(object)) return;
                    setSelectedCountry(object);
                }}

                polygonAltitude={(object) => {
                    if (!isSelectableFeature(object)) return 0.01;
                    const country = object;
                    if (!selectedCountry) return 0.01;
                    return (
                        selectedCountry.id == country.id
                            ? 0.03
                            : 0.01
                    )
                }
                }

                onPolygonHover={handlePolygonHover}

                polygonsTransitionDuration={0}
                polygonCapCurvatureResolution={3}

                backgroundColor="rgba(0,0,0,0)"

                globeImageUrl={null}
                globeMaterial={globeMaterial}

                showAtmosphere={false}

                animateIn={false}
            />
            {loading && (<div className={`absolute inset-0 flex items-center justify-center bg-background z-50 transition-opacity duration-500
            ${animateLoad ? "opacity-0" : "opacity-100"}
                `}>
                <div className="relative">
                    <div className="h-40 w-40 rounded-full bg-foreground opacity-30 blur-2xl animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center text-white/80 text-center">
                        Loading globe...
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
