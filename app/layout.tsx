import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/caveat/600.css";
import "./globals.css";
const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: "OBAFEMIX — I build solutions for a better tomorrow", template: "%s — OBAFEMIX" },
  description: "OBAFEMIX — student & full-stack developer in Lagos State, Nigeria. I build complete web apps, connect frontends to APIs, and ship backend systems.",
  openGraph: { title: "OBAFEMIX — I build solutions for a better tomorrow", description: "Student & full-stack developer based in Lagos State, Nigeria.", images: ["/assets/obafemix-og.webp"], type: "website" },
  twitter: { card: "summary_large_image", title: "OBAFEMIX", description: "I build solutions for a better tomorrow.", images: ["/assets/obafemix-og.webp"] },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" as const, themeColor: "#05010f" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Person", name: "OBAFEMIX", alternateName: "Linuxboss", jobTitle: "Full-Stack Developer", address: { "@type": "PostalAddress", addressRegion: "Lagos State", addressCountry: "NG" }, sameAs: ["https://github.com/yzigzag26-lab"], email: "mailto:yzigzag26@gmail.com" },
      { "@type": "WebSite", name: "OBAFEMIX", url: base },
    ],
  };
  return (
    <html lang="en">
      <body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body>
    </html>
  );
}
