import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "WAZOBIA — African Language Technology Project",
  description: "WAZOBIA is a Nigeria-first African language technology ecosystem by Obafemi Precious, focused on Yorùbá, Hausa and Igbo learning, translation, pronunciation and cultural preservation.",
  alternates: { canonical: "/projects/wazobia" },
  openGraph: { title: "WAZOBIA | OBAFEMIX Project", description: "An African language technology ecosystem — Nigeria first, built for Africa.", url: "/projects/wazobia", type: "article" },
};

export default function WazobiaProjectPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "WAZOBIA",
    description: "A Nigeria-first African language technology ecosystem focused on Yorùbá, Hausa and Igbo.",
    url: site.url + "/projects/wazobia",
    creator: { "@id": site.url + "/#person" },
    inLanguage: "en",
    dateCreated: "2026",
  };
  return (
    <main className="min-h-screen bg-[#05010f] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/projects" className="text-sm text-violet-300 hover:text-white">← All projects</Link>
        <p className="eyebrow mt-16">PROJECT OVERVIEW · AFRICAN LANGUAGE TECHNOLOGY</p>
        <h1 className="font-display mt-4 text-5xl font-extrabold sm:text-7xl">WAZOBIA<span className="text-gradient">.</span></h1>
        <p className="mt-5 text-xl text-violet-200">An African language technology ecosystem — Nigeria first, built for Africa.</p>
        <p className="mt-7 text-lg leading-relaxed text-white/70">WAZOBIA is a project exploring how African languages can become easier to learn, use and preserve through digital tools. Its Nigerian foundation centres on Yorùbá, Igbo and Hausa, with English serving as a bridge language.</p>
        <section className="mt-14 space-y-5 leading-relaxed text-white/70">
          <h2 className="font-display text-2xl font-bold text-white">The problem it explores</h2>
          <p>Language technology is not equally available across the world&apos;s languages. WAZOBIA is being shaped around the need for African-language experiences that support everyday use, learning and cultural continuity — rather than treating these languages as an afterthought.</p>
          <h2 className="font-display pt-5 text-2xl font-bold text-white">The product direction</h2>
          <p>The ecosystem brings several related capabilities into one product direction: language learning, translation, pronunciation support, dictionary experiences, community participation and cultural preservation. The first phase is focused on Nigerian languages before considering wider African-language expansion.</p>
          <h2 className="font-display pt-5 text-2xl font-bold text-white">My involvement</h2>
          <p>My role on WAZOBIA is full-stack product development. The work documented for this project includes frontend development, backend development, API integration and product architecture. The project is an evolving build, so this overview describes its purpose and direction rather than claiming that every planned capability is already complete.</p>
          <h2 className="font-display pt-5 text-2xl font-bold text-white">Technology</h2>
          <p>The project record identifies React, TypeScript and Vercel in its current stack. The implementation may evolve as the product develops.</p>
        </section>
        <div className="mt-12 flex flex-wrap gap-3">
          <a href={site.wazobia} target="_blank" rel="noreferrer" className="btn-primary-glow rounded-full px-6 py-3 font-semibold">Visit WAZOBIA</a>
          <a href={site.github} target="_blank" rel="noreferrer" className="rounded-full border border-violet-300/30 px-6 py-3 font-semibold text-violet-100 hover:bg-violet-500/10">GitHub profile</a>
        </div>
        <p className="mt-16 border-t border-white/10 pt-6 text-sm text-white/40">A project by Obafemi Precious · OBAFEMIX</p>
      </div>
    </main>
  );
}
