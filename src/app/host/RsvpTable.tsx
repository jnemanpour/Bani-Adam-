"use client";

import { useMemo, useState } from "react";
import type { Rsvp } from "@/lib/supabase";

const COLUMNS: (keyof Rsvp)[] = ["name", "attending", "adults", "kids", "kids_ages", "phone", "email", "dietary", "volunteer", "note", "created_at", "updated_at"];

function toCsv(rows: Rsvp[]) {
  const cell = (v: unknown) => {
    const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
    // Quote everything; neutralize spreadsheet formula injection.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(","))].join("\r\n");
}

const badge = { yes: "bg-gold text-night", maybe: "bg-coral text-night", no: "bg-white/15 text-mist" } as const;

export default function RsvpTable({ rows }: { rows: Rsvp[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Rsvp["attending"]>("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.attending === filter) &&
        (!needle || [r.name, r.email, r.phone, r.note, r.dietary, r.kids_ages].some((v) => v?.toLowerCase().includes(needle))),
    );
  }, [rows, q, filter]);

  function download() {
    const blob = new Blob([toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `rsvps-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section aria-labelledby="all" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="all" className="text-2xl font-bold">
          All RSVPs <span className="text-mist">({shown.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="q">Search</label>
          <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, note…" className="rounded-full border-2 border-white/15 bg-night px-4 py-2 focus:border-palm focus:outline-none" />
          <label className="sr-only" htmlFor="f">Filter</label>
          <select id="f" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="rounded-full border-2 border-white/15 bg-night px-4 py-2">
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="maybe">Maybe</option>
            <option value="no">No</option>
          </select>
          <button onClick={download} className="rounded-full bg-palm px-4 py-2 font-bold text-night">Export CSV</button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-night-2 text-mist">
            <tr>
              {["Name", "RSVP", "Adults", "Kids", "Ages", "Phone", "Email", "Dietary", "Helping", "Note", "Updated"].map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-3 font-bold">{r.name}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${badge[r.attending]}`}>{r.attending}</span></td>
                <td className="px-3 py-3">{r.adults}</td>
                <td className="px-3 py-3">{r.kids}</td>
                <td className="px-3 py-3">{r.kids_ages}</td>
                <td className="px-3 py-3 whitespace-nowrap"><a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></td>
                <td className="px-3 py-3">{r.email}</td>
                <td className="px-3 py-3">{r.dietary}</td>
                <td className="px-3 py-3">{r.volunteer?.join(", ")}</td>
                <td className="max-w-xs px-3 py-3">{r.note}</td>
                <td className="px-3 py-3 whitespace-nowrap text-mist">{new Date(r.updated_at).toLocaleString("en-US", { timeZone: "America/Los_Angeles", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</td>
              </tr>
            ))}
            {!shown.length && (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-mist">No RSVPs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
