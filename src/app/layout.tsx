import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import localFont from "next/font/local";
import { EVENT_CITY, EVENT_START, formatDateShort, formatTime, siteUrl } from "@/config/event";
import "./globals.css";

const cormorant = Cormorant_Garamond({ weight: ["600"], subsets: ["latin"], variable: "--font-cormorant", display: "swap" });
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon", display: "swap" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" });
// Noto Nastaliq Urdu, subset to just the letters in the Saadi verse (the full font is ~156 KB).
// If you change the Persian text, regenerate this file with the Google Fonts `text=` parameter.
const nastaliq = localFont({ src: "../assets/nastaliq-poem.woff2", variable: "--font-nastaliq", display: "swap", preload: false });

const title = "Bani Adam · Jay's 30th";
const description = `${formatDateShort()} · ${formatTime(EVENT_START)} · ${EVENT_CITY}. A sober, all-ages sunrise dance party. DJ, egg tacos, cold brew, costumes. No gifts: give instead.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Bani Adam" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050806",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${pinyon.variable} ${jost.variable} ${nastaliq.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
