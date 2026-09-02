import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import "./globals.css";

import Modals from "@/modals/modals";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
      lang="en"
      className={`${outfit.variable} h-full overflow-hidden antialiased`}
    >
      <body className=" h-screen flex flex-col max-w-screen ">
        <Header />
        <div className="overflow-scroll">
          {children}
          <Footer />
        </div>
        <Modals />
      </body>
    </html>
  );
}
