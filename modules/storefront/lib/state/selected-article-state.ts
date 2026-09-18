import { create } from "zustand";

import { Article } from "../../../catalog/src/contract";

interface SelectedArticleState {
    item: Article | null;
    setItem: (item: Article) => void;
}

export const useSelectedArticleStore =
    create<SelectedArticleState>()((set) => ({
        item: null,
        setItem: (item) => set((state) => ({
            item: item,
        })),
    }))