import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { verificationLabel, type College } from "@/lib/colleges";

const nav = [
  { to: "/colleges", label: "Colleges" },
  { to: "/compare", label: "Compare" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold">Campus<span className="text-primary">Atlas</span></span>
            <span className="eyebrow hidden sm:inline">Jaipur</span>
          </Link>
          <nav className="flex gap-6 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-semibold" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-24 bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl">CampusAtlas</p>
            <p className="mt-2 text-sm opacity-70">Jaipur's Engineering Colleges. Decoded.</p>
          </div>
          <p className="text-sm opacity-70 md:col-span-2">
            Information is compiled from public and official sources. Every record carries a verification status — always confirm admissions, fees and placements on the institution's official website. No rankings, no paid placements.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function VerificationBadge({ status }: { status: College["verification"] }) {
  const tone = status === "pending" ? "border-border text-muted-foreground" : status === "verified" ? "border-success text-success" : "border-primary text-primary";
  return <span className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone}`}>● {verificationLabel[status]}</span>;
}

export function CollegeRow({ c }: { c: College }) {
  return (
    <Link to="/colleges/$slug" params={{ slug: c.slug }} className="group grid grid-cols-12 items-center gap-4 border-b py-5 transition-colors hover:bg-muted/60">
      <div className="col-span-12 md:col-span-6">
        <h3 className="font-display text-xl group-hover:text-primary">{c.name}</h3>
        {c.aliases.length > 0 && <p className="text-xs text-muted-foreground">{c.aliases.join(" · ")}</p>}
      </div>
      <p className="col-span-6 text-sm text-muted-foreground md:col-span-3">{c.type}</p>
      <p className="col-span-6 text-sm md:col-span-2">{c.area ?? <span className="text-muted-foreground">Location pending</span>}</p>
      <div className="col-span-12 md:col-span-1 md:text-right"><VerificationBadge status={c.verification} /></div>
    </Link>
  );
}
