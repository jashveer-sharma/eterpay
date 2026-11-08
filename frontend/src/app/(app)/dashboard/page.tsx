"use client";
import Link from "next/link";
import {
  Send, Download, QrCode, ArrowLeftRight, TrendingUp, TrendingDown,
  ShoppingBag, Repeat, Plane, CreditCard, Zap, Bell, Sparkles,
  ArrowUpRight, ArrowDownLeft, ChevronRight, Wallet,
} from "lucide-react";
import {
  DEMO_USER, DEMO_BALANCES, DEMO_TRANSACTIONS, DEMO_PORTFOLIO,
  DEMO_NOTIFICATIONS, DEMO_ANALYTICS,
} from "@/lib/demo-data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  transfer: <ArrowLeftRight size={14} />,
  subscription: <Repeat size={14} />,
  commerce: <ShoppingBag size={14} />,
  refund: <Download size={14} />,
  travel: <Plane size={14} />,
  invest: <TrendingUp size={14} />,
};

const QUICK_ACTIONS = [
  { label: "Send", sub: "Transfer & Pay", icon: Send, href: "/pay" },
  { label: "Receive", sub: "Request Money", icon: Download, href: "/requests" },
  { label: "QR Pay", sub: "Scan & Settle", icon: QrCode, href: "/qr" },
  { label: "Exchange", sub: "Instant FX Swap", icon: ArrowLeftRight, href: "/currency" },
];

function fmt(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getHour() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default function DashboardPage() {
  const recentTxns = DEMO_TRANSACTIONS.slice(0, 6);
  const unreadNotifs = DEMO_NOTIFICATIONS.filter((n) => !n.read).slice(0, 2);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#fbf9f5]">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-[#fbf9f5]/95 backdrop-blur border-b border-[rgba(17,17,17,0.08)] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl font-semibold text-[#111111] truncate">
            Good {getHour()}, {DEMO_USER.firstName} 👋
          </h1>
          <p className="text-[11px] sm:text-xs text-[#888] truncate">{today}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="demo-badge text-[10px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
            Sandbox
          </span>
          <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[rgba(17,17,17,0.05)] transition-colors">
            <Bell size={18} className="text-[#555]" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#dc2626]" />
            )}
          </Link>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Primary Balance Card */}
        <div className="card-emerald p-6 text-[#fbf9f5] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)" }} />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#fbf9f5]/70 mb-1">Primary Balance</p>
            <div className="flex items-end gap-4 mb-3">
              <span className="text-4xl sm:text-5xl font-serif font-light tabular text-white">
                ₹{fmt(DEMO_BALANCES.primary.amount)}
              </span>
            </div>
            <p className="text-sm text-[#fbf9f5]/80 mb-4">
              Available: <span className="text-white font-medium tabular">₹{(180000).toLocaleString("en-IN")}</span>
              &nbsp;·&nbsp;In transit: <span className="text-white/80 tabular">₹{(4250.75).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_BALANCES.wallet.slice(0, 3).map((w) => (
                <span key={w.currency} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/90">
                  <span>{w.flag}</span>
                  <span>{w.currency}</span>
                  <span className="tabular">{w.symbol}{w.amount.toLocaleString()}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className="card p-3.5 sm:p-4 flex items-center sm:flex-col sm:items-center justify-start sm:justify-center gap-3 hover:border-[#0f4d40]/40 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(15,77,64,0.08)] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0f4d40] group-hover:text-white transition-all text-[#0f4d40]">
                  <Icon size={18} />
                </div>
                <div className="text-left sm:text-center min-w-0">
                  <span className="text-xs font-semibold text-[#111111] block group-hover:text-[#0f4d40] transition-colors">{a.label}</span>
                  <span className="text-[10px] text-[#666666] block truncate">{a.sub}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Middle Row: Transactions + Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(17,17,17,0.07)]">
              <h2 className="font-semibold text-[#111]">Recent Transactions</h2>
              <Link href="/transactions" className="text-xs text-[#0f4d40] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(17,17,17,0.05)]">
              {recentTxns.map((txn) => (
                <div key={txn.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[rgba(15,77,64,0.03)] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    txn.type === "credit" ? "bg-green-50 text-[#0f4d40]" : "bg-[#fbf9f5] text-[#555]"
                  }`}>
                    {txn.type === "credit"
                      ? <ArrowDownLeft size={14} />
                      : (CATEGORY_ICONS[txn.category] ?? <ArrowUpRight size={14} />)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111] truncate">{txn.title}</p>
                    <p className="text-xs text-[#888]">{new Date(txn.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {txn.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold tabular ${txn.type === "credit" ? "text-[#0f4d40]" : "text-[#111]"}`}>
                      {txn.type === "credit" ? "+" : "−"}{txn.symbol}{txn.amount.toLocaleString("en-IN")}
                    </p>
                    <span className={`text-[0.625rem] font-medium px-1.5 py-0.5 rounded-full ${
                      txn.status === "completed" ? "bg-green-50 text-green-700" :
                      txn.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Overview */}
          <div className="card">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(17,17,17,0.07)]">
              <h2 className="font-semibold text-[#111]">Wallets</h2>
              <Link href="/wallet" className="text-xs text-[#0f4d40] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Manage <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(17,17,17,0.05)]">
              {DEMO_BALANCES.wallet.map((w) => (
                <div key={w.currency} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{w.flag}</span>
                    <div>
                      <p className="text-sm font-medium text-[#111]">{w.currency}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold tabular text-[#111]">{w.symbol}{w.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Portfolio + AI Insight + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Snapshot */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#111]">Portfolio</h2>
              <Link href="/invest" className="text-xs text-[#0f4d40] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View <ChevronRight size={12} />
              </Link>
            </div>
            <p className="text-3xl font-serif font-light tabular text-[#111] mb-1">
              ₹{DEMO_PORTFOLIO.totalValue.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center gap-1.5 mb-4">
              <TrendingUp size={13} className="text-[#0f4d40]" />
              <span className="text-xs font-semibold text-[#0f4d40]">+{DEMO_PORTFOLIO.change24h}%</span>
              <span className="text-xs text-[#888]">today</span>
            </div>
            <div className="space-y-2">
              {DEMO_PORTFOLIO.assets.slice(0, 3).map((a) => (
                <div key={a.symbol} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-[#555] font-medium">{a.name}</span>
                      <span className="tabular text-[#111] font-medium">{a.allocation}%</span>
                    </div>
                    <div className="h-1 bg-[#f4f0e8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0f4d40] rounded-full" style={{ width: `${a.allocation}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <span className="inline-block mt-3 text-[0.625rem] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Simulated Portfolio — Educational Only — No Capital at Risk</span>
          </div>

          {/* AI Insight */}
          <div className="card p-5 border-[rgba(15,77,64,0.2)]" style={{ backgroundColor: "rgba(15,77,64,0.03)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#0f4d40] flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0f4d40]">AI Insight</p>
                <p className="text-[0.625rem] text-[#888]">Your insight for today</p>
              </div>
            </div>
            <p className="text-sm text-[#333] leading-relaxed mb-3">
              Your subscriptions total <strong>₹5,297/month</strong>. Consider auditing Figma Pro (paused) — you could save <strong>₹1,200</strong> by cancelling it.
            </p>
            <p className="text-sm text-[#333] leading-relaxed">
              You&apos;ve spent <strong>22% more</strong> on travel this quarter vs last. Your Singapore trip is your biggest single expense of the month.
            </p>
            <Link href="/ai" className="mt-4 inline-flex items-center gap-1 text-xs text-[#0f4d40] font-medium hover:gap-2 transition-all">
              Chat with EterPay AI <ChevronRight size={12} />
            </Link>
          </div>

          {/* Notifications Preview */}
          <div className="card">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(17,17,17,0.07)]">
              <h2 className="font-semibold text-[#111]">Notifications</h2>
              <Link href="/notifications" className="text-xs text-[#0f4d40] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(17,17,17,0.05)]">
              {DEMO_NOTIFICATIONS.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${!n.read ? "bg-[rgba(15,77,64,0.02)]" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? "bg-[#0f4d40]" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111] truncate">{n.title}</p>
                    <p className="text-xs text-[#888] leading-relaxed mt-0.5">{n.body}</p>
                    <p className="text-[0.625rem] text-[#aaa] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* This month analytics strip */}
        <div className="card p-5">
          <div className="grid grid-cols-3 gap-6 divide-x divide-[rgba(17,17,17,0.07)]">
            <div>
              <p className="label-eyebrow mb-1">Spent this month</p>
              <p className="text-2xl font-semibold tabular text-[#dc2626]">₹{DEMO_ANALYTICS.totalSpentThisMonth.toLocaleString("en-IN")}</p>
            </div>
            <div className="pl-6">
              <p className="label-eyebrow mb-1">Received this month</p>
              <p className="text-2xl font-semibold tabular text-[#0f4d40]">₹{DEMO_ANALYTICS.totalReceivedThisMonth.toLocaleString("en-IN")}</p>
            </div>
            <div className="pl-6">
              <p className="label-eyebrow mb-1">Net cash flow</p>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#0f4d40]" />
                <p className="text-2xl font-semibold tabular text-[#0f4d40]">+₹{DEMO_ANALYTICS.netCashFlow.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
