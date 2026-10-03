import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteShell, VerificationBadge } from "@/components/site";
import { useSuspenseQuery } from "@tanstack/react-query";
import { collegeQuery } from "@/lib/colleges.functions";

export const Route = createFileRoute("/colleges/$slug")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const college = await context.queryClient.ensureQueryData(collegeQuery(params.slug));
    if (!college) throw notFound();
    return { college };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "College not found — CampusAtlas" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.college;
    const d = c.summary ?? `${c.name} — ${c.type} in ${c.area}, Jaipur.`;
    return { meta: [
      { title: `${c.name} — CampusAtlas` }, { name: "description", content: d },
      { property: "og:title", content: `${c.name} — CampusAtlas` }, { property: "og:description", content: d },
    ] };
  },
  notFoundComponent: () => (
    <SiteShell><div className="py-32 text-center"><h1 className="text-4xl">College not found</h1><Link to="/colleges" className="mt-4 inline-block text-primary">Back to all colleges</Link></div></SiteShell>
  ),
  errorComponent: () => <SiteShell><p className="py-32 text-center">Couldn't load this college.</p></SiteShell>,
  component: Profile,
});

const Missing = () => <span className="text-muted-foreground">Not yet verified</span>;

function Profile() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(collegeQuery(slug));
  const c = data!;
  const facts: [string, React.ReactNode][] = [
    ["Type", c.type], ["Ownership", c.ownership], ["Location", c.area ? `${c.area}, Jaipur` : <Missing />],
    ["Established", c.established ?? <Missing />], ["Affiliation", c.affiliation ?? <Missing />],
    ["Entrance routes", (c.entrance.join(", ") || <Missing />)], ["Programs", (c.programs.join(", ") || <Missing />)],
    ["Official website", c.website ? <a href={c.website} target="_blank" rel="noreferrer" className="text-primary underline">{c.website.replace("https://", "")}</a> : <Missing />],
  ];
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 pt-14">
        <Link to="/colleges" className="eyebrow hover:text-primary">← All colleges</Link>
        <div className="mt-6"><VerificationBadge status={c.verification} /></div>
        <h1 className="mt-4 max-w-4xl text-5xl leading-tight md:text-6xl">{c.name}</h1>
        {c.aliases.length > 0 && <p className="mt-2 font-mono text-sm text-muted-foreground">also known as {c.aliases.join(", ")}</p>}
        {c.summary && <p className="mt-8 max-w-2xl text-xl leading-relaxed">{c.summary}</p>}
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <dl className="border-t lg:col-span-8">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 border-b py-4">
                <dt className="eyebrow pt-1">{k}</dt><dd className="col-span-2">{v}</dd>
              </div>
            ))}
          </dl>
          <aside className="space-y-6 lg:col-span-4">
            <div className="border p-6">
              <p className="eyebrow">Sources</p>
              <ul className="mt-3 space-y-3 text-sm">
                {c.sources.map((s) => (
                  <li key={s.id}>
                    {s.url.startsWith("http") ? <a href={s.url} target="_blank" rel="noreferrer" className="text-primary underline">{s.title ?? s.url}</a> : <span>{s.title}</span>}
                    <div className="mt-1"><VerificationBadge status={s.verification} /></div>
                    {s.notes && <p className="mt-1 text-xs text-muted-foreground">{s.notes}</p>}
                    <p className="text-xs text-muted-foreground">Last verified: {s.lastVerifiedAt ? new Date(s.lastVerifiedAt).toLocaleDateString("en-IN") : "not yet"}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink p-6 text-ink-foreground">
              <p className="eyebrow !text-primary">Coming next</p>
              <p className="mt-3 text-sm opacity-80">Clubs, events, hostels, fees and placements will appear here once confirmed from official sources.</p>
            </div>
            <Link to="/compare" search={{ a: c.slug }} className="block border border-foreground p-4 text-center font-semibold hover:bg-foreground hover:text-background">Compare this college</Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
