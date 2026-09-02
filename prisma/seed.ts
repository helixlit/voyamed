import { AntoniusClient } from "@/lib/antonius/client";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { mapArticles } from "@/lib/antonius/mapper";

import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const client = new AntoniusClient(
  process.env.BASE_URL,
  process.env.USERNAME,
  process.env.PASSWORD,
);

export async function main() {
  let skip = 0;
  const take = 5000;
  const total = await client.getArticelTotal();

  while (true) {
    const articles = mapArticles(
      await client.getArticleReturn({
        skip: skip,
        take: take,
      }),
    );

    console.debug("creating articles...");
    await prisma.article.createMany({
      data: articles,
    });
    console.debug("created articles!");

    // console.debug("creating article-attributes...");
    // await prisma.articleAttribute.createMany({
    //   data: articleAttributes,
    // });
    // console.debug("created article-attributes!");

    const count = await prisma.article.count();
    console.debug("current article count:");
    console.debug(count);

    if (count >= skip || total <= skip + take) {
      skip += take;
      console.debug("batch complete!");
    }

    console.debug("skip:");
    console.debug(skip);

    if (skip >= total) break;
  }
}

main();
