import Stripe from "stripe";

type OrderEmailConfig = {
    apiKey: string;
    from: string;
    to: string;
};

const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
});

function escapeHtml(value: string) {
    return value.replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
    })[character] ?? character);
}

function addressLines(address: Stripe.Address | null | undefined) {
    if (!address) return ["Keine Lieferadresse übermittelt"];
    return [
        [address.line1, address.line2].filter(Boolean).join(" "),
        [address.postal_code, address.city].filter(Boolean).join(" "),
        address.state ?? "",
        address.country ?? "",
    ].filter(Boolean);
}

export async function sendOrderEmail(
    session: Stripe.Checkout.Session,
    lineItems: Stripe.LineItem[],
    config: OrderEmailConfig,
) {
    const customer = session.customer_details;
    const orderNumber = session.id;
    const items = lineItems.map((item) => {
        const product = typeof item.price?.product === "string" ? undefined : item.price?.product;
        const metadata = product && !product.deleted ? product.metadata : {};
        return {
            name: item.description ?? "Unbekannter Artikel",
            pzn: metadata.pzn ?? "nicht vorhanden",
            supplier: metadata.supplier ?? "",
            unit: metadata.unit ?? "",
            quantity: item.quantity ?? 0,
            amount: item.amount_total ?? 0,
        };
    });

    const address = addressLines(customer?.address);
    const itemText = items.map((item) =>
        `${item.quantity} × ${item.name} | PZN: ${item.pzn}${item.unit ? ` | Einheit: ${item.unit}` : ""}${item.supplier ? ` | Hersteller: ${item.supplier}` : ""} | ${euro.format(item.amount / 100)}`,
    );
    const text = [
        "Neue bezahlte Voyamed-Bestellung",
        "",
        `Bestellnummer: ${orderNumber}`,
        `Stripe-Zahlungsreferenz: ${session.payment_intent ?? "nicht vorhanden"}`,
        `Bestellt am: ${new Date(session.created * 1000).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
        "",
        "Lieferadresse:",
        customer?.name ?? "Name nicht vorhanden",
        ...address,
        "",
        `E-Mail: ${customer?.email ?? "nicht vorhanden"}`,
        `Telefon: ${customer?.phone ?? "nicht vorhanden"}`,
        "",
        "Artikel:",
        ...itemText,
        "",
        `Gesamtbetrag: ${euro.format((session.amount_total ?? 0) / 100)}`,
        "",
        "Bitte Bestellung manuell im System der Antonius Apotheke aufnehmen und bearbeiten.",
    ].join("\n");

    const itemRows = items.map((item) =>
        `<tr><td>${item.quantity} × ${escapeHtml(item.name)}</td><td>${escapeHtml(item.pzn)}</td><td>${escapeHtml([item.unit, item.supplier].filter(Boolean).join(" · ") || "–")}</td><td>${escapeHtml(euro.format(item.amount / 100))}</td></tr>`,
    ).join("");
    const html = `
      <h2>Neue bezahlte Voyamed-Bestellung</h2>
      <p><strong>Bestellnummer:</strong> ${escapeHtml(orderNumber)}<br />
      <strong>Stripe-Zahlungsreferenz:</strong> ${escapeHtml(String(session.payment_intent ?? "nicht vorhanden"))}<br />
      <strong>Bestellt am:</strong> ${escapeHtml(new Date(session.created * 1000).toLocaleString("de-DE", { timeZone: "Europe/Berlin" }))}</p>
      <h3>Lieferadresse</h3>
      <p>${escapeHtml(customer?.name ?? "Name nicht vorhanden")}<br />${address.map(escapeHtml).join("<br />")}</p>
      <p><strong>E-Mail:</strong> ${escapeHtml(customer?.email ?? "nicht vorhanden")}<br />
      <strong>Telefon:</strong> ${escapeHtml(customer?.phone ?? "nicht vorhanden")}</p>
      <h3>Artikel</h3>
      <table border="1" cellspacing="0" cellpadding="8"><thead><tr><th>Artikel</th><th>PZN</th><th>Details</th><th>Summe</th></tr></thead><tbody>${itemRows}</tbody></table>
      <p><strong>Gesamtbetrag: ${escapeHtml(euro.format((session.amount_total ?? 0) / 100))}</strong></p>
      <p>Bitte Bestellung manuell im System der Antonius Apotheke aufnehmen und bearbeiten.</p>`;

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: config.from,
            to: [config.to],
            subject: `Neue bezahlte Voyamed-Bestellung ${orderNumber}`,
            text,
            html,
        }),
    });

    if (!response.ok) {
        throw new Error(`Could not send order email: ${response.status} ${await response.text()}`);
    }
}
