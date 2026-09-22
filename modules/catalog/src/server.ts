import { serve } from "@prisma/composer/service-rpc";
import type { ShopArticle } from "./contract";
import service from "./service";
import { AntoniusClient } from "./antonius/client";
import { mapArticles } from "./antonius/mapper";


console.debug(`Starting server!`);

const { db } = service.load();
const input = service.input();
const port = service.port();

const antoniusClient = new AntoniusClient(
    input.antoniusUrl.expose(),
    input.antoniusUser.expose(),
    input.antoniusPassword.expose(),
);


console.debug(`${port}`);


console.debug(`Local postgresql database is at ${db.url}`);

const antoniusArticleTotal = await antoniusClient.getArticleTotal();
console.debug(`Antonius database has a total of ${antoniusArticleTotal} articles`!);

const localArticleTotal = await db.client.orm.public.Article
    .aggregate((a) => ({ total: a.count() }))
console.debug(`Postgres database has a total of ${localArticleTotal.total} artricles!`);

// console.debug(`Deleting all articles...`);
// const BATCH_SIZE = 500;
// let deletedArticles = 0;
// for (let i = 0; i <= antoniusArticleTotal; i += deletedArticles) {
//     deletedArticles += await db.client.orm.public.Article
//         .where({})
//         .limit(BATCH_SIZE)
//         .deleteAndCount();
//     console.debug(`Deleted ${deletedArticles} articles!`);
// }

// localArticleTotal = await db.client.orm.public.Article
//     .aggregate((a) => ({ total: a.count() }))
// console.debug(`Postgres database has a total of ${localArticleTotal.total} artricles!`);



//if (localArticleTotal.total < antoniusArticleTotal) await seed();



const handler = serve(service, {
    rpc: {
        getShopArticles: async (params) => {
            const result = await db.client.orm.public.ShopArticle
                .where((sa) =>
                    sa.article.some((a) => a.name.ilike(`%${params.query}%`)))
                .limit(params.take)
                .offset(params.skip)
                .include('article')
                .all() as Array<ShopArticle>;

            return {
                shopArticles: result
            }

        },
        getShopArticleByPZN: async ({ pzn }) => {
            const result = await db.client.orm.public.ShopArticle
                .where((sa) => sa.pzn.eq(pzn))
                .include("article")
                .first() as ShopArticle;
            return { shopArticle: result };
        },
        getShopArticleCount: async ({ query }) => {
            return (
                await db.client.orm.public.ShopArticle
                    .where((sa) =>
                        sa.article.some((a) =>
                            a.name.ilike(`%${query}%`)))

                    .aggregate((sa) => ({ count: sa.count() }))
            );
        },
        addShopArticles: async ({ articlePZNs }) => {
            const shopArticlesToAdd =
                articlePZNs.map((a) => ({
                    pzn: a,
                }));

            let count = 0;
            for (const s of shopArticlesToAdd) {
                try {
                    await db.client.orm.public.ShopArticle
                        .create(s);
                    count++;

                } catch (e) {
                    console.log(`Could not create ShopArticle because of ${e}!`)
                }
            }

            return ({
                created: count
            });
        },
        addArticles: async ({ articlePZNs }) => {
            const shopArticlesToAdd =
                articlePZNs.map((a) => ({
                    pzn: a,
                }));

            let count = 0;
            for (const s of shopArticlesToAdd) {
                try {
                    const articleReturn =
                        await antoniusClient.getArticleReturn({ pzn: s.pzn });

                    const article = mapArticles(articleReturn)[0];

                    await db.client.orm.public.Article.create(article);

                    await db.client.orm.public.ShopArticle
                        .create(s);
                    count++;
                } catch (e) {
                    console.log(`Could not create Article because of ${e}!`)
                }
            }

            return ({
                created: count
            });
        },
        freshSeed: async () => ({
            success: await seed(),
        }),
    }
},
);
export default handler;

Bun.serve({ port, hostname: '0.0.0.0', fetch: handler });
console.debug(`Catalog server up!`);


async function seed() {

    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    let skip = 0;
    const take = 10000;
    let localArticleTotal = 0;
    while (true) {
        const articleReturn = await antoniusClient.getArticleReturn({ skip, take });

        const articles = mapArticles(articleReturn);
        console.debug(`Got ${articles.length} articles from antonius database!`)

        const filteredArticles = articles.filter((a) => a.active);
        console.debug(`Filtered ${filteredArticles.length} articles`);

        const BATCH_SIZE = 500;
        let addedArticles = 0;
        for (let i = 0; i < filteredArticles.length; i += BATCH_SIZE) {
            const batch = filteredArticles
                .slice(i, Math.min((i + BATCH_SIZE), filteredArticles.length));

            try {
                addedArticles += await db.client.orm.public.Article
                    .createAndCount(batch);
                await new Promise<void>((resolve) => setTimeout(resolve, 500));
            } catch {
                console.debug(`Duplicate found! Adding each article individually...`)
                for (const article of batch) {
                    await db.client.orm.public.Article
                        .upsert({
                            create: article,
                            update: article,
                        });
                    addedArticles += 1;
                    console.debug(`Added ${addedArticles} of ${filteredArticles.length} articles!`);
                }
            }
        }

        localArticleTotal += addedArticles;
        console.debug(`Created ${addedArticles} articles in local database`);
        console.debug(`Created a total of ${localArticleTotal}/${antoniusArticleTotal} articles in local database`);

        if (addedArticles > filteredArticles.length) {
            console.debug(`Batch is incomplete! Retrying batch!`);
        }
        else {
            skip += take;
            console.debug(`Batch is complete! Skip is now ${skip}.`);
        }

        if (skip >= antoniusArticleTotal)
            break;
    }

    return true;
}