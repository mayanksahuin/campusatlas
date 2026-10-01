import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell, CollegeRow } from "@/components/site";
import { colleges } from "@/lib/colleges";

type Search = { q?: string; type?: string };

export const Route = createFileRoute("/colleges/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    type: typeof s.type === "string" ? s.type : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Engineering Colleges in Jaipur — CampusAtlas" },
      { name: "description", content: "Search and filter every engineering institution in Jaipur by type, area and ownership. No fake rankings." },
      { property: "og:title", content: "Explore Engineering Colleges in Jaipur — CampusAtlas" },
      { property: "og:description", content: "Search and filter Jaipur engineering colleges by factual attributes." },
    ],
  }),
  component: Explore,
});

const types = ["All", "Institute of National Importance", "Private University", "Deemed University", "Affiliated College"];

function Explore() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [type, setType] = useState(search.type ?? "All");
  const [sort, setSort] = useState<"az" | "est">("az");
  const list = useMemo(() => {
    const t = q.toLowerCase();
    return colleges
      .filter((c) => type === "All" || c.type === type)
      .filter((c) => !t || [c.name, c.area, ...(c.aliases ?? []), ...(c.programs ?? []), ...(c.entrance ?? [])].join(" ").toLowerCase().includes(t))
      .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : (a.established ?? 9999) - (b.established ?? 9999)));
  }, [q, type, sort]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 pt-14">
        <p className="eyebrow">Index</p>
        <h1 className="mt-3 text-5xl">Explore colleges</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Listed alphabetically, never ranked. Records marked pending are seed entries awaiting source verification.</p>
        <div className="mt-10 flex flex-col gap-4 border-y py-4 md:flex-row md:items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, area, program, exam…" className="flex-1 border bg-card px-4 py-3 outline-none focus:border-primary" />
          <select value={sort} onChange={(e) => setSort(e.target.value as "az" | "est")} className="border bg-card px-3 py-3 text-sm">
            <option value="az">A → Z</option>
            <option value="est">Oldest established</option>
          </select>
          <Link to="/compare" className="bg-ink px-5 py-3 text-sm font-semibold text-ink-foreground">Compare →</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`border px-3 py-1.5 text-xs ${type === t ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-foreground"}`}>{t}</button>
          ))}
        </div>
        <p className="eyebrow mt-8">{list.length} results</p>
        <div className="mt-2 border-t">{list.map((c) => <CollegeRow key={c.slug} c={c} />)}</div>
        {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No colleges match that search.</p>}
      </section>
    </SiteShell>
  );
}
