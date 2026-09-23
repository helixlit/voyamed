import type { Article } from "@voyamed/catalog/contract";

type PackageSize = { quantity: number; unit: string };

export function parsePackageSize(value: string): PackageSize | null {
  const normalized = value.replace(",", ".");
  const multiplied = normalized.match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)\s*(ml|g|st\.?)/i);
  if (multiplied) {
    return { quantity: Number(multiplied[1]) * Number(multiplied[2]), unit: multiplied[3].toLowerCase().replace(".", "") };
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg|st\.?|tabletten|tab\.?|kapseln|kaps\.?)/i);
  if (!match) return null;
  const rawUnit = match[2].toLowerCase().replace(".", "");
  const unit = ["st", "tabletten", "tab", "kapseln", "kaps"].includes(rawUnit) ? "St" : rawUnit;
  return { quantity: Number(match[1]), unit };
}

export function formatPackageLabel(article: Article) {
  if (article.purchaseUnit > 1 && article.unit !== "Packung") return `${article.purchaseUnit} ${article.unit}`;
  return article.unit === "Packung" ? "Packung" : `${article.purchaseUnit} ${article.unit}`;
}

export function formatUnitPrice(article: Article) {
  const unit = article.unit.toLowerCase().replace(".", "");
  const price = article.priceCents / 100;
  const amount = article.purchaseUnit;
  if (!Number.isFinite(amount) || amount <= 0 || article.unit === "Packung") return null;

  const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  if (["st", "tabletten", "tab", "kapseln", "kaps"].includes(unit)) return `${euro.format(price / amount)} / Stück`;
  if (unit === "ml") return `${euro.format(price / amount * 1000)} / l`;
  if (unit === "l") return `${euro.format(price / amount)} / l`;
  if (unit === "g") return `${euro.format(price / amount * 1000)} / kg`;
  if (unit === "kg") return `${euro.format(price / amount)} / kg`;
  return null;
}
