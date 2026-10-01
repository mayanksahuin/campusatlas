import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, VerificationBadge } from "@/components/site";
import { useSuspenseQuery } from "@tanstack/react-query";
import { collegesQuery } from "@/lib/colleges.functions";
import type { College } from "@/lib/colleges";

export const Route = createFileRoute("/compare")({
  validateSearch: (s: Record<string, unknown>): { a?: string | undefined } => ({ a: typeof s["a"] === "string" ? s["a"] : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(collegesQuery()),
  head: () => ({
    meta: [
      { title: "Compare Jaipur Engineering Colleges — CampusAtlas" },
      { name: "description", content: "Compare up to three Jaipur engineering colleges side by side on factual attributes." },
      { property: "og:title", content: "Compare Jaipur Engineering Colleges — CampusAtlas" },
      { property: "og:description", content: "Side-by-side factual comparison, no scores." },
    ],
  }),
  component: Compare,
});

const rows: [string, (c: College) => string | undefined][] = [
  ["Type", (c) => c.type], ["Ownership", (c) => c.ownership], ["Area", (c) => c.area ?? undefined],
  ["Established", (c) => c.established?.toString()], ["Entrance", (c) => c.entrance.join(", ") || undefined],
  ["Programs", (c) => c.programs.join(", ") || undefined], ["Website", (c) => c.website?.replace("https://", "")],
  ["Status", (c) => c.verification],
];

function Compare() {
  const { a } = Route.useSearch();
  const { data: colleges } = useSuspenseQuery(collegesQuery());
  const getCollege = (s: string) => colleges.find((c) => c.slug === s);
  const [sel, setSel] = useState<string[]>([a ?? "mnit-jaipur", "lnmiit", ""]);
  const picked = sel.map((s) => getCollege(s));
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 pt-14">
        <p className="eyebrow">Side by side</p>
        <h1 className="mt-3 text-5xl">Compare colleges</h1>
        <p className="mt-3 text-muted-foreground">Facts only. Blank cells mean the information isn't verified yet.</p>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40" />
                {sel.map((s, i) => (
                  <th key={i} className="border-b p-3 align-top font-normal">
                    <select value={s} onChange={(e) => setSel(sel.map((x, j) => (j === i ? e.target.value : x)))} className="w-full border bg-card p-2 text-sm">
                      <option value="">Choose a college…</option>
                      {colleges.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    {picked[i] && <div className="mt-3"><p className="font-display text-xl">{picked[i]!.name}</p><div className="mt-2"><VerificationBadge status={picked[i]!.verification} /></div></div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-b">
                  <td className="eyebrow p-3">{label}</td>
                  {picked.map((c, i) => <td key={i} className="p-3 text-sm">{c ? fn(c) ?? <span className="text-muted-foreground">—</span> : ""}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteShell>
  );
}
