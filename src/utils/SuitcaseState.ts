import {create} from "zustand";
type Item = {
    id: string;
    name: string;
    quantity: number;
};

type SuitcaseState = {
    items: Item[];
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
};

export const useSuitcase = create<SuitcaseState>((set) => ({
    items: [],
    addItem: (item) => 
        set((state) => ({items: [...state.items, item] })),
    removeItem: (id) => {
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }));
    },
}))