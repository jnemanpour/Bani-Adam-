import "server-only";
import { createClient } from "@supabase/supabase-js";

export type Rsvp = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "maybe" | "no";
  adults: number;
  kids: number;
  kids_ages: string | null;
  dietary: string | null;
  volunteer: string[] | null;
  note: string | null;
};

/** Service-role client. Bypasses RLS, so it must only ever run on the server. */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
