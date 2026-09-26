import { pharmacy } from "@/lib/pharmacy";

// Every statement here must stay true — visitors of a pharmacy shop are sceptical,
// and one broken promise costs more trust than any badge earns.
const items = [
  {
    title: `Geprüft von der ${pharmacy.name}`,
    text: `Jede Bestellung prüft eine Vor-Ort-Apotheke in ${pharmacy.city.replace(/^\d+\s/, "")}.`,
    icon: "M12 3 4 6v6c0 4.5 3.4 8.5 8 9 4.6-.5 8-4.5 8-9V6l-8-3Zm-1.2 12.2-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4-5.4 5.4Z",
  },
  {
    title: "Sicher bezahlen",
    text: "Die Zahlung läuft verschlüsselt über Stripe.",
    icon: "M17 9V7A5 5 0 0 0 7 7v2H5v12h14V9h-2ZM9 7a3 3 0 0 1 6 0v2H9V7Zm3 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z",
  },
  {
    // Large online pharmacies ship free only above 19–55 €; keep in sync with the cart and FAQ if shipping ever costs.
    title: "Kostenloser Versand",
    text: "Ohne Mindestbestellwert, innerhalb Deutschlands.",
    icon: "M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  },
];

export default function TrustBar() {
  return (
    <section aria-label="Warum Voyamed" className="border-b border-foreground/10 bg-background px-5 py-6">
      <ul className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            <TrustIcon path={item.icon} />
            <div>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-sm text-foreground/65">{item.text}</p>
            </div>
          </li>
        ))}
        <li className="flex items-start gap-3">
          <TrustIcon path="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z" />
          <div>
            <p className="text-sm font-semibold">Fragen? Einfach anrufen</p>
            <p className="text-sm text-foreground/65">
              Die Apotheke berät dich: <a href={pharmacy.phoneHref} className="font-medium text-foreground underline underline-offset-2">{pharmacy.phone}</a>
            </p>
          </div>
        </li>
      </ul>
    </section>
  );
}

function TrustIcon({ path }: { path: string }) {
  return (
    <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-prim/45 text-secondary">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d={path} /></svg>
    </span>
  );
}
