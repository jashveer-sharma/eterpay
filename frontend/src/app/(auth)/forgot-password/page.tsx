"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Demo banner */}
      <div className="w-full max-w-sm mb-6">
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.18)", color: "var(--warning)" }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          Demo Application — No real email will be sent
        </div>
      </div>

      <div className="card w-full max-w-sm p-8" style={{ borderRadius: "1.25rem" }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <EterPayLogo />
        </div>

        {!submitted ? (
          <>
            {/* Headline */}
            <h1 className="font-serif text-3xl text-[#111111] mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em", fontWeight: 400 }}>
              Reset your password.
            </h1>
            <p className="text-sm mb-7" style={{ color: "var(--ink-muted)" }}>
              Enter your email and we&apos;ll send you a one-time code.
            </p>

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

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Send reset code"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--info-bg)", border: "1.5px solid rgba(15,77,64,0.2)" }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#0f4d40" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <h1 className="font-serif text-3xl text-[#111111] mb-1 text-center" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em", fontWeight: 400 }}>
              Check your email.
            </h1>
            <p className="text-sm mb-6 text-center" style={{ color: "var(--ink-muted)" }}>
              We&apos;ve sent a reset code to{" "}
              <span className="font-medium" style={{ color: "var(--ink)" }}>{email}</span>.
            </p>

            {/* Mock OTP box */}
            <div className="p-5 rounded-xl mb-6 text-center" style={{ backgroundColor: "var(--info-bg)", border: "1.5px solid rgba(15,77,64,0.2)" }}>
              <p className="label-eyebrow-forest mb-2">Your demo OTP is</p>
              <p className="font-serif text-4xl tabular tracking-widest" style={{ fontFamily: "var(--font-serif)", color: "var(--forest)", letterSpacing: "0.18em" }}>
                123456
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--ink-faint)" }}>
                This code is for demo purposes only
              </p>
            </div>

            <p className="text-xs text-center mb-5" style={{ color: "var(--ink-muted)" }}>
              Didn&apos;t get it?{" "}
              <button
                className="font-medium underline"
                style={{ color: "var(--forest)", backgroundColor: "none", border: "none", cursor: "pointer" }}
                onClick={() => setSubmitted(false)}
              >
                Try again
              </button>
            </p>
          </>
        )}

        {/* Divider */}
        <div className="divider my-5" />

        <div className="text-center">
          <Link href="/login" className="text-sm font-medium flex items-center justify-center gap-1.5" style={{ color: "var(--ink-muted)" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
