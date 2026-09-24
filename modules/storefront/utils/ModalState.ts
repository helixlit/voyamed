import { create } from "zustand";

type ModalName = "shoppingCart" | "settings" | "stripe";

interface ModalState {
    modals: Record<ModalName, { open: boolean, beginClose: boolean, src?: string }>;
    open: (name: ModalName) => void;
    close: (name: ModalName) => void;
    closeAll: () => void;
    setStripeSrc: (src: string) => void;
};

export const useModalStore = create<ModalState>((set) => ({
    modals: {
        shoppingCart: { open: false, beginClose: false },
        stripe: { open: false, beginClose: false, src: "" },
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
            stripe: { open: false, beginClose: false },
            settings: { open: false, beginClose: false },
        },
    }),

    setStripeSrc: (src: string) => set((state) => ({
        modals: {
            ...state.modals, stripe: { open: true, beginClose: false, src: src }
        }
    }))
}));

export const useIsAnyModalOpen = () =>
    useModalStore((state) => {
        const isAnyOpen = Object.values(state.modals).some((modal) => (modal.open), Boolean)
        return isAnyOpen;
    }
    );