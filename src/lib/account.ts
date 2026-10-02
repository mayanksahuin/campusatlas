// User-owned data. Read through the browser client; RLS limits every row to its owner.
import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string; full_name: string; email: string; user_type: "student" | "teacher";
  institution: string | null; course: string | null; created_at: string;
};

async function uid() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export const profileQuery = () => queryOptions({
  queryKey: ["account", "profile"],
  queryFn: async () => {
    const id = await uid();
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  },
});

export const accountStatsQuery = () => queryOptions({
  queryKey: ["account", "stats"],
  queryFn: async () => {
    await uid();
    const [c, e] = await Promise.all([
      supabase.from("saved_colleges").select("id", { count: "exact", head: true }),
      supabase.from("saved_events").select("id", { count: "exact", head: true }),
    ]);
    return { colleges: c.count ?? 0, events: e.count ?? 0 };
  },
});

export const recentQuery = () => queryOptions({
  queryKey: ["account", "recent"],
  queryFn: async () => {
    await uid();
    const { data, error } = await supabase
      .from("recently_viewed_colleges")
      .select("viewed_at, colleges(slug, name, institution_type)")
      .order("viewed_at", { ascending: false }).limit(6);
    if (error) throw error;
    return (data ?? []).map((r) => ({ viewedAt: r.viewed_at, ...(r.colleges as { slug: string; name: string; institution_type: string }) }));
  },
});

export const savedCollegesQuery = () => queryOptions({
  queryKey: ["account", "saved-colleges"],
  queryFn: async () => {
    await uid();
    const { data, error } = await supabase.from("saved_colleges").select("created_at, colleges(slug, name, institution_type)").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => r.colleges as { slug: string; name: string; institution_type: string });
  },
});

export async function recordCollegeView(collegeId: string) {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  await supabase.from("recently_viewed_colleges").upsert({ user_id: user.id, college_id: collegeId, viewed_at: new Date().toISOString() });
}
