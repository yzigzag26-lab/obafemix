"use client";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

/** Opens Gmail's compose window with everything pre-filled (visitor just presses Send in Gmail). */
const gmailCompose = (subject: string, body?: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Project Collaboration", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) errs.message = "Please write a message of at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(gmailCompose(`[Portfolio] ${form.subject}`, body), "_blank", "noopener,noreferrer");
    setStatus("Opening Gmail with your message pre-filled — just press Send in Gmail. If nothing opened, allow pop-ups for this site or write to me directly at yzigzag26@gmail.com");
  };
  const field = (k: keyof typeof form) => ({
    value: form[k], "aria-invalid": !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value }),
  });
  const rows = [
    { icon: Mail, label: "EMAIL", value: site.email, href: gmailCompose("Hello OBAFEMIX") },
    { icon: Github, label: "GITHUB", value: site.githubLabel, href: site.github },
    { icon: MapPin, label: "LOCATION", value: site.location, href: site.maps },
  ];
  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0 bg-[url('/assets/contact-bg.webp')] bg-cover opacity-20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05010f] via-[#05010f]/85 to-[#05010f]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{"// 04. CONTACT"}</p>
          <h2 className="font-display mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">Let&apos;s Build <span className="text-gradient">Something Amazing</span> Together.</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="leading-relaxed text-white/70">Have a project idea, collaboration opportunity, or just want to connect? I&apos;d love to hear from you. Whether it&apos;s about full-stack web apps, backend systems, or something exciting — let&apos;s turn ideas into reality.</p>
            <div className="mt-8 space-y-3">
              {rows.map(r => (
                <a key={r.label} href={r.href} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="glass card-lift flex items-center gap-4 rounded-2xl p-4">
                  <span className="rounded-xl bg-violet-500/20 p-3 text-violet-200"><r.icon size={20} /></span>
                  <span className="flex-1"><span className="block font-mono text-[10px] tracking-[.25em] text-violet-300/80">{r.label}</span><span className="block font-medium">{r.value}</span></span>
                  <ArrowUpRight className="text-white/40" size={18} />
                </a>
              ))}
              <div className="glass flex cursor-not-allowed items-center gap-4 rounded-2xl p-4 opacity-60" title="Coming soon">
                <span className="rounded-xl bg-violet-500/20 p-3 text-violet-200"><Linkedin size={20} /></span>
                <span className="flex-1"><span className="block font-mono text-[10px] tracking-[.25em] text-violet-300/80">LINKEDIN</span><span className="block font-medium">Coming soon — being set up</span></span>
                <span className="chip text-[10px]">SOON</span>
              </div>
            </div>
            <p className="font-hand mt-6 text-2xl text-violet-200">Let&apos;s turn ideas into reality.</p>
          </Reveal>
          <Reveal>
            <form onSubmit={submit} noValidate className="glass rounded-3xl p-6 sm:p-8">
              <p className="eyebrow">SEND A MESSAGE</p>
              <h3 className="font-display mt-2 text-3xl font-bold text-white">I&apos;m all ears!</h3>
              <p className="mt-2 text-sm text-white/60">Fill out the form below and I&apos;ll get back to you as soon as possible.</p>
              <div className="mt-6 space-y-4">
                <div><label htmlFor="c-name" className="mb-1.5 block text-sm">Your Name</label><input id="c-name" className="input-dark" placeholder="Your name" {...field("name")} />{errors.name && <p role="alert" className="mt-1 text-sm text-red-300">{errors.name}</p>}</div>
                <div><label htmlFor="c-email" className="mb-1.5 block text-sm">Your Email</label><input id="c-email" type="email" className="input-dark" placeholder="you@example.com" {...field("email")} />{errors.email && <p role="alert" className="mt-1 text-sm text-red-300">{errors.email}</p>}</div>
                <div><label htmlFor="c-subject" className="mb-1.5 block text-sm">Subject</label>
                  <select id="c-subject" className="input-dark" {...field("subject")}>
                    {["Project Collaboration", "Job Opportunity", "Freelance Work", "General Question"].map(s => <option key={s} className="bg-[#0d0724]">{s}</option>)}
                  </select></div>
                <div><label htmlFor="c-msg" className="mb-1.5 block text-sm">Message</label><textarea id="c-msg" rows={5} className="input-dark" placeholder="Tell me about your idea…" {...field("message")} />{errors.message && <p role="alert" className="mt-1 text-sm text-red-300">{errors.message}</p>}</div>
              </div>
              <button type="submit" className="btn-primary-glow shimmer-sweep mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold"><Send size={17} /> Send Message</button>
              {status && <p role="status" className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{status}</p>}
              <div className="mt-6 flex items-center gap-3 text-white/40"><span className="h-px flex-1 bg-violet-300/15" /><span className="font-mono text-[10px] tracking-[.2em]">OTHER WAYS TO CONNECT</span><span className="h-px flex-1 bg-violet-300/15" /></div>
              <div className="mt-4 flex justify-center gap-3">
                <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass rounded-full p-3 hover:shadow-[0_0_20px_rgba(139,92,246,.6)]"><Github size={18} /></a>
                <span title="Coming soon" className="glass cursor-not-allowed rounded-full p-3 opacity-50" aria-disabled="true"><Linkedin size={18} /></span>
              </div>
              <p className="mt-4 text-center text-xs text-white/40">Pressing Send opens Gmail with your message pre-filled (to, subject and message) — you review it and press Send there. Nothing is sent until you do.</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
