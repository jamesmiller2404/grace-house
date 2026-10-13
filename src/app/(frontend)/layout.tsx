import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Source_Sans_3,
} from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

// DM Serif Display ships in one weight only (400)
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});
const source = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });
// Elegant serif used for the memorial dedication in the footer
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Grace House Nor Cal",
  description: "To bring hope to the hopeless.",
  // Browser tab / home-screen icon (served from public/images/).
  icons: {
    icon: "/images/favicon1.png",
    apple: "/images/favicon1.png",
  },
  // Concept stage: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${source.variable} ${cormorant.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
