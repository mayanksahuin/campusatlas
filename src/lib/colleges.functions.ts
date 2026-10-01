import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { College, CollegeDetail, CollegeType, Verification } from "./colleges";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Database connection is not configured");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const SELECT = "*, college_aliases(alias), college_programs(degree)";

type Row = Database["public"]["Tables"]["colleges"]["Row"] & {
  college_aliases: { alias: string }[];
  college_programs: { degree: string }[];
};

function toCollege(r: Row): College {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    aliases: r.college_aliases.map((a) => a.alias),
    type: r.institution_type as CollegeType,
    ownership: r.ownership as College["ownership"],
    area: r.area,
    established: r.established_year,
    affiliation: r.affiliation,
    website: r.website,
    entrance: r.entrance_routes,
    programs: r.college_programs.map((p) => p.degree),
    summary: r.summary,
    verification: r.verification_status as Verification,
    lastVerifiedAt: r.last_verified_at,
    updatedAt: r.updated_at,
  };
}

export const listColleges = createServerFn({ method: "GET" }).handler(async (): Promise<College[]> => {
  const { data, error } = await publicClient().from("colleges").select(SELECT).order("name");
  if (error) {
    console.error("listColleges", error);
    throw new Error("Could not load colleges");
  }
  return (data as unknown as Row[]).map(toCollege);
});

export const searchColleges = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ q: z.string().max(100).optional(), kind: z.string().max(60).optional() }).parse(d))
  .handler(async ({ data }): Promise<College[]> => {
    const sb = publicClient();
    const { data: hits, error } = await sb.rpc("search_colleges", { q: data.q ?? "", kind: data.kind ?? null as unknown as string });
    if (error) {
      console.error("searchColleges", error);
      throw new Error("Search failed");
    }
    const ids = (hits ?? []).map((h) => h.id);
    if (!ids.length) return [];
    const { data: rows, error: e2 } = await sb.from("colleges").select(SELECT).in("id", ids).order("name");
    if (e2) throw new Error("Search failed");
    return (rows as unknown as Row[]).map(toCollege);
  });

export const getCollegeBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<CollegeDetail | null> => {
    const { data: r, error } = await publicClient()
      .from("colleges")
      .select(`${SELECT}, college_sources(*), college_facilities(*), college_clubs(*), college_social_links(*)`)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) {
      console.error("getCollegeBySlug", error);
      throw new Error("Could not load college");
    }
    if (!r) return null;
    const x = r as unknown as Row & {
      college_sources: Database["public"]["Tables"]["college_sources"]["Row"][];
      college_facilities: Database["public"]["Tables"]["college_facilities"]["Row"][];
      college_clubs: Database["public"]["Tables"]["college_clubs"]["Row"][];
      college_social_links: Database["public"]["Tables"]["college_social_links"]["Row"][];
    };
    return {
      ...toCollege(x),
      sources: x.college_sources.map((s) => ({ id: s.id, url: s.url, title: s.title, sourceType: s.source_type, notes: s.notes, verification: s.verification_status as Verification, lastVerifiedAt: s.last_verified_at })),
      facilities: x.college_facilities.map((f) => ({ id: f.id, category: f.category, name: f.name, description: f.description, verification: f.verification_status as Verification })),
      clubs: x.college_clubs.map((c) => ({ id: c.id, category: c.category, name: c.name, description: c.description, url: c.url, verification: c.verification_status as Verification })),
      socials: x.college_social_links.map((s) => ({ id: s.id, platform: s.platform, url: s.url, verification: s.verification_status as Verification })),
    };
  });

export const collegesQuery = () => queryOptions({ queryKey: ["colleges"], queryFn: () => listColleges(), staleTime: 60_000 });
export const collegeQuery = (slug: string) =>
  queryOptions({ queryKey: ["colleges", slug], queryFn: () => getCollegeBySlug({ data: { slug } }), staleTime: 60_000 });
