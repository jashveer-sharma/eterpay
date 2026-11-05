"use client";
import Link from "next/link";
import { Building2, Receipt, RefreshCw, BarChart2, ShieldAlert, ArrowUpRight, Plus, ExternalLink } from "lucide-react";
import { DEMO_INVOICES, DEMO_MERCHANTS, DEMO_SUBSCRIPTIONS } from "@/lib/demo-data";

export default function BusinessHubPage() {
  const totalBilled = DEMO_INVOICES.reduce((acc, inv) => acc + (inv.currency === "INR" ? inv.amount : 0), 0);

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Commercial Hub</div>
            <h1 className="font-serif text-3xl text-[#111111]">Merchant & Business Suite</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="demo-badge">Multi-Merchant Sandbox</span>
            <Link href="/invoices" className="btn btn-primary text-xs px-4 py-2.5 rounded-full">
              <Plus className="w-3.5 h-3.5 mr-1 inline" /> Create New Invoice
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Gross Billed (INR)</span>
            <div className="font-serif text-3xl font-medium text-[#111111] mt-1 tabular">
              ₹ {totalBilled.toLocaleString("en-IN")}
            </div>
            <span className="text-xs text-[#16a34a] mt-1 block">+18.4% vs last cycle</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Pending Collection</span>
            <div className="font-serif text-3xl font-medium text-[#d97706] mt-1 tabular">
              ₹ 42,000.00
            </div>
            <span className="text-xs text-[#888888] mt-1 block">2 open client invoices</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Recurring MRR</span>
            <div className="font-serif text-3xl font-medium text-[#0f4d40] mt-1 tabular">
              ₹ 5,117.00
            </div>
            <span className="text-xs text-[#16a34a] mt-1 block">5 active customer tiers</span>
          </div>

          <div className="card p-6 bg-white">
            <span className="text-xs font-semibold uppercase text-[#888888]">Clearing Health</span>
            <div className="font-serif text-3xl font-medium text-[#16a34a] mt-1 tabular">
              99.9%
            </div>
            <span className="text-xs text-[#888888] mt-1 block">PayPal Sandbox v2 live</span>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="grid sm:grid-cols-3 gap-6">
          <Link href="/invoices" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <Receipt className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Invoice Generator</h3>
              <p className="text-xs text-[#666666]">Dispatch automated PDF invoices with dynamic payment links.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              Manage Invoices <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>

          <Link href="/subscriptions" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <RefreshCw className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Subscriptions Engine</h3>
              <p className="text-xs text-[#666666]">Automate recurring merchant charges and member plans.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              Inspect Plans <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>

          <Link href="/analytics" className="card p-6 bg-white hover:border-[#0f4d40]/40 transition-all flex flex-col justify-between">
            <div>
              <BarChart2 className="w-6 h-6 text-[#0f4d40] mb-3" />
              <h3 className="font-semibold text-base text-[#111111] mb-1">Revenue Telemetry</h3>
              <p className="text-xs text-[#666666]">Real-time AG Grid financial analytics and cashflow forecasts.</p>
            </div>
            <span className="text-xs text-[#0f4d40] font-semibold mt-4 flex items-center">
              View Analytics <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </Link>
        </div>

        {/* Merchant Portfolios Table */}
        <div className="card p-6 bg-white shadow-xs">
          <h3 className="font-serif text-xl text-[#111111] mb-4">Enterprise Merchant Accounts</h3>
          <div className="space-y-3">
            {DEMO_MERCHANTS.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)]">
                <div>
                  <div className="text-sm font-semibold text-[#111111]">{m.name}</div>
                  <div className="text-xs text-[#888888]">{m.category} • {m.transactions} cleared operations</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-base font-semibold text-[#0f4d40] tabular">
                    ₹ {m.revenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#16a34a]">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
