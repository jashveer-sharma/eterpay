"use client";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Zap, Users, CheckCircle2, Compass, Award } from "lucide-react";

export default function AboutPage() {
  const problems = [
    { title: "Fragmented Rail Systems", desc: "Crossing international borders requires juggling different local payment apps, bank codes, and settlement currencies." },
    { title: "Hidden Foreign Exchange Spreads", desc: "Traditional cross-border remittance extracts 3% to 7% margins masked inside opaque dynamic currency conversions." },
    { title: "Siloed Financial Intelligence", desc: "Users receive static monthly statements without forward-looking cashflow advisory or currency risk hedging." },
    { title: "Merchant Integration Overhead", desc: "Businesses manage disparate contracts across Visa, PayPal, SEPA, and UPI just to service global clients." },
  ];

  const values = [
    { icon: <Shield className="w-6 h-6 text-[#0f4d40]" />, title: "Non-Custodial Transparency", desc: "Clear fee disclosures, real-time central bank reference rates, and zero hidden markup." },
    { icon: <Globe className="w-6 h-6 text-[#0f4d40]" />, title: "Universal Interoperability", desc: "Neutral protocol bridge unifying PayPal, local card rails, instant bank transfers, and QR standards." },
    { icon: <Zap className="w-6 h-6 text-[#0f4d40]" />, title: "Autonomous Intelligence", desc: "Local and cloud AI agents providing real-time routing optimization and personal financial intelligence with Eter AI." },
    { icon: <Award className="w-6 h-6 text-[#0f4d40]" />, title: "Institutional Rigor", desc: "Strict adherence to PCI-DSS, double-entry idempotency, and defense-in-depth telemetry." },
  ];

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Compass className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">About EterPay</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.1] mb-6">
          Architecting universal financial connectivity.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
          EterPay is an intelligent global payments and liquidity platform. We bridge disconnected national networks, digital wallets, and merchants into one unified, autonomous financial experience.
        </p>
      </section>

      {/* Vision Statement */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="card-dark p-8 sm:p-12 text-center bg-[#111111] rounded-3xl relative overflow-hidden">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#34d399] mb-4">Our Vision</div>
          <p className="font-serif text-2xl sm:text-3xl text-[#fbf9f5] leading-snug mb-6">
            "One app. One intelligent payment experience. Multiple payment networks. Global reach."
          </p>
          <p className="text-sm text-[rgba(251,249,245,0.7)] max-w-xl mx-auto">
            Whether a consumer pays a merchant across Tokyo, a contractor invoices a European studio, or a traveler taps a QR in Bengaluru, money should flow without frictional barriers.
          </p>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="label-eyebrow mb-2">Market Inefficiencies</div>
          <h2 className="heading-section text-3xl sm:text-4xl text-[#111111]">The problems we eliminate</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <div key={i} className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-colors">
              <div className="text-xs font-semibold text-[#0f4d40] mb-2">0{i + 1}</div>
              <h3 className="text-lg font-semibold text-[#111111] mb-2">{p.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="label-eyebrow mb-2">Core Principles</div>
          <h2 className="heading-section text-3xl sm:text-4xl text-[#111111]">Engineered on solid foundations</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="card p-6 bg-white text-center flex flex-col items-center">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl mb-4">{v.icon}</div>
              <h4 className="font-semibold text-base text-[#111111] mb-2">{v.title}</h4>
              <p className="text-xs text-[#666666] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Origin Story / Architecture */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="card p-8 sm:p-10 bg-white">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] mb-4">Born for the Autonomous Era</h3>
          <p className="text-sm text-[#555555] leading-relaxed mb-4">
            Financial software has traditionally mirrored the physical banking branches of the 20th century: siloed balances, manual forms, and asynchronous clearing houses that charge premium fees for standard ledger entries.
          </p>
          <p className="text-sm text-[#555555] leading-relaxed mb-6">
            EterPay unifies payment orchestration using modern microservices, WebAssembly clients, PayPal sandbox APIs, European Central Bank market rates, and open machine learning models. We do not replace underlying rails; we coordinate them with deterministic mathematical precision.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 border-t border-[rgba(17,17,17,0.08)]">
            <div className="flex items-center gap-2 text-xs text-[#0f4d40] font-medium">
              <CheckCircle2 className="w-4 h-4" /> PayPal Developer Certified
            </div>
            <div className="flex items-center gap-2 text-xs text-[#0f4d40] font-medium">
              <CheckCircle2 className="w-4 h-4" /> Real-Time ECB FX Clearing
            </div>
            <div className="flex items-center gap-2 text-xs text-[#0f4d40] font-medium">
              <CheckCircle2 className="w-4 h-4" /> Multi-Tier AI Agent Failover
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-12 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-[#0f4d40] text-white">
          <h2 className="font-serif text-3xl mb-4">Experience the EterPay Platform</h2>
          <p className="text-sm text-[rgba(251,249,245,0.8)] max-w-md mx-auto mb-8">
            Access our comprehensive interactive simulation including live PayPal checkouts, multi-currency wallets, and AI advisor.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn bg-white text-[#0f4d40] hover:bg-[#fbf9f5] px-6 py-3 rounded-full font-medium text-sm">
              Launch Dashboard Demo <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
