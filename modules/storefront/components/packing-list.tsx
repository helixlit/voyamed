"use client";

import type { Article } from "@voyamed/catalog/contract";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { formatPackageLabel } from "@/lib/article-price";
import { getIndication } from "@/lib/product-info";
import { pharmacy } from "@/lib/pharmacy";

const reminders = [
  "Regelmäßig eingenommene Medikamente in ausreichender Menge plus Reserve – im Handgepäck.",
  "Impfpass und Nachweis deiner Auslandskrankenversicherung.",
  "Medikamente vor Hitze geschützt lagern, nicht im heißen Auto liegen lassen.",
  "Flüssigkeiten im Handgepäck: Mengengrenzen und Ausnahmen für Medikamente vorab bei der Airline klären.",
];

const noopSubscribe = () => () => {};

interface Props {
  title: string;
  articles: Article[];
  disabled?: boolean;
}

/**
 * A printable checklist of the kit — the free travel-pharmacy planners offer a PDF packing list,
 * so ours does too. The browser's print dialog also saves it as PDF.
 */
export default function PackingList({ title, articles, disabled }: Props) {
  // False during server rendering, true in the browser — the portal needs `document.body`.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const today = new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date());

  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        disabled={disabled}
        className="min-h-11 rounded-full border border-foreground/20 px-5 text-sm font-medium transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-45"
      >
        Packliste drucken / als PDF
      </button>
      {mounted && createPortal(
        <div id="print-root" className="hidden p-8 text-black print:block">
          <p className="text-sm">Voyamed · Packliste Reiseapotheke</p>
          <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
          <table className="mt-6 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black">
                <th className="w-8 py-2" aria-label="Eingepackt" />
                <th className="py-2">Produkt</th>
                <th className="py-2">Packung</th>
                <th className="py-2">Wofür</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.pzn} className="border-b border-black/20">
                  <td className="py-2 text-lg leading-none">☐</td>
                  <td className="py-2 pr-3">{article.name}</td>
                  <td className="py-2 pr-3">{formatPackageLabel(article)}</td>
                  <td className="py-2">{getIndication(article.pzn) ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="mt-8 text-lg font-semibold">Außerdem nicht vergessen</h2>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {reminders.map((reminder) => <li key={reminder}>☐ {reminder}</li>)}
          </ul>
          <p className="mt-8 text-xs">
            Unverbindliche Orientierung, ersetzt keine ärztliche Beratung. Fragen beantwortet die {pharmacy.name}: {pharmacy.phone}.
            Zu Risiken und Nebenwirkungen lesen Sie die Packungsbeilage und fragen Sie Ihre Ärztin, Ihren Arzt oder in Ihrer Apotheke.
          </p>
          <p className="mt-2 text-xs">Erstellt am {today}</p>
        </div>,
        document.body,
      )}
    </>
  );
}
