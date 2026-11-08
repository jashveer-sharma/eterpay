"use client";
import { useState } from "react";
import Link from "next/link";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { DEMO_BALANCES, DEMO_PAYMENT_METHODS } from "@/lib/demo-data";

export default function WalletPage() {
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [methodType, setMethodType] = useState("card");
  const [methodAdded, setMethodAdded] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMethodAdded(true);
    setTimeout(() => {
      setMethodAdded(false);
      setShowAddMethod(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Multi-Currency Treasury</div>
            <h1 className="font-serif text-3xl text-[#111111]">Digital Wallet & Funding Rails</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="demo-badge">Multi-Asset Ledger</span>
            <button
              onClick={() => setShowAddMethod(true)}
              className="btn btn-primary text-xs px-4 py-2.5 rounded-full"
            >
              <Plus className="w-4 h-4 mr-1 inline" /> Link Payment Method
            </button>
          </div>
        </div>

        {/* Primary Balances Card */}
        <div className="card-emerald p-8 rounded-3xl relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-[#34d399] font-semibold mb-2">Primary Operating Ledger</div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="font-serif text-4xl sm:text-5xl tabular font-medium text-white">
                ₹ {DEMO_BALANCES.primary.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-[rgba(251,249,245,0.7)] mt-1">
                Settled & instantly accessible across connected routing networks.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/pay" className="btn bg-white text-[#0f4d40] hover:bg-[#fbf9f5] text-xs px-5 py-2.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Transfer Funds
              </Link>
              <Link href="/currency" className="btn bg-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.25)] text-xs px-5 py-2.5 rounded-full">
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Swap Currency
              </Link>
            </div>
          </div>
        </div>

        {/* Multi-Currency Foreign Ledgers */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#111111]">Foreign Currency Sub-Accounts</h2>
            <span className="text-xs text-[#888888]">Direct European Central Bank Rates</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {DEMO_BALANCES.wallet.map((w) => (
              <div key={w.currency} className="card p-5 bg-white flex flex-col justify-between hover:border-[#0f4d40]/30 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{w.flag}</span>
                    <span className="text-xs font-semibold uppercase text-[#888888]">{w.currency}</span>
                  </div>
                  <div className="font-serif text-xl font-medium text-[#111111] tabular">
                    {w.symbol} {w.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="pt-3 border-t border-[rgba(17,17,17,0.06)] mt-3 flex justify-between text-[11px] text-[#0f4d40] font-medium">
                  <Link href="/currency" className="hover:underline">Convert</Link>
                  <Link href="/pay" className="hover:underline">Send</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Payment Methods */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#111111]">Connected Payment Rails & Cards</h2>
            <span className="text-xs text-[#888888]">Zero Client Secrets Cached</span>
          </div>
          <div className="space-y-3">
            {DEMO_PAYMENT_METHODS.map((pm) => (
              <div key={pm.id} className="card p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[rgba(15,77,64,0.06)] rounded-xl text-[#0f4d40]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#111111]">{pm.label}</div>
                    <div className="text-xs text-[#888888]">
                      {pm.verified ? "Cryptographically Verified" : "Pending Verification"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pm.default && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                      Default Rail
                    </span>
                  )}
                  <span className="text-xs text-[#888888] font-mono">Status: Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Modal */}
        {showAddMethod && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card p-6 bg-white max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#111111]">Link Funding Rail</h3>
                <button onClick={() => setShowAddMethod(false)} className="text-[#888888] hover:text-[#111111] text-sm">✕</button>
              </div>

              {methodAdded ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#16a34a] mx-auto" />
                  <p className="text-sm font-semibold text-[#111111]">Payment Method Attached!</p>
                  <p className="text-xs text-[#888888]">Updated in simulated session state.</p>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Method Type</label>
                    <select
                      value={methodType}
                      onChange={(e) => setMethodType(e.target.value)}
                      className="input text-xs"
                    >
                      <option value="card">Debit / Credit Card (RuPay, Visa, MC)</option>
                      <option value="bank">Bank Account Direct (IFSC)</option>
                      <option value="upi">Unified Payments Interface (UPI)</option>
                      <option value="paypal">PayPal Sandbox Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Identifier / Number</label>
                    <input
                      type="text"
                      required
                      placeholder={methodType === "card" ? "4111 2222 3333 4444" : "user@okaxis or Bank Account"}
                      className="input text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[rgba(15,77,64,0.06)] text-[11px] text-[#0f4d40]">
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1" /> Client credentials tokenized via backend gateway; zero raw numbers recorded.
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowAddMethod(false)} className="btn btn-secondary flex-1 text-xs py-2.5">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary flex-1 text-xs py-2.5">
                      Confirm Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
