import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteShell } from "@/components/site";
import { Field, Notice, PrimaryButton } from "@/components/forms";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Set a new password — CampusAtlas" },
    { name: "description", content: "Choose a new password for your CampusAtlas account." },
    { property: "og:title", content: "Set a new password — CampusAtlas" },
    { property: "og:description", content: "Choose a new password for your CampusAtlas account." },
    { name: "robots", content: "noindex" },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => { if (e === "PASSWORD_RECOVERY" || s) setReady(true); });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const pw = String(f.get("password") ?? ""), confirm = String(f.get("confirm") ?? "");
    setError(null);
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setError(friendlyAuthError(error.message));
    setOk(true);
    setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-md px-6 py-20">
        <p className="eyebrow">Account</p>
        <h1 className="mt-4 text-4xl">Set a new password.</h1>
        <div className="mt-8 border bg-card p-6 sm:p-8">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Open this page from the reset link in your email. If the link has expired, request a new one from the log-in page.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
              <Field label="New password" name="password" type="password" autoComplete="new-password" hint="At least 8 characters." />
              <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" />
              {error && <Notice tone="error">{error}</Notice>}
              {ok && <Notice tone="ok">Password updated. Taking you to your dashboard…</Notice>}
              <PrimaryButton type="submit" disabled={busy || ok}>{busy ? "Saving…" : "Update password"}</PrimaryButton>
            </form>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
