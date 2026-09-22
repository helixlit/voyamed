import { ShoppingCartArticle } from "../state/shopping-cart-state";

export async function createStripeProduct(
    name: string,
    description: string,
    priceInCents: number,
) {
    const params = [{ name, description, priceInCents }];
    const result = await fetch(
        `/api/stripe/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    console.debug(result);
}


export async function createStripeCeckout(
    shoppingCartArticles: ShoppingCartArticle[]
) {
    const response = await fetch("/api/stripe/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: shoppingCartArticles,
        }),
    });

    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "Der Checkout konnte nicht gestartet werden.");
    }

    const { url } = await response.json();
    if (!url) throw new Error("Der Checkout-Link konnte nicht erstellt werden.");
    return url;
}
