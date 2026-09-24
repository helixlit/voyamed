import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
                const { shopArticles } = await catalog.getShopArticlesByPZNs({
                    pzns: [pzn]
                });
                if (!shopArticles[0].article.active) {
                    throw new Error(`Artikel ${pzn} ist nicht verfügbar.`);
                }
                return { article: shopArticles[0].article, quantity };
            }),
        );

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            metadata: {
                orderId: 'test'
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
            success_url: `${request.nextUrl.origin}/checkout/success`,
            cancel_url: `${request.nextUrl.origin}/checkout/cancel`,
            shipping_address_collection: { allowed_countries: ["DE"] },
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
