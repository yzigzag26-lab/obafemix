"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import Logo from "@/components/Logo";
const modules = ["Overview & build checklist", "About Me editor", "Professional Titles", "Skills & Levels", "Featured Project (WAZOBIA)", "Profile Image preview", "Contact Info & Social Links", "Site Metadata"];
export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) { setError("Please enter a password to continue."); return; }
    setBusy(true); setError("");
    try {
      const { apiFetch } = await import("@/lib/api");
      const res = await apiFetch("/auth/verify", { method: "POST", body: JSON.stringify({ password: pw }) });
      if (res.ok) { router.push("/admin/dashboard"); return; }
      if (res.status === 401) setError("Incorrect password. Try again.");
      else if (res.status === 429) setError("Too many attempts — wait 15 minutes and try again.");
      else setError("The API could not check the password right now. Try again shortly.");
    } catch {
      setError("Cannot reach the API. Make sure the backend is running (local: apps/api on :4000 — or the Render deploy) and NEXT_PUBLIC_API_URL is correct.");
    } finally { setBusy(false); }
  };
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src="/assets/obafemix.png" alt="OBAFEMIX" fill className="object-cover" style={{ maskImage: "linear-gradient(to right, black 55%, transparent)", WebkitMaskImage: "linear-gradient(to right, black 55%, transparent)" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#05010f]" />
        <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_right,transparent_40%,black)]" />
        <div className="relative flex h-full flex-col justify-center p-12">
          <Logo size={56} />
          <p className="eyebrow mt-8">{"// ADMINISTRATOR ACCESS"}</p>
          <h1 className="font-display mt-4 max-w-md text-4xl font-extrabold leading-tight">The command center behind the legend.</h1>
          <ul className="mt-8 space-y-2.5">{modules.map(m => <li key={m} className="flex items-center gap-2 text-sm text-white/75"><CheckCircle2 size={16} className="text-emerald-300" />{m}</li>)}</ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8" noValidate>
          <div className="flex items-center gap-2 lg:hidden"><Logo size={36} /><span className="font-display font-extrabold">OBAFEMIX</span></div>
          <p className="eyebrow mt-2">{"// ADMIN"}</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold">Administrator Login</h2>
          <div role="note" className="mt-5 rounded-xl border border-amber-300/30 bg-amber-500/10 p-3.5 text-sm text-amber-200">Real authentication: your password is checked by the API against the one-time password stored in the server&apos;s .env (never in this browser). A short-lived httpOnly session cookie is issued on success.</div>
          <label htmlFor="pw" className="mt-6 block text-sm font-medium">Password</label>
          <div className="relative mt-1.5">
            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input id="pw" type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} aria-invalid={!!error} placeholder="Enter the admin password" className="input-dark !pl-10 !pr-11" autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
          <button type="submit" className="btn-primary-glow shimmer-sweep mt-6 w-full rounded-full px-6 py-3.5 font-semibold" disabled={busy}>{busy ? "Checking…" : "Unlock Dashboard"}</button>
          <Link href="/" className="mt-5 block text-center text-sm text-violet-300 hover:text-violet-200">← Back to portfolio</Link>
          <p className="mt-4 text-center text-xs text-white/40">Session lasts 60 minutes. The password never leaves the server check — nothing is stored in this browser.</p>
        </form>
      </div>
    </main>
  );
}
