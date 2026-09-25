import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/** Short, human-readable order number for emails and support, e.g. `VM-260925-3F9A1C`. */
function createOrderNumber() {
    const date = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" }).slice(2).replaceAll("-", "");
    return `VM-${date}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

type RequestedItem = {
    article?: { pzn?: unknown };
    quantity?: unknown;
};

export async function POST(request: NextRequest) {
    const input = service.input();
    const { catalog } = service.load();
    const stripe = new Stripe(input.stripeSecretKey.expose());
    const body = await request.json() as { items?: RequestedItem[] };

    if (!Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json({ error: "Der Warenkorb ist leer." }, { status: 400 });
    }

    try {
        // Prices and product information must come from the catalog, not from the browser.
        const itemsByPzn = new Map<string, { quantity: number }>();
        for (const item of body.items) {
            const pzn = typeof item.article?.pzn === "string" ? item.article.pzn : "";
            const quantity = typeof item.quantity === "number" ? item.quantity : 0;

            if (!pzn || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
                return NextResponse.json({ error: "Ungültiger Warenkorb." }, { status: 400 });
            }

            const existing = itemsByPzn.get(pzn);
            const totalQuantity = (existing?.quantity ?? 0) + quantity;
            if (totalQuantity > 20) {
                return NextResponse.json({ error: "Maximal 20 Stück pro Artikel." }, { status: 400 });
            }
            itemsByPzn.set(pzn, { quantity: totalQuantity });
        }

        const items = await Promise.all(
            [...itemsByPzn.entries()].map(async ([pzn, { quantity }]) => {
                const { shopArticle } = await catalog.getShopArticleByPZN({ pzn });
                if (!shopArticle.article.active) {
                    throw new Error(`Artikel ${pzn} ist nicht verfügbar.`);
                }
                return { article: shopArticle.article, quantity };
            }),
        );

        const orderNumber = createOrderNumber();
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            locale: "de",
            metadata: { orderNumber },
            payment_intent_data: {
                description: `Voyamed-Bestellung ${orderNumber}`,
                metadata: { orderNumber },
            },
            line_items: items.map((item) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.article.name,
                        metadata: {
                            pzn: item.article.pzn,
                            supplier: item.article.supplier,
                            unit: item.article.unit,
                        },
                    },
                    unit_amount: item.article.priceCents,
                },
                quantity: item.quantity,
            })),
            success_url: `${request.nextUrl.origin}/?checkout=success&order=${orderNumber}`,
            cancel_url: `${request.nextUrl.origin}/?checkout=cancelled`,
            shipping_address_collection: { allowed_countries: ["DE"] },
            phone_number_collection: { enabled: true },
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error("Could not create checkout session", error);
        return NextResponse.json(
            { error: "Die Bestellung konnte nicht vorbereitet werden." },
            { status: 400 },
        );
    }
}
