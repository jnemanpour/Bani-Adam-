import { NextResponse, type NextRequest } from "next/server";
import { sendConfirmation } from "@/lib/email";
import { rateLimited } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/rsvp-schema";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many tries. Give it a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot filled: pretend it worked so bots don't learn anything.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true, attending: "yes" });
  }

  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Please fix the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const { website: _honeypot, ...rsvp } = parsed.data;

  // Same email = update the existing row (unique constraint on email).
  const { data: existing } = await supabaseAdmin().from("rsvps").select("id").eq("email", rsvp.email).maybeSingle();
  const { error } = await supabaseAdmin().from("rsvps").upsert(rsvp, { onConflict: "email" });
  if (error) {
    console.error("RSVP insert failed", error);
    return NextResponse.json({ error: "Something went wrong saving your RSVP. Please try again." }, { status: 500 });
  }

  const emailed = await sendConfirmation(rsvp).catch((e) => {
    console.error("Confirmation email failed", e);
    return false;
  });

  return NextResponse.json({ ok: true, attending: rsvp.attending, updated: Boolean(existing), emailed });
}
