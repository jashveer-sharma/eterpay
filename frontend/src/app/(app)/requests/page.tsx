"use client";
import { useState } from "react";
import Link from "next/link";
import { Download, Plus, CheckCircle2, Copy, Check, Clock, ArrowRight } from "lucide-react";

export default function RequestsPage() {
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({ payer: "client@venture.co", amount: "15000", currency: "INR", note: "Design Sprint Retainer" });

  const demoRequests = [
    { id: "req_01", payer: "Rahul Verma", amount: 4500, currency: "INR", note: "Weekend getaway split", status: "pending", date: "2026-11-04" },
    { id: "req_02", payer: "TechCorp Solutions", amount: 85000, currency: "INR", note: "Fullstack engineering sprint", status: "paid", date: "2026-10-28" },
    { id: "req_03", payer: "John Smith", amount: 850, currency: "USD", note: "Consulting advisory hours", status: "paid", date: "2026-10-25" },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreated(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://eterpay.demo/pay/req_share_9942");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Inbound Liquidity</div>
            <h1 className="font-serif text-3xl text-[#111111]">Payment Requests</h1>
          </div>
          <span className="demo-badge">Sharable Links</span>
        </div>

        {/* Create Request */}
        <div className="card p-8 bg-white shadow-sm">
          <h2 className="font-serif text-2xl text-[#111111] mb-6">Create New Payment Request</h2>
          {created ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
              <h3 className="font-serif text-xl text-[#111111]">Request Dispatched!</h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto">
                Sharable link generated for {form.currency} {Number(form.amount).toLocaleString("en-IN")}.
              </p>
              <div className="p-3 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)] flex items-center justify-between max-w-md mx-auto">
                <span className="font-mono text-xs text-[#555555]">https://eterpay.demo/pay/req_share_9942</span>
                <button onClick={handleCopyLink} className="text-xs text-[#0f4d40] font-semibold flex items-center gap-1">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <button onClick={() => setCreated(false)} className="btn btn-secondary text-xs px-5 py-2">
                Create Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Payer Email / Name</label>
                  <input
                    type="text"
                    required
                    value={form.payer}
                    onChange={(e) => setForm({ ...form, payer: e.target.value })}
                    className="input text-xs"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Amount</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="input text-xs font-semibold tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Currency</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="input text-xs"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Note / Description</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="input text-xs"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full py-3 text-xs font-medium">
                Generate Payment Request <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
              </button>
            </form>
          )}
        </div>

        {/* Existing Requests */}
        <div className="card p-6 bg-white">
          <h3 className="font-serif text-xl text-[#111111] mb-4">Past Payment Requests</h3>
          <div className="space-y-3">
            {demoRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
                <div>
                  <div className="text-sm font-semibold text-[#111111]">{r.payer}</div>
                  <div className="text-xs text-[#888888]">{r.note} • {r.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-sm font-semibold text-[#111111] tabular">
                    {r.currency === "INR" ? "₹" : "$"} {r.amount.toLocaleString("en-IN")} {r.currency}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      r.status === "paid" ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#fffbeb] text-[#d97706]"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
