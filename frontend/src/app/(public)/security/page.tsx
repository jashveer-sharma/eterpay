"use client";
import Link from "next/link";
import { ArrowRight, Shield, Lock, EyeOff, KeyRound, Server, CheckCircle2, AlertCircle } from "lucide-react";

export default function SecurityPage() {
  const securityPillars = [
    {
      icon: <Lock className="w-5 h-5 text-[#0f4d40]" />,
      title: "Zero Client Secrets Architecture",
      desc: "Private API keys, PayPal credentials, and DB connections never touch client JavaScript bundles. All auth tokens are issued via server-side session envelopes.",
    },
    {
      icon: <EyeOff className="w-5 h-5 text-[#0f4d40]" />,
      title: "Deterministic Payment Approval Gate",
      desc: "Our Eter AI agents have zero capability to unilaterally execute funds transfers. Every financial mutation requires explicit biometric or user cryptographic confirmation.",
    },
    {
      icon: <KeyRound className="w-5 h-5 text-[#0f4d40]" />,
      title: "Cryptographic Idempotency Guard",
      desc: "Every order mutation carries a unique UUID v4 idempotency token ensuring packet drops and network retries never trigger duplicate account charges.",
    },
    {
      icon: <Server className="w-5 h-5 text-[#0f4d40]" />,
      title: "Simulated Portfolio Quarantine",
      desc: "Educational wealth models operate in complete isolation from operational settlement ledgers. Simulated assets are distinctly labeled with zero capital at risk.",
    },
  ];

  const standards = [
    { name: "PCI-DSS Level 1 Reference Alignment", status: "Compliant" },
    { name: "PayPal Orders v2 Signature Validation", status: "Active" },
    { name: "AES-256 In-Flight & At-Rest Encryption", status: "Enforced" },
    { name: "FastAPI Pydantic v2 Type Safety", status: "Audited" },
    { name: "Multi-Model Fallback Circuit Breaker", status: "Active" },
  ];

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Shield className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">Fintech Trust & Infrastructure Security</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-6">
          Security engineered<br />at mathematical ground level.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mb-8">
          In financial systems, trust is not marketing—it is provable architecture. Discover how EterPay isolates credentials, validates signatures, and guarantees idempotency.
        </p>
      </section>

      {/* Pillars */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {securityPillars.map((p, idx) => (
            <div key={idx} className="card p-8 bg-white hover:border-[#0f4d40]/40 transition-all">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl w-fit mb-4">{p.icon}</div>
              <h3 className="font-semibold text-lg text-[#111111] mb-2">{p.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="card p-8 bg-white border-[rgba(17,17,17,0.08)]">
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
            <div>
              <span className="label-eyebrow">Rigorous Defense</span>
              <h3 className="font-serif text-2xl text-[#111111]">Telemetry & Safeguards Checklist</h3>
            </div>
            <span className="demo-badge">PCI-DSS Safe</span>
          </div>

          <div className="space-y-4 pt-6">
            {standards.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0f4d40]" />
                  <span className="text-sm font-medium text-[#111111]">{s.name}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[rgba(217,119,6,0.06)] border border-[rgba(217,119,6,0.2)] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#888888] leading-relaxed">
              <strong className="text-[#d97706] font-semibold">Demonstration Environment Notice:</strong> All live payments in this sandbox instance utilize PayPal Sandbox test cards and simulated ECB FX conversion feeds. No live sovereign currency is ever exposed to loss.
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <div className="p-10 rounded-3xl bg-[#111111] text-[#fbf9f5]">
          <h2 className="font-serif text-3xl mb-4">Questions about our security model?</h2>
          <p className="text-sm text-[rgba(251,249,245,0.7)] max-w-md mx-auto mb-8">
            Review our developer documentation and API signature verification guidelines.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/developer" className="btn btn-primary px-8 py-3.5 text-sm">
              Inspect Security Specs <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
