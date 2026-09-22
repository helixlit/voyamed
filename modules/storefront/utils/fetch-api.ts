
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
    try {
        const result = await fetch(
            `/api/shop-articles?pzn=${encodeURIComponent(pzn)}`
        );
        return await result.json();
    }
    catch (e) {
        return { error: e };
    }
}

export async function catalogDatabaseFreshSeed() {
    const result = await fetch(
        `/api/catalog-database`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ operator: "freshSeed" })
    });

    return await result.json();
}

export async function addArticles(articlePZNs: Array<string>) {
    const result = await fetch("/api/catalog-articles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(articlePZNs),
    });
    return result.json();
}