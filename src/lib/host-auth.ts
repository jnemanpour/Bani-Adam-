import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const HOST_COOKIE = "sr_host";

function token(): string | null {
  const pw = process.env.HOST_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("sunrise-rave-host").digest("hex");
}

export function passwordMatches(input: string): boolean {
  const pw = process.env.HOST_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isHost(): Promise<boolean> {
  const expected = token();
  const got = (await cookies()).get(HOST_COOKIE)?.value;
  if (!expected || !got || got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export async function setHostCookie() {
  (await cookies()).set(HOST_COOKIE, token()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/host",
    maxAge: 60 * 60 * 24 * 60,
  });
}

export async function clearHostCookie() {
  (await cookies()).delete({ name: HOST_COOKIE, path: "/host" });
}
