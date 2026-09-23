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

  return (
    <div className="relative h-full min-h-[28rem] w-full overflow-hidden">
      {/* This stays visible before the interactive canvas has finished loading. */}
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,#f8fbff_0%,#edf4ff_42%,#dce9fb_100%)]">
        <div className="absolute h-[min(72vw,38rem)] w-[min(72vw,38rem)] rounded-full bg-[radial-gradient(circle_at_31%_25%,#b8deff_0%,#6098f4_22%,#2f67d6_55%,#12367e_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_28px_70px_rgba(21,69,164,0.30)]">
          <div className="absolute inset-[7%] rounded-full border border-white/30" />
          <div className="absolute left-1/2 top-[4%] h-[92%] w-[32%] -translate-x-1/2 rounded-full border border-white/25" />
          <div className="absolute left-[6%] top-1/2 h-[28%] w-[88%] -translate-y-1/2 rounded-full border border-white/25" />
          <div className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent_22%,rgba(255,255,255,0.24)_50%,transparent_78%)] animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute -left-[15%] top-[48%] h-[16%] w-[130%] -translate-y-1/2 rounded-[50%] border-y border-white/25 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.45),transparent_18%),radial-gradient(circle_at_67%_78%,rgba(4,24,82,0.50),transparent_42%)]" />
        </div>
        <p className="absolute bottom-5 rounded-full bg-white/80 px-4 py-2 text-center text-xs font-medium text-[#163266] shadow-sm backdrop-blur-sm">
          Interaktiver Globus wird geladen …
        </p>
      </div>

      <div ref={mountRef} className="relative z-10 h-full min-h-[28rem] w-full" />

      {loadFailed && (
        <p className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-center text-sm text-foreground/70 shadow-sm">
          Die Länder-Suche funktioniert weiterhin, auch wenn der 3D-Globus nicht geladen wird.
        </p>
      )}
    </div>
  );
}
