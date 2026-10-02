import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/site";
import { Field, Notice, PrimaryButton } from "@/components/forms";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/account";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [
    { title: "Your profile — CampusAtlas" },
    { name: "description", content: "Edit your CampusAtlas profile." },
    { property: "og:title", content: "Your profile — CampusAtlas" },
    { property: "og:description", content: "Edit your CampusAtlas profile." },
    { name: "robots", content: "noindex" },
  ] }),
  component: ProfilePage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(100),
  institution: z.string().trim().max(150),
  course: z.string().trim().max(100),
});

function ProfilePage() {
  const qc = useQueryClient();
  const { data: p, isLoading } = useQuery(profileQuery());
  const [type, setType] = useState<"student" | "teacher" | null>(null);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const userType = type ?? p?.user_type ?? "student";

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!p) return;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return setMsg({ tone: "error", text: (parsed.error.issues[0]?.message ?? "Invalid input") });
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      full_name: parsed.data.full_name, user_type: userType,
      institution: parsed.data.institution || null, course: parsed.data.course || null,
    }).eq("id", p.id);
    setBusy(false);
    if (error) return setMsg({ tone: "error", text: "Couldn't save. Please try again." });
    setMsg({ tone: "ok", text: "Profile saved." });
    qc.invalidateQueries({ queryKey: ["account"] });
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-2xl px-6 py-14">
        <p className="eyebrow">Profile</p>
        <h1 className="mt-4 text-4xl md:text-5xl">Your details.</h1>
        {isLoading || !p ? <p className="mt-8 text-muted-foreground">{isLoading ? "Loading…" : "Profile not found."}</p> : (
          <form key={p.id} onSubmit={submit} className="mt-10 space-y-5 border bg-card p-6 sm:p-8" noValidate>
            <Field label="Full name" name="full_name" defaultValue={p.full_name} />
            <Field label="Email" value={p.email} readOnly disabled hint="Your sign-in email can't be changed here." />
            <div>
              <span className="eyebrow">I am a</span>
              <div className="mt-2 grid grid-cols-2 border">
                {(["student", "teacher"] as const).map((t) => (
                  <button key={t} type="button" aria-pressed={userType === t} onClick={() => setType(t)} className={`py-2 text-sm capitalize ${userType === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t}</button>
                ))}
              </div>
            </div>
            <Field label="College / institution (optional)" name="institution" defaultValue={p.institution ?? ""} />
            <Field label="Course / branch (optional)" name="course" defaultValue={p.course ?? ""} />
            <p className="text-xs text-muted-foreground">Member since {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</PrimaryButton>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
