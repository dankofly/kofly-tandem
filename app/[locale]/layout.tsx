import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import nextDynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import ThemeProvider from "@/components/ThemeProvider";

const ChatBotLazy = nextDynamic(() => import("@/components/ChatBotLazy"), { loading: () => null });
const CookieBanner = nextDynamic(() => import("@/components/CookieBanner"), { loading: () => null });
const ScrollProgress = nextDynamic(() => import("@/components/ScrollProgress"), { loading: () => null });
import {
  organizationSchema,
  serviceSchema,
  voucherServiceSchema,
  webSiteSchema,
  touristAttractionSchema,
  siteNavigationSchema,
  personSchema,
} from "@/lib/schema";
import { buildAlternates, buildOpenGraph, buildTwitter } from "@/lib/seo";
import { SITE_URL } from "@/lib/routes";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const dynamic = "force-static";
export const revalidate = 3600;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const og = { title: t("homeOgTitle"), description: t("homeOgDescription") };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("homeTitle"),
      // Kurzes Brand-Suffix: Kern der Seitentitel muss in ~60 Zeichen passen,
      // das Suffix wird von Google in der SERP oft abgeschnitten oder ersetzt.
      template: "%s | KOFLY - Gleitschirm-Tandemflug.com",
    },
    description: t("homeDescription"),
    keywords: t("homeKeywords").split(","),
    authors: [{ name: "Gleitschirm-Tandemflug.com" }],
    openGraph: await buildOpenGraph(locale, "", og),
    twitter: await buildTwitter(og),
    alternates: buildAlternates(locale),
    verification: {
      google: "googlefb3c4e31913cb3e3",
      other: {
        "msvalidate.01": "e9d9b24bb6a94185be234573c3c01af6",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-surface-primary text-content-base">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                organizationSchema(locale),
                serviceSchema(locale),
                voucherServiceSchema(locale),
                webSiteSchema(locale),
                // Kein Product im sitewide @graph: jede Seite traegt hoechstens
                // EIN Product (Startseite productSchema, Landingpages ihr
                // packageProductSchema), sonst doppelte Entitaeten je URL.
                touristAttractionSchema(locale),
                siteNavigationSchema(locale),
                personSchema(locale),
              ],
            }),
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ScrollProgress />
            <Header />
            <main>{children}</main>
            <Footer />
            <MobileCTA />
            <ChatBotLazy />
            <CookieBanner />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
