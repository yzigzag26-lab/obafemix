import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Admin one-time password handling.
 * Preferred: ADMIN_OTP_HASH in .env (scrypt format below) so a leaked env
 * file does not reveal the password. A plaintext ADMIN_OTP is also accepted
 * for local dev only. Generate a hash with: npm run hash-otp -- "your password"
 * (prints the value to paste into .env — the password itself is never stored).
 */
export function hashOtp(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyOtp(candidate: string): boolean {
  const hash = process.env.ADMIN_OTP_HASH;
  if (hash?.startsWith("scrypt$")) {
    const [, saltB64, hashB64] = hash.split("$");
    const expected = Buffer.from(hashB64, "base64");
    const actual = scryptSync(candidate, Buffer.from(saltB64, "base64"), expected.length);
    return timingSafeEqual(actual, expected);
  }
  const plain = process.env.ADMIN_OTP;
  if (plain) {
    const a = Buffer.from(candidate);
    const b = Buffer.from(plain);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  return false; // auth not configured
}

export const authConfigured = () => Boolean(process.env.ADMIN_OTP_HASH || process.env.ADMIN_OTP);
