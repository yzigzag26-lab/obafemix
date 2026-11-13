import { SignJWT, jwtVerify } from "jose";
import type { FastifyReply, FastifyRequest } from "fastify";

export const COOKIE = "obafemix_session";

function secret(): Uint8Array | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 16 ? new TextEncoder().encode(s) : null;
}

export async function issueSession(reply: FastifyReply) {
  const key = secret();
  if (!key) throw new Error("SESSION_SECRET is not configured (min 16 chars in .env).");
  const ttl = Number(process.env.SESSION_TTL_MINUTES ?? 60);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}m`)
    .sign(key);
  const prod = process.env.NODE_ENV === "production";
  reply.setCookie(COOKIE, token, {
    httpOnly: true,
    // Render: site and API live on different *.onrender.com subdomains, which
    // browsers treat as cross-site — the cookie needs SameSite=None + Secure
    // there, or login appears to succeed and immediately looks logged-out.
    // Locally (same-site localhost) Lax is correct and works over http.
    sameSite: prod ? "none" : "lax",
    path: "/",
    secure: prod,
    maxAge: ttl * 60,
  });
}

export async function isAdmin(req: FastifyRequest): Promise<boolean> {
  const key = secret();
  const token = req.cookies?.[COOKIE];
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** preHandler for every admin route. Standard error envelope on failure. */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  if (!(await isAdmin(req))) {
    return reply.status(401).send({ error: { code: "UNAUTHORIZED", message: "Admin login required." } });
  }
}
