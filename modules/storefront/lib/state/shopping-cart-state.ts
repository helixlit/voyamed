import { Article } from "../../../catalog/src/contract";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { immerable } from "immer";

export type ShoppingCartArticle = {
  article: Article;
  quantity: number;
};

export class ShoppingCartBundle {
  [immerable] = true;
  name: string;
  articles: Array<ShoppingCartArticle>;
  quantity: number;
  complete: boolean;
  priceCents: number;

  constructor(
    name: string, quantity = 1, articles: Array<ShoppingCartArticle> = []
  ) {
    this.complete = true;
    this.quantity = quantity;
    this.name = name;
    this.priceCents = 0;
    this.articles = articles;
  }

  changeQuantity(quantityDelta: number = 1) {
    if (this.quantity + quantityDelta < 0) return -1;
    this.quantity += quantityDelta;
    return this.quantity;
  }

  setQuantity(quantity: number) {
    if (quantity >= 0) this.quantity = quantity;
  }

  changeArticleQuantity(pzn: string, quantityDelta: number) {
    const article = this.articles.find(
      (article) => article.article.pzn === pzn,
    );
    if (!article) return -1;

    if (article.quantity + quantityDelta > 0) {
      article.quantity += quantityDelta;
      this.priceCents += quantityDelta * article.article.priceCents;
    }
    else if (article.quantity + quantityDelta === 0)
      this.removeArticle(article.article.pzn);

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
    const oldQuantity = article.quantity;
    article.quantity = quantity;
    this.priceCents += (quantity - oldQuantity) * article.article.priceCents;
  }

  addArticle(article: Article, quantity = 1) {
    const shoppingCartArticle = this.articles.find(
      (shoppingCartArticle) => shoppingCartArticle.article.pzn === article.pzn,
    );
    if (shoppingCartArticle) shoppingCartArticle.quantity += quantity;
    else this.articles.push({ article: article, quantity: quantity });

    this.priceCents += article.priceCents * quantity;
  }

  removeArticle(pzn: string) {
    const articleCount = this.articles.length;
    const article = this.articles.find((a) => a.article.pzn === pzn);
    this.articles = this.articles.filter(
      (article) => article.article.pzn !== pzn,
    );
    if (article && articleCount > this.articles.length) this.priceCents -= article.article.priceCents * article.quantity;
  }
}

interface ShoppingCartState {
  bundles: Array<ShoppingCartBundle>;
  addBundle: (item: ShoppingCartBundle) => void;
  removeBundle: (name: string) => void;
  changeBundleQuantity: (
    bundleName: string,
    quantityDelta: number,
  ) => number;
  setBundleQuantity: (
    bundleName: string,
    quantityDelta: number,
  ) => void;
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
    changeBundleQuantity: (bundleName, quantityDelta) => {
      let newQuantity = -1;
      set((state) => {
        const bundle = state.bundles.find(
          (bundle) => bundle.name === bundleName,
        );
        if (!bundle) return;
        newQuantity = bundle.changeQuantity(quantityDelta);
        if (newQuantity === 0) state.bundles
          = state.bundles.filter(b => b.name !== bundle.name)
      });
      return newQuantity;
    },
    setBundleQuantity: (bundleName, quantityDelta) =>
      set((state) => {
        const bundle = state.bundles.find(
          (bundle) => bundle.name === bundleName,
        );
        if (!bundle) return;
        bundle.setQuantity(quantityDelta);

        if (quantityDelta === 0) state.bundles
          = state.bundles.filter(b => b.name !== bundle.name);
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
