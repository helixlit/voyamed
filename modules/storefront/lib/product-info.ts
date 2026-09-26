import productData from "@/data/konfigurator/produkte.json";

// The shop catalog has no indication field; the bundled product list does.
const indications = new Map(productData.produkte.map((product) => [product.pzn, product.indikation]));

/** What a product is for, e.g. "Durchfall" — null for products outside the bundled list. */
export function getIndication(pzn: string) {
  return indications.get(pzn) ?? null;
}
