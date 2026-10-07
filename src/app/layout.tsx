import type { Metadata } from "next";
import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

// DM Serif Display ships in one weight only (400)
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});
const source = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });

export const metadata: Metadata = {
  title: "Grace House — Design Concept",
  description: "Design concept for the new Grace House website.",
  // Concept stage: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${source.variable}`}>
      <body className="flex min-h-screen flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
