"use client";

import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";

type Props = {
  countries: FeatureCollection | null;
  selectedCountry: Feature | null;
  setSelectedCountry: (country: Feature | null) => void;
  width: number;
  height: number;
};

type GlobeInstance = {
  width: (value: number) => GlobeInstance;
  height: (value: number) => GlobeInstance;
  backgroundColor: (value: string) => GlobeInstance;
  globeImageUrl: (value: null) => GlobeInstance;
  showAtmosphere: (value: boolean) => GlobeInstance;
  polygonsData: (value: Feature[] | undefined) => GlobeInstance;
  polygonCapColor: (value: (feature: Feature) => string) => GlobeInstance;
  polygonStrokeColor: (value: () => string) => GlobeInstance;
  polygonAltitude: (value: (feature: Feature) => number) => GlobeInstance;
  polygonsTransitionDuration: (value: number) => GlobeInstance;
  polygonCapCurvatureResolution: (value: number) => GlobeInstance;
  onPolygonClick: (value: (feature: Feature) => void) => GlobeInstance;
  onPolygonHover: (value: (feature: Feature | null) => void) => GlobeInstance;
  pointOfView: (value: { lat?: number; lng?: number; altitude?: number }, duration?: number) => GlobeInstance;
  controls: () => { enableRotate: boolean; enableZoom: boolean; enableDamping: boolean; dampingFactor: number; zoomSpeed: number; minPolarAngle: number; maxPolarAngle: number };
  _destructor?: () => void;
};

declare global {
  interface Window { Globe?: () => (element: HTMLElement) => GlobeInstance; }
}

function isSelectableFeature(value: Feature | null): value is Feature {
  return Boolean(value?.geometry && value.id);
}

function getCenter(feature: Feature) {
  const geometry = feature.geometry;
  if (!geometry) return null;
  const rings = geometry.type === "Polygon" ? geometry.coordinates : geometry.type === "MultiPolygon" ? geometry.coordinates.flat() : [];
  const points = rings.flat();
  if (!points.length) return null;
  const [lng, lat] = points.reduce(([sumLng, sumLat], [pointLng, pointLat]) => [sumLng + pointLng, sumLat + pointLat], [0, 0]);
  return [lng / points.length, lat / points.length];
}

export default function GlobeCanvas({ countries, selectedCountry, setSelectedCountry, width, height }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeInstance | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const initialise = () => {
      if (!active || !mountRef.current || !window.Globe) return;
      const globe = window.Globe()(mountRef.current)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl(null)
        .showAtmosphere(false)
        .polygonsTransitionDuration(0)
        .polygonCapCurvatureResolution(3)
        .polygonStrokeColor(() => "#ffffff")
        .onPolygonClick((feature) => { if (isSelectableFeature(feature)) setSelectedCountry(feature); })
        .onPolygonHover(() => undefined);
      const controls = globe.controls();
      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.zoomSpeed = 0.65;
      controls.minPolarAngle = 0.35;
      controls.maxPolarAngle = Math.PI - 0.1;
      globe.pointOfView({ altitude: 1.65 }, 0);
      globeRef.current = globe;
    };

    if (window.Globe) initialise();
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/globe.gl";
      script.async = true;
      script.onload = initialise;
      script.onerror = () => { if (active) setLoadFailed(true); };
      document.head.appendChild(script);
    }
    return () => { active = false; globeRef.current?._destructor?.(); };
  }, [setSelectedCountry]);

  useEffect(() => { globeRef.current?.width(width).height(height); }, [height, width]);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    globe.polygonsData(countries?.features)
      .polygonCapColor((feature) => selectedCountry?.id === feature.id ? "rgba(34,197,94,0.82)" : "rgba(37,99,235,1)")
      .polygonAltitude((feature) => selectedCountry?.id === feature.id ? 0.03 : 0.01);
  }, [countries, selectedCountry]);

  useEffect(() => {
    const center = selectedCountry && getCenter(selectedCountry);
    if (center) globeRef.current?.pointOfView({ lng: center[0], lat: center[1], altitude: 0.9 }, 750);
  }, [selectedCountry]);

  return <div ref={mountRef} className="h-full min-h-[28rem] w-full">{loadFailed && <p className="grid h-full place-items-center text-sm text-foreground/60">Der 3D-Globus konnte nicht geladen werden. Nutze bitte die Länder-Suche.</p>}</div>;
}
