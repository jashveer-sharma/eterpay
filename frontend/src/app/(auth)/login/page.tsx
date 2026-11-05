"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEMO_EMAIL = "demo@eterpay.com";
const DEMO_PASSWORD = "Demo1234!";

function EterPayLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="18" cy="18" r="17" stroke="#0f4d40" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="18" r="12" stroke="#0f4d40" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
        <circle cx="18" cy="18" r="6.5" stroke="#0f4d40" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="18" r="2.5" fill="#0f4d40" />
        <path d="M4 18 Q11 10 18 18 Q25 26 32 18" stroke="#0f4d40" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-2xl tracking-tight text-[#111111]" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em" }}>
        EterPay
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("eterpay_session", "active");
          localStorage.setItem("eterpay_jwt", data.access_token);
          localStorage.setItem("eterpay_user", JSON.stringify(data.user));
        }
        router.push("/dashboard");
        return;
      }

      // If backend returned 401 or invalid credentials
      const errData = await res.json().catch(() => ({}));
      setError(errData.detail || "Incorrect email or password. Verify credentials.");
    } catch {
      // Offline fallback
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem("eterpay_session", "demo_active");
        router.push("/dashboard");
      } else {
        setError("Incorrect email or password. Try the demo credentials below.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Demo banner */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.18)", color: "var(--warning)" }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          Demo Application — No real transactions processed
        </div>
      </div>

      <div className="card w-full max-w-sm p-8" style={{ borderRadius: "1.25rem" }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <EterPayLogo />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-3xl text-[#111111] mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em", fontWeight: 400 }}>
          Welcome back.
        </h1>
        <p className="text-sm mb-7" style={{ color: "var(--ink-muted)" }}>
          Log in to your EterPay account.
        </p>

        {/* Demo credentials info box */}
        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: "var(--info-bg)", border: "1px solid rgba(15,77,64,0.14)" }}>
          <p className="label-eyebrow-forest mb-2">Demo credentials</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>Email</span>
              <span className="text-xs font-medium tabular" style={{ color: "var(--forest)", fontFamily: "var(--font-sans)" }}>demo@eterpay.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>Password</span>
              <span className="text-xs font-medium tabular" style={{ color: "var(--forest)" }}>Demo1234!</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "var(--error-bg)", color: "var(--error)", border: "1px solid rgba(220,38,38,0.15)" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
              Email address
            </label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium" style={{ color: "var(--ink-muted)" }}>
                Password
              </label>
              <Link href="/forgot-password" className="text-xs" style={{ color: "var(--forest)" }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-2"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider my-6" />

        {/* Sign up link */}
        <p className="text-center text-sm" style={{ color: "var(--ink-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium" style={{ color: "var(--forest)" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
