import type { Metadata, Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notarko.vercel.app";
const title = `${profile.name} | ${profile.role}`;
const description = `${profile.name} — ${profile.role} and ${profile.hackathonWins}× hackathon winner. Projects, experience, skills and contact.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: { type: "website", url: "/", siteName: profile.name, title, description, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description, creator: profile.handle },
};

export const viewport: Viewport = { themeColor: "#0b0d0e" };

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
