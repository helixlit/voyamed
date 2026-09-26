import type { Metadata } from "next";
import Browser from "./article-browser";

export const metadata: Metadata = { title: "Reiseapotheke zusammenstellen" };

export default function page() {
  return (
    <div className="mx-auto w-full max-w-6xl p-3 sm:p-5">
      <Browser />
    </div>
  );
}
