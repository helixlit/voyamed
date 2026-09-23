import { Article } from "@voyamed/catalog/contract";

export enum BundelType {
  Desert,
  Mountain,
  ColdClimate,
}

type RenamePznToId<T extends { pzn: unknown }> =
  Omit<T, "pzn"> & {
    id: T["pzn"];
  };

export type ArticleWithId = RenamePznToId<Article>;

export enum ClimateZoneEnum {
  Tropical = "tropisch",
  Subtropical = "subtropisch",
  dry = "trocken",
  temperate = "gemaessigt",
  polar = "kalt"
}

export enum HygieneRisk {
  Low = "niedrig",
  Moderate = "mittel",
  High = "hoch"
}

export interface CountryKit {
  id: string,
  code: string,
  iso3: string,
  name_en: string,
  name: string,
  region: string,
  klimazone: ClimateZoneEnum | string,
  hygiene_risiko: HygieneRisk | string,
}

import kits from "@/data/konfigurator/kits.json";

export type Activity = keyof typeof kits.activities;
export type ClimateZone = keyof typeof kits.klimazonen;

import { countries } from "@/data/konfigurator/countries.json"
export type Country = (typeof countries)[0];

import { kategorien } from "@/data/konfigurator/produkte.json"
export type Indication = keyof typeof kategorien;