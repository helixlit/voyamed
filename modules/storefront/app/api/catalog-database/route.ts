import service from "@/src/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { catalog } = service.load();
    const { operator } = await request.json();

    let result;
    if (operator === 'freshSeed') {
        try {
            result = (await catalog.freshSeed({}));
        }
        catch (e) {
            console.error(`Could not fresh seed catalog databse beacause of ${e}`);
            result = {
                success: -1,
            }
        }
    }

    return NextResponse.json(result);
}