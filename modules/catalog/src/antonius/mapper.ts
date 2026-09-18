import { Article } from "../contract";
import { PriceGroupKey, ArticleReturn } from "./types";

export function mapArticles(antoniusArticleReturn: ArticleReturn) {
  const antoniusArticles = antoniusArticleReturn.articles;
  const articles: Article[] = [];
  // const articleAttributes: Prisma.ArticleAttributeCreateManyInput[] = [];

  for (const antoniusArticle of antoniusArticles) {
    const article: Article = {
      pzn: antoniusArticle.mainDetail.number,
      name: antoniusArticle.name,
      active: antoniusArticle.active,
      supplier: antoniusArticle.supplier.Firmenname,
      unit: antoniusArticle.mainDetail.unit.toString(),
      purchaseUnit: Math.round(Number(antoniusArticle.mainDetail.purchaseUnit)),
      priceCents: Math.round(Number(
        antoniusArticle.mainDetail.prices.find(
          (price) => price.groupKey == PriceGroupKey.VerkaufsPreis,
        )?.price ?? 0,
      ) * 100),
    };
    articles.push(article);

    // if (!antoniusArticle.propertyValues) continue;
    // const newArticleAttributes = antoniusArticle.propertyValues.map(
    //   (attribute) => ({
    //     ...attribute,
    //     articlePZN: antoniusArticle.mainDetail.number,
    //   }),
    // );
    // articleAttributes.push(...newArticleAttributes);
  }
  return articles;
}
