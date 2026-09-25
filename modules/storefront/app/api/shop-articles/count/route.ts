import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    try {
        const { catalog } = service.load();
        const result = await catalog.getArticleCountByQuery({ query });
        return NextResponse.json(result);
    } catch (error) {
        console.error(`Can not reach catalog database beacause ${error}`);
    }
}
