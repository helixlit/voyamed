import type { Metadata } from "next";
import GlobeApp from "./GlobeApp";

export const metadata: Metadata = { title: "Reiseziel wählen" };

export default function page() {
    return (
        <div className="flex h-[calc(100dvh-var(--header-height))] flex-col">
            <GlobeApp />
        </div>
    )
}