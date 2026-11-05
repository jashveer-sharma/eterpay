"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, AlertTriangle, ShieldCheck, ArrowUpRight, CheckCircle2, PieChart } from "lucide-react";
import { DEMO_PORTFOLIO } from "@/lib/demo-data";

export default function InvestPage() {
  const [rebalanced, setRebalanced] = useState(false);

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Mandatory Financial Safety Badge */}
        <div className="p-3 bg-[#fffbeb] border border-[#d97706]/30 rounded-xl text-center">
          <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">
            [Simulated Portfolio — Educational Only — No Capital at Risk]
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Wealth Intelligence</div>
            <h1 className="font-serif text-3xl text-[#111111]">Invest & Portfolio Allocation</h1>
          </div>
          <button
            onClick={() => {
              setRebalanced(true);
              setTimeout(() => setRebalanced(false), 2500);
            }}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-full"
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1 inline" /> AI Rebalance Simulation
          </button>
        </div>

        {/* Portfolio Summary */}
        <div className="card p-8 bg-[#111111] text-[#fbf9f5] rounded-3xl relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-[#34d399] font-semibold mb-2">Simulated Net Asset Value</div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="font-serif text-4xl sm:text-5xl tabular font-medium text-white">
                ₹ {DEMO_PORTFOLIO.totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[#34d399] mt-1 font-semibold flex items-center gap-1">
                +{DEMO_PORTFOLIO.change24h}% (₹ {DEMO_PORTFOLIO.changeValue.toLocaleString("en-IN")}) 24h Yield
              </p>
            </div>
            <span className="text-xs text-[rgba(251,249,245,0.6)]">
              Educational Multi-Asset Diversification Model
            </span>
          </div>
        </div>

        {rebalanced && (
          <div className="p-4 bg-[#f0fdf4] border border-[#16a34a]/30 rounded-2xl flex items-center gap-2 text-xs text-[#16a34a] font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Portfolio rebalance completed! Targets optimized across Bond & FX Reserve tranches.
          </div>
        )}

        {/* Asset Table */}
        <div className="card bg-white overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[rgba(17,17,17,0.06)] flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#111111]">Simulated Asset Allocations</h2>
            <span className="text-xs text-[#888888]">Historical Risk Attribution</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f5] text-[#888888] uppercase font-semibold border-b border-[rgba(17,17,17,0.06)]">
                <tr>
                  <th className="p-4">Instrument</th>
                  <th className="p-4">Target Allocation</th>
                  <th className="p-4">Current Value</th>
                  <th className="p-4">24h Variance</th>
                  <th className="p-4 text-right">Holdings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,17,17,0.06)]">
                {DEMO_PORTFOLIO.assets.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-[#fbf9f5]/60 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#111111]">{asset.name}</div>
                      <span className="font-mono text-[10px] text-[#888888]">{asset.symbol}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[rgba(17,17,17,0.1)] overflow-hidden">
                          <div className="h-full bg-[#0f4d40]" style={{ width: `${asset.allocation * 2}%` }} />
                        </div>
                        <span className="tabular font-semibold text-[#111111]">{asset.allocation}%</span>
                      </div>
                    </td>
                    <td className="p-4 font-serif text-sm tabular font-semibold text-[#111111]">
                      ₹ {asset.value.toLocaleString("en-IN")}
                    </td>
                    <td className={`p-4 font-semibold tabular ${asset.change >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      {asset.change >= 0 ? `+${asset.change}%` : `${asset.change}%`}
                    </td>
                    <td className="p-4 text-right font-mono text-[#555555]">
                      {asset.units} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Portfolio Advisory Note */}
        <div className="card p-6 bg-white border border-[rgba(17,17,17,0.08)]">
          <h3 className="font-serif text-lg text-[#111111] mb-2">Autonomous Stress Test Assessment</h3>
          <p className="text-xs text-[#555555] leading-relaxed mb-4">
            Under a simulated 5% INR/USD depreciation scenario, your 10% FX Reserve allocation and 20% US Tech index position yield a net +1.8% portfolio hedge.
          </p>
          <div className="text-[11px] text-[#888888]">
            Generated via Gemini 1.5 Flash Copilot • Theoretical models for educational learning only.
          </div>
        </div>
      </div>
    </div>
  );
}
