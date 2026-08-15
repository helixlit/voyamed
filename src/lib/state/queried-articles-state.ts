import { create } from "zustand";

import { Article } from "@/utils/types";

interface QueriedArticlesState {
    items: Array<Article>;
    setItems: (items: Array<Article>) => void;
}

export const useQueriedArticleStore =
    create<QueriedArticlesState>()((set) => ({
        items: null,
        setItems: (items) => set((state) => ({
            items: items,
        })),
    }))