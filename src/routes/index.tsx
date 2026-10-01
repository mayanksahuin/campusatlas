import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero-jaipur.jpg";
import { SiteShell, CollegeRow } from "@/components/site";
import { collegesQuery } from "@/lib/colleges.functions";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(collegesQuery()),
  head: () => ({
    meta: [
      { title: "CampusAtlas — Jaipur's Engineering Colleges. Decoded." },
      { name: "description", content: "Discover Jaipur's engineering colleges, campus life, events and verified information that actually matters." },
      { property: "og:title", content: "CampusAtlas — Jaipur's Engineering Colleges. Decoded." },
      { property: "og:description", content: "Discover colleges, campus life, events and verified public information in Jaipur." },
    ],
  }),
  component: Home,
});

const categories = ["Institute of National Importance", "Private University", "Deemed University", "Affiliated College"];
const popular = ["Sitapura colleges", "JEE Main admission", "Hostel facilities", "Hackathons", "B.Arch", "Women's colleges"];

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { data: colleges } = useSuspenseQuery(collegesQuery());
  const featured = colleges.filter((c) => c.verification !== "pending");
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-14 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:pt-10">
          <p className="eyebrow">Vol. 01 — Jaipur, Rajasthan</p>
          <h1 className="mt-6 text-5xl font-medium leading-[1.02] md:text-7xl">
            Jaipur's Engineering Colleges. <em className="text-primary">Decoded.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Discover colleges, campus life, events, opportunities and the information that actually matters.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/colleges", search: { q } }); }}
            className="mt-10 flex max-w-lg border border-foreground bg-card"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a college, area or program…" className="flex-1 bg-transparent px-4 py-4 outline-none" />
            <button className="bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90">Explore Colleges</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2">
            {popular.map((p) => (
              <Link key={p} to="/colleges" search={{ q: p.split(" ")[0] }} className="border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">{p}</Link>
            ))}
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <img src={hero} alt="Sandstone arches and jaali lattice in warm Jaipur light" width={1600} height={1104} className="h-full max-h-[600px] w-full object-cover" />
          <div className="absolute -bottom-6 left-6 bg-ink p-5 text-ink-foreground">
            <p className="font-display text-4xl">{colleges.length}</p>
            <p className="eyebrow !text-ink-foreground/70">institutions tracked</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between rule-top pt-6">
          <h2 className="text-3xl">Partially verified so far</h2>
          <Link to="/colleges" className="text-sm font-semibold text-primary">All colleges →</Link>
        </div>
        <div className="mt-4">{featured.map((c) => <CollegeRow key={c.slug} c={c} />)}</div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2">
          <h2 className="text-5xl leading-tight">Don't just choose a college. <em className="text-primary">Understand it.</em></h2>
          <ul className="grid grid-cols-2 gap-px bg-ink-foreground/15">
            {["Clubs & technical societies", "Hackathons & fests", "Hostels & transport", "Entrance routes", "Research & incubation", "Official sources"].map((t, i) => (
              <li key={t} className="bg-ink p-5">
                <p className="font-mono text-xs text-primary">0{i + 1}</p>
                <p className="mt-2">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="rule-top pt-6 text-3xl">Browse by type</h2>
        <div className="mt-8 grid gap-px border bg-border md:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat} to="/colleges" search={{ type: cat }} className="bg-background p-6 transition-colors hover:bg-accent">
              <p className="font-display text-4xl text-primary">{colleges.filter((c) => c.type === cat).length}</p>
              <p className="mt-3 text-sm">{cat}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
