import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "About CampusAtlas — Verified college intelligence for Jaipur" },
      { name: "description", content: "Why CampusAtlas exists, how we verify information, and where we're headed: Jaipur, Rajasthan, India." },
      { property: "og:title", content: "About CampusAtlas" },
      { property: "og:description", content: "Verified, unranked, source-backed college information for Jaipur." },
    ],
  }),
  component: About,
});

const principles = [
  ["No rankings", "We never invent 'best college' lists or scores. You compare facts."],
  ["Sources first", "Every record shows its verification status and links to official sources."],
  ["Beyond brochures", "Clubs, fests, hackathons and campus life — the things that shape four years."],
];

function About() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 pt-14">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-6xl leading-tight">Jaipur first. Then Rajasthan. Then India.</h1>
        <p className="mt-8 text-xl leading-relaxed text-muted-foreground">CampusAtlas helps students and teachers understand engineering colleges through verified public information — not marketing.</p>
        <div className="mt-16 border-t">
          {principles.map(([t, d], i) => (
            <div key={t} className="grid grid-cols-12 border-b py-8">
              <p className="col-span-2 font-mono text-primary">0{i + 1}</p>
              <div className="col-span-10"><h2 className="text-3xl">{t}</h2><p className="mt-2 text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
