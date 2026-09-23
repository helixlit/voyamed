import advice from "@/data/konfigurator/travel-advice.json";
import { getActivity } from "@/lib/travel-kit";
import type { Activity, CountryKit } from "@/utils/types";

type Props = { country: CountryKit; activity: Activity };

export default function TravelAdvice({ country, activity }: Props) {
  const selectedActivity = getActivity(activity);
  const climateHint = advice.climateHints[country.klimazone as keyof typeof advice.climateHints];
  const activityHint = advice.activityHints[activity as keyof typeof advice.activityHints];
  const countryHint = advice.countryHints[country.code as keyof typeof advice.countryHints];

  if (!selectedActivity) return null;

  return (
    <aside className="mt-5 rounded-2xl border border-highlight/30 bg-highlight/10 p-4 text-sm text-foreground">
      <p className="font-semibold">Unverbindlicher Reisehinweis für {country.name}</p>
      <p className="mt-2 text-foreground/75">{countryHint ?? climateHint}</p>
      <p className="mt-2 text-foreground/75">{activityHint}</p>
      <p className="mt-3 text-xs leading-relaxed text-foreground/65">{advice.disclaimer}</p>
      <p className="mt-3 text-xs text-foreground/65">
        Reiseinformationen: {advice.sources.map((source, index) => (
          <span key={source.url}>{index > 0 ? " · " : ""}<a className="underline underline-offset-2 hover:text-foreground" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>
        ))}
      </p>
    </aside>
  );
}
