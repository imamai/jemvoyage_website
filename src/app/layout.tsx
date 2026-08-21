import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

import { publicEnv } from "@/lib/env";
import { getPublicSettings, settingString } from "@/lib/cms/queries";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/** Title, description and social image all come from the CMS, not from code. */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const name = settingString(settings, "site.name", "Jemvoyage");
  const tagline = settingString(
    settings,
    "site.tagline",
    "Premium journeys across Kenya and East Africa",
  );
  const description = settingString(settings, "site.description", tagline);

  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s · ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} — ${tagline}`,
      description,
      locale: "en_KE",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sand-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
