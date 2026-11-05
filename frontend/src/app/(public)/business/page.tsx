"use client";
import Link from "next/link";
import { ArrowRight, Building2, Receipt, RefreshCw, BarChart2, ShieldCheck, Globe, Check, Zap } from "lucide-react";
import { useState } from "react";

export default function BusinessPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const pillars = [
    {
      icon: <Building2 className="w-5 h-5 text-[#0f4d40]" />,
      title: "Global Checkout & Acceptance",
      desc: "Accept cards, PayPal, UPI, and local wallets through one clean drop-in checkout SDK with custom brand theming.",
    },
    {
      icon: <Receipt className="w-5 h-5 text-[#0f4d40]" />,
      title: "Automated Enterprise Invoicing",
      desc: "Dispatch line-item tax invoices with automatic currency calculations, dynamic payment links, and reminder triggers.",
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#0f4d40]" />,
      title: "Recurring Subscription Engine",
      desc: "Manage customer lifecycles, tiered billing, proration schedules, and smart payment retry mechanisms without churn.",
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-[#0f4d40]" />,
      title: "Real-Time AG Grid Financials",
      desc: "Inspect live order books, customer retention cohorts, and tax liabilities with millisecond-speed tabular telemetry.",
    },
  ];

  const plans = [
    {
      name: "Starter Merchant",
      price: billingCycle === "monthly" ? "₹ 0" : "₹ 0",
      desc: "For independent consultants, creators, and bootstrapping founders.",
      features: [
        "Up to 50 monthly invoices",
        "PayPal Sandbox & live checkout integration",
        "EterPay Anywhere QR generator",
        "Standard currency exchange (ECB benchmark)",
        "Basic AI transaction categorization",
      ],
      cta: "Start Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Scale Commerce",
      price: billingCycle === "monthly" ? "₹ 1,499" : "₹ 14,990",
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      desc: "For high-volume merchants and global cross-border operations.",
      features: [
        "Unlimited invoices & smart payment links",
        "Recurring subscription & proration engine",
        "AG Grid high-density live telemetry",
        "Multi-agent AI financial copilot",
        "Priority cross-border routing",
        "Automated customer tax reconciliation",
      ],
      cta: "Launch Scale Account",
      href: "/signup",
      popular: true,
    },
    {
      name: "Enterprise Multi-Rail",
      price: "Custom",
      desc: "Dedicated treasury routing, custom clearing arrangements, and SLAs.",
      features: [
        "Dedicated webhook endpoints with signature validation",
        "Bespoke liquidity pooling across currencies",
        "Custom ERP / SAP data integration pipelines",
        "Dedicated fintech solutions architect",
        "99.99% clearing SLA guarantee",
      ],
      cta: "Contact Enterprise",
      href: "/contact",
      popular: false,
    },
  ];

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Building2 className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">Enterprise & Merchant Infrastructure</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.1] mb-6">
          Accelerate your revenue.<br />Across any market, in any currency.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mb-8">
          The unified merchant suite engineered for international trade. Unify payments, automated invoicing, recurring billing, and real-time cashflow intelligence.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn btn-primary px-8 py-3.5 text-sm">
            Create Business Account <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Link>
          <Link href="/business" className="btn btn-secondary px-8 py-3.5 text-sm">
            View Merchant Hub Demo
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((item, idx) => (
            <div key={idx} className="card p-8 bg-white hover:border-[#0f4d40]/40 transition-all">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl w-fit mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-[#111111] mb-2">{item.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="label-eyebrow mb-2">Transparent Commercials</div>
          <h2 className="heading-section text-3xl sm:text-4xl text-[#111111] mb-4">Plans designed for sustainable scale</h2>
          
          {/* Toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[rgba(17,17,17,0.05)] border border-[rgba(17,17,17,0.08)] mt-2">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                billingCycle === "monthly" ? "bg-white text-[#111111] shadow-sm" : "text-[#666666]"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                billingCycle === "annual" ? "bg-white text-[#111111] shadow-sm" : "text-[#666666]"
              }`}
            >
              Billed Annually <span className="text-[#0f4d40] font-semibold">(Save 17%)</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`card p-8 flex flex-col justify-between ${
                p.popular ? "bg-white border-[#0f4d40] shadow-md relative" : "bg-white"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0f4d40] text-white text-[11px] font-semibold uppercase tracking-wider">
                  Recommended
                </div>
              )}
              <div>
                <h3 className="font-serif text-2xl text-[#111111] mb-1">{p.name}</h3>
                <p className="text-xs text-[#666666] mb-6 min-h-[32px]">{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-serif text-4xl text-[#111111] tabular">{p.price}</span>
                  {p.period && <span className="text-xs text-[#888888]">{p.period}</span>}
                </div>

                <div className="space-y-3 pt-6 border-t border-[rgba(17,17,17,0.06)] mb-8">
                  {p.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs text-[#444444]">
                      <Check className="w-4 h-4 text-[#0f4d40] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={p.href}
                className={`btn w-full text-center text-xs py-3 rounded-full font-medium ${
                  p.popular ? "btn-primary" : "btn-secondary"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Integration Callout */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="card-dark p-8 rounded-3xl bg-[#111111] text-[#fbf9f5] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#34d399] font-semibold mb-2">Developer Friendly</div>
            <h3 className="font-serif text-2xl text-[#fbf9f5] mb-2">Modern APIs, Webhooks & SDKs</h3>
            <p className="text-xs text-[rgba(251,249,245,0.7)] max-w-md">
              Integrate PayPal Orders v2, verify HMAC signatures, and hook into live exchange rates using standard Python and TypeScript libraries.
            </p>
          </div>
          <Link href="/developer" className="btn btn-primary px-6 py-3 text-xs whitespace-nowrap">
            View Developer Docs <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
          </Link>
        </div>
      </section>
    </div>
  );
}
