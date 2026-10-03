import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site";
import { savedCollegesQuery } from "@/lib/account";

export const Route = createFileRoute("/_authenticated/saved")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Saved items — CampusAtlas" },
    { name: "description", content: "Colleges and events you saved on CampusAtlas." },
    { property: "og:title", content: "Saved items — CampusAtlas" },
    { property: "og:description", content: "Colleges and events you saved on CampusAtlas." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Saved,
});

function Saved() {
  const { data, isLoading } = useQuery(savedCollegesQuery());
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-6 py-14">
        <p className="eyebrow">Saved</p>
        <h1 className="mt-4 text-4xl md:text-5xl">Your shortlist.</h1>
        <p className="mt-4 text-muted-foreground">Save buttons on colleges and events are coming next. Anything you save will appear here, visible only to you.</p>
        <div className="mt-10 border-t">
          {data?.length ? data.map((c) => (
            <Link key={c.slug} to="/colleges/$slug" params={{ slug: c.slug }} className="block border-b py-4 font-display text-lg hover:text-primary">{c.name}</Link>
          )) : <p className="border-b py-6 text-sm text-muted-foreground">{isLoading ? "Loading…" : "Nothing saved yet."} <Link to="/colleges" className="text-primary hover:underline">Browse colleges →</Link></p>}
        </div>
      </section>
    </SiteShell>
  );
}
