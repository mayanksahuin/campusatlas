import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site";

export const Route = createFileRoute("/events")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Hackathons, Fests & Workshops in Jaipur — CampusAtlas" },
      { name: "description", content: "Upcoming hackathons, technical fests, cultural events and workshops across Jaipur engineering campuses." },
      { property: "og:title", content: "Jaipur Campus Events — CampusAtlas" },
      { property: "og:description", content: "Hackathons, fests and workshops from Jaipur engineering colleges." },
    ],
  }),
  component: Events,
});

const kinds = ["Hackathons", "Technical fests", "Cultural fests", "Workshops", "Competitions", "Seminars"];

function Events() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 pt-14">
        <p className="eyebrow">Calendar</p>
        <h1 className="mt-3 text-5xl">Events</h1>
        <div className="mt-6 flex flex-wrap gap-2">{kinds.map((k) => <span key={k} className="border px-3 py-1.5 text-xs text-muted-foreground">{k}</span>)}</div>
        <div className="mt-12 border border-dashed p-16 text-center">
          <p className="font-display text-3xl">No verified events yet.</p>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">We only list events confirmed by an official college page or social account. The first verified listings will appear here soon.</p>
          <Link to="/colleges" className="mt-8 inline-block bg-primary px-6 py-3 font-semibold text-primary-foreground">Explore colleges meanwhile</Link>
        </div>
      </section>
    </SiteShell>
  );
}
