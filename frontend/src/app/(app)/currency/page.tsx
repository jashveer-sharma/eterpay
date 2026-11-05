"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeftRight, CheckCircle2, AlertCircle, ArrowUpRight, ArrowRight } from "lucide-react";
import { DEMO_CURRENCIES_FX } from "@/lib/demo-data";

export default function CurrencyExchangePage() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [sourceAmount, setSourceAmount] = useState<number>(10000);
  const [fromCurr, setFromCurr] = useState("INR");
  const [toCurr, setToCurr] = useState("USD");
  const [swappedSuccess, setSwappedSuccess] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("http://localhost:8000/api/currency/rates?base=INR");
        if (res.ok) {
          const data = await res.json();
          setRates(data.rates || {});
        } else {
          // fallback
          const fb: Record<string, number> = {};
          DEMO_CURRENCIES_FX.forEach((p) => {
            fb[p.to] = p.rate;
          });
          setRates(fb);
        }
      } catch {
        const fb: Record<string, number> = {};
        DEMO_CURRENCIES_FX.forEach((p) => {
          fb[p.to] = p.rate;
        });
        setRates(fb);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const currentRate = rates[toCurr] || 0.01198;
  const converted = (sourceAmount * currentRate).toFixed(2);

  const handleSwapExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setSwappedSuccess(true);
    setTimeout(() => setSwappedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Liquidity Terminal</div>
            <h1 className="font-serif text-3xl text-[#111111]">Currency & Foreign Exchange</h1>
          </div>
          <span className="demo-badge">European Central Bank Rates</span>
        </div>

        {/* Swap Calculator */}
        <div className="card p-8 bg-white shadow-sm">
          <h2 className="font-serif text-2xl text-[#111111] mb-6">Real-Time Instant Swap</h2>
          
          <form onSubmit={handleSwapExecute} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Sell ({fromCurr})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#888888]">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={sourceAmount}
                    onChange={(e) => setSourceAmount(Number(e.target.value))}
                    className="input pl-8 text-xl font-semibold tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Target Currency</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="input font-medium text-sm"
                >
                  <option value="USD">USD ($) — United States Dollar</option>
                  <option value="EUR">EUR (€) — Eurozone</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="JPY">JPY (¥) — Japanese Yen</option>
                  <option value="SGD">SGD (S$) — Singapore Dollar</option>
                  <option value="AED">AED (د.إ) — UAE Dirham</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#888888]">You Receive in Foreign Sub-Wallet:</span>
                <div className="font-serif text-3xl text-[#0f4d40] font-semibold tabular mt-0.5">
                  {converted} {toCurr}
                </div>
              </div>
              <div className="text-xs text-right">
                <span className="text-[#888888] block">ECB Mid-Market Quote:</span>
                <span className="font-mono font-semibold text-[#111111]">1 INR = {currentRate} {toCurr}</span>
              </div>
            </div>

            {swappedSuccess && (
              <div className="p-3 bg-[#f0fdf4] border border-[#16a34a]/20 rounded-xl flex items-center gap-2 text-xs text-[#16a34a] font-medium">
                <CheckCircle2 className="w-4 h-4" /> Swap simulated! {converted} {toCurr} credited to sub-wallet.
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full py-3.5 text-sm font-medium">
              Execute Simulated Currency Swap <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </form>
        </div>

        {/* Live Rates Feed */}
        <div className="card p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-[#111111]">Live Benchmark Foreign Rates (Base: INR)</h3>
            <span className="text-xs text-[#888888]">Zero Spread Markup</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f5] text-[#888888] uppercase font-semibold border-b border-[rgba(17,17,17,0.06)]">
                <tr>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Benchmark Rate</th>
                  <th className="p-3">24h Variance</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,17,17,0.06)]">
                {DEMO_CURRENCIES_FX.map((item) => (
                  <tr key={item.to} className="hover:bg-[#fbf9f5]">
                    <td className="p-3 font-semibold text-[#111111]">{item.to}</td>
                    <td className="p-3 font-mono tabular">{item.rate}</td>
                    <td className={`p-3 font-medium tabular ${item.change >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                      {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setToCurr(item.to)}
                        className="text-[#0f4d40] font-semibold hover:underline"
                      >
                        Select Pair
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
