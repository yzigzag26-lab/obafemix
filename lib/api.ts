/** Base URL of the Fastify API (apps/api). Set NEXT_PUBLIC_API_URL in production (Render). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include", // the httpOnly admin session cookie
    // Only claim JSON when a body is actually sent: Fastify's JSON parser
    // rejects an empty body with 400, which silently broke every DELETE.
    headers: { ...(init.body ? { "content-type": "application/json" } : {}), ...(init.headers ?? {}) },
  });
}

export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

/** Upload a project image through the API (admin session cookie required).
 *  Returns the public storage URL to store in the project's image field. */
export async function uploadProjectImage(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "project-image.webp");
  const res = await fetch(`${API_BASE}/admin/media`, { method: "POST", body: form, credentials: "include" });
  const j = await res.json().catch(() => null);
  if (!res.ok || !j?.data?.url) throw new Error(j?.error?.message ?? `Upload failed (HTTP ${res.status})`);
  return j.data.url as string;
}

/** Crop/resize any picture to the project card's exact shape: 1600x1000 (16:10),
 *  centre-cover — so it can never look squished or cramped on the site. */
export async function cropToCard(blob: Blob): Promise<Blob> {
  const bmp = await createImageBitmap(blob);
  const W = 1600, H = 1000;
  const scale = Math.max(W / bmp.width, H / bmp.height);
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return blob;
  ctx.drawImage(bmp, Math.round((W - w) / 2), Math.round((H - h) / 2), w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? blob), "image/webp", 0.85));
}
