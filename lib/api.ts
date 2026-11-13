/** Base URL of the Fastify API (apps/api). Set NEXT_PUBLIC_API_URL in production (Render). */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include", // the httpOnly admin session cookie
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  });
}

export const isUuid = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
