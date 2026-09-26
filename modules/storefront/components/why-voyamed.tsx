// Compared against a generic ready-made set, never a named competitor — every row has to stay objectively true.
const rows = [
  {
    label: "Inhalt",
    standard: "Gleiches Set für alle Reisenden",
    voyamed: "Passend zu Klima, Hygienerisiko und Aktivität deines Reiseziels",
  },
  {
    label: "Anpassen",
    standard: "Meist nur komplett zu kaufen",
    voyamed: "Jedes Produkt abwählbar, weitere aus dem Katalog ergänzbar",
  },
  {
    label: "Preis",
    standard: "Fester Setpreis",
    voyamed: "Summe der Einzelpreise – mit Grundpreis für jedes Produkt",
  },
  {
    label: "Versand",
    standard: "Oft erst ab Mindestbestellwert kostenlos",
    voyamed: "Kostenlos, ohne Mindestbestellwert",
  },
  {
    label: "Packliste",
    standard: "Selbst schreiben",
    voyamed: "Zum Ausdrucken oder als PDF – inklusive Erinnerungen",
  },
];

export default function WhyVoyamed() {
  return (
    <section aria-labelledby="why-voyamed-title" className="bg-foreground/5 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-highlight-ink">Warum Voyamed</p>
        <h2 id="why-voyamed-title" className="mt-1 text-2xl font-semibold sm:text-3xl">Deine Reise statt Einheitsset</h2>
        <p className="mt-2 max-w-2xl text-foreground/70">Fertige Reiseapotheken enthalten oft Dinge, die du nicht brauchst – und es fehlt, was dein Reiseziel verlangt.</p>
        {/* A grid instead of a table, so each row can stack on phones. */}
        <div className="mt-6 overflow-hidden rounded-3xl bg-background text-sm shadow-sm ring-1 ring-foreground/10">
          <div aria-hidden="true" className="hidden border-b border-foreground/10 sm:grid sm:grid-cols-[9rem_1fr_1fr]">
            <span />
            <span className="px-5 py-3 font-medium text-foreground/60">Standard-Set</span>
            <span className="bg-prim/30 px-5 py-3 font-semibold">Voyamed</span>
          </div>
          <dl>
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-2 border-b border-foreground/10 last:border-0 sm:grid-cols-[9rem_1fr_1fr]">
                <dt className="col-span-2 px-4 pb-1 pt-3 font-semibold sm:col-span-1 sm:px-5 sm:py-3">{row.label}</dt>
                <dd className="px-4 pb-3 pt-2 text-foreground/60 sm:px-5 sm:py-3">
                  <span className="block text-xs sm:hidden">Standard-Set</span>
                  {row.standard}
                </dd>
                <dd className="bg-prim/30 px-4 pb-3 font-medium pt-2 sm:px-5 sm:py-3">
                  <span className="block text-xs font-normal text-foreground/60 sm:hidden">Voyamed</span>
                  {row.voyamed}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
