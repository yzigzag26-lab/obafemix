/** Supabase Storage uploads (server-side only, service-role key).
 *  Files live in the public `project-images` bucket; the database only
 *  ever stores the returned public URL in projects.image_url. */
const EXT: Record<string, string> = {
  "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/avif": "avif", "image/gif": "gif",
};

export function storageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function uploadProjectImage(buffer: Buffer, contentType: string): Promise<string> {
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const ext = EXT[contentType] ?? "webp";
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const res = await fetch(`${base}/storage/v1/object/project-images/${path}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": contentType, "x-upsert": "true" },
    body: new Uint8Array(buffer),
  });
  if (!res.ok) throw new Error(`Storage upload failed (${res.status}): ${await res.text().catch(() => "")}`.slice(0, 300));
  return `${base}/storage/v1/object/public/project-images/${path}`;
}
