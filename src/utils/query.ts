"use server";

import prisma from "@/lib/prisma";

export async function queryPrismaArticles(query: string) {
  const articles = await prisma.article.findMany({
    distinct: ["name"],
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
      active: {
        equals: true,
      },
    },
    take: 3,
  });

  return articles;
}

export async function queryShopArticles(query: string, take = 10, skip = 0) {
  const articles = await prisma.shopArticle.findMany({
    include: {
      article: {},
    },
    where: {
      article: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
    take: take,
    skip: skip,
  });
  return articles.map((article) => ({
    ...article.article,
    price: article.article.price.toNumber(),
  }));
}

export async function queryShopArticleCount(query?: string) {
  if (!query) return prisma.shopArticle.count();
  return await prisma.shopArticle.count({
    where: {
      article: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    },
  });
}
