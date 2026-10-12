import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond, Figtree, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import Cosmos from "@/components/Cosmos";
import { profile } from "@/lib/data";
import "./globals.css";

const figtree = Figtree({ variable: "--font-sans", subsets: ["latin"] });
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.name} — ${profile.role}. Projects, experience, skills and contact.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${figtree.variable} ${display.variable} ${mono.variable} ${serif.variable}`}>
      <body id="top">
        <Cosmos />
        <Motion />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
