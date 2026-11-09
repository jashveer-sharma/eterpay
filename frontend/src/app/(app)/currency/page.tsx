"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DEMO_CURRENCIES_FX } from "@/lib/demo-data";
import CurrencySwitcher from "@/components/shared/CurrencySwitcher";

interface ConversionData {
  rate: number;
  amount_source: number;
  currency_source: string;
  amount_target: number;
  currency_target: string;
  traditional_bank_fee_estimate: number;
  eterpay_estimated_savings: number;
}

export default function CurrencyExchangePage() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ratesDate, setRatesDate] = useState<string>("");
  const [loadingRates, setLoadingRates] = useState(true);
  const [sourceAmount, setSourceAmount] = useState<number>(10000);
  const [fromCurr, setFromCurr] = useState("INR");
  const [toCurr, setToCurr] = useState("USD");
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [converting, setConverting] = useState(false);
  const [swappedSuccess, setSwappedSuccess] = useState(false);

  // Fetch live ECB rates from backend
  const fetchRates = useCallback(async () => {
    setLoadingRates(true);
    try {
      const res = await fetch(`/api/currency/rates?base=${fromCurr}`);
      if (res.ok) {
        const data = await res.json();
        setRates(data.rates || {});
        setRatesDate(data.date || "");
      } else {
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
      setLoadingRates(false);
    }
  }, [fromCurr]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Convert via backend conversion endpoint with bank fee & savings calculation
  const executeConversion = useCallback(async () => {
    if (sourceAmount <= 0) return;
    setConverting(true);
    try {
      const res = await fetch("/api/currency/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: sourceAmount,
          from_currency: fromCurr,
          to_currency: toCurr,
        }),
      });

      if (res.ok) {
        const data: ConversionData = await res.json();
        setConversion(data);
      } else {
        // Fallback calculation using cached/demo rates
        const rate = rates[toCurr] || 0.01065;
        const target = sourceAmount * rate;
        const bankFee = sourceAmount * 0.045;
        const savings = bankFee - sourceAmount * 0.004;
        setConversion({
          rate,
          amount_source: sourceAmount,
          currency_source: fromCurr,
          amount_target: target,
          currency_target: toCurr,
          traditional_bank_fee_estimate: bankFee,
          eterpay_estimated_savings: savings,
        });
      }
    } catch {
      const rate = rates[toCurr] || 0.01065;
      const target = sourceAmount * rate;
      const bankFee = sourceAmount * 0.045;
      const savings = bankFee - sourceAmount * 0.004;
      setConversion({
        rate,
        amount_source: sourceAmount,
        currency_source: fromCurr,
        amount_target: target,
        currency_target: toCurr,
        traditional_bank_fee_estimate: bankFee,
        eterpay_estimated_savings: savings,
      });
    } finally {
      setConverting(false);
    }
  }, [sourceAmount, fromCurr, toCurr, rates]);

  useEffect(() => {
    executeConversion();
  }, [executeConversion]);

  const handleSwapCurrencies = () => {
    const prevFrom = fromCurr;
    const prevTo = toCurr;
    setFromCurr(prevTo);
    setToCurr(prevFrom);
  };

  const handleSwapExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setSwappedSuccess(true);
    setTimeout(() => setSwappedSuccess(false), 3000);
  };

  const currentRate = conversion?.rate || rates[toCurr] || 0.01065;
  const converted = conversion ? conversion.amount_target.toFixed(2) : (sourceAmount * currentRate).toFixed(2);

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">
              European Central Bank (ECB) Feed · Zero Hidden Spreads
            </div>
            <h1 className="font-serif text-3xl text-[#111111]">Currency &amp; Foreign Exchange</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="demo-badge">Live Interbank Feed</span>
            <button
              onClick={() => {
                fetchRates();
                executeConversion();
              }}
              title="Refresh rates"
              className="p-2 rounded-xl hover:bg-[rgba(17,17,17,0.05)] text-[#555]"
            >
              <RefreshCw className={`w-4 h-4 ${loadingRates || converting ? "animate-spin text-[#0f4d40]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Swap Calculator */}
        <div className="card p-8 bg-white shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#111111]">Real-Time Currency Conversion</h2>
            {ratesDate && (
              <span className="text-[11px] text-[#888888]">
                ECB Reference Date: <code className="font-mono">{ratesDate}</code>
              </span>
            )}
          </div>

          <form onSubmit={handleSwapExecute} className="space-y-6">
            <div className="grid sm:grid-cols-5 gap-4 items-center">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">You Send ({fromCurr})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#888888]">
                    {fromCurr === "INR" ? "₹" : fromCurr === "USD" ? "$" : fromCurr === "EUR" ? "€" : fromCurr}
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={sourceAmount}
                    onChange={(e) => setSourceAmount(Math.max(1, Number(e.target.value)))}
                    className="input pl-8 text-xl font-semibold tabular"
                  />
                </div>
              </div>

              <div className="flex justify-center sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  title="Swap currencies"
                  className="p-3 rounded-full border border-[rgba(17,17,17,0.12)] hover:bg-[#fbf9f5] transition-all hover:scale-105"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#0f4d40]" />
                </button>
              </div>

              <div className="sm:col-span-2">
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
                  <option value="INR">INR (₹) — Indian Rupee</option>
                </select>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#888888]">Instant Liquidity Value:</span>
                <div className="font-serif text-3xl text-[#0f4d40] font-semibold tabular mt-0.5">
                  {converted} {toCurr}
                </div>
              </div>
              <div className="text-xs text-right space-y-1">
                <div>
                  <span className="text-[#888888]">Live Mid-Market: </span>
                  <span className="font-mono font-semibold text-[#111111]">
                    1 {fromCurr} = {typeof currentRate === "number" ? currentRate.toFixed(5) : currentRate} {toCurr}
                  </span>
                </div>
                <div className="text-[11px] text-[#16a34a] font-medium flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct ECB Feed with Zero Spread Markup
                </div>
              </div>
            </div>

            {/* DCC Anti-Markup Comparison Card */}
            {conversion && conversion.eterpay_estimated_savings > 0 && (
              <div className="p-4 rounded-xl border border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.04)] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#16a34a] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Dynamic Currency Conversion (DCC) Savings
                  </span>
                  <span className="font-bold text-[#16a34a] font-mono">
                    Save ~{conversion.currency_source} {conversion.eterpay_estimated_savings.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[11px] text-[#555555] leading-relaxed">
                  Traditional card processors and airport ATMs apply a hidden 3.5%–4.5% Dynamic Currency Conversion (DCC) spread
                  (estimated cost: {conversion.currency_source} {conversion.traditional_bank_fee_estimate.toFixed(2)}).
                  EterPay settles at the pure European Central Bank rate with a 0.4% platform fee.
                </p>
              </div>
            )}

            {swappedSuccess && (
              <div className="p-3 bg-[#f0fdf4] border border-[#16a34a]/20 rounded-xl flex items-center gap-2 text-xs text-[#16a34a] font-medium">
                <CheckCircle2 className="w-4 h-4" /> Swap simulated! {converted} {toCurr} credited to your multi-currency wallet ledger.
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full py-3.5 text-sm font-medium">
              Execute Instant Currency Swap <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </form>
        </div>

        {/* Live Rates Feed */}
        <div className="card p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl text-[#111111]">Live Benchmark Foreign Rates (Base: {fromCurr})</h3>
              <p className="text-xs text-[#888888] mt-0.5">Frankfurter Interbank ECB Feed</p>
            </div>
            <span className="text-xs text-[#16a34a] font-semibold bg-[#f0fdf4] px-2.5 py-1 rounded-full">
              Zero Hidden Markup
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f5] text-[#888888] uppercase font-semibold border-b border-[rgba(17,17,17,0.06)]">
                <tr>
                  <th className="p-3">Currency Pair</th>
                  <th className="p-3">Reference Rate</th>
                  <th className="p-3">Spread Comparison</th>
                  <th className="p-3 text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,17,17,0.06)]">
                {DEMO_CURRENCIES_FX.map((item) => {
                  const liveRate = rates[item.to] || item.rate;
                  return (
                    <tr key={item.to} className="hover:bg-[#fbf9f5]">
                      <td className="p-3 font-semibold text-[#111111]">
                        {fromCurr} / {item.to}
                      </td>
                      <td className="p-3 font-mono tabular font-medium">
                        {typeof liveRate === "number" ? liveRate.toFixed(4) : liveRate}
                      </td>
                      <td className="p-3 font-medium text-[#16a34a] text-[11px]">
                        Save ~3.5% vs Bank DCC
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setToCurr(item.to);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-[#0f4d40] font-semibold hover:underline"
                        >
                          Select Pair →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
