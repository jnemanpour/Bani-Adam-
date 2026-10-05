import type { Metadata, Viewport } from "next";
import { Monoton, Rubik } from "next/font/google";
import { EVENT_CITY, formatDateShort, formatTime, EVENT_START, siteUrl } from "@/config/event";
import "./globals.css";

const monoton = Monoton({ weight: "400", subsets: ["latin"], variable: "--font-monoton", display: "swap" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik", display: "swap" });

const title = "SUNRISE RAVE · Jay's 30th";
const description = `${formatDateShort()} · ${formatTime(EVENT_START)} · ${EVENT_CITY}. A sober, all-ages sunrise rave. DJ, egg tacos, cold brew, costumes. No gifts: give instead.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "Sunrise Rave" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#07040F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${monoton.variable} ${rubik.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
