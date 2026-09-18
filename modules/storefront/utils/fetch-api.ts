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