import {
    getOrderDetails,
    sendCustomerConfirmationEmail,
    sendPharmacyOrderEmail,
} from "@/lib/orders/send-order-email";
import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Card payments complete immediately; delayed methods (e.g. SEPA, Klarna) complete
// unpaid and are confirmed later by `async_payment_succeeded`.
const PAID_ORDER_EVENTS = new Set<string>([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
]);

export async function POST(request: NextRequest) {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "Stripe-Signatur fehlt." }, { status: 400 });
    }

    const input = service.input();
    const stripe = new Stripe(input.stripeSecretKey.expose());
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            await request.text(),
            signature,
            input.stripeWebhookSecret.expose(),
        );
    } catch (error) {
        console.error("Invalid Stripe webhook signature", error);
        return NextResponse.json({ error: "Ungültige Stripe-Signatur." }, { status: 400 });
    }

    if (!PAID_ORDER_EVENTS.has(event.type)) {
        return NextResponse.json({ received: true });
    }

    const eventSession = event.data.object as Stripe.Checkout.Session;
    if (eventSession.payment_status !== "paid") {
        return NextResponse.json({ received: true });
    }

    try {
        // Read the current session so a retried webhook only sends what is still missing.
        const session = await stripe.checkout.sessions.retrieve(eventSession.id);
        const metadata = session.metadata ?? {};
        const pharmacyNotified = Boolean(metadata.pharmacyNotifiedAt ?? metadata.orderNotificationSentAt);
        const customerConfirmed = Boolean(metadata.customerConfirmedAt);
        if (pharmacyNotified && customerConfirmed) {
            return NextResponse.json({ received: true, alreadyNotified: true });
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ["data.price.product"],
        });
        const order = getOrderDetails(session, lineItems.data);
        const config = {
            apiKey: input.resendApiKey.expose(),
            from: input.orderNotificationFrom.expose(),
            pharmacyEmail: input.orderNotificationEmail.expose(),
            siteUrl: request.nextUrl.origin,
        };

        // The pharmacy comes first: without its email the order would not be fulfilled.
        if (!pharmacyNotified) {
            await sendPharmacyOrderEmail(order, config);
            await stripe.checkout.sessions.update(session.id, {
                metadata: { pharmacyNotifiedAt: new Date().toISOString() },
            });
        }

        if (!customerConfirmed) {
            await sendCustomerConfirmationEmail(order, config);
            await stripe.checkout.sessions.update(session.id, {
                metadata: { customerConfirmedAt: new Date().toISOString() },
            });
        }

        return NextResponse.json({ received: true, notified: true });
    } catch (error) {
        // A 5xx makes Stripe retry the webhook; already sent emails are skipped then.
        console.error(`Could not send order emails for ${eventSession.id}`, error);
        return NextResponse.json({ error: "Bestell-E-Mails konnten nicht gesendet werden." }, { status: 500 });
    }
}
