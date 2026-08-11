import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Header } from "@/components/Header";
import { site } from "@/data/site";
import "./globals.css";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteBg = `url("${basePath}/images/site-bg.png")`;

  return (
    <html lang="en" className={`${display.variable} ${ui.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ ["--site-bg-image" as string]: siteBg }}
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
