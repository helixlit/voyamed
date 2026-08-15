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

const client = new AntoniusClient(process.env.BASE_URL, process.env.USERNAME, process.env.PASSWORD);

export async function main() {
  let skip = 0;
  let take = 10000;
  let total = await client.getArticelTotal();

  while (true) {

    await prisma.article
      .createMany({
        data: mapArticles(
          await client.getArticleReturn({ skip: skip, take: take })
        )
      });

    const count = await prisma.article.count();

    if (count >= skip || total <= skip + take) {
      skip += take;
    }


    console.debug("skip:");
    console.debug(skip);

    if (skip >= total) break;
  }
}

main();