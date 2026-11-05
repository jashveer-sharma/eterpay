"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">("all");
  const [filterCat, setFilterCat] = useState("all");

  const filtered = DEMO_TRANSACTIONS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCat = filterCat === "all" || t.category === filterCat;
    return matchesSearch && matchesType && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Audit Ledger</div>
            <h1 className="font-serif text-3xl text-[#111111]">Transaction History</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="demo-badge">Immutable Records</span>
            <button
              onClick={() => alert("Audit report export simulation downloaded (CSV / PDF).")}
              className="btn btn-secondary text-xs px-4 py-2.5 rounded-full"
            >
              <Download className="w-3.5 h-3.5 mr-1 inline" /> Export Ledger
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 bg-white flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, recipient, note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Type buttons */}
            <div className="inline-flex rounded-lg bg-[#fbf9f5] p-1 border border-[rgba(17,17,17,0.06)] text-xs">
              {(["all", "credit", "debit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                    filterType === t ? "bg-white text-[#111111] shadow-xs" : "text-[#666666]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Category select */}
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="input text-xs py-1.5 px-3 w-auto font-medium"
            >
              <option value="all">All Categories</option>
              <option value="transfer">Transfers</option>
              <option value="subscription">Subscriptions</option>
              <option value="commerce">Commerce</option>
              <option value="travel">Travel</option>
              <option value="invest">Invest</option>
              <option value="refund">Refunds</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f5] text-[#888888] uppercase font-semibold border-b border-[rgba(17,17,17,0.06)]">
                <tr>
                  <th className="p-4">Transaction / Counterparty</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,17,17,0.06)]">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#fbf9f5]/60 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#111111]">{t.title}</div>
                      <div className="text-[11px] text-[#888888]">{t.counterparty} • {t.note}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-[rgba(17,17,17,0.05)] text-[#555555] font-medium text-[10px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#888888]">{t.ref}</td>
                    <td className="p-4 text-[#555555]">{t.date}</td>
                    <td className="p-4">
                      <span
                        className={`capitalize font-semibold text-[10px] px-2 py-0.5 rounded-full ${
                          t.status === "completed"
                            ? "bg-[#f0fdf4] text-[#16a34a]"
                            : t.status === "pending"
                            ? "bg-[#fffbeb] text-[#d97706]"
                            : "bg-[#fef2f2] text-[#dc2626]"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`font-serif text-sm font-semibold tabular ${
                          t.type === "credit" ? "text-[#16a34a]" : "text-[#111111]"
                        }`}
                      >
                        {t.type === "credit" ? "+" : "-"} {t.symbol} {t.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-[#888888]">
              No transactions match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
