import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { catalog } = service.load();

    const query = request.nextUrl.searchParams.get("query") ?? "";
    console.debug(`api/shop-articles/count/GET: query: ${query}`);

    const result = await catalog.getShopArticleCount({
        query
    });

    console.debug(`api/shop-articles/count/GET: result: ${JSON.stringify(result)}`);

    return NextResponse.json(result);
}