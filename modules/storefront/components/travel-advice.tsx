import advice from "@/data/konfigurator/travel-advice.json";
import { getActivity } from "@/lib/travel-kit";
import type { Activity, CountryKit } from "@/utils/types";

type Props = { country: CountryKit; activity: Activity };

export default function TravelAdvice({ country, activity }: Props) {
  const selectedActivity = getActivity(activity);
  const climateHint = advice.climateHints[country.klimazone as keyof typeof advice.climateHints];
  const activityHint = advice.activityHints[activity as keyof typeof advice.activityHints];
  const countryHint = advice.countryHints[country.code as keyof typeof advice.countryHints];
  const needsTravelVaccinationCheck = country.hygiene_risiko === "hoch" || country.klimazone === "tropisch";

  if (!selectedActivity) return null;

  return (
    <aside className="mt-5 rounded-2xl border border-highlight/30 bg-highlight/10 p-4 text-sm text-foreground">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold marker:hidden">
          <span>Unverbindliche Reisehinweise für {country.name}</span>
          <span aria-hidden="true" className="text-lg transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="pt-3">
          <p className="text-foreground/75">{countryHint ?? climateHint}</p>
          <p className="mt-2 text-foreground/75">{activityHint}</p>
          {needsTravelVaccinationCheck && (
            <div className="mt-4 rounded-xl border border-foreground/10 bg-background/70 p-3">
              <p className="font-semibold">Impfungen vor der Reise prüfen</p>
              <p className="mt-1 text-foreground/75">Für dieses Reiseziel kann eine reisemedizinische Beratung sinnvoll sein. Lass den Standardimpfschutz und – je nach genauer Route, Aufenthaltsdauer und Reiseart – mögliche Reiseimpfungen oder eine Malariavorbeugung rechtzeitig ärztlich oder in einer Apotheke prüfen.</p>
              <p className="mt-2 text-xs text-foreground/65">Keine individuelle Impfempfehlung: Alter, Vorerkrankungen, bisherige Impfungen, Transitländer und aktuelle Einreisevorgaben können die Beratung verändern.</p>
              <p className="mt-2 text-xs text-foreground/65">
                Offizielle Quellen: {advice.vaccineSources.map((source, index) => (
                  <span key={source.url}>{index > 0 ? " · " : ""}<a className="underline underline-offset-2 hover:text-foreground" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>
                ))}
              </p>
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-foreground/65">{advice.disclaimer}</p>
          <p className="mt-3 text-xs text-foreground/65">
            Reiseinformationen: {advice.sources.map((source, index) => (
              <span key={source.url}>{index > 0 ? " · " : ""}<a className="underline underline-offset-2 hover:text-foreground" href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>
            ))}
          </p>
        </div>
      </details>
    </aside>
  );
}
