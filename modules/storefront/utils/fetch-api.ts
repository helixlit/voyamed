import { ShopArticle } from "@voyamed/catalog/contract";

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
    console.debug(`Fetching ${`/api/shop-articles?pzn=${encodeURIComponent(pzn)}`}`);

    const result = await fetch(
        `/api/shop-articles?pzn=${encodeURIComponent(pzn)}`
    );

    return await result.json() as ShopArticle;
}

export async function getShopArticlesByPZNs(pzns: Array<string>) {
    const params = new URLSearchParams();

    pzns.forEach(pzn => {
        params.append("pzn", pzn)
    });

    console.debug(`Fetching ${`/api/shop-articles?${params.toString()}`}`);

    const result = await fetch(
        `/api/shop-articles?${params.toString()}`
    );

    return await result.json() as Array<ShopArticle>;
}