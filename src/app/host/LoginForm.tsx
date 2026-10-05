"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto mt-10 max-w-sm space-y-4 rounded-3xl border-2 border-cyan/40 bg-night-2 p-6">
      <label htmlFor="password" className="block font-bold">Host password</label>
      <input id="password" name="password" type="password" required autoComplete="current-password" className="block w-full rounded-xl border-2 border-white/15 bg-night px-4 py-3 text-lg focus:border-cyan focus:outline-none" />
      {error && <p role="alert" className="font-bold text-pink">{error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-pink px-6 py-3 text-lg font-bold text-night disabled:opacity-60">
        {pending ? "Checking…" : "Let me in"}
      </button>
    </form>
  );
}
