import type { InputHTMLAttributes, ReactNode } from "react";

export function Field({ label, hint, ...props }: { label: string; hint?: string | undefined } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input {...props} className="mt-2 block w-full border bg-background px-3 py-2.5 text-base outline-none transition-colors focus:border-primary" />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({ children, ...props }: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="w-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">{children}</button>;
}

export function Notice({ tone, children }: { tone: "error" | "ok"; children: ReactNode }) {
  return <p role={tone === "error" ? "alert" : "status"} className={`border-l-2 px-3 py-2 text-sm ${tone === "error" ? "border-destructive bg-destructive/5 text-destructive" : "border-success bg-success/5"}`}>{children}</p>;
}
