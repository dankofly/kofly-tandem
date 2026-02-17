import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import ChatBot from "@/components/ChatBot";
import CookieBanner from "@/components/CookieBanner";
import ThemeProvider from "@/components/ThemeProvider";
import {
  organizationSchema,
  serviceSchema,
  voucherServiceSchema,
  webSiteSchema,
} from "@/lib/schema";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = "https://www.gleitschirm-tandemflug.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocaleMap: Record<string, string> = {
  de: "de_AT",
  en: "en_US",
  nl: "nl_NL",
};

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("homeTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("homeDescription"),
    keywords: t("homeKeywords").split(","),
    authors: [{ name: "Gleitschirm-Tandemflug.com" }],
    openGraph: {
      type: "website",
      locale: ogLocaleMap[locale] || "de_AT",
      url: `${SITE_URL}/${locale}`,
      siteName: "Gleitschirm-Tandemflug.com",
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
      images: [
        {
          url: `${SITE_URL}/images/hero-1771273007982.jpg`,
          width: 1200,
          height: 630,
          alt: t("homeOgTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
      images: [`${SITE_URL}/images/hero-1771273007982.jpg`],
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        de: `${SITE_URL}/de`,
        en: `${SITE_URL}/en`,
        nl: `${SITE_URL}/nl`,
        "x-default": `${SITE_URL}/de`,
      },
    },
    robots: { index: true, follow: true },
    other: {
      "geo.region": "AT-7",
      "geo.placename": "Lienz, Osttirol",
      "geo.position": "46.8298;12.7693",
      "ICBM": "46.8298, 12.7693",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-surface-primary text-content-base">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(voucherServiceSchema(locale)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema(locale)),
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <MobileCTA />
            <ChatBot />
            <CookieBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
