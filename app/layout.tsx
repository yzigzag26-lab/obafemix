import type { Metadata } from "next";
import { site } from "@/lib/site";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/caveat/600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "OBAFEMIX — I build solutions for a better tomorrow", template: "%s | OBAFEMIX" },
  description: "OBAFEMIX is the portfolio of Obafemi Precious, a student and software developer in Lagos State, Nigeria, building web applications, API integrations and backend systems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "OBAFEMIX — Obafemi Precious, Software Developer",
    description: "I build solutions for a better tomorrow. Explore the work, projects and development services of Obafemi Precious.",
    url: site.url,
    siteName: "OBAFEMIX",
    images: [{ url: "/assets/obafemix-og.webp", width: 1200, height: 630, alt: "OBAFEMIX — Obafemi Precious" }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBAFEMIX — Obafemi Precious",
    description: "I build solutions for a better tomorrow.",
    images: ["/assets/obafemix-og.webp"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" as const, themeColor: "#05010f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personId = `${site.url}/#person`;
  const brandId = `${site.url}/#brand`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.personName,
        alternateName: site.alias,
        url: site.url + "/about",
        jobTitle: "Student Developer",
        address: { "@type": "PostalAddress", addressRegion: "Lagos State", addressCountry: "NG" },
        email: "mailto:" + site.email,
        sameAs: [site.github],
        brand: { "@id": brandId },
      },
      {
        "@type": "Brand",
        "@id": brandId,
        name: site.name,
        url: site.url,
        description: "The professional development brand and portfolio of Obafemi Precious.",
      },
      {
        "@type": "WebSite",
        "@id": site.url + "/#website",
        name: site.name,
        url: site.url,
        publisher: { "@id": personId },
        inLanguage: "en",
      },
    ],
  };
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="gJ9g-p1bH9StWy_fQFx5LgsobjJZEKo1foxF2qzfno8" />
      </head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
