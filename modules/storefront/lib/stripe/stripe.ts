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

    const { url } = await response.json();

    return url;
}