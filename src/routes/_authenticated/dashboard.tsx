import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site";
import { accountStatsQuery, profileQuery, recentQuery } from "@/lib/account";

export const Route = createFileRoute("/_authenticated/dashboard")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Your dashboard — CampusAtlas" },
    { name: "description", content: "Your CampusAtlas dashboard: profile, saved colleges and events." },
    { property: "og:title", content: "Your dashboard — CampusAtlas" },
    { property: "og:description", content: "Your CampusAtlas dashboard." },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useQuery(profileQuery());
  const stats = useQuery(accountStatsQuery());
  const recent = useQuery(recentQuery());
  const p = profile.data;
  const first = p?.full_name?.split(" ")[0];
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-4 text-4xl leading-tight md:text-6xl">{profile.isLoading ? "Welcome." : `Welcome${first ? `, ${first}` : ""}.`}</h1>
        {profile.error && <p className="mt-4 text-destructive">Couldn't load your profile. Refresh to try again.</p>}

        <div className="mt-12 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Saved colleges" value={stats.data?.colleges} />
          <Stat label="Saved events" value={stats.data?.events} />
          <Stat label="Account type" value={p ? (p.user_type === "teacher" ? "Teacher" : "Student") : undefined} />
          <Stat label="Member since" value={p ? new Date(p.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : undefined} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow">Recently viewed colleges</p>
            <div className="mt-4 border-t">
              {recent.data?.length ? recent.data.map((r) => (
                <Link key={r.slug} to="/colleges/$slug" params={{ slug: r.slug }} className="flex items-baseline justify-between gap-4 border-b py-4 hover:text-primary">
                  <span className="font-display text-lg">{r.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{r.institution_type}</span>
                </Link>
              )) : <p className="border-b py-6 text-sm text-muted-foreground">{recent.isLoading ? "Loading…" : "Colleges you open will show up here."}</p>}
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="border p-6">
              <p className="eyebrow">Profile</p>
              <dl className="mt-3 space-y-2 text-sm">
                <Row k="Name" v={p?.full_name || "—"} />
                <Row k="Email" v={p?.email || "—"} />
                <Row k="Institution" v={p?.institution || "—"} />
                <Row k="Course" v={p?.course || "—"} />
              </dl>
              <Link to="/profile" className="mt-4 inline-block text-sm text-primary hover:underline">Edit profile →</Link>
            </div>
            <div className="border p-6">
              <p className="eyebrow">Quick links</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Link to="/colleges" className="border px-3 py-2 hover:border-primary">Colleges</Link>
                <Link to="/compare" className="border px-3 py-2 hover:border-primary">Compare</Link>
                <Link to="/events" className="border px-3 py-2 hover:border-primary">Events</Link>
                <Link to="/saved" className="border px-3 py-2 hover:border-primary">Saved</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value }: { label: string; value?: string | number | undefined }) {
  return <div className="bg-background p-6"><p className="eyebrow">{label}</p><p className="mt-3 font-display text-4xl">{value ?? "…"}</p></div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="truncate text-right">{v}</dd></div>;
}
