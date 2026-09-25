import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "AGB" };

export default function AgbPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <p className="text-sm font-medium text-highlight">Rechtliches</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Allgemeine Geschäftsbedingungen</h1>
      <div className="mt-8 rounded-3xl bg-foreground/[0.045] p-5 text-foreground/80 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Bestellungen über VoyaMed</h2>
        <p className="mt-3 leading-7">VoyaMed stellt Reisekits und Produkte unverbindlich zusammen. Eine Bestellung wird erst verbindlich, wenn sie von der Antonius-Apotheke geprüft und ausdrücklich angenommen wurde. Verfügbarkeit, Preis, Lieferbarkeit sowie pharmazeutische Rückfragen werden dabei durch die Apotheke bestätigt.</p>
        <h2 className="mt-7 text-lg font-semibold text-foreground">AGB der Antonius-Apotheke</h2>
        <p className="mt-3 leading-7">Für Bestellungen im Online-Shop der Antonius-Apotheke gelten deren aktuellen Allgemeinen Geschäftsbedingungen. Bitte lies sie vor einer verbindlichen Bestellung vollständig durch.</p>
        <Link href="https://www.impfstoffversand.de/agb" target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:-translate-y-0.5 hover:shadow-lg">AGB der Antonius-Apotheke öffnen</Link>
        <p className="mt-5 text-sm leading-6 text-foreground/65">Hinweis: Die verlinkten AGB richten sich laut Antonius-Shop an medizinische Fachkreise und Unternehmer. Für einen Endkunden-Shop müssten eigene, rechtlich geprüfte Verbraucher-AGB ergänzt werden.</p>
      </div>
    </div>
  )
}
