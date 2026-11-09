"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Japan", "Brazil", "South Africa",
];

function EterPayLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="18" cy="18" r="17" stroke="#0f4d40" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="18" r="12" stroke="#0f4d40" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        <circle cx="18" cy="18" r="6.5" stroke="#0f4d40" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="18" r="2.5" fill="#0f4d40" />
        <path d="M4 18 Q11 10 18 18 Q25 26 32 18" stroke="#0f4d40" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-xl tracking-tight text-[#111111]" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em" }}>
        EterPay
      </span>
    </div>
  );
}

function PersonalForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", country: "India", password: "", confirm: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    onSubmit();
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)", border: "1px solid rgba(220,38,38,0.15)" }}>
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>First name</label>
          <input className="input" placeholder="Jane" value={form.firstName} onChange={set("firstName")} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Last name</label>
          <input className="input" placeholder="Doe" value={form.lastName} onChange={set("lastName")} required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Email address</label>
        <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Phone number</label>
        <input type="tel" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Country</label>
        <select className="input" value={form.country} onChange={set("country")} required>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Password</label>
        <input type="password" className="input" placeholder="At least 8 characters" value={form.password} onChange={set("password")} required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Confirm password</label>
        <input type="password" className="input" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} required />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-2">
        Create personal account
      </button>
    </form>
  );
}

function BusinessForm({ onSubmit }: { onSubmit: () => void }) {
  const [form, setForm] = useState({ bizName: "", regNumber: "", country: "India", email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    onSubmit();
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)", border: "1px solid rgba(220,38,38,0.15)" }}>
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Business name</label>
        <input className="input" placeholder="Acme Payments Pvt. Ltd." value={form.bizName} onChange={set("bizName")} required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Registration number</label>
        <input className="input" placeholder="CIN / GSTIN / EIN" value={form.regNumber} onChange={set("regNumber")} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Country</label>
        <select className="input" value={form.country} onChange={set("country")} required>
          {COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Business email</label>
        <input type="email" className="input" placeholder="contact@acme.com" value={form.email} onChange={set("email")} required />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Password</label>
        <input type="password" className="input" placeholder="At least 8 characters" value={form.password} onChange={set("password")} required />
      </div>
      <button type="submit" className="btn btn-primary w-full mt-2">
        Create business account
      </button>
    </form>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"personal" | "business">("personal");

  function handleSuccess() {
    localStorage.setItem("eterpay_session", "demo_active");
    router.push("/onboarding");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Demo banner */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.18)", color: "var(--warning)" }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          Demo Application — No real account will be created
        </div>
      </div>

      <div className="card w-full max-w-md p-8" style={{ borderRadius: "1.25rem" }}>
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <EterPayLogo />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl text-[#111111] mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em", fontWeight: 400 }}>
          Create your account.
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
          Join EterPay and send money globally.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "var(--surface-1)" }}>
          {(["personal", "business"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: tab === t ? "white" : "transparent",
                color: tab === t ? "var(--ink)" : "var(--ink-muted)",
                border: tab === t ? "1px solid var(--border)" : "1px solid transparent",
                boxShadow: tab === t ? "0 1px 4px rgba(17,17,17,0.08)" : "none",
              }}
            >
              {t === "personal" ? "Personal" : "Business"}
            </button>
          ))}
        </div>

        {/* Form */}
        {tab === "personal" ? (
          <PersonalForm onSubmit={handleSuccess} />
        ) : (
          <BusinessForm onSubmit={handleSuccess} />
        )}

        {/* Divider */}
        <div className="divider my-6" />

        <p className="text-center text-sm" style={{ color: "var(--ink-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-medium" style={{ color: "var(--forest)" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
