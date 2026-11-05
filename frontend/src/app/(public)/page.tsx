"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield, TrendingUp, ChevronDown, Play, Check, Star } from "lucide-react";

// ── Animated 3D-like Globe using CSS ──────────────────────────────
const ORBIT_CURRENCIES = [
  { label: "INR", bgClass: "bg-[#0f4d40]", transform: "translate(108px, 0px)" },
  { label: "USD", bgClass: "bg-[#166b59]", transform: "translate(33px, 103px)" },
  { label: "EUR", bgClass: "bg-[#0a352c]", transform: "translate(-87px, 63px)" },
  { label: "GBP", bgClass: "bg-[#0f4d40]", transform: "translate(-87px, -63px)" },
  { label: "JPY", bgClass: "bg-[#166b59]", transform: "translate(33px, -103px)" },
];

function EterGlobe() {
  return (
    <div className="relative flex items-center justify-center w-80 h-80 mx-auto">
      {/* Outer ring */}
      <div className="absolute w-72 h-72 rounded-full border border-[rgba(15,77,64,0.15)] animate-spin-slow" />
      {/* Middle ring */}
      <div className="absolute w-56 h-56 rounded-full border-2 border-[rgba(15,77,64,0.2)] [animation:spin-slow_14s_linear_infinite_reverse]" />
      {/* Inner ring */}
      <div className="absolute w-40 h-40 rounded-full border border-[rgba(15,77,64,0.25)] animate-spin-slow [animation-duration:9s]" />
      {/* Core */}
      <div className="relative w-24 h-24 rounded-full bg-[#0f4d40] flex items-center justify-center shadow-lg animate-float">
        <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
          <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.2"/>
          <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <circle cx="24" cy="24" r="5" fill="#fbf9f5"/>
          <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="38" cy="24" r="2.5" fill="#fbf9f5"/>
        </svg>
      </div>
      {/* Orbiting payment dots */}
      {ORBIT_CURRENCIES.map(({ label, bgClass, transform }) => (
        <div
          key={label}
          className={`absolute flex items-center justify-center w-8 h-8 rounded-full text-[8px] font-semibold text-white tracking-wider shadow-sm ${bgClass}`}
          style={{ transform }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

// ── Rotating word hero ────────────────────────────────────────────
const HERO_WORDS = ["Everywhere.", "Intelligently.", "Seamlessly.", "Globally.", "Effortlessly."];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % HERO_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`font-serif text-[#0f4d40] inline-block transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {HERO_WORDS[idx]}
    </span>
  );
}

// ── Stats ticker ──────────────────────────────────────────────────
const STATS = [
  { value: "200+", label: "Countries supported" },
  { value: "50+", label: "Currencies" },
  { value: "0%", label: "Transfer fees (demo)" },
  { value: "24/7", label: "AI-powered support" },
  { value: "< 2s", label: "Transfer speed" },
  { value: "100%", label: "Secure & encrypted" },
];

// ── Feature sections ──────────────────────────────────────────────
const FEATURES_PERSONAL = [
  { icon: "💸", title: "Send money globally", desc: "Transfer to 200+ countries with live ECB exchange rates and transparent fees." },
  { icon: "🌐", title: "EterPay Anywhere", desc: "Pay any merchant worldwide through one intelligent payment interface." },
  { icon: "🤖", title: "AI Financial Assistant", desc: "Get instant insights, spending analysis and payment recommendations." },
  { icon: "💱", title: "Multi-currency wallet", desc: "Hold INR, USD, EUR, GBP, JPY and more in one unified wallet." },
  { icon: "📊", title: "Portfolio & Invest", desc: "Grow your wealth with intelligent portfolio tools and market insights." },
  { icon: "🛡️", title: "Security first", desc: "Bank-grade encryption, biometrics and real-time fraud detection." },
];

const FEATURES_BUSINESS = [
  { icon: "🏪", title: "Accept payments", desc: "Online, QR code, payment links — every way your customers want to pay." },
  { icon: "📄", title: "Professional invoicing", desc: "Create, send and track invoices with automated payment reminders." },
  { icon: "🔄", title: "Subscription billing", desc: "Set up recurring revenue with smart subscription management." },
  { icon: "📈", title: "Merchant analytics", desc: "Real-time sales dashboards and AI-driven business insights." },
  { icon: "🌍", title: "International commerce", desc: "Accept payments in 50+ currencies with automatic conversion." },
  { icon: "🔗", title: "Payment Links", desc: "No-code payment collection pages for any product or service." },
];

const STEPS = [
  { step: "01", title: "Create your account", desc: "Sign up in minutes. Choose personal or business. Verify your identity." },
  { step: "02", title: "Add your money", desc: "Connect your bank, UPI or card. Fund your EterPay wallet instantly." },
  { step: "03", title: "Pay anywhere", desc: "Send money globally, pay merchants, convert currencies — all in one place." },
  { step: "04", title: "Grow intelligently", desc: "Let AI optimise your payments, investments and financial decisions." },
];

const FAQ_ITEMS = [
  { q: "Is EterPay free to use?", a: "EterPay offers a free personal plan with core payment features. EterPay Plus offers advanced features including unlimited currency wallets and AI insights." },
  { q: "Which countries does EterPay support?", a: "EterPay supports 200+ countries for payments and 50+ currencies for conversion. EterPay Anywhere connects multiple regional payment networks globally." },
  { q: "How does EterPay Anywhere work?", a: "EterPay Anywhere intelligently discovers compatible payment methods for your destination, handles currency conversion, and routes your payment through the optimal network." },
  { q: "Is my money safe with EterPay?", a: "Yes. EterPay uses bank-grade AES-256 encryption, biometric authentication, and real-time fraud monitoring. All funds are held in regulated accounts." },
  { q: "How does the AI Assistant help?", a: "The AI Assistant analyses your spending patterns, suggests optimal payment methods, identifies savings opportunities, and provides real-time financial guidance." },
  { q: "Can I use EterPay for my business?", a: "Yes. EterPay Business offers invoicing, merchant tools, payment links, subscription billing, analytics and international commerce features." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[rgba(17,17,17,0.09)] last:border-b-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium text-[#111111]">{q}</span>
        <ChevronDown size={18} className={`flex-shrink-0 text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 text-sm text-[#555555] leading-relaxed">{a}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");

  return (
    <div className="bg-[#fbf9f5]">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-8">
                <Zap size={12} className="text-[#0f4d40]" />
                <span className="text-xs font-medium text-[#0f4d40]">AI-powered global payments</span>
              </div>

              <h1 className="font-serif text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-[#111111] mb-6">
                Your Money.<br />
                <RotatingWord />
              </h1>

              <p className="text-lg text-[#555555] leading-relaxed mb-10 max-w-lg">
                EterPay brings payments, money management, international finance, commerce, travel and AI intelligence into one seamlessly connected experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn btn-primary text-base px-7 py-3.5">
                  Get started free <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="btn btn-secondary text-base px-7 py-3.5">
                  Log in
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[rgba(17,17,17,0.09)]">
                <div className="text-center">
                  <div className="text-2xl font-serif font-normal text-[#111111] tabular">200+</div>
                  <div className="text-xs text-[#888888] mt-0.5">Countries</div>
                </div>
                <div className="w-px h-10 bg-[rgba(17,17,17,0.09)]" />
                <div className="text-center">
                  <div className="text-2xl font-serif font-normal text-[#111111] tabular">50+</div>
                  <div className="text-xs text-[#888888] mt-0.5">Currencies</div>
                </div>
                <div className="w-px h-10 bg-[rgba(17,17,17,0.09)]" />
                <div className="text-center">
                  <div className="text-2xl font-serif font-normal text-[#111111] tabular">AI</div>
                  <div className="text-xs text-[#888888] mt-0.5">Powered</div>
                </div>
              </div>
            </div>

            {/* Right — 3D globe */}
            <div className="flex justify-center">
              <EterGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STATS ──────────────────────────────────────── */}
      <div className="border-y border-[rgba(17,17,17,0.09)] bg-white py-5 overflow-hidden">
        <div className="animate-marquee">
          {[...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-8 px-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-2xl text-[#111111] tabular">{s.value}</span>
                <span className="text-sm text-[#888888]">{s.label}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[rgba(17,17,17,0.2)]" />
            </div>
          ))}
        </div>
      </div>

      {/* ── PERSONAL / BUSINESS TOGGLE ─────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-eyebrow mb-4">What EterPay does</p>
            <h2 className="heading-section text-4xl lg:text-5xl text-[#111111] mb-6">
              Built for every financial journey
            </h2>
            <p className="text-[#555555] text-lg max-w-xl mx-auto">
              Whether you're managing personal finances or running a business, EterPay provides the tools you need.
            </p>
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[rgba(17,17,17,0.06)] border border-[rgba(17,17,17,0.09)] mt-8">
              {(["personal", "business"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    activeTab === tab
                      ? "bg-[#111111] text-[#fbf9f5] shadow-sm"
                      : "text-[#555555] hover:text-[#111111]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "personal" ? FEATURES_PERSONAL : FEATURES_BUSINESS).map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-lg transition-shadow duration-300 group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-medium text-[#111111] mb-2 group-hover:text-[#0f4d40] transition-colors">{f.title}</h3>
                <p className="text-sm text-[#888888] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={activeTab === "personal" ? "/personal" : "/business"}
              className="btn btn-secondary"
            >
              Explore {activeTab} features <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ETERPAY ANYWHERE ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#111111] text-[#fbf9f5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="label-eyebrow mb-5 text-[#34d399]">
                <span>EterPay Anywhere</span>
              </p>
              <h2 className="heading-section text-4xl lg:text-5xl text-[#fbf9f5] mb-6">
                Pay Beyond Borders. One Intelligent Experience.
              </h2>
              <p className="text-[rgba(251,249,245,0.65)] text-lg leading-relaxed mb-8">
                Whether you're travelling, shopping globally or sending money home — EterPay Anywhere discovers the optimal payment route, handles currency conversion and delivers your payment through the right network.
              </p>
              <ul className="flex flex-col gap-4 mb-10">
                {[
                  "Automatic payment network discovery",
                  "Live currency conversion with ECB rates",
                  "QR payments, digital wallets, bank transfers",
                  "Fee preview before you confirm",
                  "Transparent payment routing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[rgba(251,249,245,0.8)]">
                    <div className="w-5 h-5 rounded-full bg-[rgba(52,211,153,0.15)] flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-[#34d399]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/anywhere" className="btn btn-primary">
                Explore EterPay Anywhere <ArrowRight size={15} />
              </Link>
            </div>

            {/* Payment flow visual */}
            <div className="relative">
              <div className="bg-[#1e1e1e] rounded-2xl border border-[rgba(255,255,255,0.08)] p-6">
                <div className="text-xs font-medium text-[rgba(251,249,245,0.4)] uppercase tracking-widest mb-5">Payment preview</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-xl">
                    <span className="text-sm text-[rgba(251,249,245,0.6)]">You send</span>
                    <span className="font-serif text-xl text-[#fbf9f5] tabular">₹10,000</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)]">
                      <Zap size={10} className="text-[#34d399]" />
                      <span className="text-[0.625rem] text-[#34d399] font-medium">AI routing via PayPal</span>
                    </div>
                    <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.04)] rounded-xl">
                    <span className="text-sm text-[rgba(251,249,245,0.6)]">They receive</span>
                    <span className="font-serif text-xl text-[#34d399] tabular">$119.80</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[rgba(251,249,245,0.35)]">
                    <span>Rate: 1 USD = ₹83.47</span>
                    <span>Fee: ₹0 (demo)</span>
                  </div>
                </div>
                <button className="btn btn-primary w-full mt-5">
                  Send now
                </button>
              </div>
              <div className="demo-badge absolute -top-2 -right-2">demo</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f4f0e8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-eyebrow mb-4">Powered by AI</p>
            <h2 className="heading-section text-4xl lg:text-5xl text-[#111111] mb-5">
              Your intelligent financial advisor
            </h2>
            <p className="text-[#555555] text-lg max-w-xl mx-auto">
              EterPay's AI assistant understands your financial life and helps you make smarter decisions — from payment routing to investment analysis.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Chat preview */}
            <div className="card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[rgba(17,17,17,0.08)]">
                <div className="w-8 h-8 rounded-full bg-[#0f4d40] flex items-center justify-center">
                  <Zap size={14} className="text-[#fbf9f5]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#111111]">EterPay AI</div>
                  <div className="text-xs text-[#888888]">Financial intelligence</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { from: "user", text: "How much did I spend on subscriptions this month?" },
                  { from: "ai", text: "You've spent ₹5,117 on 4 active subscriptions this month. That's 8% of your total spend. Adobe Creative Cloud is your largest at ₹4,230." },
                  { from: "user", text: "Should I pause any of them?" },
                  { from: "ai", text: "Based on your usage patterns, Figma Professional hasn't been used in 18 days. Pausing it would save ₹1,200/month. Want me to arrange that?" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === "user"
                          ? "bg-[#111111] text-[#fbf9f5] rounded-br-sm"
                          : "bg-[rgba(15,77,64,0.08)] text-[#111111] rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-5">
              {[
                { icon: "📊", title: "Spending analysis", desc: "Understand where your money goes with AI-powered categorization and trend analysis." },
                { icon: "💡", title: "Smart recommendations", desc: "Get personalized suggestions for payment methods, exchange timing and cost savings." },
                { icon: "🌐", title: "Payment intelligence", desc: "AI selects the optimal payment route for every transaction globally." },
                { icon: "📈", title: "Investment insights", desc: "Portfolio analysis, market context and rebalancing guidance powered by AI." },
              ].map((cap) => (
                <div key={cap.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(15,77,64,0.1)] flex items-center justify-center flex-shrink-0 text-lg">
                    {cap.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#111111] mb-0.5">{cap.title}</div>
                    <div className="text-sm text-[#888888] leading-relaxed">{cap.desc}</div>
                  </div>
                </div>
              ))}
              <Link href="/signup" className="btn btn-dark inline-flex mt-2">
                Try AI Assistant <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="label-eyebrow mb-4">Simple to start</p>
            <h2 className="heading-section text-4xl text-[#111111]">How EterPay works</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.step} className="relative">
                <div className="card p-6">
                  <div className="font-serif text-4xl text-[rgba(17,17,17,0.06)] mb-4">{step.step}</div>
                  <h3 className="font-medium text-[#111111] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-[rgba(17,17,17,0.15)]" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/signup" className="btn btn-primary text-base px-8 py-4">
              Start your journey <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: "Bank-grade security", desc: "AES-256 encryption, biometric auth, and real-time fraud monitoring protect every transaction." },
              { icon: Globe, title: "Global compliance", desc: "Built with regulatory requirements for international financial operations in mind." },
              { icon: Zap, title: "AI-first protection", desc: "Machine learning models detect and prevent fraudulent activity before it happens." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 rounded-2xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-[rgba(251,249,245,0.7)]" />
                </div>
                <h3 className="font-medium text-[#fbf9f5] mb-3">{title}</h3>
                <p className="text-sm text-[rgba(251,249,245,0.5)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="label-eyebrow mb-4">Common questions</p>
            <h2 className="heading-section text-4xl text-[#111111]">Frequently asked</h2>
          </div>
          <div className="card overflow-hidden">
            <div className="divide-y-0">
              {FAQ_ITEMS.map((item) => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0f4d40]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl lg:text-5xl text-[#fbf9f5] mb-6 leading-tight">
            Ready to experience the future of payments?
          </h2>
          <p className="text-[rgba(251,249,245,0.7)] text-lg mb-10">
            Join EterPay today and connect your financial world intelligently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn bg-[#fbf9f5] text-[#0f4d40] hover:bg-white px-8 py-4 rounded-full font-medium text-base transition-all">
              Create free account <ArrowRight size={16} />
            </Link>
            <Link href="/about" className="btn border border-[rgba(251,249,245,0.3)] text-[#fbf9f5] hover:bg-[rgba(251,249,245,0.1)] px-8 py-4 rounded-full font-medium text-base transition-all">
              Learn about EterPay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
