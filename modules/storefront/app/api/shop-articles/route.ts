import service from "@/src/service";
import { ShopArticle } from "@voyamed/catalog/contract";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const pzns = searchParams.getAll("pzn");

    const query = searchParams.get("query") ?? "";
    const take = Number(searchParams.get("take") ?? 20);
    const skip = Number(searchParams.get("skip") ?? 0);

    const { catalog } = service.load();

    if (pzns.length > 0) {
        console.debug(`/api/shop-articles/GET: getting articles for pzns ${JSON.stringify(pzns)}`);
        const result: Array<ShopArticle> = (await catalog.getShopArticlesByPZNs({ pzns })).shopArticles;
        console.debug(`/api/shop-article/GET: returned ${JSON.stringify(result)}`);
        return NextResponse.json(result);
    }

    const result: Array<ShopArticle> = (await catalog.getShopArticles({
        query,
        take,
        skip,
    })).shopArticles;

    return NextResponse.json(result);
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
