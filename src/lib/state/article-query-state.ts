import { create } from "zustand";

interface ArticleQueryState {
    query: string;
    setQuery: (query: string) => void;
}

export const useArticleQueryStore =
    create<ArticleQueryState>()((set) => ({
        query: "",
        setQuery: (query) => set((state) => ({
            query: query,
        })),
    }))