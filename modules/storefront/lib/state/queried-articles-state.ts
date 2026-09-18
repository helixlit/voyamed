import { create } from "zustand";

import { Article } from "../../../catalog/src/contract";

interface QueriedArticlesState {
    items: Array<Article> | null;
    setItems: (items: Array<Article>) => void;
}

export const useQueriedArticleStore =
    create<QueriedArticlesState>()((set) => ({
        items: null,
        setItems: (items) => set((state) => ({
            items: items,
        })),
    }))