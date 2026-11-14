"use client";
import { useEffect, useState } from "react";

/**
 * The live LinkedIn URL from the admin panel (Social Links), via GET /site.
 * Returns "" while unpublished/empty — callers then show "Coming soon".
 * One shared fetch: every component using this hook reuses the same promise.
 */
let cached: Promise<string> | null = null;

function fetchLinkedin(): Promise<string> {
  if (!cached) {
    cached = (async () => {
      try {
        const { API_BASE } = await import("@/lib/api");
        const res = await fetch(`${API_BASE}/site`);
        if (!res.ok) return "";
        const j = await res.json();
        const row = (j?.data?.socials ?? []).find(
          (s: { platform?: string }) => s?.platform === "linkedin",
        ) as { url?: string; published?: boolean } | undefined;
        const url = (row?.url ?? "").trim();
        if (!row?.published || !url) return "";
        return /^https?:\/\//i.test(url) ? url : `https://${url}`;
      } catch {
        return "";
      }
    })();
  }
  return cached;
}

export function useLinkedin(): string {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetchLinkedin().then((u) => { if (!cancelled) setUrl(u); });
    return () => { cancelled = true; };
  }, []);
  return url;
}
