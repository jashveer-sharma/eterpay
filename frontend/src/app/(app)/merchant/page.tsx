"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Receipt,
  RefreshCw,
  BarChart2,
  ShieldAlert,
  ArrowUpRight,
  Plus,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { DEMO_INVOICES, DEMO_MERCHANTS, DEMO_SUBSCRIPTIONS } from "@/lib/demo-data";

export default function BusinessHubPage() {
  const totalBilled = DEMO_INVOICES.reduce((acc, inv) => acc + (inv.currency === "INR" ? inv.amount : 0), 0);

  // EterPay Virtual Soundbox State (Zero-Hardware Auditory Payment Confirmation)
  const [soundboxEnabled, setSoundboxEnabled] = useState(true);
  const [soundboxLanguage, setSoundboxLanguage] = useState<"en" | "hi" | "es">("en");
  const [announcing, setAnnouncing] = useState(false);
  const [lastAnnouncement, setLastAnnouncement] = useState<string | null>(null);

  const testAnnouncement = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech Synthesis not supported in this browser.");
      return;
    }
    setAnnouncing(true);
    const textMap = {
      en: "Payment received on PayPal! 2,500 Rupees credited to EterPay Merchant account.",
      hi: "पेपाल पर दो हज़ार पाँच सौ रुपये प्राप्त हुए। ईटरपे खाते में जमा।",
      es: "Pago recibido en PayPal! Dos mil quinientos rupias acreditadas a EterPay.",
    };
    const text = textMap[soundboxLanguage];
    setLastAnnouncement(text);

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes = { en: "en-US", hi: "hi-IN", es: "es-ES" };
    utterance.lang = langCodes[soundboxLanguage];
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setAnnouncing(false);
    utterance.onerror = () => setAnnouncing(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Commercial Hub</div>
            <h1 className="font-serif text-3xl text-[#111111]">Merchant & Business Suite</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="demo-badge">Multi-Merchant Sandbox</span>
            <Link href="/invoices" className="btn btn-primary text-xs px-4 py-2.5 rounded-full">
              <Plus className="w-3.5 h-3.5 mr-1 inline" /> Create New Invoice
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Gross Billed (INR)</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">
              ₹ {totalBilled.toLocaleString("en-IN")}
            </div>
            <span className="text-xs text-[#16a34a] mt-1 block">+18.4% vs last cycle</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Pending Collection</span>
            <div className="font-serif text-3xl font-medium text-[#d97706] mt-1 tabular">
              ₹ 42,000.00
            </div>
            <span className="text-xs text-[#888888] mt-1 block">2 open client invoices</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Recurring MRR</span>
            <div className="font-serif text-3xl font-medium text-[#0f4d40] mt-1 tabular">
              ₹ 5,117.00
            </div>
            <span className="text-xs text-[#16a34a] mt-1 block">5 active customer tiers</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Clearing Health</span>
            <div className="font-serif text-3xl font-medium text-[#16a34a] mt-1 tabular">
              99.9%
            </div>
            <span className="text-xs text-[#888888] mt-1 block">PayPal Sandbox v2 live</span>
          </div>
        </div>

        {/* ─── EterPay Virtual Soundbox (Zero-Hardware Auditory Terminal) ─── */}
        <div className="card p-6 sm:p-7 bg-white border border-[rgba(15,77,64,0.18)] rounded-3xl shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(17,17,17,0.06)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[rgba(15,77,64,0.1)] text-[#0f4d40] flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl text-[#111111]">EterPay Virtual Soundbox</h3>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30 font-bold">
                    Zero Proprietary Hardware
                  </span>
                </div>
                <p className="text-xs text-[#555555] mt-0.5">
                  Instant multi-lingual speech audio confirmation when payments clear via PayPal Orders v2 or invoices.
                </p>
              </div>
            </div>

            {/* Language Selector & Toggle */}
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg bg-[#fbf9f5] p-1 border border-[rgba(17,17,17,0.08)] text-xs">
                {(["en", "hi", "es"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSoundboxLanguage(lang)}
                    className={`px-2.5 py-1 rounded-md uppercase font-semibold text-[10px] transition-colors ${
                      soundboxLanguage === lang
                        ? "bg-[#0f4d40] text-white"
                        : "text-[#555555] hover:text-[#111111]"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "hi" ? "हिंदी (Hindi)" : "Español"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#fbf9f5] p-4 rounded-2xl border border-[rgba(17,17,17,0.06)]">
            <div className="text-xs space-y-1">
              <div className="font-semibold text-[#111111] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0f4d40]" />
                Browser Web Speech API Synthesizer Ready
              </div>
              <div className="text-[#666666] font-mono text-[11px]">
                {lastAnnouncement ? `Last uttered: "${lastAnnouncement}"` : "Ready to broadcast received payments."}
              </div>
            </div>

            <button
              type="button"
              onClick={testAnnouncement}
              disabled={announcing}
              className="btn btn-primary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {announcing ? "Speaking Broadcast..." : "Test Audio Announcer"}
            </button>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="grid sm:grid-cols-3 gap-6">
          <Link href="/invoices" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <Receipt className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Invoice Generator</h3>
              <p className="text-xs text-[#666666]">Dispatch automated PDF invoices with dynamic payment links.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              Manage Invoices <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>

          <Link href="/subscriptions" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <RefreshCw className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Subscriptions Engine</h3>
              <p className="text-xs text-[#666666]">Automate recurring merchant charges and member plans.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              Inspect Plans <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>

          <Link href="/analytics" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <BarChart2 className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Revenue Telemetry</h3>
              <p className="text-xs text-[#666666]">Real-time AG Grid financial analytics and cashflow forecasts.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              View Analytics <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>
        </div>

        {/* Merchant Portfolios Table */}
        <div className="card p-6 bg-white shadow-xs">
          <h3 className="font-serif text-xl text-[#111111] mb-4">Enterprise Merchant Accounts</h3>
          <div className="space-y-3">
            {DEMO_MERCHANTS.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
                <div>
                  <div className="text-sm font-semibold text-[#111111]">{m.name}</div>
                  <div className="text-xs text-[#888888]">{m.category} • {m.transactions} cleared operations</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-base font-semibold text-[#0f4d40] tabular">
                    ₹ {m.revenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#16a34a]">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
