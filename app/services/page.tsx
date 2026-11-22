import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Web Development & Software Services",
  description: "Explore the development work OBAFEMIX can help with: frontend web applications, API integration, backend development and turning product ideas into working software.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Development Services | OBAFEMIX", description: "Frontend development, API integration and backend implementation by Obafemi Precious.", url: "/services", type: "website" },
};

const services = [
  { title: "Frontend web development", detail: "Building responsive web interfaces that make products clear and usable across phones, tablets and desktops." },
  { title: "API integration", detail: "Connecting frontend applications to backend services and APIs, handling data flow and practical application states." },
  { title: "Backend development", detail: "Working on the server-side foundations behind applications, including routes, application logic and data connections." },
  { title: "Product implementation", detail: "Helping turn a defined idea into a working web product through focused implementation and iterative improvements." },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#05010f] text-white">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="font-display text-sm font-extrabold tracking-widest text-violet-200">OBAFEMIX</Link>
        <p className="eyebrow mt-16">DEVELOPMENT SERVICES</p>
        <h1 className="font-display mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">Practical software development, <span className="text-gradient">built around your idea.</span></h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/70">I&apos;m a student developer based in Lagos, Nigeria. I&apos;m open to suitable collaborations and scoped projects where I can contribute to building web applications and connecting the systems behind them.</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => (
            <article key={service.title} className="glass rounded-2xl p-6">
              <p className="font-mono text-xs tracking-[.25em] text-violet-300">0{index + 1}</p>
              <h2 className="font-display mt-3 text-xl font-bold">{service.title}</h2>
              <p className="mt-3 leading-relaxed text-white/65">{service.detail}</p>
            </article>
          ))}
        </div>
        <section className="mt-14 max-w-3xl space-y-4 leading-relaxed text-white/65">
          <h2 className="font-display text-2xl font-bold text-white">A clear and honest process</h2>
          <p>Every project starts with understanding the problem, agreeing on a realistic scope and identifying the technical work involved. I communicate what I can take on, what needs further research and what should be handled by a more experienced specialist.</p>
          <p>I don&apos;t present myself as an agency or claim a track record I haven&apos;t earned. If the project is a good fit, we can define a practical first milestone and work from there.</p>
        </section>
        <div className="mt-12 flex flex-wrap gap-3">
          <a href={`mailto:${site.email}?subject=${encodeURIComponent("Development project enquiry")}`} className="btn-primary-glow rounded-full px-6 py-3 font-semibold">Discuss a project</a>
          <Link href="/projects" className="rounded-full border border-violet-300/30 px-6 py-3 font-semibold text-violet-100 hover:bg-violet-500/10">See selected work</Link>
        </div>
      </div>
    </main>
  );
}
