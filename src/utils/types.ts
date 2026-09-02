import { Article, Prisma } from "@/generated/prisma/client";

export enum BundelType {
  Desert,
  Mountain,
  ColdClimate,
}

type DecimalToNumber<T> = T extends Prisma.Decimal
  ? number
  : T extends Array<infer U>
    ? DecimalToNumber<U>[]
    : T extends object
      ? { [K in keyof T]: DecimalToNumber<T[K]> }
      : T;

export type ArticleClient = DecimalToNumber<Article>;
