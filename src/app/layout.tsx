import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "@/components/providers/AppProviders";
import { getSiteUrl } from "@/lib/site-url";
import { getPortfolioJsonLd } from "@/lib/portfolio-json-ld";

const siteUrl = getSiteUrl();

/** Título para resultados de búsqueda, pestaña y Open Graph (debe coincidir con el nombre deseado en Google). */
const SITE_TITLE = "Portfolio web Mateo G. Fontana Dalmasso (MGFD)";
/** Snippet: refuerza identidad y reduce confusiones con otras entidades (p. ej. nombres parecidos o finanzas). */
const SITE_DESCRIPTION =
  "Portfolio web Mateo G. Fontana Dalmasso (MGFD). Diseño gráfico, UX/UI y desarrollo digital. Autor: Mateo G. Fontana Dalmasso; marca personal MGFD.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: SITE_TITLE,
    template: `%s · Mateo G. Fontana Dalmasso (MGFD)`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  authors: [{ name: "Mateo G. Fontana Dalmasso", url: siteUrl }],
  creator: "Mateo G. Fontana Dalmasso",
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/images/favicon.png",
        type: "image/png",
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = getPortfolioJsonLd(siteUrl);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-transparent text-foreground transition-colors duration-200">
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}