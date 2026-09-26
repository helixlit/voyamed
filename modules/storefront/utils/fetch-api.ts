import type { ShopArticle } from "@voyamed/catalog/contract";

export async function addShopArticles(articlePZNs: Array<string>) {
    const result = await fetch("/api/shop-articles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(articlePZNs),
    });
    return result.json();
}

export async function getShopArticleByPZN(pzn: string) {
    const result = await fetch(
        `/api/shop-articles?pzn=${encodeURIComponent(pzn)}`
    );

    return await result.json();
}

/** Loads several articles in one request; unknown PZNs are left out, the order of `pzns` is kept. */
export async function getShopArticlesByPZNs(pzns: Array<string>): Promise<Array<ShopArticle>> {
    if (pzns.length === 0) return [];
    const result = await fetch(`/api/shop-articles?pzns=${pzns.map(encodeURIComponent).join(",")}`);
    if (!result.ok) throw new Error(`Artikel konnten nicht geladen werden (${result.status})`);
    return await result.json();
}
