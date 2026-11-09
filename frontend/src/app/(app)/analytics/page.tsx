"use client";
import Link from "next/link";
import { BarChart2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, PieChart } from "lucide-react";
import { DEMO_ANALYTICS } from "@/lib/demo-data";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySwitcher from "@/components/shared/CurrencySwitcher";

export default function AnalyticsPage() {
  const { formatAmount } = useCurrency();
  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Financial Intelligence</div>
            <h1 className="font-serif text-3xl text-[#111111]">Reports &amp; Cashflow Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <CurrencySwitcher />
            <span className="demo-badge">Real-Time Telemetry</span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Monthly Inflow</span>
            <div className="font-serif text-3xl font-medium text-[#16a34a] mt-1 tabular">
              +{formatAmount(DEMO_ANALYTICS.totalReceivedThisMonth)}
            </div>
            <span className="text-xs text-[#888888] mt-1 block">Settled peer &amp; merchant credits</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Monthly Outflow</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">
              -{formatAmount(DEMO_ANALYTICS.totalSpentThisMonth)}
            </div>
            <span className="text-xs text-[#888888] mt-1 block">Across commerce &amp; transfers</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Net Operating Cashflow</span>
            <div className="font-serif text-3xl font-medium text-[#0f4d40] mt-1 tabular">
              +{formatAmount(DEMO_ANALYTICS.netCashFlow)}
            </div>
            <span className="text-xs text-[#16a34a] mt-1 block">Positive liquidity surplus</span>
          </div>
        </div>

        {/* Monthly Trend Bars */}
        <div className="card p-6 bg-white">
          <h2 className="font-serif text-xl text-[#111111] mb-6">6-Month Expenditure Run-Rate</h2>
          <div className="flex items-end justify-between gap-4 h-48 pt-8">
            {DEMO_ANALYTICS.monthlySpend.map((m) => {
              const heightPercent = Math.round((m.amount / 80000) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono text-[#888888] tabular">
                    ₹{(m.amount / 1000).toFixed(0)}k
                  </span>
                  <div className="w-full max-w-[48px] bg-[rgba(17,17,17,0.06)] rounded-t-xl overflow-hidden h-32 flex items-end">
                    <div
                      className="w-full bg-[#0f4d40] rounded-t-xl transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#111111]">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card p-6 bg-white">
          <h2 className="font-serif text-xl text-[#111111] mb-4">Expenditure by Category Tranche</h2>
          <div className="space-y-4">
            {DEMO_ANALYTICS.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#111111]">
                  <span>{cat.category}</span>
                  <span className="tabular">
                    {formatAmount(cat.amount)} ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[rgba(17,17,17,0.06)] overflow-hidden">
                  <div
                    className="h-full bg-[#0f4d40] rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
