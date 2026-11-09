"use client";
import Link from "next/link";
import { ArrowRight, Search, HelpCircle, BookOpen, MessageSquare, ChevronDown, CheckCircle2, ShieldCheck, CreditCard, Send, Wallet } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { icon: <Send className="w-5 h-5 text-[#0f4d40]" />, title: "Transfers & Payments", count: "14 articles" },
    { icon: <Wallet className="w-5 h-5 text-[#0f4d40]" />, title: "Multi-Currency Wallets", count: "9 articles" },
    { icon: <CreditCard className="w-5 h-5 text-[#0f4d40]" />, title: "Payment Methods & Cards", count: "12 articles" },
    { icon: <ShieldCheck className="w-5 h-5 text-[#0f4d40]" />, title: "Security & 2FA Setup", count: "8 articles" },
  ];

  const questions = [
    { q: "How do I top up my EterPay wallet?", a: "You can fund your primary wallet instantly using connected bank accounts, debit cards, UPI handles, or incoming transfers from other EterPay and PayPal accounts." },
    { q: "What is the settlement speed for EterPay Anywhere?", a: "Transfers routed through instant rails (like UPI and PayPal Direct) settle within 2 to 3 seconds. Cross-border banking rails settle according to destination clearing windows." },
    { q: "How are currency conversion rates determined?", a: "EterPay pulls official European Central Bank reference benchmark rates updated in real-time, offering zero spread markups in demo mode." },
    { q: "How can I dispute a transaction or claim a refund?", a: "Navigate to the Refunds & Protection module in your dashboard, select the transaction, and submit a refund ticket. Protected transactions are resolved within 48 hours." },
    { q: "Is two-factor authentication mandatory?", a: "For security and regulatory safety, high-value transfers and sensitive account configuration updates require OTP or biometric verification." },
  ];

  const filtered = questions.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <div className="label-eyebrow mb-2">Support & Knowledgebase</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] mb-6">How can we assist you?</h1>
        
        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="w-5 h-5 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions, articles, or payment rails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 py-3.5 text-sm shadow-sm"
          />
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-6 py-6 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c, i) => (
            <div key={i} className="card p-5 bg-white hover:border-[#0f4d40]/30 transition-all cursor-pointer">
              <div className="p-2.5 bg-[rgba(15,77,64,0.06)] rounded-xl w-fit mb-3">{c.icon}</div>
              <h3 className="font-semibold text-sm text-[#111111] mb-1">{c.title}</h3>
              <span className="text-xs text-[#888888]">{c.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#111111]">Popular Knowledgebase Articles</h2>
          <span className="text-xs text-[#888888]">{filtered.length} results</span>
        </div>

        <div className="space-y-3">
          {filtered.map((item, idx) => (
            <div key={idx} className="card bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-medium text-sm text-[#111111]">{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#888888] transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#666666] leading-relaxed border-t border-[rgba(17,17,17,0.06)] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Live AI Assistance Contact Card */}
      <section className="px-6 py-10 max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl bg-white border border-[rgba(17,17,17,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[rgba(15,77,64,0.08)] rounded-2xl">
              <MessageSquare className="w-6 h-6 text-[#0f4d40]" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#111111]">Instant Help via AI Assistant</h3>
              <p className="text-xs text-[#666666]">Chat with EterPay AI directly to query your account and solve questions.</p>
            </div>
          </div>
          <Link href="/ai" className="btn btn-primary text-xs px-6 py-3 whitespace-nowrap">
            Launch AI Chat <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
