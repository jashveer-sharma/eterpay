"use client";
import Link from "next/link";
import { ArrowRight, Send, Wallet, Globe, TrendingUp, ShoppingBag, Plane, Bot, Building2, ShieldCheck, Check } from "lucide-react";

export default function ProductsPage() {
  const products = [
    {
      id: "pay",
      title: "EterPay Pay",
      tagline: "Instant P2P & Cross-Border Money Movement",
      desc: "Deterministic settlement engine executing transfers across domestic bank rails and international PayPal Orders v2 infrastructure with zero friction.",
      icon: <Send className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Real-time recipient identity validation", "Idempotency guaranteed with UUID v4 tokens", "Instant domestic UPI & international clearing"],
      href: "/pay",
    },
    {
      id: "anywhere",
      title: "EterPay Anywhere",
      tagline: "Universal Cross-Border Interoperability",
      desc: "One app to pay anywhere in the world. Intelligently determines compatibility between sender rails and local recipient payment methods.",
      icon: <Globe className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Dynamic routing discovery across 200+ regions", "Automatic ECB benchmark FX rates without markup", "Seamless QR & mobile checkout execution"],
      href: "/anywhere",
    },
    {
      id: "wallet",
      title: "Multi-Currency Ledger",
      tagline: "Global Balances in Single Account",
      desc: "Simultaneously hold, convert, and budget across INR, USD, EUR, GBP, and JPY with millisecond balance updates and audit trail telemetry.",
      icon: <Wallet className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Multi-asset balance reconciliation", "One-click instant currency swap simulation", "Bank and debit card top-up mechanisms"],
      href: "/wallet",
    },
    {
      id: "invest",
      title: "EterPay Invest & Portfolio",
      tagline: "Intelligent Wealth Management & Hedging",
      desc: "Educational simulated portfolio engine demonstrating multi-asset diversification across Sovereign Bonds, Gold, Tech Indexes, and FX Reserves.",
      icon: <TrendingUp className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Real-time risk attribution and stress testing", "Clear [Simulated Portfolio — No Capital at Risk] safeguards", "AI portfolio rebalancing proposals"],
      href: "/invest",
    },
    {
      id: "commerce",
      title: "Universal Commerce Hub",
      tagline: "Embedded Shopping & One-Click Checkout",
      desc: "Discover products, verify merchant trust credentials, and complete purchases using connected PayPal sandbox credentials or local cards.",
      icon: <ShoppingBag className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Curated international product catalog", "Integrated shopping cart & order fulfillment simulation", "Instant purchase protection guarantee"],
      href: "/commerce",
    },
    {
      id: "travel",
      title: "EterPay Travel & Mobility",
      tagline: "Seamless Cross-Border Travel Treasury",
      desc: "Book international flights and luxury stays with automatic local currency conversion and destination treasury budgeting tips.",
      icon: <Plane className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Instant flight & accommodation reservation demo", "Smart FX rate locks before departure", "Dedicated traveler wallet buckets"],
      href: "/travel",
    },
    {
      id: "ai",
      title: "Eter AI Financial Intelligence",
      tagline: "Conversational Financial Intelligence",
      desc: "State-of-the-art multi-tier reasoning agent powered by Gemini 1.5 Flash. Delivers cashflow audits, expense optimization, and contextual guidance.",
      icon: <Bot className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Structured tool-calling proposals with human approval gates", "Spending anomaly flags and recurring fee audits", "Zero client secrets stored in model context"],
      href: "/ai",
    },
    {
      id: "business",
      title: "Merchant & Enterprise Suite",
      tagline: "Full-Stack Commercial Operations",
      desc: "Line-item invoicing, recurring subscription billing, payment links, and high-performance AG Grid transaction telemetry.",
      icon: <Building2 className="w-6 h-6 text-[#0f4d40]" />,
      features: ["Automated PDF invoice generation and tracking", "Churn-resistant recurring subscription engine", "High-density tabular ledger telemetry"],
      href: "/business",
    },
  ];

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="label-eyebrow mb-3">Product Architecture</div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.1] mb-6">
          The comprehensive modern<br />financial ecosystem.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
          Every module is built with extreme craft: mathematical clarity, bank-grade security, and seamless interoperability.
        </p>
      </section>

      {/* Product List */}
      <section className="px-6 py-8 max-w-5xl mx-auto space-y-8">
        {products.map((p, idx) => (
          <div key={p.id} id={p.id} className="card p-8 bg-white hover:border-[#0f4d40]/30 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(17,17,17,0.06)]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl flex-shrink-0 mt-1">{p.icon}</div>
                <div>
                  <div className="text-xs font-semibold text-[#0f4d40] uppercase tracking-wider mb-1">{p.tagline}</div>
                  <h2 className="font-serif text-2xl text-[#111111]">{p.title}</h2>
                </div>
              </div>
              <Link href={p.href} className="btn btn-secondary text-xs px-5 py-2.5 rounded-full flex-shrink-0 self-start md:self-auto">
                Open in App <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="pt-6 grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <p className="text-sm text-[#555555] leading-relaxed mb-4">{p.desc}</p>
              </div>
              <div className="space-y-2 bg-[#fbf9f5] p-4 rounded-xl border border-[rgba(17,17,17,0.06)]">
                <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2">Capabilities</div>
                {p.features.map((feat, fidx) => (
                  <div key={fidx} className="flex items-center gap-2 text-xs text-[#222222]">
                    <Check className="w-3.5 h-3.5 text-[#0f4d40] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <div className="p-10 rounded-3xl bg-[#0f4d40] text-white">
          <h2 className="font-serif text-3xl mb-4">Ready to test the entire suite?</h2>
          <p className="text-sm text-[rgba(251,249,245,0.8)] max-w-md mx-auto mb-8">
            All 8 modules are fully functional in interactive simulation mode with preloaded balances and demo networks.
          </p>
          <Link href="/dashboard" className="btn bg-white text-[#0f4d40] hover:bg-[#fbf9f5] px-8 py-3.5 rounded-full text-sm font-medium">
            Access EterPay Application
          </Link>
        </div>
      </section>
    </div>
  );
}
