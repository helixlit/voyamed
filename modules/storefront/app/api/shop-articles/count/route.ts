import service from "@/src/service";
import {
    canUseLocalCatalogFallback,
    getLocalShopArticleCount,
} from "@/lib/local-catalog-preview";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query") ?? "";
    try {
        const { catalog } = service.load();
        const result = await catalog.getShopArticleCount({ query });
        return NextResponse.json(result);
    } catch (error) {
        if (!canUseLocalCatalogFallback()) {
            return NextResponse.json({ error: "Der Artikelkatalog ist derzeit nicht erreichbar." }, { status: 503 });
        }

        console.warn("Lokale Katalogvorschau wird verwendet:", error);
        return NextResponse.json({ count: getLocalShopArticleCount(query) });
    }
}
