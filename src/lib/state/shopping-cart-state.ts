import { ArticleClient as Article } from "@/utils/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { immerable } from "immer";
import { persist } from "zustand/middleware/persist";

export type ShoppingCartArticle = {
  article: Article;
  quantity: number;
};

class ShoppingCartBundle {
  [immerable] = true;
  name: string;
  articles: Array<ShoppingCartArticle>;
  quantity: number;
  complete: boolean;

  constructor(name: string, quantity = 1) {
    this.complete = true;
    this.quantity = quantity;
    this.name = name;
    this.articles = [];
  }

  changeQuantity(quantityDelta: number = 1) {
    if (this.quantity + quantityDelta >= 0) this.quantity += quantityDelta;
  }

  setQuantity(quantity: number) {
    if (quantity >= 0) this.quantity = quantity;
  }

  changeArticleQuantity(pzn: string, quantityDelta: number) {
    const article = this.articles.find(
      (article) => article.article.pzn === pzn,
    );
    if (!article) return -1;
    if (article.quantity + quantityDelta >= 0)
      article.quantity += quantityDelta;

    if (article.quantity === 0) this.removeArticle(article.article.pzn);

    return article.quantity;
  }

  setArticleQuantity(pzn: string, quantity: number) {
    if (quantity < 0) return;
    const article = this.articles.find(
      (article) => article.article.pzn === pzn,
    );
    if (!article) return;
    if (quantity === 0) {
      this.removeArticle(article.article.pzn);
      return;
    }
    article.quantity = quantity;
  }

  addArticle(article: Article, quantity = 1) {
    const shoppingCartArticle = this.articles.find(
      (shoppingCartArticle) => shoppingCartArticle.article.pzn === article.pzn,
    );
    if (shoppingCartArticle) shoppingCartArticle.quantity += quantity;
    else this.articles.push({ article: article, quantity: quantity });
  }

  removeArticle(pzn: string) {
    this.articles = this.articles.filter(
      (article) => article.article.pzn !== pzn,
    );
  }
}

interface ShoppingCartState {
  bundles: Array<ShoppingCartBundle>;
  addBundle: (item: ShoppingCartBundle) => void;
  removeBundle: (name: string) => void;
  addArticleToBundle: (
    bundleName: string,
    article: Article,
    quantity: number,
  ) => void;
  changeArticleQuantity: (
    bundleName: string,
    articlePZN: string,
    quantityDelta: number,
  ) => number;
  setArticleQuantity: (
    bundleName: string,
    articlePZN: string,
    quantityDelta: number,
  ) => void;
}

const defaultBundle = new ShoppingCartBundle("default");

export const useShoppingCartStore = create<ShoppingCartState>()(
  immer((set) => ({
    bundles: [defaultBundle],
    addBundle: (item) =>
      set((state) => ({
        bundles: [...state.bundles, item],
      })),
    removeBundle: (name) =>
      set((state) => ({
        bundles: state.bundles.filter((bundle) => bundle.name !== name),
      })),
    addArticleToBundle: (bundleName, article, quantity = 1) =>
      set((state) => {
        const bundel = state.bundles.find(
          (bundle) => bundle.name === bundleName,
        );
        if (!bundel) return;
        bundel.addArticle(article, quantity);
      }),
    changeArticleQuantity: (bundleName, articlePZN, quantityDelta) => {
      let newQuantity = -1;
      set((state) => {
        const bundle = state.bundles.find(
          (bundle) => bundle.name === bundleName,
        );
        if (!bundle) return;
        newQuantity = bundle.changeArticleQuantity(articlePZN, quantityDelta);
      });
      return newQuantity;
    },
    setArticleQuantity: (bundleName, articlePZN, quantityDelta) =>
      set((state) => {
        const bundle = state.bundles.find(
          (bundle) => bundle.name === bundleName,
        );
        if (!bundle) return;
        bundle.setArticleQuantity(articlePZN, quantityDelta);
      }),
  })),
);
