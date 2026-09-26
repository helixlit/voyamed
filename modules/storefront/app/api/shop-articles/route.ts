import service from "@/src/service";
import {
    canUseLocalCatalogFallback,
    getLocalShopArticle,
    getLocalShopArticles,
} from "@/lib/local-catalog-preview";
import { ShopArticle } from "@voyamed/catalog/contract";
import { NextRequest, NextResponse } from "next/server";


// Catalog reads may be cached briefly: prices are re-checked server-side when the checkout session is created.
const cacheHeaders = { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" };
const maxBatchSize = 60;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const pzn = searchParams.get("pzn") ?? "";
    // `pzns=a,b,c` loads a whole kit in one request instead of one request per product.
    const pzns = (searchParams.get("pzns") ?? "").split(",").filter(Boolean).slice(0, maxBatchSize);
    const query = searchParams.get("query") ?? "";
    const take = Number(searchParams.get("take") ?? 20);
    const skip = Number(searchParams.get("skip") ?? 0);

    try {
        const { catalog } = service.load();

        if (pzns.length > 0) {
            const results = await Promise.allSettled(pzns.map((id) => catalog.getShopArticleByPZN({ pzn: id })));
            const found = results.flatMap((result) => result.status === "fulfilled" && result.value.shopArticle ? [result.value.shopArticle] : []);
            // Every lookup failing means the catalog itself is down — let the fallback below handle it.
            if (found.length === 0 && results.every((result) => result.status === "rejected")) throw new Error("Katalog nicht erreichbar");
            return NextResponse.json(found, { headers: cacheHeaders });
        }

        if (pzn) {
            const result: ShopArticle = (await catalog.getShopArticleByPZN({ pzn })).shopArticle;
            return NextResponse.json(result, { headers: cacheHeaders });
        }

        const result: Array<ShopArticle> = (await catalog.getShopArticles({
            query,
            take,
            skip,
        })).shopArticles;

        return NextResponse.json(result, { headers: cacheHeaders });
    } catch (error) {
        if (!canUseLocalCatalogFallback()) {
            return NextResponse.json({ error: "Der Artikelkatalog ist derzeit nicht erreichbar." }, { status: 503 });
        }

        if (pzns.length > 0) {
            return NextResponse.json(pzns.flatMap((id) => getLocalShopArticle(id) ?? []));
        }

        if (pzn) {
            const article = getLocalShopArticle(pzn);
            return article
                ? NextResponse.json(article)
                : NextResponse.json({ error: "Artikel nicht gefunden." }, { status: 404 });
        }

        console.warn("Lokale Katalogvorschau wird verwendet:", error);
        return NextResponse.json(getLocalShopArticles(query, take, skip));
    }
}

export async function POST(request: NextRequest) {
    const { catalog } = service.load();

    const pzns = await request.json();

    let result;
    try {
        result = (await catalog.addShopArticles(pzns));
    }
    catch (e) {
        console.error(`Could not add articles to catalog shop-articles because of ${e}`);

        result = {
            created: -1
        }
    }

    return NextResponse.json(result);
}
