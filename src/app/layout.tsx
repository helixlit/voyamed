import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Modals from "../modals/Modals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})


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
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col max-w-screen">
        <Header />
        {children}
        <Footer />
        <Modals />
      </body>
    </html>
  );
}
