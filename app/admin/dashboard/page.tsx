"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { CONTRIBUTION_OPTIONS, IMAGE_PRESETS, LOCATION_OPTIONS, PROJECT_CATEGORIES, PROJECT_ROLES, PROJECT_STATUSES, STACK_OPTIONS, YEAR_OPTIONS, defaultProject, emptyProject, type Project } from "@/lib/projects";

type Draft = typeof defaults;
const defaults = {
  bio: "I'm OBAFEMIX — a student developer and full-stack developer based in Lagos State, Nigeria.",
  location: "Lagos State, Nigeria", availability: "Open to opportunities",
  headline: "I build solutions for a better tomorrow.",
  titles: ["Student Developer", "Full-Stack Developer", "Software Developer", "Technology Entrepreneur"],
  skills: [
    { name: "TypeScript", percent: 95, category: "Programming", color: "#3178C6", featured: true },
    { name: "React", percent: 90, category: "Frontend", color: "#61DAFB", featured: true },
    { name: "Git", percent: 95, category: "Developer Tools", color: "#F05032", featured: true },
  ] as { name: string; percent: number; category: string; color: string; featured: boolean }[],
  project: { name: "WAZOBIA", url: "https://wazobia-omega.vercel.app/", contributions: "Frontend Development, Backend Development, API Integration, Product Architecture, Product Development", description: "WAZOBIA is an African language technology ecosystem — Nigeria first, built for Africa." },
  projects: [defaultProject] as Project[],
  email: "yzigzag26@gmail.com", phone: "", contactLocation: "Lagos State, Nigeria", timezone: "Africa/Lagos (WAT)",
  github: "https://github.com/yzigzag26-lab", linkedin: "", linkedinPublished: false, wazobiaUrl: "https://wazobia-omega.vercel.app/",
  metaTitle: "OBAFEMIX — I build solutions for a better tomorrow", metaDescription: "OBAFEMIX — student & full-stack developer in Lagos State, Nigeria.", keywords: "OBAFEMIX, full-stack developer, Lagos, WAZOBIA", themeColor: "#05010f", ogImage: "/assets/obafemix.png",
};
const LEVELS = ["Beginner", "Beginner–Intermediate", "Intermediate"];
const panels = ["Overview", "About Me", "Professional Titles", "Skills & Levels", "Projects", "Messages", "Profile Image", "Contact Info", "Social Links", "Site Metadata"] as const;

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<(typeof panels)[number]>("Overview");
  const [draft, setDraft] = useState<Draft>(defaults);
  const [savedAt, setSavedAt] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [toast, setToast] = useState("");
  const [errorKind, setErrorKind] = useState<"unreachable" | "rejected">("unreachable");
  const [dirty, setDirty] = useState(false);
  const baseline = useRef("");       // JSON of the draft as loaded / last successfully saved
  const hydrated = useRef(false);    // true once the initial API+local load has finished
  const draftRef = useRef<Draft | null>(null);
  const [imgPreview, setImgPreview] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSkill, setNewSkill] = useState({ name: "", percent: 50, category: "Frontend", color: "#a78bfa", featured: false });
  const serverSkillIds = useRef<string[]>([]);
  const [messages, setMessages] = useState<{ id: string; name: string; email: string; subject: string; message: string; readAt: string | null; createdAt: string }[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Project>(emptyProject);
  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({});
  const [customStack, setCustomStack] = useState("");
  const [imageMode, setImageMode] = useState<string>(emptyProject.image);
  const [imgBusy, setImgBusy] = useState(false);
  const [imgMsg, setImgMsg] = useState("");

  const [apiProjectsLoaded, setApiProjectsLoaded] = useState(false);
  const serverProjectIds = useRef<string[]>([]);

  useEffect(() => {
    // Real guard: the API session cookie decides, not a browser flag.
    (async () => {
      try {
        const { apiFetch } = await import("@/lib/api");
        const s = await apiFetch("/auth/session");
        const sj = s.ok ? await s.json() : null;
        if (!sj?.data?.authenticated) { router.replace("/admin"); return; }
        // Projects come from the database now (public read endpoint).
        const pr = await apiFetch("/projects");
        if (pr.ok) {
          const pj = await pr.json();
          if (Array.isArray(pj.data) && pj.data.length) {
            const mapped = pj.data.map((x: Record<string, unknown>) => ({
              id: String(x.id), title: String(x.title), aside: String(x.aside ?? ""), category: String(x.category),
              tags: Array.isArray(x.tags) ? (x.tags as string[]).join(", ") : String(x.tags ?? ""),
              featured: Boolean(x.featured), status: String(x.status) === "in_progress" ? "In Progress" : String(x.status) === "coming_soon" ? "Coming Soon" : String(x.status).charAt(0).toUpperCase() + String(x.status).slice(1),
              description: String(x.description), description2: String(x.description2 ?? ""), role: String(x.role ?? ""),
              contributions: (x.contributions as string[]) ?? [], stack: (x.stack as string[]) ?? [],
              liveUrl: String(x.liveUrl ?? ""), githubUrl: String(x.githubUrl ?? ""),
              image: String(x.image ?? ""), imageAlt: String(x.imageAlt ?? ""), caption: String(x.caption ?? ""),
              location: String(x.location ?? ""), year: String(x.year ?? ""),
            }));
            serverProjectIds.current = mapped.map((m: { id: string }) => m.id);
            setDraft((d) => ({ ...d, projects: mapped }));
          }
          setApiProjectsLoaded(true);
        }
        const sk = await apiFetch("/skills");
        if (sk.ok) {
          const sj = await sk.json();
          if (Array.isArray(sj.data) && sj.data.length) {
            serverSkillIds.current = sj.data.map((x: { id: string }) => x.id);
            setDraft((d) => ({ ...d, skills: sj.data.map((x: Record<string, unknown>) => ({
              name: String(x.name), percent: Number(x.percent), category: String(x.category),
              color: String(x.color ?? "#a78bfa"), featured: Boolean(x.featured),
            })) }));
          }
        }
        const st = await apiFetch("/site");
        if (st.ok) {
          const sd = (await st.json())?.data;
          if (sd) setDraft((d) => ({
            ...d,
            bio: sd.profile?.aboutBio || d.bio,
            headline: sd.profile?.headline || d.headline,
            location: sd.profile?.location || d.location,
            availability: sd.profile?.availability || d.availability,
            titles: Array.isArray(sd.titles) && sd.titles.length ? sd.titles : d.titles,
            metaTitle: sd.settings?.metaTitle || d.metaTitle,
            metaDescription: sd.settings?.metaDescription || d.metaDescription,
            keywords: sd.settings?.keywords || d.keywords,
            themeColor: sd.settings?.themeColor || d.themeColor,
            ogImage: sd.settings?.ogImageUrl || d.ogImage,
            email: sd.settings?.contactEmail || d.email,
            github: sd.socials?.find((s: { platform: string }) => s.platform === "github")?.url || d.github,
            wazobiaUrl: sd.socials?.find((s: { platform: string }) => s.platform === "wazobia")?.url || d.wazobiaUrl,
            linkedin: sd.socials?.find((s: { platform: string }) => s.platform === "linkedin")?.url || d.linkedin,
            linkedinPublished: Boolean(sd.socials?.find((s: { platform: string }) => s.platform === "linkedin")?.published),
          }));
        }
        const ms = await apiFetch("/admin/contact");
        if (ms.ok) { const mj = await ms.json(); if (Array.isArray(mj.data)) setMessages(mj.data); }
        hydrated.current = true;
        if (draftRef.current) { baseline.current = JSON.stringify(draftRef.current); setDirty(false); }
      } catch { router.replace("/admin"); return; }
    })();
    try {
      const raw = localStorage.getItem("obafemix.adminDraft");
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...defaults, ...parsed };
        // Migrate drafts saved before the Projects manager existed.
        if (!Array.isArray(parsed.projects) && parsed.project) {
          merged.projects = [{ ...defaultProject, title: parsed.project.name || defaultProject.title, liveUrl: parsed.project.url || defaultProject.liveUrl, description: parsed.project.description || defaultProject.description, contributions: String(parsed.project.contributions || "").split(",").map((s: string) => s.trim()).filter(Boolean) }];
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from this browser's localStorage after mount (SSR-safe)
        setDraft(merged);
      }
    } catch { /* ignore */ }
    setReady(true);
  }, [router]);

  useEffect(() => {
    draftRef.current = draft;
    if (!hydrated.current) return;
    const snap = JSON.stringify(draft);
    if (!baseline.current) { baseline.current = snap; setDirty(false); return; }
    setDirty(snap !== baseline.current);
  }, [draft]);

  const save = async () => {
    if (saveState === "saving") return; // double-click guard: one save at a time
    setSaveState("saving"); setToast("");
    let apiOk = true;
    let failKind: "unreachable" | "rejected" = "unreachable"; // widened below via markBad closure
    let step = "projects"; // which group of calls is running — reported in the toast if one dies
    let failDetail = "";
    let rejectedDetail = "";
    const markBad = (res?: Response) => { apiOk = false; if (res) { failKind = "rejected"; if (!rejectedDetail) rejectedDetail = `${step} (HTTP ${res.status})`; } };
    // Working copy of the projects — when the server creates a project it hands
    // back a UUID; we ADOPT that id into the draft immediately. That is what
    // makes Save idempotent: a second Save updates (PUT) instead of creating
    // a duplicate (POST).
    const projects = draft.projects.map((x) => ({ ...x }));
    try {
      const { apiFetch, isUuid } = await import("@/lib/api");
      const currentIds = projects.map((x) => x.id).filter(isUuid);
      for (const id of serverProjectIds.current.filter((id) => !currentIds.includes(id))) {
        const res = await apiFetch(`/admin/projects/${id}`, { method: "DELETE" });
        if (res.ok) serverProjectIds.current = serverProjectIds.current.filter((x) => x !== id);
        else markBad(res);
      }
      for (const proj of projects) {
        const body = JSON.stringify(proj);
        if (isUuid(proj.id) && serverProjectIds.current.includes(proj.id)) {
          const res = await apiFetch(`/admin/projects/${proj.id}`, { method: "PUT", body });
          if (!res.ok) markBad(res);
        } else {
          const res = await apiFetch("/admin/projects", { method: "POST", body });
          if (res.ok) {
            const j = await res.json().catch(() => null);
            if (j?.data?.id) {
              proj.id = j.data.id; // adopt the server id -> next Save is an update, not a duplicate create
              if (!serverProjectIds.current.includes(j.data.id)) serverProjectIds.current.push(j.data.id);
            }
          } else markBad(res);
        }
      }
    } catch (e) { markBad(); failDetail = e instanceof Error ? e.message : String(e); console.error("[admin save] failed at step:", step, e); }
    try {
      const { apiFetch: af } = await import("@/lib/api");
      step = "skills";
      const before = await (await af("/skills")).json().catch(() => null);
      const serverNames: string[] = Array.isArray(before?.data) ? before.data.map((x: { name: string }) => x.name) : [];
      for (const name of serverNames.filter((n: string) => !draft.skills.some((s) => s.name === n))) {
        const row = before.data.find((x: { name: string }) => x.name === name);
        if (row?.id) { const r = await af(`/admin/skills/${row.id}`, { method: "DELETE" }); if (!r.ok) markBad(r); }
      }
      for (const s of draft.skills) { const r = await af("/admin/skills", { method: "POST", body: JSON.stringify(s) }); if (!r.ok) markBad(r); } // server upserts by name — safe to repeat
      step = "profile/settings";
      const rp = await af("/admin/profile", { method: "PATCH", body: JSON.stringify({ headline: draft.headline, location: draft.location, availability: draft.availability, aboutBio: draft.bio }) }); if (!rp.ok) markBad(rp);
      const rs = await af("/admin/settings", { method: "PATCH", body: JSON.stringify({ metaTitle: draft.metaTitle, metaDescription: draft.metaDescription, keywords: draft.keywords, themeColor: draft.themeColor, ogImageUrl: draft.ogImage, contactEmail: draft.email }) }); if (!rs.ok) markBad(rs);
      step = "titles";
      const tr = await (await af("/admin/titles")).json().catch(() => null);
      const serverTitles: { id: string; label: string }[] = Array.isArray(tr?.data) ? tr.data : [];
      for (const st2 of serverTitles.filter((x) => !draft.titles.includes(x.label))) { const r = await af(`/admin/titles/${st2.id}`, { method: "DELETE" }); if (!r.ok) markBad(r); }
      for (const label of draft.titles.filter((l) => !serverTitles.some((x) => x.label === l))) { const r = await af("/admin/titles", { method: "POST", body: JSON.stringify({ label }) }); if (!r.ok) markBad(r); }
      step = "socials";
      const g1 = await af("/admin/socials/github", { method: "PUT", body: JSON.stringify({ url: draft.github, published: true }) }); if (!g1.ok) markBad(g1);
      const g2 = await af("/admin/socials/linkedin", { method: "PUT", body: JSON.stringify({ url: draft.linkedin, published: draft.linkedinPublished }) }); if (!g2.ok) markBad(g2);
      const g3 = await af("/admin/socials/wazobia", { method: "PUT", body: JSON.stringify({ url: draft.wazobiaUrl, published: true }) }); if (!g3.ok) markBad(g3);
    } catch (e) { markBad(); failDetail = e instanceof Error ? e.message : String(e); console.error("[admin save] failed at step:", step, e); }
    // Persist the draft WITH the adopted server ids, so a reload + Save still updates instead of duplicating.
    const nextDraft = { ...draft, projects };
    setDraft(nextDraft);
    if (apiOk) { baseline.current = JSON.stringify(nextDraft); setDirty(false); }
    try { localStorage.setItem("obafemix.adminDraft", JSON.stringify(nextDraft)); } catch { /* storage full — DB save above is the source of truth */ }
    setSavedAt(new Date().toLocaleTimeString());
    if (apiOk) { setSaveState("success"); setToast("Saved successfully — everything is in the database."); }
    else if ((failKind as string) === "rejected") { setSaveState("error"); setErrorKind("rejected"); setToast(`The API answered, but one part did not save: ${rejectedDetail || "unknown call"}. Everything else went through — press Save again, and if it repeats, tell me that step name.`); }
    else { setSaveState("error"); setErrorKind("unreachable"); setToast(`Saved in this browser only — the request died at "${step}" (${failDetail || "network error"}), so the database was not updated.`); }
    setTimeout(() => { setSaveState("idle"); setToast(""); }, 4000);
  };
  const reset = () => { setDraft(defaults); localStorage.removeItem("obafemix.adminDraft"); setSavedAt(""); };
  const signOut = async () => {
    try { const { apiFetch } = await import("@/lib/api"); await apiFetch("/auth/logout", { method: "POST" }); } catch { /* still leave */ }
    sessionStorage.removeItem("obafemixAdminPreview");
    router.push("/admin");
  };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft(d => ({ ...d, [k]: v }));
  if (!ready) return <main className="flex min-h-screen items-center justify-center text-white/60">Checking session…</main>;

  const label = "mb-1.5 block text-sm font-medium text-white/80";
  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-violet-300/10 bg-[#05010f]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Logo size={36} /><span className="font-display font-extrabold">OBAFEMIX</span><span className="chip text-[10px]">ADMIN</span>
          <span className="flex-1" />
          {savedAt && <span className="text-xs text-emerald-300">Last saved {savedAt}</span>}
          <button onClick={save} disabled={saveState === "saving" || !dirty} title={dirty ? "Save changes to the database" : "No changes to save"} className="btn-primary-glow inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">{saveState === "saving" ? "Saving…" : saveState === "success" && !dirty ? "✓ Saved" : dirty ? "Save changes" : "No changes"}</button>
          <button onClick={reset} className="rounded-full border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/15">Reset</button>
          <Link href="/" className="rounded-full border border-violet-300/30 px-4 py-2 text-sm hover:bg-violet-500/15">View site</Link>
          <button onClick={signOut} className="rounded-full border border-red-300/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/15">Sign out</button>
        </div>
        <div className="border-t border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-center text-xs text-emerald-200">🟢 Live backend connected — login is verified by the API, and <strong>Save</strong> writes projects, skills, profile, titles, socials &amp; settings to the database.</div>
      </div>
      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl animate-[toastIn_.25s_ease-out] ${saveState === "error" ? "border-amber-300/40 bg-[#1a1206]/95" : "border-emerald-300/40 bg-[#061a10]/95"}`}>
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold ${saveState === "error" ? "bg-amber-400/20 text-amber-300" : "bg-emerald-400/20 text-emerald-300"}`}>{saveState === "error" ? "!" : "✓"}</span>
          <div className="text-sm">
            <p className="font-display font-bold text-white">{saveState === "error" ? (errorKind === "rejected" ? "Database didn't save" : "Saved locally only") : "Save successful"}</p>
            <p className="mt-0.5 text-white/65">{toast}</p>
          </div>
          <button onClick={() => { setToast(""); setSaveState("idle"); }} aria-label="Dismiss" className="ml-1 text-white/40 hover:text-white">✕</button>
        </div>
      )}
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}`}</style>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Admin panels">
          {panels.map(p => <button key={p} onClick={() => setPanel(p)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm transition ${panel === p ? "btn-primary-glow" : "glass text-white/70 hover:text-white"}`}>{p}</button>)}
        </nav>
        <div className="glass rounded-3xl p-6 sm:p-8">
          {panel === "Overview" && (
            <div>
              <h1 className="font-display text-3xl font-extrabold">Overview</h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">{[["16", "Technologies"], [String(draft.projects.length), draft.projects.length === 1 ? "Flagship Product" : "Projects on Site"], ["10", "Admin Panels"]].map(([n, l]) => <div key={l} className="rounded-2xl border border-violet-300/15 p-5"><p className="font-display text-2xl font-extrabold text-violet-200">{n}</p><p className="text-sm text-white/55">{l}</p></div>)}</div>
              <div className="mt-6 rounded-2xl border border-violet-300/15 p-5"><p className="font-display font-bold">{draft.projects[0]?.title ?? "WAZOBIA"} — Flagship</p><p className="mt-1 text-sm text-white/60">{draft.projects[0]?.description}</p>{draft.projects[0]?.liveUrl && <a href={draft.projects[0].liveUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-violet-300">Visit live site →</a>}<button onClick={() => setPanel("Projects")} className="btn-primary-glow mt-4 block rounded-full px-4 py-2 text-sm font-semibold">+ Add a project</button></div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Build checklist</p>
              <ul className="mt-2 space-y-1.5 text-sm text-white/70">{["Hero video + navbar avatar live", "About crown emblem (no portrait)", "Projects are managed in the Projects panel — added projects appear on the site in the same card format", "Contact form saves to the database — read replies in the Messages panel", "Real auth live: password checked by the API, session cookie issued"].map(i => <li key={i}>✓ {i}</li>)}</ul>
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
            <div><h1 className="font-display text-3xl font-extrabold">Skills &amp; Percentages</h1><p className="mt-1 text-sm text-white/55">These percentages are the bars on the site. Category controls the filter pill; Featured = shown in the default “8 of 20” view. Saves to the database on Save.</p>
              <ul className="mt-4 space-y-2">{draft.skills.map((s, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-300/15 px-4 py-2.5">
                  <input className="input-dark !w-auto flex-1" value={s.name} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} aria-label="Skill name" />
                  <input type="number" min={0} max={100} className="input-dark !w-24" value={s.percent} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, percent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) } : x))} aria-label="Percent" />
                  <span className="text-sm text-white/50">%</span>
                  <select className="input-dark !w-auto [&>option]:bg-[#0d0724]" value={s.category} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, category: e.target.value } : x))} aria-label="Category">
                    {["Programming","Frontend","Backend","API","AI","Data","Developer Tools","Operating Systems","Databases","DevOps","Architecture","Computer Science"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs text-white/60"><input type="checkbox" checked={s.featured} onChange={e => set("skills", draft.skills.map((x, j) => j === i ? { ...x, featured: e.target.checked } : x))} className="h-4 w-4 accent-violet-500" /> Featured</label>
                  <button onClick={() => set("skills", draft.skills.filter((_, j) => j !== i))} className="text-sm text-red-300">Remove</button>
                </li>))}</ul>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <input className="input-dark !w-auto flex-1" placeholder="New skill name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} />
                <input type="number" min={0} max={100} className="input-dark !w-24" value={newSkill.percent} onChange={e => setNewSkill({ ...newSkill, percent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })} aria-label="New skill percent" />
                <select className="input-dark !w-auto [&>option]:bg-[#0d0724]" value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}>
                  {["Programming","Frontend","Backend","API","AI","Data","Developer Tools","Operating Systems","Databases","DevOps","Architecture","Computer Science"].map(c => <option key={c}>{c}</option>)}
                </select>
                <button disabled={!newSkill.name.trim()} onClick={() => { set("skills", [...draft.skills, newSkill]); setNewSkill({ name: "", percent: 50, category: "Frontend", color: "#a78bfa", featured: false }); }} className="btn-primary-glow whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40">Add</button>
              </div>
            </div>
          )}
          {panel === "Projects" && (() => {
            const pf = projectForm;
            const setPf = (patch: Partial<Project>) => setProjectForm((f) => ({ ...f, ...patch }));
            const toggleList = (key: "contributions" | "stack", value: string) =>
              setPf({ [key]: pf[key].includes(value) ? pf[key].filter((v) => v !== value) : [...pf[key], value] } as Partial<Project>);
            const openAdd = () => { setProjectForm({ ...emptyProject, id: `p-${Date.now()}` }); setEditingProjectId(null); setProjectErrors({}); setCustomStack(""); setImageMode(emptyProject.image); setShowProjectForm(true); };
            const openEdit = (proj: Project) => { setProjectForm({ ...proj, contributions: [...proj.contributions], stack: [...proj.stack] }); setEditingProjectId(proj.id); setProjectErrors({}); setCustomStack(""); setImageMode(IMAGE_PRESETS.some((i) => i.value === proj.image) ? proj.image : (proj.image.startsWith("data:") || proj.image.includes("/storage/v1/object/public/")) ? "upload" : "custom"); setImgMsg(""); setShowProjectForm(true); };
            const submitProject = () => {
              const errs: Record<string, string> = {};
              if (pf.title.trim().length < 2) errs.title = "Project name is required (at least 2 characters).";
              if (!pf.category) errs.category = "Pick a category — it controls the filter on the site.";
              if (pf.description.trim().length < 20) errs.description = "Describe the project in at least 20 characters — this is paragraph 1 on the card.";
              if (!pf.role) errs.role = "Pick your role on this project.";
              if (pf.liveUrl && !/^https?:\/\/.+/i.test(pf.liveUrl)) errs.liveUrl = "Live URL must start with https://";
              if (pf.githubUrl && !/^https?:\/\/.+/i.test(pf.githubUrl)) errs.githubUrl = "GitHub URL must start with https://";
              if (!pf.image) errs.image = "Choose an image preset, paste an image URL, or upload an image.";
              if (pf.image && !pf.imageAlt.trim()) errs.imageAlt = "Add alt text describing the image (accessibility).";
              setProjectErrors(errs);
              if (Object.keys(errs).length) return;
              const extraStack = customStack.split(",").map((s) => s.trim()).filter(Boolean);
              const cleaned: Project = { ...pf, title: pf.title.trim(), stack: Array.from(new Set([...pf.stack, ...extraStack])) };
              set("projects", editingProjectId ? draft.projects.map((x) => (x.id === editingProjectId ? cleaned : x)) : [...draft.projects, cleaned]);
              setShowProjectForm(false);
            };
            const err = (k: string) => projectErrors[k] ? <p role="alert" className="mt-1 text-sm text-red-300">{projectErrors[k]}</p> : null;
            const sel = "input-dark [&>option]:bg-[#0d0724]";
            return (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <h1 className="font-display text-3xl font-extrabold">Projects</h1>
                  <p className="mt-1 text-sm text-white/55">Add a project in the exact format of the site card. Press <strong>Save</strong> (top bar) afterwards — it then appears on the homepage Projects section for every visitor, in the same design.</p>
                </div>
                <button onClick={openAdd} className="btn-primary-glow shimmer-sweep rounded-full px-5 py-2.5 text-sm font-semibold">+ Add Project</button>
              </div>

              <ul className="mt-6 space-y-2">
                {draft.projects.map((proj) => (
                  <li key={proj.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-300/15 px-4 py-3">
                    <span className="flex-1">
                      <span className="font-display block font-bold">{proj.title} {proj.featured && <span className="chip ml-1 text-[10px]">FEATURED</span>}</span>
                      <span className="block text-xs text-white/50">{proj.category} · {proj.status} · {proj.location} · {proj.year}</span>
                    </span>
                    <button onClick={() => openEdit(proj)} className="rounded-full border border-violet-300/30 px-3.5 py-1.5 text-sm hover:bg-violet-500/15">Edit</button>
                    <button onClick={() => set("projects", draft.projects.filter((x) => x.id !== proj.id))} className="rounded-full border border-red-300/30 px-3.5 py-1.5 text-sm text-red-200 hover:bg-red-500/15">Delete</button>
                  </li>
                ))}
                {draft.projects.length === 0 && <li className="rounded-xl border border-dashed border-violet-300/25 p-6 text-center text-sm text-white/55">No projects yet — click “+ Add Project”. The site will show an honest empty state until you add one.</li>}
              </ul>

              {showProjectForm && (
                <div className="mt-8 space-y-7 rounded-2xl border border-violet-300/20 bg-violet-500/5 p-5 sm:p-6">
                  <h2 className="font-display text-2xl font-extrabold">{editingProjectId ? `Edit — ${pf.title || "project"}` : "Add a project"}</h2>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">1 · The basics — as they appear on the card</legend>
                    <div><label className={label} htmlFor="pf-title">Project name *</label><input id="pf-title" className="input-dark" placeholder="e.g. WAZOBIA" value={pf.title} onChange={(e) => setPf({ title: e.target.value })} aria-invalid={!!projectErrors.title} />{err("title")}</div>
                    <div><label className={label} htmlFor="pf-aside">Handwritten aside next to the title</label><input id="pf-aside" className="input-dark" placeholder="e.g. the African language ecosystem" value={pf.aside} onChange={(e) => setPf({ aside: e.target.value })} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className={label} htmlFor="pf-category">Category (site filter) *</label>
                        <select id="pf-category" className={sel} value={pf.category} onChange={(e) => setPf({ category: e.target.value })} aria-invalid={!!projectErrors.category}>
                          {PROJECT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>{err("category")}</div>
                      <div><label className={label} htmlFor="pf-status">Project status</label>
                        <select id="pf-status" className={sel} value={pf.status} onChange={(e) => setPf({ status: e.target.value })}>
                          {PROJECT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select></div>
                      <div><label className={label} htmlFor="pf-location">Location (shown under the image)</label>
                        <select id="pf-location" className={sel} value={pf.location} onChange={(e) => setPf({ location: e.target.value })}>
                          {LOCATION_OPTIONS.map((l) => <option key={l}>{l}</option>)}
                        </select></div>
                      <div><label className={label} htmlFor="pf-year">Year (shown under the image)</label>
                        <select id="pf-year" className={sel} value={pf.year} onChange={(e) => setPf({ year: e.target.value })}>
                          {YEAR_OPTIONS.map((y) => <option key={y}>{y}</option>)}
                        </select></div>
                    </div>
                    <div><label className={label} htmlFor="pf-tags">Tag chips (comma-separated)</label><input id="pf-tags" className="input-dark" placeholder="Web App, African Language Tech" value={pf.tags} onChange={(e) => setPf({ tags: e.target.value })} /></div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pf.featured} onChange={(e) => setPf({ featured: e.target.checked })} className="h-4 w-4 accent-violet-500" /> Show the violet “FEATURED” pill on the card</label>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">2 · Media — left side of the card</legend>
                    <div><label className={label} htmlFor="pf-image">Card image</label>
                      <select id="pf-image" className={sel} value={imageMode} onChange={(e) => { const v = e.target.value; setImageMode(v); if (v !== "custom" && v !== "upload") setPf({ image: v }); else if (v === "custom") setPf({ image: "" }); }}>
                        {IMAGE_PRESETS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
                      </select></div>
                    {imageMode === "custom" && <div><label className={label} htmlFor="pf-image-url">Image URL</label><input id="pf-image-url" className="input-dark" placeholder="https://…/screenshot.png" value={pf.image.startsWith("data:") ? "" : pf.image} onChange={(e) => setPf({ image: e.target.value })} /></div>}
                    {imageMode === "upload" && <div><label className={label} htmlFor="pf-image-file">Upload an image (stored permanently — auto-cropped to the card shape, 16:10)</label>
                      <input id="pf-image-file" type="file" accept="image/*" className="input-dark" disabled={imgBusy} onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setImgBusy(true); setImgMsg("Cropping to 16:10 and uploading…"); try { const { cropToCard, uploadProjectImage } = await import("@/lib/api"); const url = await uploadProjectImage(await cropToCard(f)); setPf({ image: url }); setImgMsg("✓ Uploaded — press Save changes (top) to attach it to the project."); } catch (err) { setImgMsg(`Upload failed: ${err instanceof Error ? err.message : "unknown error"}`); } finally { setImgBusy(false); } }} />
                      {imgMsg && <p className="mt-1.5 text-xs text-white/55">{imgMsg}</p>}</div>}
                    {err("image")}
                    {pf.image && /* eslint-disable-next-line @next/next/no-img-element */ <img src={pf.image} alt="" className="aspect-[16/10] w-full max-w-md rounded-xl border border-violet-300/20 object-cover" />}
                    <div><label className={label} htmlFor="pf-alt">Image alt text *</label><input id="pf-alt" className="input-dark" placeholder="Describe the image for screen readers" value={pf.imageAlt} onChange={(e) => setPf({ imageAlt: e.target.value })} aria-invalid={!!projectErrors.imageAlt} />{err("imageAlt")}</div>
                    <div><label className={label} htmlFor="pf-caption">Handwritten caption under the image</label><input id="pf-caption" className="input-dark" placeholder="e.g. Africa speaks. Let's understand every voice." value={pf.caption} onChange={(e) => setPf({ caption: e.target.value })} /></div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">3 · The story — card paragraphs</legend>
                    <div><label className={label} htmlFor="pf-desc">Description — paragraph 1 (what it is &amp; who it serves) *</label><textarea id="pf-desc" rows={4} className="input-dark" value={pf.description} onChange={(e) => setPf({ description: e.target.value })} aria-invalid={!!projectErrors.description} />{err("description")}</div>
                    <div><label className={label} htmlFor="pf-desc2">Second paragraph (why it matters — optional)</label><textarea id="pf-desc2" rows={3} className="input-dark" value={pf.description2} onChange={(e) => setPf({ description2: e.target.value })} /></div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">4 · Your role &amp; contributions</legend>
                    <div><label className={label} htmlFor="pf-role">Your role *</label>
                      <select id="pf-role" className={sel} value={pf.role} onChange={(e) => setPf({ role: e.target.value })} aria-invalid={!!projectErrors.role}>
                        {PROJECT_ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>{err("role")}</div>
                    <div><span className={label}>Contributions (tick all that apply — shown as chips)</span>
                      <div className="flex flex-wrap gap-2">{CONTRIBUTION_OPTIONS.map((c) => (
                        <label key={c} className={`chip cursor-pointer ${pf.contributions.includes(c) ? "!border-violet-300 !bg-violet-500/30 text-white" : "text-white/60"}`}>
                          <input type="checkbox" className="hidden" checked={pf.contributions.includes(c)} onChange={() => toggleList("contributions", c)} />{c}
                        </label>))}</div></div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">5 · Tech stack — shown as chips</legend>
                    <div className="flex flex-wrap gap-2">{STACK_OPTIONS.map((s) => (
                      <label key={s} className={`chip cursor-pointer ${pf.stack.includes(s) ? "!border-violet-300 !bg-violet-500/30 text-white" : "text-white/60"}`}>
                        <input type="checkbox" className="hidden" checked={pf.stack.includes(s)} onChange={() => toggleList("stack", s)} />{s}
                      </label>))}</div>
                    <div><label className={label} htmlFor="pf-custom-stack">Anything else? (comma-separated)</label><input id="pf-custom-stack" className="input-dark" placeholder="e.g. Docker, PostgreSQL" value={customStack} onChange={(e) => setCustomStack(e.target.value)} /></div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="eyebrow">6 · Links — card buttons</legend>
                    <div><label className={label} htmlFor="pf-live">Live website URL (“Visit Live Website” button)</label><input id="pf-live" className="input-dark" placeholder="https://your-project.vercel.app/" value={pf.liveUrl} onChange={(e) => setPf({ liveUrl: e.target.value })} aria-invalid={!!projectErrors.liveUrl} />{err("liveUrl")}</div>
                    <div><label className={label} htmlFor="pf-github">GitHub URL (“GitHub” button)</label><input id="pf-github" className="input-dark" placeholder="https://github.com/yzigzag26-lab" value={pf.githubUrl} onChange={(e) => setPf({ githubUrl: e.target.value })} aria-invalid={!!projectErrors.githubUrl} />{err("githubUrl")}</div>
                    <p className="text-xs text-white/40">Leave a link empty and its button simply won’t show on the card.</p>
                  </fieldset>

                  <div className="flex flex-wrap gap-3 border-t border-violet-300/10 pt-5">
                    <button onClick={submitProject} className="btn-primary-glow rounded-full px-6 py-3 text-sm font-semibold">{editingProjectId ? "Update project" : "Add project to site"}</button>
                    <button onClick={() => setShowProjectForm(false)} className="rounded-full border border-violet-300/30 px-6 py-3 text-sm hover:bg-violet-500/15">Cancel</button>
                    <span className="self-center text-xs text-white/45">Then press <strong>Save</strong> at the top to publish it to the database and homepage.</span>
                  </div>
                </div>
              )}
            </div>
            );
          })()}
          {panel === "Messages" && (
            <div><h1 className="font-display text-3xl font-extrabold">Messages</h1>
              <p className="mt-1 text-sm text-white/55">From the website contact form, stored in the database. {messages.filter((m) => !m.readAt).length} unread.</p>
              <ul className="mt-5 space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className={`rounded-2xl border p-4 ${m.readAt ? "border-violet-300/10" : "border-violet-300/35 bg-violet-500/5"}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display flex-1 font-bold">{m.name} <span className="text-sm font-normal text-white/45">· {m.email}</span></p>
                      <span className="chip text-[10px]">{m.subject}</span>
                      {!m.readAt && <span className="chip text-[10px]">UNREAD</span>}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{m.message}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/40">
                      <span>{new Date(m.createdAt).toLocaleString()}</span><span className="flex-1" />
                      {!m.readAt && <button onClick={async () => { const { apiFetch } = await import("@/lib/api"); await apiFetch(`/admin/contact/${m.id}`, { method: "PATCH", body: JSON.stringify({ read: true }) }); setMessages(messages.map((x) => x.id === m.id ? { ...x, readAt: new Date().toISOString() } : x)); }} className="rounded-full border border-violet-300/30 px-3 py-1.5 text-white/70 hover:bg-violet-500/15">Mark read</button>}
                      <a href={`mailto:${m.email}`} className="rounded-full border border-violet-300/30 px-3 py-1.5 text-white/70 hover:bg-violet-500/15">Reply by email</a>
                      <button onClick={async () => { const { apiFetch } = await import("@/lib/api"); await apiFetch(`/admin/contact/${m.id}`, { method: "DELETE" }); setMessages(messages.filter((x) => x.id !== m.id)); }} className="rounded-full border border-red-300/30 px-3 py-1.5 text-red-200 hover:bg-red-500/15">Delete</button>
                    </div>
                  </li>
                ))}
                {messages.length === 0 && <li className="rounded-2xl border border-dashed border-violet-300/25 p-8 text-center text-sm text-white/55">No messages yet — when someone uses the contact form, it lands here.</li>}
              </ul>
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
          <p className="mt-8 border-t border-violet-300/10 pt-4 text-xs text-white/40">Press <strong>Save</strong> (top bar) to sync projects, skills, profile, titles, socials and settings to the database{savedAt ? ` — last saved ${savedAt}` : ""}. A local draft is also kept in this browser as a backup.</p>
        </div>
      </div>
    </main>
  );
}
