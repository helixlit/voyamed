import Link from "next/link";
import type { ReactNode } from "react";
import { pharmacy } from "@/lib/pharmacy";

// Only answers we can stand behind: on a pharmacy shop every promise here is read as a commitment.
const questions: Array<{ question: string; answer: ReactNode }> = [
  {
    question: "Wer steht hinter Voyamed?",
    answer: <>Voyamed stellt Reiseapotheken passend zu Reiseziel und Aktivität zusammen. Deine Bestellung prüft und bearbeitet die {pharmacy.name} in {pharmacy.city.replace(/^\d+\s/, "")} ({pharmacy.owner}).</>,
  },
  {
    question: "Wie wird mein Reisekit zusammengestellt?",
    answer: <>Aus dem Klima deines Reiseziels, dem Hygienerisiko vor Ort und deiner Aktivität entsteht ein Vorschlag mit rezeptfreien Produkten. Im Konfigurator kannst du weitere Produkte ergänzen, im Warenkorb entfernst du, was du nicht brauchst.</>,
  },
  {
    question: "Warum kostet ein Kit so viel?",
    answer: <>Der Kitpreis ist einfach die Summe der enthaltenen Produkte – jedes steht mit Einzel- und Grundpreis im Konfigurator. Wenn du etwas schon zu Hause hast, entfernst du es im Warenkorb und zahlst nur, was du wirklich brauchst.</>,
  },
  {
    question: "Ersetzt das Kit eine ärztliche Beratung?",
    answer: <>Nein. Die Produkte sind für typische Reisebeschwerden gedacht. Bei Vorerkrankungen, regelmäßiger Medikamenteneinnahme, in der Schwangerschaft oder für Kinder sprich vor der Reise mit deiner Ärztin, deinem Arzt oder der Apotheke. Hinweise zu Impfungen findest du bei deinem Reiseziel.</>,
  },
  {
    question: "Was kostet der Versand?",
    answer: <>Der Versand innerhalb Deutschlands ist derzeit kostenlos. Der Betrag im Warenkorb ist dein Endpreis inklusive Mehrwertsteuer.</>,
  },
  {
    question: "Wie bezahle ich – und ist das sicher?",
    answer: <>Die Zahlung läuft über Stripe. Welche Zahlarten verfügbar sind, siehst du im Bezahlschritt. Deine Zahlungsdaten gibst du direkt bei Stripe ein, Voyamed selbst sieht sie nicht.</>,
  },
  {
    question: "Was passiert nach meiner Bestellung?",
    answer: <>Du bekommst eine Bestätigung per E-Mail. Die {pharmacy.name} prüft deine Bestellung und meldet sich bei Rückfragen direkt bei dir. Verbindlich wird die Bestellung, sobald die Apotheke sie annimmt – Details in den <Link href="/agb" className="underline underline-offset-2">AGB</Link>.</>,
  },
  {
    question: "Wie lange sind die Produkte haltbar?",
    answer: <>Das Haltbarkeitsdatum steht auf jeder Packung. Wenn du für eine lange Reise eine bestimmte Mindesthaltbarkeit brauchst, frag vor der Bestellung kurz bei der Apotheke nach: <a href={pharmacy.phoneHref} className="underline underline-offset-2">{pharmacy.phone}</a>.</>,
  },
  {
    question: "Darf ich die Medikamente im Flugzeug mitnehmen?",
    answer: <>Pack die Reiseapotheke am besten ins Handgepäck, falls dein Koffer verloren geht. Für Flüssigkeiten gelten im Handgepäck die üblichen Mengengrenzen – ob Ausnahmen für Medikamente gelten, klärst du am besten vorab mit deiner Airline.</>,
  },
  {
    question: "Kann ich meine Bestellung stornieren oder zurückgeben?",
    answer: <>Melde dich so schnell wie möglich bei der {pharmacy.name} – telefonisch unter <a href={pharmacy.phoneHref} className="underline underline-offset-2">{pharmacy.phone}</a> oder per E-Mail an <a href={`mailto:${pharmacy.email}`} className="underline underline-offset-2">{pharmacy.email}</a>. Die Bedingungen findest du in den <Link href="/agb" className="underline underline-offset-2">AGB</Link>.</>,
  },
  {
    question: "Was passiert mit meinen Daten?",
    answer: <>Für die Bestellung brauchen wir Name, Lieferadresse, E-Mail-Adresse und Telefonnummer. Diese Daten erhält die {pharmacy.name}, damit sie deine Bestellung bearbeiten kann. Die Zahlung wickelt unser Zahlungsdienstleister Stripe ab.</>,
  },
];

export default function FQA() {
  return (
    <section aria-labelledby="faq-title" className="w-full px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-medium text-highlight-ink">FAQ</p>
        <h2 id="faq-title" className="mt-1 text-center text-2xl font-semibold sm:text-3xl">Häufig gestellte Fragen</h2>
        <p className="mt-2 text-center text-foreground/70">
          Deine Frage ist nicht dabei? Die Apotheke hilft dir weiter: <a href={pharmacy.phoneHref} className="font-medium text-foreground underline underline-offset-2">{pharmacy.phone}</a>
        </p>
        <ul className="mt-8 divide-y divide-foreground/15 border-y border-foreground/15">
          {questions.map((item) => (
            <li key={item.question}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-medium transition-colors hover:text-secondary [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-foreground/20 text-lg leading-none transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 pr-10 leading-relaxed text-foreground/75">{item.answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
