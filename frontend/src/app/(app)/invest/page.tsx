"use client";
import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Sparkles,
  Lock,
  Unlock,
  Percent,
  Coins,
  Wallet,
} from "lucide-react";
import { DEMO_PORTFOLIO } from "@/lib/demo-data";

export default function InvestPage() {
  const [rebalanced, setRebalanced] = useState(false);
  const [activeScenario, setActiveScenario] = useState<"usd_deprec" | "eur_surge" | "equity_shock">("usd_deprec");

  // EterPay ReserveLien™ State (Loan Against Fixed Deposit & Multi-Currency Reserves)
  const [collateralAmount, setCollateralAmount] = useState(500000);
  const [collateralCcy, setCollateralCcy] = useState<"INR" | "USD">("INR");
  const [drawSuccess, setDrawSuccess] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const ltv = 0.85;
  const maxCreditLine = Math.round(collateralAmount * ltv);
  const fdRate = 7.20;
  const borrowRate = 8.45;
  const netSpread = 1.25;
  const annualEarnedYield = Math.round(collateralAmount * (fdRate / 100));
  const annualBorrowCost = Math.round(maxCreditLine * (borrowRate / 100));
  const sym = collateralCcy === "INR" ? "₹" : "$";

  const scenarios = {
    usd_deprec: {
      title: "Simulated 5% INR/USD Depreciation",
      badge: "+1.8% Net Portfolio Hedge",
      badgeCls: "bg-[#f0fdf4] text-[#16a34a] border-[#16a34a]/30",
      analysis:
        "Under a simulated 5% INR depreciation against the US Dollar, your 10% FX Reserve allocation and 20% US Tech index position yield a net +1.8% portfolio hedge, insulating international purchasing power.",
    },
    eur_surge: {
      title: "Simulated 4% EUR Appreciation Shock",
      badge: "+0.9% European Pocket Gain",
      badgeCls: "bg-[#f0fdf4] text-[#16a34a] border-[#16a34a]/30",
      analysis:
        "Under a 4% euro strengthening scenario, cross-border European travel balances gain purchasing strength with zero foreign exchange fees thanks to live ECB interbank clearing.",
    },
    equity_shock: {
      title: "Simulated 8% Global Equity Drawdown",
      badge: "-2.1% Drawdown (Buffered)",
      badgeCls: "bg-[#fffbeb] text-[#d97706] border-[#d97706]/30",
      analysis:
        "During severe equity turbulence, the 30% sovereign bond foundation and cash reserve buffer 74% of the market drawdown, restricting portfolio contraction to -2.1%.",
    },
  };

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
        <div className="card-dark p-8 rounded-3xl relative overflow-hidden">
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

        {/* ─── EterPay ReserveLien™ (Loan Against Multi-Currency FD & Reserves) ─── */}
        <div className="card p-6 sm:p-8 bg-white border border-[rgba(15,77,64,0.2)] rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(17,17,17,0.06)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[rgba(15,77,64,0.1)] text-[#0f4d40]">
                  Global Asset-Backed Liquidity
                </span>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30">
                  Zero Credit Score Check
                </span>
              </div>
              <h2 className="font-serif text-2xl text-[#111111] mt-1.5 flex items-center gap-2">
                EterPay ReserveLien™
                <span className="text-xs font-normal text-[#555555]">
                  (Overdraft Against FD &amp; Multi-Currency Reserves)
                </span>
              </h2>
              <p className="text-xs text-[#555555] mt-1 leading-relaxed max-w-2xl">
                Inspired by the Indian banking breakthrough of <em>Loan Against Fixed Deposit</em>, now upgraded for global fintech.
                Pledge your domestic term deposits or foreign currency reserves to unlock an instant 85% liquidity line without breaking deposits.
                Your pledged balance continues compounding yield uninterrupted.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="inline-flex rounded-lg bg-[#fbf9f5] p-1 border border-[rgba(17,17,17,0.08)] text-xs font-medium self-start sm:self-center">
              <button
                type="button"
                onClick={() => {
                  setCollateralCcy("INR");
                  setCollateralAmount(500000);
                }}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  collateralCcy === "INR"
                    ? "bg-[#0f4d40] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                ₹ INR Deposit
              </button>
              <button
                type="button"
                onClick={() => {
                  setCollateralCcy("USD");
                  setCollateralAmount(10000);
                }}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  collateralCcy === "USD"
                    ? "bg-[#0f4d40] text-white shadow-xs"
                    : "text-[#555555] hover:text-[#111111]"
                }`}
              >
                $ USD Reserve
              </button>
            </div>
          </div>

          {/* Interactive Collateral Slider */}
          <div className="space-y-3 bg-[#fbf9f5] p-5 rounded-2xl border border-[rgba(17,17,17,0.06)]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#555555]">
                Pledge Collateral Amount:
              </label>
              <span className="font-serif text-xl font-bold text-[#0f4d40] tabular">
                {sym} {collateralAmount.toLocaleString(collateralCcy === "INR" ? "en-IN" : "en-US")}
              </span>
            </div>
            <input
              type="range"
              min={collateralCcy === "INR" ? 50000 : 1000}
              max={collateralCcy === "INR" ? 2500000 : 50000}
              step={collateralCcy === "INR" ? 25000 : 500}
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(Number(e.target.value))}
              className="w-full accent-[#0f4d40] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#888888] font-mono">
              <span>Min: {sym} {collateralCcy === "INR" ? "50,000" : "1,000"}</span>
              <span>Max: {sym} {collateralCcy === "INR" ? "25,00,000" : "50,000"}</span>
            </div>
          </div>

          {/* 4 Financial Metric Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.08)]">
              <div className="flex items-center justify-between text-[11px] text-[#888888]">
                <span>Instant Overdraft Line</span>
                <Unlock className="w-3.5 h-3.5 text-[#0f4d40]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#0f4d40] mt-1 tabular">
                {sym} {maxCreditLine.toLocaleString(collateralCcy === "INR" ? "en-IN" : "en-US")}
              </div>
              <span className="text-[10px] text-[#16a34a] font-semibold mt-0.5 block">85% Instant LTV</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.08)]">
              <div className="flex items-center justify-between text-[11px] text-[#888888]">
                <span>Deposit Compounding Yield</span>
                <Coins className="w-3.5 h-3.5 text-[#16a34a]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#16a34a] mt-1 tabular">
                +{fdRate}% p.a.
              </div>
              <span className="text-[10px] text-[#555555] mt-0.5 block">
                Earns ~{sym}{annualEarnedYield.toLocaleString()}/yr
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.08)]">
              <div className="flex items-center justify-between text-[11px] text-[#888888]">
                <span>Overdraft Borrow Rate</span>
                <Percent className="w-3.5 h-3.5 text-[#555555]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#111111] mt-1 tabular">
                {borrowRate}% p.a.
              </div>
              <span className="text-[10px] text-[#555555] mt-0.5 block">
                Cost ~{sym}{annualBorrowCost.toLocaleString()}/yr
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[rgba(17,17,17,0.08)]">
              <div className="flex items-center justify-between text-[11px] text-[#888888]">
                <span>Effective Net Spread</span>
                <Sparkles className="w-3.5 h-3.5 text-[#0f4d40]" />
              </div>
              <div className="font-serif text-2xl font-bold text-[#0f4d40] mt-1 tabular">
                Only {netSpread}% p.a.
              </div>
              <span className="text-[10px] text-[#16a34a] font-semibold mt-0.5 block">
                vs 36%-42% on Credit Cards
              </span>
            </div>
          </div>

          {/* Educational Comparison Box */}
          <div className="p-4 rounded-2xl bg-[rgba(15,77,64,0.04)] border border-[rgba(15,77,64,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-[#333333] space-y-1">
              <div className="font-semibold text-[#0f4d40] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0f4d40]" />
                Why ReserveLien™ Outperforms Traditional Borrowing &amp; Premature Liquidation:
              </div>
              <p className="text-[#555555] leading-relaxed">
                Breaking a deposit forfeits compounding interest and incurs early exit penalties.
                Personal loans require invasive credit bureau checks. ReserveLien is 100% asset-backed,
                free from credit checks, and spendable instantly across the PayPal merchant ecosystem.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDrawing(true);
                setTimeout(() => {
                  setIsDrawing(false);
                  setDrawSuccess(true);
                }, 1200);
              }}
              disabled={isDrawing || drawSuccess}
              className="btn btn-primary text-xs px-5 py-3 rounded-xl flex-shrink-0 flex items-center gap-2 whitespace-nowrap"
            >
              {isDrawing ? (
                <>Allocating Overdraft Line...</>
              ) : drawSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#34d399]" /> Line Allocated
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" /> Draw {sym} {maxCreditLine.toLocaleString()} to PayPal
                </>
              )}
            </button>
          </div>

          {drawSuccess && (
            <div className="p-4 bg-[#f0fdf4] border border-[#16a34a]/30 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between text-[#16a34a] font-semibold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  ReserveLien™ Overdraft Facility Ready for Instant Spend
                </span>
                <span className="font-mono text-[10px]">TX-LIEN-2026-OK</span>
              </div>
              <div className="text-[#555555]">
                {sym} {maxCreditLine.toLocaleString()} liquidity line linked to your EterPay account.
                You can now settle merchant invoices, buy commerce items, or execute PayPal Orders v2 transactions.
                Your pledged collateral of {sym} {collateralAmount.toLocaleString()} continues compounding yield.
              </div>
              <div className="pt-1">
                <Link
                  href="/commerce"
                  className="inline-flex items-center gap-1 font-semibold text-[#0f4d40] underline underline-offset-2 hover:no-underline"
                >
                  Spend via PayPal Commerce Hub <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* AI Portfolio Advisory & Multi-Scenario Stress Test */}
        <div className="card p-6 bg-white border border-[rgba(17,17,17,0.08)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg text-[#111111]">Autonomous Macro Stress Test Engine</h3>
              <p className="text-xs text-[#888888]">Simulate FX and macro shocks on current asset allocation</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveScenario("usd_deprec")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activeScenario === "usd_deprec"
                    ? "bg-[#0f4d40] text-white border-[#0f4d40]"
                    : "bg-[#fbf9f5] text-[#555555] border-[rgba(17,17,17,0.1)] hover:bg-white"
                }`}
              >
                INR/USD -5%
              </button>
              <button
                onClick={() => setActiveScenario("eur_surge")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activeScenario === "eur_surge"
                    ? "bg-[#0f4d40] text-white border-[#0f4d40]"
                    : "bg-[#fbf9f5] text-[#555555] border-[rgba(17,17,17,0.1)] hover:bg-white"
                }`}
              >
                EUR +4%
              </button>
              <button
                onClick={() => setActiveScenario("equity_shock")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  activeScenario === "equity_shock"
                    ? "bg-[#0f4d40] text-white border-[#0f4d40]"
                    : "bg-[#fbf9f5] text-[#555555] border-[rgba(17,17,17,0.1)] hover:bg-white"
                }`}
              >
                Equity -8%
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#111111]">{scenarios[activeScenario].title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scenarios[activeScenario].badgeCls}`}>
                {scenarios[activeScenario].badge}
              </span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed">
              {scenarios[activeScenario].analysis}
            </p>
          </div>

          <div className="text-[11px] text-[#888888] flex items-center justify-between border-t border-[rgba(17,17,17,0.06)] pt-3">
            <span>Powered by Gemini &amp; Groq Eter AI • Theoretical models only.</span>
            <span className="font-semibold text-[#d97706]">[No Capital at Risk]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
