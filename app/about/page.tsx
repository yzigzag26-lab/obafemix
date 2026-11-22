import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Obafemi Precious",
  description: "Meet Obafemi Precious, the student developer behind OBAFEMIX. Based in Lagos State, Nigeria, focused on building web applications, API integrations and backend systems.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About Obafemi Precious | OBAFEMIX", description: "The person behind OBAFEMIX — a student developer building practical software and web applications.", url: "/about", type: "profile" },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "About Obafemi Precious",
    url: site.url + "/about",
    mainEntity: { "@id": site.url + "/#person" },
  };
  return (
    <main className="min-h-screen bg-[#05010f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="font-display text-sm font-extrabold tracking-widest text-violet-200">OBAFEMIX</Link>
        <p className="eyebrow mt-16">ABOUT THE PERSON BEHIND THE BRAND</p>
        <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">I&apos;m Obafemi Precious.<br /><span className="text-gradient">I build solutions for a better tomorrow.</span></h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/70">OBAFEMIX is my professional brand. I&apos;m the student developer behind it, based in Lagos State, Nigeria, learning by building and turning ideas into real-world applications.</p>
        <section className="mt-14 space-y-5 leading-relaxed text-white/70">
          <h2 className="font-display text-2xl font-bold text-white">What I work on</h2>
          <p>My work centres on building complete web applications, connecting frontend interfaces to APIs, and developing the backend systems that support useful products. I enjoy understanding how the pieces of a product fit together — from the user experience to the data and services behind it.</p>
          <p>I&apos;m still developing my craft, and I prefer to be honest about that. I approach projects as opportunities to learn, test ideas, solve problems and improve the quality of what I ship.</p>
          <h2 className="font-display pt-5 text-2xl font-bold text-white">The name OBAFEMIX</h2>
          <p>OBAFEMIX is the name I use for my professional work and public portfolio. Linuxboss is a secondary nickname; the work and professional identity are presented under OBAFEMIX.</p>
          <h2 className="font-display pt-5 text-2xl font-bold text-white">Based in Nigeria, building for a wider audience</h2>
          <p>I&apos;m based in Lagos State, Nigeria, and interested in working with people and teams locally and internationally. My focus is practical software: clear interfaces, connected systems and products built around real needs.</p>
        </section>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/projects" className="btn-primary-glow rounded-full px-6 py-3 font-semibold">Explore my projects</Link>
          <Link href="/services" className="rounded-full border border-violet-300/30 px-6 py-3 font-semibold text-violet-100 hover:bg-violet-500/10">Explore development services</Link>
        </div>
        <p className="mt-16 border-t border-white/10 pt-6 text-sm text-white/40">Lagos State, Nigeria · <a className="text-violet-300 hover:underline" href={site.github} target="_blank" rel="noreferrer">GitHub</a></p>
      </div>
    </main>
  );
}
