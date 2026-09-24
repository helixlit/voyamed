import type { Article, ShopArticle } from "@voyamed/catalog/contract";

import productData from "@/data/konfigurator/produkte.json";
import { parsePackageSize } from "@/lib/article-price";

type LocalProduct = (typeof productData.produkte)[number];

function toArticle(product: LocalProduct): Article {
  const packageSize = parsePackageSize(product.name_original);
  return {
    active: true,
    name: product.name,
    pzn: product.pzn,
    supplier: product.hersteller,
    purchaseUnit: packageSize?.quantity ?? 1,
    unit: packageSize?.unit ?? "Packung",
    priceCents: Math.round(product.preis_brutto * 100),
  };
}

function toShopArticle(product: LocalProduct): ShopArticle {
  return { id: Number(product.pzn), pzn: product.pzn, article: toArticle(product) };
}

function matchesQuery(product: LocalProduct, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("de-DE");
  if (!normalizedQuery) return true;

  return [
    product.name,
    product.name_original,
    product.pzn,
    product.hersteller,
    product.indikation,
    ...product.suchbegriffe,
  ].some((value) => value.toLocaleLowerCase("de-DE").includes(normalizedQuery));
}

export function getLocalShopArticle(pzn: string) {
  const product = productData.produkte.find((item) => item.pzn === pzn);
  return product ? toShopArticle(product) : null;
}

export function getLocalShopArticles(query: string, take: number, skip: number) {
  return productData.produkte
    .filter((product) => matchesQuery(product, query))
    .slice(skip, skip + take)
    .map(toShopArticle);
}

export function getLocalShopArticleCount(query: string) {
  return productData.produkte.filter((product) => matchesQuery(product, query)).length;
}

/**
 * Keeps the storefront usable when the shop catalog is temporarily unavailable.
 * The bundled catalog is deliberately a read-only fallback; live availability is
 * still confirmed by the pharmacy before an order is accepted.
 */
export function canUseLocalCatalogFallback() {
  return process.env.VOYAMED_DISABLE_LOCAL_CATALOG_FALLBACK !== "true";
}
