import { ShoppingCartArticle } from "@/lib/state/shopping-cart-state";
import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "process";

export async function POST(request: NextRequest) {
    const input = service.input();
    const stripe = new Stripe(input.stripeSecretKey.expose());

    const { items } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: items.map((item: ShoppingCartArticle) => ({
            price_data: {
                currency: "eur",
                product_data: {
                    name: item.article.name,
                },
                unit_amount: item.article.priceCents,
            },
            quantity: item.quantity,
        })),

        success_url: `http://localhost:3000/`,
        cancel_url: `http://localhost:3000/about`,

        shipping_address_collection: {
            allowed_countries: ["DE", "AT"],
        },
    });

    return Response.json({
        url: session.url,
    });
}