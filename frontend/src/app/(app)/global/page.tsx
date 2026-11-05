"use client";
import Link from "next/link";
import { ArrowLeftRight, Globe, ShieldCheck, Zap, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { DEMO_CURRENCIES_FX, DEMO_TRANSACTIONS } from "@/lib/demo-data";

export default function GlobalPaymentsPage() {
  const internationalTxns = DEMO_TRANSACTIONS.filter((t) => t.currency !== "INR" || t.category === "travel");

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Worldwide Network</div>
            <h1 className="font-serif text-3xl text-[#111111]">Global Payments & FX Clearing</h1>
          </div>
          <Link href="/anywhere" className="btn btn-primary text-xs px-4 py-2 rounded-full">
            Open Anywhere Router →
          </Link>
        </div>

        {/* Global Key Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Direct Country Rails</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">200+</div>
            <span className="text-xs text-[#0f4d40] mt-1 block">Zero FX Spread in Sandbox</span>
          </div>
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Median Settlement Latency</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">1.4s</div>
            <span className="text-xs text-[#16a34a] mt-1 block">99.98% High Availability</span>
          </div>
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Supported Currencies</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">50+</div>
            <span className="text-xs text-[#888888] mt-1 block">Live ECB Reference Quotes</span>
          </div>
        </div>

        {/* Live Currency Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[#111111]">Benchmark Foreign Exchange Pairs</h2>
            <Link href="/currency" className="text-xs text-[#0f4d40] font-medium hover:underline">
              View FX Terminal →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_CURRENCIES_FX.map((pair) => (
              <div key={`${pair.from}-${pair.to}`} className="card p-4 bg-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#111111]">
                    {pair.from} / {pair.to}
                  </div>
                  <div className="font-mono text-sm text-[#0f4d40] tabular font-semibold mt-0.5">
                    {pair.rate}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    pair.change >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"
                  }`}
                >
                  {pair.change >= 0 ? `+${pair.change}%` : `${pair.change}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cross-Border Ledger */}
        <div className="card p-6 bg-white">
          <h2 className="font-serif text-xl text-[#111111] mb-4">Cross-Border Activity</h2>
          <div className="space-y-3">
            {internationalTxns.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
                <div>
                  <div className="text-sm font-semibold text-[#111111]">{t.title}</div>
                  <div className="text-xs text-[#888888]">
                    Ref: {t.ref} • {t.date}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-serif text-base font-semibold tabular ${
                      t.type === "credit" ? "text-[#16a34a]" : "text-[#111111]"
                    }`}
                  >
                    {t.type === "credit" ? "+" : "-"} {t.symbol} {t.amount.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#16a34a]">{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
