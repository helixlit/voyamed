import { create } from "zustand";

import { Article } from "@/utils/types";

interface SelectedArticleState {
    item: Article;
    setItem: (item: Article) => void;
}

export const useSelectedArticleStore =
    create<SelectedArticleState>()((set) => ({
        item: null,
        setItem: (item) => set((state) => ({
            item: item,
        })),
    }))