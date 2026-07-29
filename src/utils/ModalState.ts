"use client"

import { create } from "zustand";

type ModalName = "shoppingCart" | "settings";

interface ModalState {
    modals: Record<ModalName, { open: boolean, beginClose: boolean }>;
    open: (name: ModalName) => void;
    close: (name: ModalName) => void;
    closeAll: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
    modals: {
        shoppingCart: { open: false, beginClose: false },
        settings: { open: false, beginClose: false },
    },

    open: (name) => set((state) => ({
        modals: { ...state.modals, [name]: { open: true, beginClose: false } },
    })),

    close: (name) => {
        set((state) => ({
            modals: { ...state.modals, [name]: { open: true, beginClose: true } }
        }));
        setTimeout(() => {
            set((state) => ({
                modals: { ...state.modals, [name]: { open: false, beginClose: false } },
            }))
        }, 250);
    },

    closeAll: () => set({
        modals: {
            shoppingCart: { open: false, beginClose: false },
            settings: { open: false, beginClose: false },
        },
    }),
}));

export const useIsAnyModalOpen = () =>
    useModalStore((state) => {
        const isAnyOpen = Object.values(state.modals).some((modal) => (modal.open), Boolean)
        return isAnyOpen;
    }
    );