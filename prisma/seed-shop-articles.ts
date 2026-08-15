import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { promises as fs } from "fs";

import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

export async function main() {
    const articlePzns: Array<string> = await JSON.parse(
        await fs.readFile("prisma/shop-articles.json", "utf8")
    );

    for (let articlePzn of articlePzns) {
        try {
            const article = await prisma.article.findUniqueOrThrow({
                where: {
                    pzn: articlePzn
                }
            });

            await prisma.shopArticle.create({
                data: { articlePZN: article.pzn }
            })

            console.debug(`Created ShopArticle for PZN ${articlePzn}`)
        } catch (e) {
            console.error(`Could not add Article to ShopArticles, because PZN ${articlePzn} was not found :(`);
        }
    }
}

main();