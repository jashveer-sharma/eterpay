"use client";
import { useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, ShieldCheck, Zap, RefreshCw, CheckCircle2, AlertCircle, Compass } from "lucide-react";
import { DEMO_PAYMENT_NETWORKS_ANYWHERE } from "@/lib/demo-data";

export default function AppAnywherePage() {
  const [targetCountry, setTargetCountry] = useState("JPN");
  const [amountINR, setAmountINR] = useState("12000");
  const [recipient, setRecipient] = useState("takeshi.sato@kyoto-merchants.jp");
  const [isRouting, setIsRouting] = useState(false);
  const [stage, setStage] = useState<"configure" | "preview" | "settled">("configure");

  const destinations: Record<string, { name: string; currency: string; rate: number; symbol: string; rail: string }> = {
    JPN: { name: "Japan", currency: "JPY", rate: 1.806, symbol: "¥", rail: "PayPal Cross-Border Direct / Zengin" },
    USA: { name: "United States", currency: "USD", rate: 0.01198, symbol: "$", rail: "PayPal Orders v2 / ACH" },
    EUR: { name: "Germany (Eurozone)", currency: "EUR", rate: 0.01102, symbol: "€", rail: "SEPA Instant via PayPal" },
    GBR: { name: "United Kingdom", currency: "GBP", rate: 0.00947, symbol: "£", rail: "Faster Payments Gateway" },
    SGP: { name: "Singapore", currency: "SGD", rate: 0.01603, symbol: "S$", rail: "PayNow Network Link" },
    ARE: { name: "United Arab Emirates", currency: "AED", rate: 0.04399, symbol: "د.إ", rail: "Visa Direct Cross-Border" },
  };

  const dest = destinations[targetCountry] || destinations.JPN;
  const convertedVal = (Number(amountINR) * dest.rate).toLocaleString("en-IN", {
    minimumFractionDigits: targetCountry === "JPN" ? 0 : 2,
    maximumFractionDigits: targetCountry === "JPN" ? 0 : 2,
  });

  const handleRoutePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
      setStage("preview");
    }, 800);
  };

  const handleExecutePayment = () => {
    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
      setStage("settled");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">
              Universal Interoperability
            </div>
            <h1 className="font-serif text-3xl text-[#111111]">EterPay Anywhere Terminal</h1>
          </div>
          <span className="demo-badge">Autonomous Routing</span>
        </div>

        {stage === "configure" && (
          <form onSubmit={handleRoutePreview} className="card p-8 bg-white space-y-6">
            <div className="p-4 rounded-2xl bg-[rgba(15,77,64,0.04)] border border-[rgba(15,77,64,0.1)] flex items-start gap-3">
              <Compass className="w-5 h-5 text-[#0f4d40] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#555555]">
                <strong className="text-[#0f4d40]">Zero Network Friction:</strong> Enter any recipient across 200+ regions. EterPay Anywhere automatically negotiates the fastest, most cost-effective clearing bridge.
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Destination Territory</label>
                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="input font-medium text-sm"
                >
                  {Object.entries(destinations).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.name} ({info.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Recipient Handle / Email</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="input text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Amount (Source: INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#888888]">₹</span>
                  <input
                    type="number"
                    required
                    min="100"
                    value={amountINR}
                    onChange={(e) => setAmountINR(e.target.value)}
                    className="input pl-8 text-lg font-semibold tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Estimated Local Payout</label>
                <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] font-serif text-xl text-[#0f4d40] font-medium tabular">
                  {dest.symbol} {convertedVal} {dest.currency}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isRouting} className="btn btn-primary w-full py-3.5 text-sm font-medium">
              {isRouting ? "Probing Network Compatibility..." : "Compute Optimal Clearing Route"}
            </button>
          </form>
        )}

        {stage === "preview" && (
          <div className="card p-8 bg-white space-y-6">
            <h2 className="font-serif text-2xl text-[#111111]">Payment Route Authorization</h2>
            <div className="p-6 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)] space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Destination Country:</span>
                <span className="font-semibold text-[#111111]">{dest.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Target Recipient:</span>
                <span className="font-semibold text-[#111111]">{recipient}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Discovered Rail:</span>
                <span className="font-semibold text-[#0f4d40]">{dest.rail}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Exchange Rate (ECB Reference):</span>
                <span className="font-mono text-[#111111]">1 INR = {dest.rate} {dest.currency}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#888888]">Intermediary Spread:</span>
                <span className="font-semibold text-[#16a34a]">₹ 0.00 (Zero Surcharge)</span>
              </div>
              <div className="pt-3 border-t border-[rgba(17,17,17,0.06)] flex justify-between items-baseline">
                <span className="text-xs font-semibold text-[#111111]">Beneficiary Receives:</span>
                <span className="font-serif text-2xl text-[#0f4d40] font-semibold tabular">
                  {dest.symbol} {convertedVal} {dest.currency}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage("configure")}
                className="btn btn-secondary flex-1 py-3 text-xs"
                disabled={isRouting}
              >
                Back to Config
              </button>
              <button
                onClick={handleExecutePayment}
                disabled={isRouting}
                className="btn btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2"
              >
                {isRouting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Settlement Rail...
                  </>
                ) : (
                  <>
                    Execute Payment via EterPay Anywhere <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {stage === "settled" && (
          <div className="card p-8 bg-white text-center space-y-6">
            <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto text-[#16a34a]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16a34a]">International Transfer Confirmed</span>
              <h2 className="font-serif text-3xl text-[#111111] mt-1">Cross-Border Funds Dispatched</h2>
              <p className="text-xs text-[#666666] mt-2 max-w-md mx-auto">
                {dest.symbol} {convertedVal} has been delivered to {recipient} via {dest.rail}.
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setStage("configure");
                }}
                className="btn btn-secondary text-xs px-6 py-2.5"
              >
                New Anywhere Route
              </button>
              <Link href="/transactions" className="btn btn-primary text-xs px-6 py-2.5">
                Inspect Transaction Ledger
              </Link>
            </div>
          </div>
        )}

        {/* Global Network Availability Grid */}
        <div>
          <h3 className="font-serif text-xl text-[#111111] mb-4">Interoperability Protocol Bridges</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_PAYMENT_NETWORKS_ANYWHERE.map((net) => (
              <div key={net.id} className="card p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#111111]">{net.name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        net.status === "live"
                          ? "bg-[#f0fdf4] text-[#16a34a]"
                          : net.status === "demo"
                          ? "bg-[#fffbeb] text-[#d97706]"
                          : "bg-[rgba(17,17,17,0.06)] text-[#666666]"
                      }`}
                    >
                      {net.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#888888]">{net.countries}+ countries supported</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
