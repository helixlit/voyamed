import { serve } from "@prisma/composer/service-rpc";
import type { Article } from "./contract";
import service from "./service";
import { AntoniusClient } from "./antonius/client";
import pzns from '../data/articles.json'


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


seed();

const handler = serve(service, {
    rpc: {
        getArticlesByQuery: async ({ query }) => {
            const result = await db.client.orm.public.Article
                .where((a) => a.name.ilike(`%${query}%`))
                .include("articleCategories")
                .all()

            return {
                articles: result.map((article) => ({
                    ...article,
                    articleCategories: article.articleCategories.map((category) => ({
                        articlePzn: String(category.articlePzn),
                        categoryId: String(category.categoryId),
                    })),
                }))
            }

        },
        getArticlesByPZNs: async ({ pzns }) => {
            const result = await db.client.orm.public.Article
                .where(a => a.pzn.in(pzns))
                .include("articleCategories")
                .all()
            return {
                articles: result.map((article) => ({
                    ...article,
                    articleCategories: article.articleCategories.map((category) => ({
                        articlePzn: String(category.articlePzn),
                        categoryId: String(category.categoryId),
                    })),
                }))
            };
        },
        getArticleCountByQuery: async ({ query }) => {
            return (
                await db.client.orm.public.Article
                    .where(a => a.name.ilike(`%${query}%`))
                    .aggregate((a) => ({ count: a.count() }))
            );
        },
    },

});
export default handler;

Bun.serve({ port, hostname: '0.0.0.0', fetch: handler });
console.debug(`Catalog server up!`);


async function seed() {

    const newArticles: Article[] = [];

    for (const pzn of pzns) {
        const a = (await antoniusClient.getArticleReturn({ pzn })).articles[0];

        newArticles.push({
            pzn: a.mainDetail.number,
            active: a.active,
            articleCategories: [],
            dosageForm: a.propertyValues.find(
                p => p.option === 'Darreichungsform'
            )!.value,
            name: a.name,
            priceCents: a.mainDetail.prices.find(p => (
                p.groupKey === 'EK'
            ))!.price,
            purchasePrice: a.mainDetail.prices.find(p => (
                p.groupKey === 'Apo_Ek'
            ))!.price,
            purchaseUnit: Number(a.mainDetail.purchaseUnit),
            unit: a.mainDetail.unit,
            supplier: a.supplier.Firmenname,
        })
    }

    const createdCount = db.client.orm.public.Article
        .createAndCount(newArticles
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ articleCategories, ...article }) => article));

    console.info(`Created ${createdCount}/${newArticles.length}`)
}