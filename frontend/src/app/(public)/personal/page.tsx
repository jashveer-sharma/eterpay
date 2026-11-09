"use client";
import Link from "next/link";
import { ArrowRight, Send, Wallet, Globe, Bot, Shield, Check, Sparkles, ArrowLeftRight, CreditCard, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function PersonalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Send className="w-5 h-5 text-[#0f4d40]" />,
      title: "Send & Request Globally",
      desc: "Transfer funds across domestic UPI or international rails with instantaneous routing and verified recipient identity.",
      pill: "Instant Rail",
    },
    {
      icon: <Wallet className="w-5 h-5 text-[#0f4d40]" />,
      title: "Multi-Currency Ledger",
      desc: "Hold, manage, and convert across INR, USD, EUR, GBP, and JPY with ECB benchmark market rates and zero hidden spread.",
      pill: "Real-Time Rates",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#0f4d40]" />,
      title: "EterPay Anywhere Hub",
      desc: "One touchpoint that discovers local merchant compatibility—whether paying via PayPal checkout, QR, or virtual debit.",
      pill: "Universal Access",
    },
    {
      icon: <Bot className="w-5 h-5 text-[#0f4d40]" />,
      title: "Eter AI Financial Assistant",
      desc: "Conversational cashflow forecasting, subscription anomaly flags, and intelligent currency timing signals.",
      pill: "Free Tier Intelligence",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#0f4d40]" />,
      title: "Flexible Funding Methods",
      desc: "Attach your bank account, RuPay or Visa cards, and PayPal wallet with dynamic fallback when clearing transactions.",
      pill: "Zero Lock-In",
    },
    {
      icon: <Shield className="w-5 h-5 text-[#0f4d40]" />,
      title: "Deterministic Vault Security",
      desc: "Client secret isolation, cryptographic webhook verification, and human-in-the-loop explicit approval gates.",
      pill: "Bank Grade",
    },
  ];

  const faqs = [
    { q: "How does EterPay execute international transfers?", a: "EterPay integrates with the PayPal Orders v2 API and regulated local clearing providers to execute deterministic settlement while applying European Central Bank mid-market rates." },
    { q: "Can I hold balances in foreign currencies?", a: "Yes. Your EterPay multi-currency wallet permits holding balances in INR, USD, EUR, GBP, JPY, and SGD with automated conversion simulation." },
    { q: "Is the AI allowed to move money autonomously?", a: "Never. By design, Eter AI only proposes intents. Every transfer, conversion, and payment requires explicit user authentication and approval." },
    { q: "What fees does EterPay charge personal users?", a: "Personal peer-to-peer transfers within the domestic network are free. Cross-border transfers display transparent network and conversion fees before confirmation." },
  ];

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">Personal Banking Reimagined</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.1] mb-6">
          Your complete financial life.<br />One intelligent surface.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mb-8">
          Manage day-to-day spending, split domestic expenses, convert international currencies, and automate wealth management with private AI assistance.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn btn-primary px-8 py-3.5 text-sm">
            Open Personal Account <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Link>
          <Link href="/dashboard" className="btn btn-secondary px-8 py-3.5 text-sm">
            Explore Live Demo
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card p-6 bg-white hover:border-[#0f4d40]/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-[rgba(15,77,64,0.06)] rounded-xl">{f.icon}</div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[rgba(17,17,17,0.05)] text-[#555555]">{f.pill}</span>
                </div>
                <h3 className="font-semibold text-lg text-[#111111] mb-2">{f.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed mb-4">{f.desc}</p>
              </div>
              <div className="pt-4 border-t border-[rgba(17,17,17,0.06)] text-xs text-[#0f4d40] font-medium flex items-center">
                Learn more <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Flow Preview */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="card p-8 bg-white border-[rgba(17,17,17,0.08)]">
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
            <div>
              <span className="label-eyebrow">Interactive Simulation</span>
              <h3 className="font-serif text-2xl text-[#111111]">Cross-Border Peer Transfer</h3>
            </div>
            <span className="demo-badge">Verified Simulation</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
              <span className="text-xs text-[#888888] font-medium">Source Currency (India)</span>
              <div className="text-2xl font-serif text-[#111111] mt-1 tabular">₹ 25,000.00</div>
              <span className="text-xs text-[#0f4d40]">Available in Primary INR Ledger</span>
            </div>
            <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
              <span className="text-xs text-[#888888] font-medium">Beneficiary Receives (US)</span>
              <div className="text-2xl font-serif text-[#111111] mt-1 tabular">$ 299.50</div>
              <span className="text-xs text-[#555555]">ECB Mid-Market Quote (0.01198)</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[rgba(15,77,64,0.04)] border border-[rgba(15,77,64,0.12)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-[#0f4d40]" />
              <div className="text-xs text-[#111111]">
                <strong className="font-semibold text-[#0f4d40]">AI Routing Strategy:</strong> Direct settlement via PayPal Sandbox v2 order with zero intermediary fee.
              </div>
            </div>
            <Link href="/pay" className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap">
              Test in App
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="label-eyebrow mb-2">Transparency</div>
          <h2 className="heading-section text-3xl text-[#111111]">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-medium text-sm text-[#111111]">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#888888] transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#666666] leading-relaxed border-t border-[rgba(17,17,17,0.06)] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <div className="p-10 rounded-3xl bg-[#111111] text-[#fbf9f5]">
          <h2 className="font-serif text-3xl mb-4">Start Transacting on EterPay</h2>
          <p className="text-sm text-[rgba(251,249,245,0.7)] max-w-md mx-auto mb-8">
            Set up your personal multi-currency profile in under two minutes with full simulation credentials.
          </p>
          <Link href="/signup" className="btn btn-primary px-8 py-3.5 text-sm">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}
