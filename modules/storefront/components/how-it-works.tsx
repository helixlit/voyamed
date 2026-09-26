import Link from "next/link";
import { pharmacy } from "@/lib/pharmacy";

const steps = [
  {
    title: "Reiseziel & Aktivität wählen",
    text: "Auf dem Globus oder über die Suche. Klima und Hygienerisiko deines Ziels fließen automatisch in den Vorschlag ein.",
  },
  {
    title: "Kit prüfen & anpassen",
    text: "Du siehst jedes Produkt mit Preis. Ergänze, was dir fehlt, und entferne im Warenkorb, was du nicht brauchst.",
  },
  {
    title: "Sicher bezahlen",
    text: `Du bekommst eine Bestätigung per E-Mail, die ${pharmacy.name} prüft deine Bestellung und kümmert sich um den Versand.`,
  },
];

export default function HowItWorks() {
  return (
    <section id="so-funktionierts" aria-labelledby="how-it-works-title" className="scroll-mt-(--header-height) px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium text-highlight-ink">So funktioniert&apos;s</p>
        <h2 id="how-it-works-title" className="mt-1 text-2xl font-semibold sm:text-3xl">In drei Schritten zur passenden Reiseapotheke</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl bg-background p-5 shadow-sm ring-1 ring-foreground/10">
              <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-lg font-semibold text-background">{index + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{step.text}</p>
            </li>
          ))}
        </ol>
        <Link
          href="/globe"
          className="mt-6 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
        >
          Jetzt Reiseziel wählen
        </Link>
      </div>
    </section>
  );
}
