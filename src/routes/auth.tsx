import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteShell } from "@/components/site";
import { Field, Notice, PrimaryButton } from "@/components/forms";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { friendlyAuthError } from "@/lib/auth";

type Mode = "login" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ mode: (["login", "signup", "forgot"].includes(s["mode"] as string) ? s["mode"] : "login") as Mode }),
  head: () => ({ meta: [
    { title: "Log in or sign up — CampusAtlas" },
    { name: "description", content: "Create a free CampusAtlas account for students and teachers to save colleges and events." },
    { property: "og:title", content: "Log in or sign up — CampusAtlas" },
    { property: "og:description", content: "Create a free CampusAtlas account for students and teachers." },
  ] }),
  component: AuthPage,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  user_type: z.enum(["student", "teacher"]),
  institution: z.string().trim().max(150),
  course: z.string().trim().max(100),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userType, setUserType] = useState<"student" | "teacher">("student");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/dashboard", replace: true }); });
  }, [navigate]);
  useEffect(() => { setError(null); setOk(null); }, [mode]);

  const setMode = (m: Mode) => navigate({ to: "/auth", search: { mode: m } });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setOk(null);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      if (mode === "login") {
        if (!f["email"] || !f["password"]) throw new Error("Enter your email and password.");
        const { error } = await supabase.auth.signInWithPassword({ email: f["email"].trim(), password: f["password"] });
        if (error) throw error;
        navigate({ to: "/dashboard", replace: true });
      } else if (mode === "signup") {
        const parsed = signupSchema.safeParse({ ...f, user_type: userType });
        if (!parsed.success) throw new Error((parsed.error.issues[0]?.message ?? "Invalid input"));
        const { email, password, ...meta } = parsed.data;
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard", data: meta } });
        if (error) throw error;
        if (data.session) navigate({ to: "/dashboard", replace: true });
        else setOk(`Almost done — we sent a confirmation link to ${email}. Open it to activate your account.`);
      } else {
        const email = z.string().trim().email("Enter a valid email").safeParse(f["email"]);
        if (!email.success) throw new Error((email.error.issues[0]?.message ?? "Invalid email"));
        const { error } = await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        setOk("If an account exists for that email, a reset link is on its way.");
      }
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : String(err)));
    } finally { setBusy(false); }
  }

  async function google() {
    setError(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setError(friendlyAuthError(r.error.message));
    else if (!r.redirected) navigate({ to: "/dashboard", replace: true });
  }

  const title = mode === "login" ? "Welcome back." : mode === "signup" ? "Join CampusAtlas." : "Reset your password.";

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-4 text-5xl leading-tight md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Free for students and teachers. Save colleges, track events and pick up where you left off.</p>
        </div>
        <div className="border bg-card p-6 sm:p-8">
          {mode !== "forgot" && (
            <div className="mb-6 grid grid-cols-2 border">
              {(["login", "signup"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} className={`py-2.5 text-sm font-semibold ${mode === m ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {m === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === "signup" && (
              <>
                <Field label="Full name" name="full_name" autoComplete="name" required />
                <div>
                  <span className="eyebrow">I am a</span>
                  <div className="mt-2 grid grid-cols-2 border">
                    {(["student", "teacher"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setUserType(t)} aria-pressed={userType === t} className={`py-2 text-sm capitalize ${userType === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <Field label="Email" name="email" type="email" autoComplete="email" required />
            {mode !== "forgot" && <Field label="Password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} hint={mode === "signup" ? "At least 8 characters." : undefined} required />}
            {mode === "signup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="College / institution (optional)" name="institution" />
                <Field label="Course / branch (optional)" name="course" />
              </div>
            )}
            {error && <Notice tone="error">{error}</Notice>}
            {ok && <Notice tone="ok">{ok}</Notice>}
            <PrimaryButton type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}</PrimaryButton>
          </form>
          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>
              <button type="button" onClick={google} className="w-full border px-4 py-3 text-sm font-semibold hover:bg-muted">Continue with Google</button>
            </>
          )}
          <div className="mt-6 text-sm">
            {mode === "login" && <button type="button" onClick={() => setMode("forgot")} className="text-primary hover:underline">Forgot password?</button>}
            {mode === "forgot" && <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">← Back to log in</button>}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
