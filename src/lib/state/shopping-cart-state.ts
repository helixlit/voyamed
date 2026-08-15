import { Article } from "@/generated/prisma/client"
import { create } from "zustand";

type ShoppingCartArticle = {
    article: Article;
    quantity: number;
};

class ArticleBundle {
    name: string;
    articles: Array<ShoppingCartArticle>;
    quantity: number;
    complete: boolean;

    constructor() {
        this.complete = true;
    }

    addQuantity(quantity: number = 1) {
        this.quantity += quantity;
    }

    removeQuantity(quantity: number = 1) {
        this.quantity -= quantity;
    }

    setQuantity(quantity: number) {
        this.quantity = quantity;
    }

    removeArticleQuantity(pzn: string, quantity: number = 1) {
        this.articles.find((article) => article.article.pzn === pzn)
            .quantity -= quantity;
    }

    addArticleQuantity(pzn: string, quantity: number = 1) {
        this.articles.find((article) => article.article.pzn === pzn)
            .quantity += quantity;
    }

    setArticleQuantity(pzn: string, quantity: number) {
        this.articles.find((article) => article.article.pzn === pzn)
            .quantity = quantity;
    }
}


interface ShoppingCartState {
    items: Array<ArticleBundle>;
    addItem: (item: ArticleBundle) => void;
    removeItem: (id: string) => void;
}

export const useShoppingCartStore = create<ShoppingCartState>()((set) => ({
    items: [{name: "default", articles}],
    addItem: (item) => set((state) => ({
        items: [ ...state.items, item],
    })),
    removeItem: (name) => set((state) => ({
        items: state.items.filter((item) => item.name !== name),
    })),
}));