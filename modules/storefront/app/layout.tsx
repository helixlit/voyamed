import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";

import Modals from "../components/modals/modals";
import Header from "../components/header";
import Footer from "../components/footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voyamed",
  description: "Voyamed - Travelmedicine",
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
        <main>
          {children}
          <Footer />
        </main>
        <Modals />
      </body>
    </html>
  );
}
