"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";

const NAV_PERSONAL = [
  { label: "Overview", href: "/personal", desc: "Your complete financial hub" },
  { label: "Send & Receive", href: "/personal#send", desc: "Instant domestic and global transfers" },
  { label: "EterPay Anywhere", href: "/anywhere", desc: "Pay beyond borders intelligently" },
  { label: "Wallet", href: "/personal#wallet", desc: "Multi-currency digital wallet" },
  { label: "Currency Exchange", href: "/personal#fx", desc: "Live ECB rates, zero guesswork" },
  { label: "AI Assistant", href: "/personal#ai", desc: "Your intelligent financial advisor" },
];

const NAV_BUSINESS = [
  { label: "Overview", href: "/business", desc: "Tools for growing businesses" },
  { label: "Accept Payments", href: "/business#accept", desc: "Online, in-store and QR payments" },
  { label: "Invoicing", href: "/business#invoices", desc: "Create and send professional invoices" },
  { label: "Merchant Dashboard", href: "/business#merchant", desc: "Real-time sales analytics" },
  { label: "Subscriptions", href: "/business#subs", desc: "Recurring billing management" },
  { label: "Payment Links", href: "/business#links", desc: "No-code payment collection" },
];

const NAV_PRODUCTS = [
  { label: "EterPay Pay", href: "/products#pay", desc: "Complete payment ecosystem" },
  { label: "EterPay Anywhere", href: "/anywhere", desc: "Global payment interoperability" },
  { label: "Invest", href: "/products#invest", desc: "Portfolio and wealth tools" },
  { label: "Commerce", href: "/products#commerce", desc: "Shop and discover products" },
  { label: "Travel", href: "/products#travel", desc: "Pay smarter on the move" },
  { label: "Security & Trust", href: "/security", desc: "Bank-grade protection" },
];

function DropdownMenu({ items }: { items: typeof NAV_PERSONAL }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[rgba(17,17,17,0.09)] rounded-2xl shadow-[0_20px_60px_rgba(17,17,17,0.12),0_4px_16px_rgba(17,17,17,0.06)] p-3 w-80 z-50">
      <div className="grid grid-cols-1 gap-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col gap-0.5 p-3 rounded-xl hover:bg-[#f4f0e8] transition-colors group"
          >
            <span className="text-sm font-medium text-[#111111] group-hover:text-[#0f4d40] transition-colors">{item.label}</span>
            <span className="text-xs text-[#888888]">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[rgba(17,17,17,0.08)] shadow-[0_2px_16px_rgba(17,17,17,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
            <circle cx="24" cy="24" r="22" stroke="#0f4d40" strokeWidth="1.5" fill="none" opacity="0.2"/>
            <circle cx="24" cy="24" r="14" stroke="#0f4d40" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <circle cx="24" cy="24" r="5" fill="#0f4d40"/>
            <path d="M24 10 A14 14 0 0 1 38 24" stroke="#0f4d40" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M24 38 A14 14 0 0 1 10 24" stroke="#0f4d40" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="38" cy="24" r="2.5" fill="#0f4d40"/>
          </svg>
          <span className="font-serif text-xl font-normal tracking-tight text-[#111111]">EterPay</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "Personal", items: NAV_PERSONAL, key: "personal" },
            { label: "Business", items: NAV_BUSINESS, key: "business" },
            { label: "Products", items: NAV_PRODUCTS, key: "products" },
          ].map((group) => (
            <div
              key={group.key}
              className="relative"
              onMouseEnter={() => setOpenDropdown(group.key)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-[#555555] hover:text-[#111111] hover:bg-[rgba(17,17,17,0.04)] transition-all">
                {group.label}
                <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === group.key ? "rotate-180" : ""}`} />
              </button>
              {openDropdown === group.key && <DropdownMenu items={group.items} />}
            </div>
          ))}
          <Link href="/anywhere" className="px-3 py-2 rounded-full text-sm font-medium text-[#555555] hover:text-[#111111] hover:bg-[rgba(17,17,17,0.04)] transition-all flex items-center gap-1">
            <Globe size={14} /> Anywhere
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-[#555555] hover:text-[#111111] transition-colors px-3 py-2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn btn-primary text-sm px-5 py-2.5"
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[rgba(17,17,17,0.06)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[rgba(17,17,17,0.08)] px-6 py-4">
          <div className="flex flex-col gap-1 mb-6">
            {[...NAV_PERSONAL, ...NAV_BUSINESS, ...NAV_PRODUCTS].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f4f0e8] transition-colors"
              >
                <div>
                  <div className="text-sm font-medium text-[#111111]">{item.label}</div>
                  <div className="text-xs text-[#888888]">{item.desc}</div>
                </div>
                <ArrowRight size={14} className="text-[#888888]" />
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-[rgba(17,17,17,0.08)]">
            <Link href="/login" className="btn btn-secondary text-center">Log in</Link>
            <Link href="/signup" className="btn btn-primary text-center">Get started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
