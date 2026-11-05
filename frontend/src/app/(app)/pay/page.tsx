"use client";
import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, ArrowRight, ShieldCheck, UserCheck, AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import { DEMO_PAYMENT_METHODS, DEMO_BALANCES } from "@/lib/demo-data";

export default function PayPage() {
  const [recipient, setRecipient] = useState("priya.sharma@eterpay.demo");
  const [amount, setAmount] = useState("5000");
  const [currency, setCurrency] = useState("INR");
  const [selectedMethod, setSelectedMethod] = useState(DEMO_PAYMENT_METHODS[0].id);
  const [note, setNote] = useState("Consulting fee invoice settlement");
  const [stage, setStage] = useState<"compose" | "review" | "success">("compose");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setStage("review");
  };

  const handleConfirmPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStage("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)] mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Money Movement</div>
            <h1 className="font-serif text-3xl text-[#111111]">Pay & Transfer</h1>
          </div>
          <span className="demo-badge">Verified Simulation</span>
        </div>

        {stage === "compose" && (
          <form onSubmit={handleReview} className="card p-8 bg-white space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Recipient Identifier</label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input text-sm"
                placeholder="email@domain.com or @username or UPI ID"
              />
              <span className="text-[11px] text-[#0f4d40] flex items-center gap-1 mt-1 font-medium">
                <UserCheck className="w-3.5 h-3.5" /> Verified EterPay & PayPal Directory Contact
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Transfer Amount</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input text-lg font-semibold tabular"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="input text-sm font-medium"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Funding Rail</label>
              <div className="space-y-2">
                {DEMO_PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMethod === pm.id
                        ? "border-[#0f4d40] bg-[rgba(15,77,64,0.04)]"
                        : "border-[rgba(17,17,17,0.08)] bg-white hover:bg-[#fbf9f5]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={selectedMethod === pm.id}
                        onChange={() => setSelectedMethod(pm.id)}
                        className="text-[#0f4d40] focus:ring-[#0f4d40]"
                      />
                      <CreditCard className="w-4 h-4 text-[#0f4d40]" />
                      <span className="text-xs font-medium text-[#111111]">{pm.label}</span>
                    </div>
                    {pm.default && <span className="text-[10px] uppercase font-semibold text-[#888888]">Default</span>}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Transfer Note / Reference</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input text-sm"
                placeholder="What is this transfer for?"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3.5 text-sm font-medium">
              Review Transfer Intent <ArrowRight className="w-4 h-4 ml-1 inline" />
            </button>
          </form>
        )}

        {stage === "review" && (
          <div className="card p-8 bg-white space-y-6">
            <h2 className="font-serif text-2xl text-[#111111]">Review & Authorize Payment</h2>
            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)] space-y-3">
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Recipient:</span>
                <span className="font-semibold text-[#111111]">{recipient}</span>
              </div>
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Transfer Amount:</span>
                <span className="font-serif text-lg font-semibold text-[#0f4d40] tabular">
                  {currency === "INR" ? "₹" : "$"} {Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Clearing Rail:</span>
                <span className="font-medium text-[#111111]">
                  {DEMO_PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.label}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Estimated Network Fee:</span>
                <span className="font-semibold text-[#16a34a]">₹ 0.00 (Zero-Fee Demo)</span>
              </div>
              <div className="flex justify-between text-xs text-[#555555]">
                <span>Reference Note:</span>
                <span className="italic text-[#111111]">{note}</span>
              </div>
            </div>

            <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-xl flex items-center gap-2 text-xs text-[#0f4d40]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Idempotency token generated: <code>UUID-v4-9b24</code> to protect against duplicate charge.</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage("compose")}
                className="btn btn-secondary flex-1 py-3 text-sm"
                disabled={isProcessing}
              >
                Modify Intent
              </button>
              <button
                onClick={handleConfirmPay}
                disabled={isProcessing}
                className="btn btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Authorizing Rail...
                  </>
                ) : (
                  <>
                    Explicit Confirm & Pay <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {stage === "success" && (
          <div className="card p-8 bg-white text-center space-y-6">
            <div className="w-16 h-16 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto text-[#16a34a]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16a34a]">Transfer Dispatched</span>
              <h2 className="font-serif text-3xl text-[#111111] mt-1">Payment Successfully Settled</h2>
              <p className="text-xs text-[#666666] mt-2">
                {currency} {Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} has been transferred to {recipient}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)] max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#888888]">Transaction ID:</span>
                <span className="font-mono text-[#111111]">TXN-2026-CONF-984</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Network Status:</span>
                <span className="font-semibold text-[#16a34a]">Settled (Instant)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#888888]">Timestamp:</span>
                <span className="text-[#111111]">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setStage("compose");
                  setAmount("1000");
                }}
                className="btn btn-secondary text-xs px-6 py-2.5"
              >
                Send Another Transfer
              </button>
              <Link href="/transactions" className="btn btn-primary text-xs px-6 py-2.5">
                View in Ledger
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
