import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { catalog } = service.load();

    const pzns = await request.json();

    let result;
    try {
        result = (await catalog.addArticles(pzns));
    }
    catch (e) {
        console.error(`Could not add articles to catalog shop-articles because of ${e}`);

        result = {
            created: -1
        }
    }

    return NextResponse.json(result);
}