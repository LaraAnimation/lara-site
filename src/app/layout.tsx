import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Chelsea_Market, Nunito } from "next/font/google";
import { Header } from "@/components/Header";
import { site } from "@/data/site";
import "./globals.css";

const display = Chelsea_Market({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const ui = Nunito({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: site.displayName,
    template: `%s · ${site.displayName}`,
  },
  description:
    "Portfolio of animator and visual artist Lara Renee Renaud — films, paintings, and drawings.",
  icons: {
    icon: [
      { url: "/images/favicon-creature.png", type: "image/png", sizes: "192x192" },
      { url: "/images/favicon-creature.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/images/favicon-creature.png",
    apple: "/images/favicon-creature.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteBg = `url("/images/site-bg.png")`;
  const paintingsBg = `url("/images/paintings-bg.png")`;

  return (
    <html lang="en" className={`${display.variable} ${ui.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={
          {
            ["--site-bg-image"]: siteBg,
            ["--paintings-bg-image"]: paintingsBg,
          } as CSSProperties
        }
      >
        <Header />
        <main className="page">{children}</main>
        <footer className="site-footer">
          © 2021 by {site.brandShort}. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
