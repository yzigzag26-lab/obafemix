import Logo from "@/components/Logo";

/** Instant first-paint while the page loads — brand skeleton, no blank screen. */
export default function Loading() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 px-6" aria-label="Loading OBAFEMIX portfolio">
      <Logo size={72} className="animate-pulse" />
      <p className="font-display text-xl font-extrabold tracking-tight">OBAFEMIX</p>
      <div className="w-full max-w-md space-y-3" aria-hidden>
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-violet-500/20" />
        <div className="h-3 w-full animate-pulse rounded-full bg-violet-500/15" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-violet-500/10" />
      </div>
      <p className="font-mono text-[10px] tracking-[.35em] text-violet-300/70">LOADING…</p>
    </main>
  );
}
