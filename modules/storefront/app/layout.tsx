import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";

import Modals from "../components/modals/modals";
import Header from "../components/header";
import Footer from "../components/footer";
import CartFlyAnimation from "../components/cart-fly-animation";
import CartHydration from "../components/cart-hydration";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Voyamed – Deine Reiseapotheke",
    template: "%s | Voyamed",
  },
  description: "Stell dir die passende Reiseapotheke für dein Reiseziel und deine Aktivität zusammen – geprüft von der Antonius-Apotheke.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-[100dvh] max-w-screen overflow-x-hidden">
        <Header />
        <main>{children}</main>
        <Footer />
        <Modals />
        <CartFlyAnimation />
        <CartHydration />
      </body>
    </html>
  );
}
