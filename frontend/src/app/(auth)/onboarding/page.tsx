"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Singapore", "UAE", "Japan", "Brazil",
];

const CURRENCIES = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "JPY", label: "Japanese Yen (¥)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
];

type PaymentMethod = "upi" | "bank" | "card" | null;

const STEPS = ["About you", "Wallet", "Payment method", "All set"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={{
                  backgroundColor: i < step ? "var(--forest)" : i === step ? "var(--forest)" : "var(--surface-2)",
                  color: i <= step ? "white" : "var(--ink-muted)",
                  border: i === step ? "2.5px solid var(--forest-dark)" : "2px solid transparent",
                  boxShadow: i === step ? "0 0 0 3px rgba(15,77,64,0.14)" : "none",
                }}
              >
                {i < step ? (
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-xs mt-1.5 hidden sm:block" style={{ color: i <= step ? "var(--forest)" : "var(--ink-faint)", fontWeight: i === step ? 500 : 400 }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 mt-0 sm:-mt-5 transition-all duration-500" style={{ backgroundColor: i < step ? "var(--forest)" : "var(--border-strong)" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");
  const [country, setCountry] = useState("India");
  const [currency, setCurrency] = useState("INR");

  return (
    <div className="animate-fade-in-up">
      <span className="label-eyebrow">Step 1 of 4</span>
      <h2 className="font-serif text-2xl mt-1 mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em", fontWeight: 400 }}>
        Tell us about yourself.
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
        Help us personalize your EterPay experience.
      </p>

      <div className="space-y-5">
        {/* Account type */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: "var(--ink-muted)" }}>Account type</label>
          <div className="grid grid-cols-2 gap-3">
            {(["personal", "business"] as const).map(t => (
              <button
                key={t}
                onClick={() => setAccountType(t)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  backgroundColor: accountType === t ? "var(--forest-mist)" : "white",
                  border: accountType === t ? "1.5px solid var(--forest)" : "1.5px solid var(--border-strong)",
                }}
              >
                <span className="block text-lg mb-1">{t === "personal" ? "👤" : "🏢"}</span>
                <span className="block text-sm font-medium capitalize" style={{ color: accountType === t ? "var(--forest)" : "var(--ink)" }}>{t}</span>
                <span className="block text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>
                  {t === "personal" ? "For individuals" : "For companies"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Country</label>
          <select className="input" value={country} onChange={e => setCountry(e.target.value)}>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Primary currency */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>Primary currency</label>
          <select className="input" value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary w-full mt-7" onClick={onNext}>
        Continue
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const stages = [
    "Generating wallet address…",
    "Allocating multi-currency ledger…",
    "Configuring security keys…",
    "Wallet ready!",
  ];
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 7, 100);
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) setStageIdx(0);
    else if (progress < 60) setStageIdx(1);
    else if (progress < 90) setStageIdx(2);
    else {
      setStageIdx(3);
      setDone(true);
    }
  }, [progress]);

  return (
    <div className="animate-fade-in-up text-center">
      <span className="label-eyebrow">Step 2 of 4</span>
      <h2 className="font-serif text-2xl mt-1 mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em", fontWeight: 400 }}>
        Set up your wallet.
      </h2>
      <p className="text-sm mb-8" style={{ color: "var(--ink-muted)" }}>
        We&apos;re creating your secure multi-currency wallet.
      </p>

      {/* Animated wallet graphic */}
      <div className="flex justify-center mb-7">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--forest-mist)", border: "1.5px solid rgba(15,77,64,0.15)" }}>
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#0f4d40" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          {!done && (
            <svg className="absolute inset-0 w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="44" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="#0f4d40"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.1s" }}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{ width: `${progress}%`, background: "var(--forest)" }}
        />
      </div>

      <p className="text-sm font-medium mb-1" style={{ color: done ? "var(--forest)" : "var(--ink)" }}>
        {stages[stageIdx]}
      </p>
      <p className="tabular text-xs" style={{ color: "var(--ink-faint)" }}>{progress}%</p>

      {done && (
        <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "var(--info-bg)", border: "1px solid rgba(15,77,64,0.14)" }}>
          <p className="text-xs font-medium" style={{ color: "var(--forest)" }}>
            ✓ Wallet address: <span className="tabular">EP·{Math.random().toString(36).slice(2, 8).toUpperCase()}·IN</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--ink-faint)" }}>Supports INR, USD, EUR, GBP and 15+ currencies</p>
        </div>
      )}

      <button
        className="btn btn-primary w-full mt-7"
        onClick={onNext}
        disabled={!done}
        style={{ opacity: done ? 1 : 0.4 }}
      >
        Continue
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<PaymentMethod>(null);

  const methods = [
    {
      id: "upi" as PaymentMethod,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: "UPI",
      subtitle: "PhonePe, GPay, Paytm, etc.",
    },
    {
      id: "bank" as PaymentMethod,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
        </svg>
      ),
      title: "Bank Account",
      subtitle: "NEFT / RTGS / IMPS",
    },
    {
      id: "card" as PaymentMethod,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path strokeLinecap="round" d="M2 10h20" />
        </svg>
      ),
      title: "Debit / Credit Card",
      subtitle: "Visa, Mastercard, RuPay",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <span className="label-eyebrow">Step 3 of 4</span>
      <h2 className="font-serif text-2xl mt-1 mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em", fontWeight: 400 }}>
        Connect a payment method.
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-muted)" }}>
        Choose how you&apos;d like to fund your wallet.
      </p>

      <div className="space-y-3">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
            style={{
              backgroundColor: selected === m.id ? "var(--forest-mist)" : "white",
              border: selected === m.id ? "1.5px solid var(--forest)" : "1.5px solid var(--border-strong)",
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: selected === m.id ? "rgba(15,77,64,0.1)" : "var(--surface-1)", color: selected === m.id ? "var(--forest)" : "var(--ink-muted)" }}>
              {m.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: selected === m.id ? "var(--forest)" : "var(--ink)" }}>{m.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--ink-faint)" }}>{m.subtitle}</p>
            </div>
            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
              style={{ backgroundColor: selected === m.id ? "var(--forest)" : "transparent", border: selected === m.id ? "2px solid var(--forest)" : "2px solid var(--border-strong)" }}>
              {selected === m.id && (
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs mt-4 text-center" style={{ color: "var(--ink-faint)" }}>
        You can skip this and add a payment method later from settings.
      </p>

      <div className="flex gap-3 mt-6">
        <button className="btn btn-secondary flex-1" onClick={onBack}>Back</button>
        <button
          className="btn btn-primary flex-1"
          onClick={onNext}
        >
          {selected ? "Continue" : "Skip for now"}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Step4({ onFinish }: { onFinish: () => void }) {
  const confettiItems = Array.from({ length: 18 }, (_, i) => i);
  const colors = ["#0f4d40", "#166b59", "#16a34a", "#111111", "#d97706", "#2563eb"];

  return (
    <div className="animate-fade-in-up text-center relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {confettiItems.map(i => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${5 + (i * 5.5) % 90}%`,
              top: `${(i * 7 + 5) % 50}%`,
              background: colors[i % colors.length],
              opacity: 0.5 + (i % 3) * 0.15,
              transform: `rotate(${i * 23}deg) scale(${0.6 + (i % 3) * 0.3})`,
            }}
          />
        ))}
      </div>

      <span className="label-eyebrow">Step 4 of 4</span>

      {/* Checkmark */}
      <div className="flex justify-center my-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--info-bg)", border: "1.5px solid rgba(15,77,64,0.2)" }}>
          <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="#0f4d40" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="font-serif text-3xl mb-1" style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.025em", fontWeight: 400 }}>
        You&apos;re all set!
      </h2>
      <p className="text-sm mb-7" style={{ color: "var(--ink-muted)" }}>
        Your EterPay account is ready. Here&apos;s a summary.
      </p>

      {/* Summary card */}
      <div className="card-cream p-5 rounded-xl text-left mb-6 space-y-3">
        {[
          { label: "Account type", value: "Personal" },
          { label: "Primary currency", value: "INR — Indian Rupee" },
          { label: "Wallet status", value: "Active ✓" },
          { label: "Supported currencies", value: "15+" },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--ink-muted)" }}>{row.label}</span>
            <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary w-full" onClick={onFinish}>
        Go to Dashboard
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <p className="text-xs mt-4" style={{ color: "var(--ink-faint)" }}>
        You can configure more settings from your profile anytime.
      </p>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  function handleFinish() {
    localStorage.setItem("eterpay_session", "demo_active");
    router.push("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* Demo banner */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-medium"
          style={{ backgroundColor: "rgba(217,119,6,0.07)", border: "1px solid rgba(217,119,6,0.18)", color: "var(--warning)" }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          Demo Application — Onboarding is simulated
        </div>
      </div>

      <div className="card w-full max-w-md p-8" style={{ borderRadius: "1.25rem" }}>
        <ProgressBar step={step} />

        {step === 0 && <Step1 onNext={next} />}
        {step === 1 && <Step2 onNext={next} />}
        {step === 2 && <Step3 onNext={next} onBack={back} />}
        {step === 3 && <Step4 onFinish={handleFinish} />}
      </div>
    </div>
  );
}
