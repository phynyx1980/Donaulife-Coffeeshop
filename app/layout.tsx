import type { Metadata } from "next";
import { Quicksand, DM_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-syne",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Donaulife Coffeeshop | Krems an der Donau",
  description:
    "Der erste Coffeeshop in Krems. Coffee, CBD, Events & gute Vibes. Mo–So 13–22 Uhr. Untere Landstraße 71, 3500 Krems.",
  keywords: ["Coffeeshop Krems", "CBD Krems", "Donaulife", "Coffee Krems", "Events Krems"],
  openGraph: {
    title: "Donaulife Coffeeshop | Krems an der Donau",
    description:
      "Der erste Coffeeshop in Krems. Coffee, CBD, Events & gute Vibes.",
    url: "https://donaulife.com",
    siteName: "Donaulife Coffeeshop",
    locale: "de_AT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donaulife Coffeeshop | Krems an der Donau",
    description: "Der erste Coffeeshop in Krems. Coffee, CBD, Events & gute Vibes.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://donaulife.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`${quicksand.variable} ${nunito.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
