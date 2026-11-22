import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Software Projects & Portfolio",
  description: "Explore selected software projects by Obafemi Precious under OBAFEMIX, including WAZOBIA, an African language technology ecosystem focused on Nigeria.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects | OBAFEMIX", description: "Selected software projects and product work by Obafemi Precious.", url: "/projects", type: "website" },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#05010f] text-white">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="font-display text-sm font-extrabold tracking-widest text-violet-200">OBAFEMIX</Link>
        <p className="eyebrow mt-16">SELECTED WORK</p>
        <h1 className="font-display mt-4 text-4xl font-extrabold sm:text-6xl">Projects that solve <span className="text-gradient">real problems.</span></h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65">I use projects to explore ideas, practise engineering and build useful products. This page highlights work with enough verified detail to explain its purpose and my involvement.</p>
        <article className="glass mt-12 overflow-hidden rounded-3xl">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,.3),transparent_55%)] p-7 sm:p-10">
            <p className="font-mono text-xs tracking-[.25em] text-violet-300">AFRICAN LANGUAGE TECHNOLOGY · 2026</p>
            <h2 className="font-display mt-4 text-3xl font-extrabold sm:text-4xl">WAZOBIA</h2>
            <p className="mt-2 text-violet-200">An African language technology ecosystem</p>
            <p className="mt-5 max-w-3xl leading-relaxed text-white/70">A Nigeria-first project focused on making Yorùbá, Hausa and Igbo more usable in digital experiences, with English as a bridge language. Its product direction brings language learning, translation, pronunciation and cultural preservation into one ecosystem.</p>
            <Link href="/projects/wazobia" className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-200 hover:text-white">Read the WAZOBIA project overview <span aria-hidden>→</span></Link>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 p-7 sm:px-10">
            <p className="text-sm text-white/50">More project case studies will be added as their scope and implementation details are documented.</p>
            <a href={site.github} target="_blank" rel="noreferrer" className="rounded-full border border-violet-300/30 px-5 py-2.5 text-sm font-semibold text-violet-100 hover:bg-violet-500/10">View GitHub</a>
          </div>
        </article>
      </div>
    </main>
  );
}
