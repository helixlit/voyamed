import { AntoniusClient } from "@/lib/antonius/client";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { mapArticles } from "@/lib/antonius/mapper";

import { promises as fs } from "fs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const client = new AntoniusClient(process.env.BASE_URL, process.env.USERNAME, process.env.PASSWORD);

export async function main() {

    const data: Array<string> = await JSON.parse(
        await fs.readFile("prisma/sync.json", "utf8")
    );

    console.debug(data);

    await prisma.article
        .createMany({
            data: mapArticles(
                await client.getArticleReturn({ take: 1000, since: data[0] })
            ),
            skipDuplicates: true
        });


    const date = new Date().toISOString().replace("T", " ").split(".")[0];



    data.unshift(date);

    await fs.writeFile(
        "prisma/sync.json",
        JSON.stringify(data, null, 2)
    )

}

main();