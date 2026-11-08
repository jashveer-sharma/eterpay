"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Send, Wallet, Globe, ArrowLeftRight, CreditCard, List,
  FileText, Link2, QrCode, Briefcase, Receipt, RefreshCw, Shield,
  TrendingUp, ShoppingBag, Plane, Bot, BarChart2, Bell, User,
  Settings, LogOut, ChevronRight, Menu, X, Zap, Building2
} from "lucide-react";
import { DEMO_USER, isAuthenticated } from "@/lib/demo-data";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Assistant", href: "/ai", icon: Bot },
      { label: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Payments",
    items: [
      { label: "Pay & Transfer", href: "/pay", icon: Send },
      { label: "Wallet", href: "/wallet", icon: Wallet },
      { label: "Anywhere Hub", href: "/anywhere-hub", icon: Globe },
      { label: "Global Payments", href: "/global", icon: ArrowLeftRight },
      { label: "Payment Methods", href: "/wallet#methods", icon: CreditCard },
      { label: "Transactions", href: "/transactions", icon: List },
      { label: "Requests", href: "/requests", icon: FileText },
      { label: "Payment Links", href: "/links", icon: Link2 },
      { label: "QR Payments", href: "/qr", icon: QrCode },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Merchant Hub", href: "/merchant", icon: Briefcase },
      { label: "Merchant Tools", href: "/merchant#tools", icon: Building2 },
      { label: "Invoices", href: "/invoices", icon: Receipt },
      { label: "Subscriptions", href: "/subscriptions", icon: RefreshCw },
      { label: "Refunds", href: "/refunds", icon: Shield },
    ],
  },
  {
    label: "More",
    items: [
      { label: "Currency & FX", href: "/currency", icon: ArrowLeftRight },
      { label: "Invest", href: "/invest", icon: TrendingUp },
      { label: "Commerce", href: "/commerce", icon: ShoppingBag },
      { label: "Travel", href: "/travel", icon: Plane },
      { label: "Analytics", href: "/analytics", icon: BarChart2 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

function NavItem({ item, collapsed }: { item: { label: string; href: string; icon: React.ElementType }; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === `/${item.href.replace(/^\//, "").split("#")[0]}` || pathname.startsWith(item.href.split("#")[0]);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`sidebar-link ${isActive ? "active" : ""}`}
    >
      <Icon size={16} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && isActive && <ChevronRight size={12} className="ml-auto opacity-50" />}
    </Link>
  );
}

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eterpay_session");
      localStorage.removeItem("eterpay_jwt");
      localStorage.removeItem("eterpay_user");
      sessionStorage.removeItem("eterpay_grid_filter");
    }
    router.replace("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.08)]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7 flex-shrink-0">
              <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.2"/>
              <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <circle cx="24" cy="24" r="5" fill="#fbf9f5"/>
              <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="38" cy="24" r="2.5" fill="#fbf9f5"/>
            </svg>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg text-[#fbf9f5]">EterPay</span>
              <span className="text-[10px] font-mono text-[#0f4d40] bg-[#0f4d40]/20 px-1.5 py-0.5 rounded border border-[#0f4d40]/40">v1.0</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <svg viewBox="0 0 48 48" fill="none" className="w-7 h-7">
              <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.2"/>
              <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <circle cx="24" cy="24" r="5" fill="#fbf9f5"/>
              <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="38" cy="24" r="2.5" fill="#fbf9f5"/>
            </svg>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-[rgba(251,249,245,0.5)]"
        >
          {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[0.625rem] font-semibold uppercase tracking-widest text-[rgba(251,249,245,0.3)]">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3 p-2 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-[#0f4d40] flex items-center justify-center flex-shrink-0 text-xs font-semibold text-[#fbf9f5]">
            {DEMO_USER.firstName[0]}{DEMO_USER.lastName[0]}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#fbf9f5] truncate">{DEMO_USER.name}</p>
              <p className="text-[0.625rem] text-[rgba(251,249,245,0.4)] truncate">{DEMO_USER.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-[rgba(251,249,245,0.5)] hover:text-[#dc2626]"
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 bg-[#111111] transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
        style={{ minHeight: "100vh" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Header Bar & Sidebar Drawer */}
      <div className="lg:hidden">
        <header className="fixed top-0 left-0 right-0 h-14 bg-[#111111] z-40 px-4 flex items-center justify-between shadow-sm">
          <button
            className="p-2 text-[#fbf9f5] rounded-xl hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
              <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.2"/>
              <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <circle cx="24" cy="24" r="5" fill="#fbf9f5"/>
              <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="38" cy="24" r="2.5" fill="#fbf9f5"/>
            </svg>
            <span className="font-serif text-base text-[#fbf9f5]">EterPay</span>
          </Link>

          <div className="w-8" />
        </header>

        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 pt-14" onClick={() => setMobileOpen(false)} />
            <aside className="fixed left-0 top-14 bottom-0 w-64 bg-[#111111] z-50 overflow-y-auto shadow-2xl">
              <SidebarContent />
            </aside>
          </>
        )}
      </div>
    </>
  );
}
