"use client";
import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Pause, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { DEMO_SUBSCRIPTIONS } from "@/lib/demo-data";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState(DEMO_SUBSCRIPTIONS);

  const toggleStatus = (id: string) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s))
    );
  };

  const totalMonthlyINR = subs
    .filter((s) => s.status === "active" && s.currency === "INR")
    .reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Recurring Outflows</div>
            <h1 className="font-serif text-3xl text-[#111111]">Subscriptions & Memberships</h1>
          </div>
          <span className="demo-badge">Auto-Debit Safeguards</span>
        </div>

        {/* Overview Banner */}
        <div className="card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase text-[#888888]">Active Recurring Commitment</span>
            <div className="font-serif text-3xl text-[#0f4d40] font-semibold tabular mt-0.5">
              ₹ {totalMonthlyINR.toLocaleString("en-IN")} <span className="text-xs font-sans text-[#555555]">/ month</span>
            </div>
          </div>
          <div className="text-xs text-[#666666] max-w-sm">
            EterPay AI monitors price changes, renewals, and dormant subscriptions to eliminate accidental churn.
          </div>
        </div>

        {/* List */}
        <div className="card p-6 bg-white shadow-xs">
          <h2 className="font-serif text-xl text-[#111111] mb-4">Tracked Subscriptions</h2>
          <div className="space-y-3">
            {subs.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#111111]">{s.name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        s.status === "active"
                          ? "bg-[#f0fdf4] text-[#16a34a]"
                          : "bg-[#fffbeb] text-[#d97706]"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#888888] mt-0.5">
                    Next billing: {s.nextBilling} • {s.cycle}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-serif text-base font-semibold text-[#111111] tabular">
                    {s.currency === "INR" ? "₹" : "$"} {s.amount.toLocaleString("en-IN")} / {s.cycle}
                  </div>
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className={`btn text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                      s.status === "active" ? "btn-secondary text-[#dc2626]" : "btn-primary"
                    }`}
                  >
                    {s.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {s.status === "active" ? "Pause" : "Resume"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
