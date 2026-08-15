import { Article, Prisma } from "@/generated/prisma/client";
import { Antonius } from "./types";

export function mapArticles(antoniusArticleReturn: Antonius.ArticleReturn) {
    const antoniusArticles = antoniusArticleReturn.articles;
    const articles: Article[] = [];
    for (const antoniusArticle of antoniusArticles) {
        const article: Article = {
            pzn: antoniusArticle.mainDetail.number,
            name: antoniusArticle.name,
            active: antoniusArticle.active,
            supplier: antoniusArticle.supplier.Firmenname,
            unit: antoniusArticle.mainDetail.unit.toString(),
            purchaseUnit: Number(antoniusArticle.mainDetail.purchaseUnit),
            price: new Prisma.Decimal(
                antoniusArticle.mainDetail.prices
                    .find(price => price.groupKey
                        == Antonius.PriceGroupKey.VerkaufsPreis)
                    .price
            ),
            prescription: !antoniusArticle.propertyValues.find(property => property.option == 'Rezeptpflicht').value.includes('nein'),
        }
        articles.push(article);
    }
    return articles;

}