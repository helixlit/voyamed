"use client"

import { useIsAnyModalOpen } from "@/utils/ModalState";
import ShoppingCart from "./ShoppingCart";

export default function Modals() {
    const isBlurred = useIsAnyModalOpen();

    return (
        <div>
            <div className={`z-100 top-0 absolute w-screen h-screen ${isBlurred ? "bg-black/60" : "bg-black/0"} pointer-events-none transition-all duration-300`}></div>
            <ShoppingCart />
        </div>
    )
}