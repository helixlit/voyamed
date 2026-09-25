import Stripe from "stripe";
import { pharmacy } from "@/lib/pharmacy";

export type OrderEmailConfig = {
    apiKey: string;
    from: string;
    /** Inbox of the pharmacy. Receives new orders and customers' replies to their confirmation. */
    pharmacyEmail: string;
    /** Public origin of the shop, used for links in the customer email. */
    siteUrl: string;
};

type OrderItem = {
    name: string;
    pzn: string;
    supplier: string;
    unit: string;
    quantity: number;
    amountCents: number;
};

export type OrderDetails = {
    orderNumber: string;
    sessionId: string;
    paymentReference: string;
    orderedAt: string;
    customer: { name: string; email: string | null; phone: string | null };
    shippingName: string;
    shippingAddress: string[];
    billingAddress: string[];
    items: OrderItem[];
    totalCents: number;
};

type Email = { subject: string; text: string; html: string };

const euro = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
});
const countryNames = new Intl.DisplayNames(["de"], { type: "region" });

const colors = {
    ink: "#001219",
    accent: "#ee9b00",
    muted: "#5b6770",
    line: "#e3e1de",
    page: "#f4f3f2",
    mint: "#e6f4ef",
};

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
    if (!address) return [];
    return [
        [address.line1, address.line2].filter(Boolean).join(", "),
        [address.postal_code, address.city].filter(Boolean).join(" "),
        address.state ?? "",
        address.country ? countryNames.of(address.country) ?? address.country : "",
    ].filter(Boolean);
}

export function getOrderDetails(session: Stripe.Checkout.Session, lineItems: Stripe.LineItem[]): OrderDetails {
    const customer = session.customer_details;
    // `customer_details.address` is the billing address; the delivery address is collected separately.
    const shipping = session.collected_information?.shipping_details;
    const paymentIntent = session.payment_intent;

    return {
        orderNumber: session.metadata?.orderNumber ?? session.id,
        sessionId: session.id,
        paymentReference: typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id ?? "nicht vorhanden",
        orderedAt: new Date(session.created * 1000).toLocaleString("de-DE", {
            timeZone: "Europe/Berlin",
            dateStyle: "long",
            timeStyle: "short",
        }),
        customer: {
            name: customer?.name ?? "",
            email: customer?.email ?? null,
            phone: customer?.phone ?? null,
        },
        shippingName: shipping?.name ?? customer?.name ?? "",
        shippingAddress: addressLines(shipping?.address ?? customer?.address),
        billingAddress: addressLines(customer?.address),
        items: lineItems.map((item) => {
            const product = typeof item.price?.product === "string" ? undefined : item.price?.product;
            const metadata = product && !product.deleted ? product.metadata : {};
            return {
                name: item.description ?? "Unbekannter Artikel",
                pzn: metadata.pzn ?? "nicht vorhanden",
                supplier: metadata.supplier ?? "",
                unit: metadata.unit ?? "",
                quantity: item.quantity ?? 0,
                amountCents: item.amount_total ?? 0,
            };
        }),
        totalCents: session.amount_total ?? 0,
    };
}

function layout(title: string, body: string, footer: string) {
    return `<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${colors.page};">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${colors.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;font-family:Arial,Helvetica,sans-serif;color:${colors.ink};">
<tr><td style="padding:28px 28px 4px;font-size:26px;font-weight:bold;">Voya<span style="color:${colors.accent};">med</span></td></tr>
<tr><td style="padding:12px 28px 28px;font-size:15px;line-height:1.55;">${body}</td></tr>
</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
<tr><td style="padding:16px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${colors.muted};">${footer}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function heading(text: string) {
    return `<h2 style="margin:24px 0 8px;font-size:16px;">${escapeHtml(text)}</h2>`;
}

function itemsTable(items: OrderItem[], totalCents: number, { withPzn }: { withPzn: boolean }) {
    const rows = items.map((item) => {
        const details = withPzn
            ? [`PZN ${item.pzn}`, item.unit, item.supplier].filter(Boolean).join(" · ")
            : "";
        return `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${colors.line};vertical-align:top;">${escapeHtml(item.name)}${details ? `<br><span style="font-size:12px;color:${colors.muted};">${escapeHtml(details)}</span>` : ""}</td>
<td style="padding:10px 8px;border-bottom:1px solid ${colors.line};vertical-align:top;white-space:nowrap;">${item.quantity} ×</td>
<td style="padding:10px 0;border-bottom:1px solid ${colors.line};vertical-align:top;text-align:right;white-space:nowrap;">${escapeHtml(euro.format(item.amountCents / 100))}</td>
</tr>`;
    }).join("");
    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">${rows}
<tr><td colspan="2" style="padding:12px 0 0;font-weight:bold;">Gesamt <span style="font-weight:normal;font-size:12px;color:${colors.muted};">inkl. MwSt.</span></td>
<td style="padding:12px 0 0;text-align:right;font-weight:bold;white-space:nowrap;">${escapeHtml(euro.format(totalCents / 100))}</td></tr>
</table>`;
}

function addressBlock(name: string, lines: string[]) {
    const all = [name, ...lines].filter(Boolean);
    return all.length ? all.map(escapeHtml).join("<br>") : "Keine Adresse übermittelt";
}

function pharmacyFooter(siteUrl?: string) {
    const links = siteUrl
        ? `<br><a href="${escapeHtml(`${siteUrl}/impressum`)}" style="color:${colors.muted};">Impressum</a> · <a href="${escapeHtml(`${siteUrl}/agb`)}" style="color:${colors.muted};">AGB</a>`
        : "";
    return `${pharmacy.name} · ${pharmacy.owner}<br>${pharmacy.street} · ${pharmacy.city}<br>Telefon ${pharmacy.phone} · ${pharmacy.email}${links}`;
}

function textItems(items: OrderItem[], { withPzn }: { withPzn: boolean }) {
    return items.map((item) => {
        const details = withPzn ? ` | PZN ${item.pzn}${item.unit ? ` | ${item.unit}` : ""}${item.supplier ? ` | ${item.supplier}` : ""}` : "";
        return `${item.quantity} × ${item.name}${details} | ${euro.format(item.amountCents / 100)}`;
    });
}

export function renderPharmacyEmail(order: OrderDetails): Email {
    const differentBilling = order.billingAddress.length > 0
        && order.billingAddress.join("|") !== order.shippingAddress.join("|");
    const subject = `Neue bezahlte Bestellung ${order.orderNumber}`;

    const text = [
        "Neue bezahlte Voyamed-Bestellung",
        "",
        `Bestellnummer: ${order.orderNumber}`,
        `Bestellt am: ${order.orderedAt}`,
        `Zahlung: bezahlt über Stripe (${order.paymentReference})`,
        "",
        "Lieferadresse:",
        order.shippingName || "Name nicht vorhanden",
        ...(order.shippingAddress.length ? order.shippingAddress : ["Keine Lieferadresse übermittelt"]),
        ...(differentBilling ? ["", "Rechnungsadresse:", order.customer.name, ...order.billingAddress] : []),
        "",
        `E-Mail: ${order.customer.email ?? "nicht vorhanden"}`,
        `Telefon: ${order.customer.phone ?? "nicht vorhanden"}`,
        "",
        "Artikel:",
        ...textItems(order.items, { withPzn: true }),
        "",
        `Gesamtbetrag: ${euro.format(order.totalCents / 100)}`,
        "",
        "Bitte die Bestellung im System der Antonius-Apotheke aufnehmen und bearbeiten.",
        "Antworten auf diese E-Mail gehen direkt an die Kundin bzw. den Kunden.",
        "",
        `Stripe-Checkout: ${order.sessionId}`,
    ].join("\n");

    const contact = [
        order.customer.email
            ? `<strong>E-Mail:</strong> <a href="mailto:${escapeHtml(order.customer.email)}" style="color:${colors.ink};">${escapeHtml(order.customer.email)}</a>`
            : "<strong>E-Mail:</strong> nicht vorhanden",
        `<strong>Telefon:</strong> ${escapeHtml(order.customer.phone ?? "nicht vorhanden")}`,
    ].join("<br>");

    const body = `
<h1 style="margin:0;font-size:22px;">Neue bezahlte Bestellung</h1>
<p style="margin:8px 0 0;"><strong>${escapeHtml(order.orderNumber)}</strong> · ${escapeHtml(order.orderedAt)}<br>
<span style="color:${colors.muted};font-size:13px;">Bezahlt über Stripe · ${escapeHtml(order.paymentReference)}</span></p>
${heading("Lieferadresse")}
<p style="margin:0;">${addressBlock(order.shippingName, order.shippingAddress)}</p>
${differentBilling ? `${heading("Rechnungsadresse")}<p style="margin:0;">${addressBlock(order.customer.name, order.billingAddress)}</p>` : ""}
${heading("Kontakt")}
<p style="margin:0;">${contact}</p>
${heading("Artikel")}
${itemsTable(order.items, order.totalCents, { withPzn: true })}
<p style="margin:24px 0 0;padding:12px 14px;background:${colors.mint};border-radius:10px;font-size:14px;">Bitte die Bestellung im System der Antonius-Apotheke aufnehmen und bearbeiten. Antworten auf diese E-Mail gehen direkt an die Kundin bzw. den Kunden.</p>`;

    return {
        subject,
        text,
        html: layout(subject, body, `Stripe-Checkout: ${escapeHtml(order.sessionId)}`),
    };
}

export function renderCustomerEmail(order: OrderDetails, siteUrl: string): Email {
    const firstName = order.customer.name.trim().split(/\s+/)[0];
    const greeting = firstName ? `Hallo ${firstName},` : "Hallo,";
    const subject = `Deine Voyamed-Bestellung ${order.orderNumber}`;

    const text = [
        greeting,
        "",
        "vielen Dank für deine Bestellung bei Voyamed! Deine Zahlung ist eingegangen.",
        "",
        "So geht es weiter: Die Antonius-Apotheke prüft deine Bestellung pharmazeutisch. Bei Rückfragen meldet sie sich direkt bei dir.",
        "",
        `Bestellnummer: ${order.orderNumber}`,
        `Bestellt am: ${order.orderedAt}`,
        "",
        "Deine Bestellung:",
        ...textItems(order.items, { withPzn: false }),
        `Gesamt (inkl. MwSt.): ${euro.format(order.totalCents / 100)}`,
        "",
        "Lieferadresse:",
        order.shippingName,
        ...order.shippingAddress,
        "",
        `Fragen zu deiner Bestellung? Antworte einfach auf diese E-Mail oder ruf die ${pharmacy.name} an: ${pharmacy.phone}.`,
        "",
        `Diese E-Mail bestätigt den Eingang deiner Bestellung. Es gelten unsere AGB: ${siteUrl}/agb`,
        "",
        `${pharmacy.name} · ${pharmacy.owner} · ${pharmacy.street} · ${pharmacy.city}`,
        `Impressum: ${siteUrl}/impressum`,
    ].filter((line, index, lines) => line !== "" || lines[index - 1] !== "").join("\n");

    const body = `
<h1 style="margin:0;font-size:22px;">Danke für deine Bestellung!</h1>
<p style="margin:12px 0 0;">${escapeHtml(greeting)}<br>deine Bestellung ist bei uns eingegangen und deine Zahlung ist bestätigt.</p>
<p style="margin:16px 0 0;padding:12px 14px;background:${colors.mint};border-radius:10px;font-size:14px;"><strong>So geht es weiter:</strong> Die ${escapeHtml(pharmacy.name)} prüft deine Bestellung pharmazeutisch. Bei Rückfragen meldet sie sich direkt bei dir.</p>
<p style="margin:16px 0 0;font-size:14px;color:${colors.muted};">Bestellnummer <strong style="color:${colors.ink};">${escapeHtml(order.orderNumber)}</strong> · ${escapeHtml(order.orderedAt)}</p>
${heading("Deine Bestellung")}
${itemsTable(order.items, order.totalCents, { withPzn: false })}
${heading("Lieferadresse")}
<p style="margin:0;">${addressBlock(order.shippingName, order.shippingAddress)}</p>
<p style="margin:24px 0 0;">Fragen zu deiner Bestellung? Antworte einfach auf diese E-Mail oder ruf die ${escapeHtml(pharmacy.name)} an: <a href="${pharmacy.phoneHref}" style="color:${colors.ink};">${escapeHtml(pharmacy.phone)}</a>.</p>
<p style="margin:16px 0 0;font-size:12px;color:${colors.muted};">Diese E-Mail bestätigt den Eingang deiner Bestellung. Es gelten unsere <a href="${escapeHtml(`${siteUrl}/agb`)}" style="color:${colors.muted};">AGB</a>.</p>`;

    return { subject, text, html: layout(subject, body, pharmacyFooter(siteUrl)) };
}

async function sendEmail(
    config: OrderEmailConfig,
    message: Email & { to: string; replyTo?: string | null; idempotencyKey: string },
) {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
            // Stripe may deliver a webhook twice at the same time; Resend drops the duplicate.
            "Idempotency-Key": message.idempotencyKey,
        },
        body: JSON.stringify({
            from: config.from,
            to: [message.to],
            reply_to: message.replyTo ? [message.replyTo] : undefined,
            subject: message.subject,
            text: message.text,
            html: message.html,
        }),
    });

    if (!response.ok) {
        throw new Error(`Could not send email: ${response.status} ${await response.text()}`);
    }
}

export async function sendPharmacyOrderEmail(order: OrderDetails, config: OrderEmailConfig) {
    await sendEmail(config, {
        ...renderPharmacyEmail(order),
        to: config.pharmacyEmail,
        replyTo: order.customer.email,
        idempotencyKey: `order-pharmacy/${order.sessionId}`,
    });
}

export async function sendCustomerConfirmationEmail(order: OrderDetails, config: OrderEmailConfig) {
    if (!order.customer.email) throw new Error(`Order ${order.orderNumber} has no customer email`);
    await sendEmail(config, {
        ...renderCustomerEmail(order, config.siteUrl),
        to: order.customer.email,
        replyTo: config.pharmacyEmail,
        idempotencyKey: `order-customer/${order.sessionId}`,
    });
}
