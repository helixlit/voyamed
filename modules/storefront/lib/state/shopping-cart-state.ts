import { Article } from "../../../catalog/src/contract";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
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
    this.priceCents = articles.reduce((sum, item) => sum + item.article.priceCents * item.quantity, 0);
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
  selectedBundleName: string | null;
  addBundle: (item: ShoppingCartBundle) => void;
  selectBundle: (name: string | null) => void;
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
  clearCart: () => void;
}

type PersistedBundle = Pick<ShoppingCartBundle, "name" | "quantity" | "articles">;
type PersistedCart = { bundles: Array<PersistedBundle>; selectedBundleName: string | null };

export const useShoppingCartStore = create<ShoppingCartState>()(
  persist(
  immer((set) => ({
    bundles: [new ShoppingCartBundle("default")],
    selectedBundleName: null,
    clearCart: () =>
      set((state) => {
        state.bundles = [new ShoppingCartBundle("default")];
        state.selectedBundleName = null;
      }),
    addBundle: (item) =>
      set((state) => {
        // A kit is identified by its destination and activity. Re-selecting it
        // must not add the base products a second time.
        if (!state.bundles.some((bundle) => bundle.name === item.name)) {
          state.bundles.push(item);
        }
      }),
    selectBundle: (name) =>
      set((state) => ({
        selectedBundleName: name && state.bundles.some((bundle) => bundle.name === name)
          ? name
          : null,
      })),
    removeBundle: (name) =>
      set((state) => {
        state.bundles = state.bundles.filter((bundle) => bundle.name !== name);
        if (state.selectedBundleName === name) state.selectedBundleName = null;
      }),
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
        if (newQuantity === 0) {
          state.bundles = state.bundles.filter(b => b.name !== bundle.name);
          if (state.selectedBundleName === bundle.name) state.selectedBundleName = null;
        }
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

        if (quantityDelta === 0) {
          state.bundles = state.bundles.filter(b => b.name !== bundle.name);
          if (state.selectedBundleName === bundle.name) state.selectedBundleName = null;
        }
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
  {
    name: "voyamed-cart",
    version: 1,
    storage: createJSONStorage(() => localStorage),
    // Hydrated from <CartHydration /> after mount, so server and first client render match.
    skipHydration: true,
    // Only plain data is stored; the bundle instances (with their methods) are rebuilt on load.
    partialize: (state): PersistedCart => ({
      bundles: state.bundles.map(({ name, quantity, articles }) => ({ name, quantity, articles })),
      selectedBundleName: state.selectedBundleName,
    }),
    merge: (persisted, current) => {
      const saved = persisted as PersistedCart | undefined;
      if (!saved?.bundles?.length) return current;
      const bundles = saved.bundles.map((bundle) => new ShoppingCartBundle(bundle.name, bundle.quantity, bundle.articles));
      if (!bundles.some((bundle) => bundle.name === "default")) bundles.unshift(new ShoppingCartBundle("default"));
      const selectedBundleName = bundles.some((bundle) => bundle.name === saved.selectedBundleName)
        ? saved.selectedBundleName
        : null;
      return { ...current, bundles, selectedBundleName };
    },
  }),
);
