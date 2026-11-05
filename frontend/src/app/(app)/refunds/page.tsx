"use client";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2, RotateCcw, Clock } from "lucide-react";

export default function RefundsPage() {
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [txnRef, setTxnRef] = useState("TXN20261102003");
  const [reason, setReason] = useState("Damaged product on delivery");

  const disputes = [
    { id: "ref_01", merchant: "Amazon India", amount: 3899, currency: "INR", status: "reviewing", filedDate: "2026-11-04", reason: "Item damaged during shipment" },
    { id: "ref_02", merchant: "Myntra Fashion", amount: 1299, currency: "INR", status: "refunded", filedDate: "2026-10-30", reason: "Wrong size delivered" },
  ];

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Consumer Guarantee</div>
            <h1 className="font-serif text-3xl text-[#111111]">Refunds & Purchase Protection</h1>
          </div>
          <span className="demo-badge">Guaranteed Resolution</span>
        </div>

        {/* Protection Banner */}
        <div className="card p-6 bg-white flex items-start gap-4">
          <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl text-[#0f4d40]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-xs text-[#555555] space-y-1">
            <h3 className="font-semibold text-sm text-[#111111]">EterPay Buyer Safety Protocol</h3>
            <p>
              Every transaction routed through PayPal Orders v2 or our verified merchant rails qualifies for 100% money-back coverage on non-delivery, fraudulent charges, or defective items.
            </p>
          </div>
        </div>

        {/* Active Claims */}
        <div className="card p-6 bg-white">
          <h2 className="font-serif text-xl text-[#111111] mb-4">Dispute & Refund Status</h2>
          <div className="space-y-3">
            {disputes.map((d) => (
              <div key={d.id} className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[#111111]">{d.merchant}</div>
                  <div className="text-xs text-[#888888]">{d.reason} • Filed: {d.filedDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-sm font-semibold tabular text-[#111111]">
                    ₹ {d.amount.toLocaleString("en-IN")}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      d.status === "refunded" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#fffbeb] text-[#d97706]"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Claim Form */}
        <div className="card p-6 bg-white">
          <h3 className="font-serif text-xl text-[#111111] mb-4">Open New Protection Claim</h3>
          {claimSubmitted ? (
            <div className="p-4 rounded-xl bg-[#f0fdf4] text-xs text-[#16a34a] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Protection claim logged under review ticket #REF-2026-904.
            </div>
          ) : (
            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Transaction Reference</label>
                <input
                  type="text"
                  required
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Dispute Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input text-xs"
                >
                  <option value="Damaged product on delivery">Damaged product on delivery</option>
                  <option value="Merchandise never delivered">Merchandise never delivered</option>
                  <option value="Unauthorized credit card debit">Unauthorized credit card debit</option>
                  <option value="Incorrect charge amount">Incorrect charge amount</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary text-xs py-2.5 px-5">
                Submit Claim for Mediation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
