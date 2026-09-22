import { sendOrderEmail } from "@/lib/orders/send-order-email";
import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

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

    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true });
    }

    const completedSession = event.data.object as Stripe.Checkout.Session;
    if (completedSession.payment_status !== "paid") {
        return NextResponse.json({ received: true });
    }

    try {
        // Retrieve the current session so retrying a Stripe webhook does not send another email.
        const session = await stripe.checkout.sessions.retrieve(completedSession.id);
        if (session.metadata?.orderNotificationSentAt) {
            return NextResponse.json({ received: true, alreadyNotified: true });
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            expand: ["data.price.product"],
        });

        await sendOrderEmail(session, lineItems.data, {
            apiKey: input.resendApiKey.expose(),
            from: input.orderNotificationFrom.expose(),
            to: input.orderNotificationEmail.expose(),
        });

        await stripe.checkout.sessions.update(session.id, {
            metadata: { orderNotificationSentAt: new Date().toISOString() },
        });

        return NextResponse.json({ received: true, notified: true });
    } catch (error) {
        console.error("Could not notify Antonius Apotheke about order", error);
        return NextResponse.json({ error: "Bestellbenachrichtigung fehlgeschlagen." }, { status: 500 });
    }
}
