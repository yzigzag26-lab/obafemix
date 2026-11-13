"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Send, Sparkles, User } from "lucide-react";
import { site } from "@/lib/site";
import { SKILLS } from "@/lib/skills";

/** Gemini-style four-point star (the Gemini AI mark) with its blue→purple gradient. */
export function GeminiStar({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="Gemini AI star" className={className}>
      <defs>
        <linearGradient id="gemini-star-g" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1ba0e0" />
          <stop offset="0.45" stopColor="#5f7bf0" />
          <stop offset="0.75" stopColor="#9b5cf5" />
          <stop offset="1" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path d="M12 1.5c.9 5.8 4.7 9.6 10.5 10.5-5.8.9-9.6 4.7-10.5 10.5C11.1 16.7 7.3 12.9 1.5 12 7.3 11.1 11.1 7.3 12 1.5Z" fill="url(#gemini-star-g)" />
    </svg>
  );
}

type Msg = { from: "bot" | "user"; text: string };

const WELCOME: Msg = { from: "bot", text: "Hi! I'm the OBAFEMIX site assistant. Ask me about OBAFEMIX, WAZOBIA, his skills, projects — or how to get in touch." };
const QUICK = ["Tell me about WAZOBIA", "What are his top skills?", "How can I contact him?", "What does he build?"];

function answer(raw: string): string {
  const q = raw.toLowerCase();
  if (/(wazobia|language|yoruba|hausa|igbo)/.test(q))
    return "WAZOBIA is OBAFEMIX's flagship product — an African language technology ecosystem, Nigeria-first. It makes Yorùbá, Hausa and Igbo fully usable in everyday digital tools: translation, structured learning, pronunciation and cultural preservation, with English as a bridge. It's live at wazobia-omega.vercel.app — scroll to Projects and hit “Visit Live Website”.";
  if (/(skill|toolbox|tech|stack|percent|best|top)/.test(q)) {
    const top = [...SKILLS].sort((a, b) => b.percent - a.percent).slice(0, 5).map((s) => `${s.name} (${s.percent}%)`).join(", ");
    return `His strongest tools right now: ${top}. The full My Toolbox section lists ${SKILLS.length} skills with animated percentage bars across Programming, Frontend, Backend, API, AI, Data, Dev Tools and more — scroll to Skills to explore by category.`;
  }
  if (/(contact|email|reach|hire|touch|message)/.test(q))
    return `You can reach OBAFEMIX at ${site.email} — or use the contact form in the Contact section (it opens your mail app with the message pre-filled, no server in between). He's open to collaborations, interesting projects and exciting opportunities.`;
  if (/(project|build|work|portfolio)/.test(q))
    return "He builds complete web applications — frontends connected to APIs, plus the backend systems behind them — always turning ideas into working software, not prototypes. His featured project is WAZOBIA (React · TypeScript · Vercel). The Projects section shows every project in detail, and he can add more from /admin.";
  if (/(who|about|obafemix|linuxboss|developer)/.test(q))
    return "OBAFEMIX is a student & full-stack developer based in Lagos State, Nigeria, and Founder & Primary Developer of WAZOBIA. “Linuxboss” is what the tech streets call him — OBAFEMIX is the name on everything he ships. His headline: “I build solutions for a better tomorrow.”";
  if (/(where|location|lagos|nigeria)/.test(q))
    return "He's based in Lagos State, Nigeria (WAT timezone) — and available for remote collaboration anywhere. Use the Let's Connect button or the contact form to start a conversation.";
  if (/(hello|hi|hey|yo)\b/.test(q))
    return "Hello! Ask me about WAZOBIA, his skills and percentages, his projects, or how to contact him.";
  if (/(price|cost|rate|charge)/.test(q))
    return "Pricing depends on the project — the honest answer is to ask him directly. Email yzigzag26@gmail.com with what you're building and he'll take it from there.";
  return "I can answer questions about OBAFEMIX, WAZOBIA, his skills (with percentages), his projects, his location, and how to contact him. Try one of the quick prompts — or ask in your own words.";
}

/**
 * AI assistant — in-flow section (NOT floating, never overlaps content).
 * Sits between Contact and Footer; clicking the Gemini star expands
 * the chat interface inline inside the card.
 */
export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", text: answer(t) }]); setTyping(false); }, 650);
  };

  return (
    <section id="assistant" aria-label="AI assistant" className="relative py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="glass overflow-hidden rounded-3xl">
          {/* Header — click the Gemini star (or anywhere here) to open/close the chat */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="ai-chat-panel"
            className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-violet-500/10"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/20 bg-[#0d0724] shadow-[0_0_28px_rgba(95,123,240,0.35)]">
              <GeminiStar size={30} className={open ? "" : "animate-pulse"} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-lg font-bold text-white">
                Ask the <span className="text-gradient">AI Assistant</span>
              </span>
              <span className="block text-sm text-white/55">
                Powered by the Gemini star — ask about OBAFEMIX, WAZOBIA, skills & projects.
              </span>
              <span className="mt-1 block text-[11px] font-medium text-emerald-300">● Online — answers from this site</span>
            </span>
            <ChevronDown aria-hidden className={`h-5 w-5 shrink-0 text-violet-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Chat interface — expands inline, in the page flow */}
          {open && (
            <div id="ai-chat-panel" className="border-t border-violet-300/15">
              <div ref={scrollRef} className="h-[380px] space-y-3 overflow-y-auto px-5 py-5 sm:px-6" aria-live="polite">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex items-end gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                    <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.from === "bot" ? "border border-violet-300/20 bg-[#0d0724]" : "bg-white/10 text-white/70"}`}>
                      {m.from === "bot" ? <GeminiStar size={14} /> : <User className="h-3.5 w-3.5" />}
                    </span>
                    <p className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "bot" ? "rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 text-white/85" : "btn-primary-glow rounded-br-md text-white"}`}>{m.text}</p>
                  </div>
                ))}
                {typing && (
                  <div className="flex items-end gap-2">
                    <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-300/20 bg-[#0d0724]"><GeminiStar size={14} /></span>
                    <p className="rounded-2xl rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 px-4 py-3" aria-label="Assistant is typing">
                      <span className="flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300" style={{ animationDelay: `${d * 150}ms` }} />)}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto px-5 pb-2 sm:px-6">
                {QUICK.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)} className="chip shrink-0 text-xs transition hover:border-violet-300/60 hover:bg-violet-500/20">{q}</button>
                ))}
              </div>

              <form className="flex gap-2 border-t border-violet-300/15 p-4" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <label htmlFor="ai-input" className="sr-only">Ask the assistant</label>
                <input id="ai-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about OBAFEMIX…" className="input-dark !rounded-full" autoComplete="off" />
                <button type="submit" disabled={!input.trim() || typing} aria-label="Send message" className="btn-primary-glow flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full disabled:opacity-40"><Send className="h-[18px] w-[18px]" /></button>
              </form>
              <p className="flex items-center justify-center gap-1.5 px-4 pb-4 text-center text-[10px] leading-relaxed text-white/40">
                <Sparkles className="h-3 w-3 shrink-0" /> On-device assistant — answers from this site&apos;s content, nothing is sent to a server.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
