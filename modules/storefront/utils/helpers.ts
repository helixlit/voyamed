export function displayPriceCentsAsFormatedPrice(priceCents: number) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(priceCents / 100)
}