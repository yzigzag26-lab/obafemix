"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

type Draft = typeof defaults;
const defaults = {
  bio: "I'm OBAFEMIX — a student developer and full-stack developer based in Lagos State, Nigeria. Founder & Primary Developer of WAZOBIA.",
  location: "Lagos State, Nigeria", availability: "Open to opportunities",
  headline: "I build solutions for a better tomorrow.",
  titles: ["Student Developer", "Full-Stack Developer", "Software Developer", "Technology Entrepreneur"],
  skills: [
    { name: "HTML", level: "Intermediate" }, { name: "CSS", level: "Intermediate" }, { name: "JavaScript", level: "Beginner–Intermediate" },
    { name: "TypeScript", level: "Beginner–Intermediate" }, { name: "React", level: "Beginner–Intermediate" }, { name: "Node.js", level: "Beginner" },
  ] as { name: string; level: string }[],
  project: { name: "WAZOBIA", url: "https://wazobia-omega.vercel.app/", contributions: "Frontend Development, Backend Development, API Integration, Product Architecture, Product Development", description: "WAZOBIA is an African language technology ecosystem — Nigeria first, built for Africa." },
  email: "yzigzag26@gmail.com", phone: "", contactLocation: "Lagos State, Nigeria", timezone: "Africa/Lagos (WAT)",
  github: "https://github.com/yzigzag26-lab", linkedin: "", linkedinPublished: false, wazobiaUrl: "https://wazobia-omega.vercel.app/",
  metaTitle: "OBAFEMIX — I build solutions for a better tomorrow", metaDescription: "OBAFEMIX — student & full-stack developer in Lagos State, Nigeria. Founder & Primary Developer of WAZOBIA, the African Language Ecosystem.", keywords: "OBAFEMIX, full-stack developer, Lagos, WAZOBIA", themeColor: "#05010f", ogImage: "/assets/obafemix.png",
};
const LEVELS = ["Beginner", "Beginner–Intermediate", "Intermediate"];
const panels = ["Overview", "About Me", "Professional Titles", "Skills & Levels", "Featured Project", "Profile Image", "Contact Info", "Social Links", "Site Metadata"] as const;

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<(typeof panels)[number]>("Overview");
  const [draft, setDraft] = useState<Draft>(defaults);
  const [savedAt, setSavedAt] = useState("");
  const [imgPreview, setImgPreview] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" });

  useEffect(() => {
    if (sessionStorage.getItem("obafemixAdminPreview") !== "1") { router.replace("/admin"); return; }
    try { const raw = localStorage.getItem("obafemix.adminDraft"); if (raw) setDraft({ ...defaults, ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, [router]);

  const save = () => { localStorage.setItem("obafemix.adminDraft", JSON.stringify(draft)); setSavedAt(new Date().toLocaleTimeString()); };
  const reset = () => { setDraft(defaults); localStorage.removeItem("obafemix.adminDraft"); setSavedAt(""); };
  const signOut = () => { sessionStorage.removeItem("obafemixAdminPreview"); router.push("/admin"); };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft(d => ({ ...d, [k]: v }));
  if (!ready) return <main className="flex min-h-screen items-center justify-center text-white/60">Checking preview session…</main>;

  const label = "mb-1.5 block text-sm font-medium text-white/80";
  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-violet-300/10 bg-[#05010f]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Logo size={36} /><span className="font-display font-extrabold">OBAFEMIX</span><span className="chip text-[10px]">ADMIN</span>
          <span className="flex-1" />
          {savedAt && <span className="text-xs text-emerald-300">Saved {savedAt}</span>}
          <button onClick={save} className="btn-primary-glow rounded-full px-4 py-2 text-sm font-semibold">Save</button>
          <button onClick={reset} className="rounded-full border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/15">Reset</button>
          <Link href="/" className="rounded-full border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/15">View site</Link>
          <button onClick={signOut} className="rounded-full border border-red-300/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/15">Sign out</button>
        </div>
        <div className="border-t border-amber-300/20 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">Frontend preview only — edits persist to this browser&apos;s localStorage (&quot;obafemix.adminDraft&quot;). Nothing hits any server; real auth &amp; database (Supabase) land in the backend phase.</div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Admin panels">
          {panels.map(p => <button key={p} onClick={() => setPanel(p)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm transition ${panel === p ? "btn-primary-glow" : "glass text-white/70 hover:text-white"}`}>{p}</button>)}
        </nav>
        <div className="glass rounded-3xl p-6 sm:p-8">
          {panel === "Overview" && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">Overview</h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">{[["16", "Technologies"], ["1", "Flagship Product"], ["9", "Admin Panels"]].map(([n, l]) => <div key={l} className="rounded-2xl border border-violet-300/15 p-5"><p className="font-display text-2xl font-extrabold text-violet-200">{n}</p><p className="text-sm text-white/55">{l}</p></div>)}</div>
              <div className="mt-6 rounded-2xl border border-violet-300/15 p-5"><p className="font-display font-bold">WAZOBIA — Flagship</p><p className="mt-1 text-sm text-white/60">{draft.project.description}</p><a href={draft.project.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-violet-300">Visit live site →</a></div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Build checklist</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/70">{["Hero video + navbar avatar live", "About crown emblem (no portrait)", "One featured project: WAZOBIA", "Contact form via mailto (no backend)", "Real auth (Supabase) — backend phase"].map(i => <li key={i}>✓ {i}</li>)}</ul>
            </div>
          )}
          {panel === "About Me" && (
            <div className="space-y-4"><h1 className="font-display text-3xl font-extrabold">About Me</h1>
              <div><label className={label}>Bio</label><textarea rows={4} className="input-dark" value={draft.bio} onChange={e => set("bio", e.target.value)} /></div>
              <div><label className={label}>Location</label><input className="input-dark" value={draft.location} onChange={e => set("location", e.target.value)} /></div>
              <div><label className={label}>Availability</label><input className="input-dark" value={draft.availability} onChange={e => set("availability", e.target.value)} /></div>
              <div><label className={label}>Headline</label><input className="input-dark" value={draft.headline} onChange={e => set("headline", e.target.value)} /></div>
            </div>
          )}
          {panel === "Professional Titles" && (
            <div><h1 className="font-display text-3xl font-extrabold">Professional Titles</h1><p className="mt-1 text-sm text-white/55">{draft.titles.length}/6 — these cycle in the hero typing line.</p>
              <ul className="mt-4 space-y-2">{draft.titles.map((t, i) => <li key={t} className="flex items-center gap-2 rounded-xl border border-violet-300/15 px-4 py-2.5"><span className="flex-1">{t}</span><button onClick={() => set("titles", draft.titles.filter((_, j) => j !== i))} className="text-sm text-red-300">Remove</button></li>)}</ul>
              <div className="mt-4 flex gap-2"><input className="input-dark" placeholder="New title" value={newTitle} onChange={e => setNewTitle(e.target.value)} /><button disabled={draft.titles.length >= 6 || !newTitle.trim()} onClick={() => { set("titles", [...draft.titles, newTitle.trim()]); setNewTitle(""); }} className="btn-primary-glow whitespace-nowrap rounded-xl px-4 text-sm font-semibold disabled:opacity-40">Add</button></div>
            </div>
          )}
          {panel === "Skills & Levels" && (
            <div><h1 className="font-display text-3xl font-extrabold">Skills &amp; Levels</h1><p className="mt-1 text-sm text-white/55">Honest levels only — Beginner / Beginner–Intermediate / Intermediate.</p>
              <ul className="mt-4 space-y-2">{draft.skills.map((s, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-300/15 px-4 py-2.5">
                  <input className="input-dark !w-auto flex-1" value={s.name} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                  <select className="input-dark !w-auto" value={s.level} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, level: e.target.value } : x))}>{LEVELS.map(l => <option key={l} className="bg-[#0d0724]">{l}</option>)}</select>
                  <button onClick={() => set("skills", draft.skills.filter((_, j) => j !== i))} className="text-sm text-red-300">Remove</button>
                </li>))}</ul>
              <div className="mt-4 flex flex-wrap gap-2"><input className="input-dark !w-auto flex-1" placeholder="New skill" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} />
                <select className="input-dark !w-auto" value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}>{LEVELS.map(l => <option key={l} className="bg-[#0d0724]">{l}</option>)}</select>
                <button disabled={!newSkill.name.trim()} onClick={() => { set("skills", [...draft.skills, newSkill]); setNewSkill({ name: "", level: "Beginner" }); }} className="btn-primary-glow rounded-xl px-4 text-sm font-semibold disabled:opacity-40">Add</button></div>
            </div>
          )}
          {panel === "Featured Project" && (
            <div className="space-y-4"><h1 className="font-display text-3xl font-extrabold">Featured Project</h1><p className="text-sm text-white/55">Fixed to exactly one project by design.</p>
              <div><label className={label}>Name</label><input className="input-dark" value={draft.project.name} onChange={e => set("project", { ...draft.project, name: e.target.value })} /></div>
              <div><label className={label}>Live URL</label><input className="input-dark" value={draft.project.url} onChange={e => set("project", { ...draft.project, url: e.target.value })} /></div>
              <div><label className={label}>Description</label><textarea rows={3} className="input-dark" value={draft.project.description} onChange={e => set("project", { ...draft.project, description: e.target.value })} /></div>
              <div><label className={label}>Contributions</label><textarea rows={2} className="input-dark" value={draft.project.contributions} onChange={e => set("project", { ...draft.project, contributions: e.target.value })} /></div>
            </div>
          )}
          {panel === "Profile Image" && (
            <div><h1 className="font-display text-3xl font-extrabold">Profile Image</h1><p className="mt-1 text-sm text-white/55">Preview only — uses a temporary object URL, nothing is uploaded.</p>
              <input type="file" accept="image/*" className="input-dark mt-4" onChange={e => { const f = e.target.files?.[0]; if (f) setImgPreview(URL.createObjectURL(f)); }} />
              {imgPreview && <img src={imgPreview} alt="Profile preview" className="mt-4 h-40 w-40 rounded-full object-cover object-[50%_15%] ring-2 ring-violet-400/60" />}
            </div>
          )}
          {panel === "Contact Info" && (
            <div className="space-y-4"><h1 className="font-display text-3xl font-extrabold">Contact Info</h1>
              {([["Email", "email"], ["Phone", "phone"], ["Location", "contactLocation"], ["Timezone", "timezone"]] as const).map(([l, k]) => (
                <div key={k}><label className={label}>{l}</label><input className="input-dark" value={draft[k]} onChange={e => set(k, e.target.value)} /></div>
              ))}
            </div>
          )}
          {panel === "Social Links" && (
            <div className="space-y-4"><h1 className="font-display text-3xl font-extrabold">Social Links</h1>
              <div><label className={label}>GitHub</label><input className="input-dark" value={draft.github} onChange={e => set("github", e.target.value)} /></div>
              <div><label className={label}>LinkedIn URL</label><input className="input-dark" placeholder="Not set up yet" value={draft.linkedin} onChange={e => set("linkedin", e.target.value)} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.linkedinPublished} onChange={e => set("linkedinPublished", e.target.checked)} className="h-4 w-4 accent-violet-500" /> LinkedIn published (turn off to show &quot;Coming soon&quot;)</label>
              <div><label className={label}>WAZOBIA URL</label><input className="input-dark" value={draft.wazobiaUrl} onChange={e => set("wazobiaUrl", e.target.value)} /></div>
            </div>
          )}
          {panel === "Site Metadata" && (
            <div className="space-y-4"><h1 className="font-display text-3xl font-extrabold">Site Metadata</h1>
              <div><label className={label}>Title</label><input className="input-dark" value={draft.metaTitle} onChange={e => set("metaTitle", e.target.value)} /></div>
              <div><label className={label}>Description ({draft.metaDescription.length}/160)</label><textarea rows={3} maxLength={200} className="input-dark" value={draft.metaDescription} onChange={e => set("metaDescription", e.target.value)} /></div>
              <div><label className={label}>Keywords</label><input className="input-dark" value={draft.keywords} onChange={e => set("keywords", e.target.value)} /></div>
              <div><label className={label}>Theme color</label><input type="color" value={draft.themeColor} onChange={e => set("themeColor", e.target.value)} className="h-11 w-20 cursor-pointer rounded-lg border border-violet-300/20 bg-transparent" /></div>
              <div><label className={label}>OG image path</label><input className="input-dark" value={draft.ogImage} onChange={e => set("ogImage", e.target.value)} /></div>
            </div>
          )}
          <p className="mt-8 border-t border-violet-300/10 pt-4 text-xs text-white/40">Draft edits live in localStorage only. Press <strong>Save</strong> (top bar) to persist{savedAt ? ` — last saved ${savedAt}` : ""}.</p>
        </div>
      </div>
    </main>
  );
}
