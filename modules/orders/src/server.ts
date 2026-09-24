import service from "@/src/service";
import { serve } from "@prisma/composer/service-rpc";
import Stripe from "stripe";

const input = service.input();
const port = service.port();

const stripe = new Stripe(input.stripeSecretKey.expose());
const endpointSecret = input.stripeWebhookSecret.expose();

process.on('uncaughtException', (e) => console.error('uncaughtException', e));
process.on('unhandledRejection', (e) => console.error('unhandledRejection', e));



const handler = serve(service, {
    rpc: {},
});
export default handler;


const fetch = async (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname === "/webhook" && request.method === "POST") {
        const body = await request.text();
        const signature = request.headers.get("stripe-signature");

        if (!signature) return new Response("Missing stripe-signature", {
            status: 400,
        });

        let event: Stripe.Event

        try {
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                endpointSecret
            );
        } catch (e) {
            console.error("Webhook signature verification failed:", e);

            return new Response("Invalid signature", {
                status: 400,
            });
        }

        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                console.log(
                    `PaymentIntent ${paymentIntent.id} for ${paymentIntent.amount} was successful!`
                );
                break;
            }
            case "payment_method.attached": {
                const paymentMethod = event.data.object;

                console.log(
                    `PaymentMethod ${paymentMethod.id} attached`
                );
                break;
            }
            case "checkout.session.completed": {
                const session = event.data.object;

                if (!(session.payment_status === "paid")) {
                    console.error(`Session payment status is ${session.payment_status}`);
                    return new Response(`Session payment status is ${session.payment_status}`, {
                        status: 400,
                    });
                }

                const orderId = session.metadata?.orderId;

                if (!orderId) {
                    console.error(`No order id found!`);
                    return new Response(`No order id found`, {
                        status: 400,
                    });
                }

                console.log(`Order ${orderId} was paid`);
                break;

            }
            default:
                console.log(`Unhandled event type ${event.type}`);

        }
        return new Response("OK");

    };

    return handler(request) ?? new Response("Not found", {
        status: 400,
    });
}

Bun.serve({ port, hostname: '0.0.0.0', fetch });
console.info(`Orders server up at port ${port}`)