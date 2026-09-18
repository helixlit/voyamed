import service from "@/src/service";
import { ShopArticle } from "@voyamed/catalog/contract";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const { catalog } = service.load();

    const searchParams = request.nextUrl.searchParams;
    const pzn = searchParams.get("pzn") ?? "";

    if (pzn) {
        console.debug(`api/shop-articles/GET: pzn: ${pzn}`);
        const result: ShopArticle = (await catalog.getShopArticleByPZN({ pzn })).shopArticle;

        return NextResponse.json(result);
    }

    const query = searchParams.get("query") ?? "";

    console.debug(`api/shop-articles/GET: query: ${query}`);

    const take = Number(searchParams.get("take") ?? 20);
    const skip = Number(searchParams.get("skip") ?? 0);

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