"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { clearHostCookie, passwordMatches, setHostCookie } from "@/lib/host-auth";
import { rateLimited } from "@/lib/rate-limit";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(`host:${ip}`)) return "Too many tries. Wait a few minutes.";
  if (!process.env.HOST_PASSWORD) return "HOST_PASSWORD isn't set on the server.";
  if (!passwordMatches(String(formData.get("password") ?? ""))) return "Wrong password.";
  await setHostCookie();
  redirect("/host");
}

export async function logout() {
  await clearHostCookie();
  redirect("/host");
}
