import countryActivities from "@/data/konfigurator/country-activities.json";
import kits from "@/data/konfigurator/kits.json";
import type { Activity, CountryKit } from "@/utils/types";

type ActivityKey = keyof typeof kits.activities;

function isActivityKey(value: string): value is ActivityKey {
  return value in kits.activities;
}

export function getAvailableActivities(country: CountryKit | null): Activity[] {
  if (!country) return [];

  const overrides = countryActivities.countryOverrides as Record<string, string[]>;
  const climateDefaults = countryActivities.climateDefaults as Record<string, string[]>;
  const candidates = overrides[country.code] ?? climateDefaults[country.klimazone] ?? [];

  return candidates.filter(isActivityKey) as Activity[];
}

export function getActivity(activity: Activity | "") {
  return activity ? kits.activities[activity] : undefined;
}

export function getClimate(country: CountryKit | null) {
  return country ? kits.klimazonen[country.klimazone as keyof typeof kits.klimazonen] : undefined;
}

export function buildKitPzns(country: CountryKit, activity: Activity) {
  const climate = getClimate(country);
  const selectedActivity = getActivity(activity);
  if (!climate || !selectedActivity) return [];

  const pzns = [
    ...kits.basis.produkte,
    ...climate.hinzufuegen,
    ...selectedActivity.hinzufuegen,
    ...(country.hygiene_risiko === "hoch" ? kits.hygiene_hoch.hinzufuegen : []),
  ];

  const excluded = new Set(selectedActivity.entfernen ?? []);
  return [...new Set(pzns.filter((pzn) => !excluded.has(pzn)))];
}
