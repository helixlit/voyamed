import service from '@/src/service';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const input = service.input();
    const stripe = new Stripe(input.stripeSecretKey.expose());
    const products = await request.json()

    console.debug(`api/stripe-products/POST: products: ${JSON.stringify(products)}`);

    try {
        for (const product of products) {
            stripe.products.create({
                name: product.name,
                description: product.description,
            }).then(p => {
                stripe.prices.create({
                    unit_amount: product.priceInCents,
                    currency: 'eur',
                    product: p.id,
                }).then(price => {
                    console.debug(`Created product: name: ${p.name} id: ${p.id} price: ${price.unit_amount}cents price_id: ${price.id}`);
                })
            })
        }
    } catch (e) {
        console.error(`/api/stripe-products/GET: ${e}`);
        return NextResponse.json("err");
    };


    return NextResponse.json("ok");
}