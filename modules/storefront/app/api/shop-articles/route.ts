import service from "@/src/service";
import { Article } from "@voyamed/catalog/contract";
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
        const result: Array<Article> = (await catalog.getArticlesByPZNs({ pzns })).articles;
        console.debug(`/api/shop-article/GET: returned ${JSON.stringify(result)}`);
        return NextResponse.json(result);
    }

    const result: Array<Article> = (await catalog.getArticlesByQuery({
        query,
        take,
        skip,
    })).articles;

    return NextResponse.json(result);
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
    // const { catalog } = service.load();

    // const pzns = await request.json();

    let result;
    try {
        console.debug('Adding articles via dashboard is deprecated')
    }
    catch (e) {
        console.error(`Could not add articles to catalog shop-articles because of ${e}`);

        result = {
            created: -1
        }
    }

    return NextResponse.json(result);
}
