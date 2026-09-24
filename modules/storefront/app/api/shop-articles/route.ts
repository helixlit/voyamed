import service from "@/src/service";
import {
    canUseLocalCatalogFallback,
    getLocalShopArticle,
    getLocalShopArticles,
} from "@/lib/local-catalog-preview";
import { ShopArticle } from "@voyamed/catalog/contract";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const pzn = searchParams.get("pzn") ?? "";
    const query = searchParams.get("query") ?? "";
    const take = Number(searchParams.get("take") ?? 20);
    const skip = Number(searchParams.get("skip") ?? 0);

    try {
        const { catalog } = service.load();

        if (pzn) {
            const result: ShopArticle = (await catalog.getShopArticleByPZN({ pzn })).shopArticle;
            return NextResponse.json(result);
        }

        const result: Array<ShopArticle> = (await catalog.getShopArticles({
            query,
            take,
            skip,
        })).shopArticles;

        return NextResponse.json(result);
    } catch (error) {
        if (!canUseLocalCatalogFallback()) {
            return NextResponse.json({ error: "Der Artikelkatalog ist derzeit nicht erreichbar." }, { status: 503 });
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
