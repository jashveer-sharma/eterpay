import Link from "next/link";
import { Globe, Shield, Zap, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  Personal: [
    { label: "Send Money", href: "/personal#send" },
    { label: "Receive Money", href: "/personal#receive" },
    { label: "Wallet", href: "/personal#wallet" },
    { label: "Currency Exchange", href: "/personal#fx" },
    { label: "EterPay Anywhere", href: "/anywhere" },
    { label: "AI Assistant", href: "/personal#ai" },
  ],
  Business: [
    { label: "Accept Payments", href: "/business#accept" },
    { label: "Invoicing", href: "/business#invoices" },
    { label: "Merchant Dashboard", href: "/business#merchant" },
    { label: "Payment Links", href: "/business#links" },
    { label: "Subscriptions", href: "/business#subs" },
    { label: "Refunds & Protection", href: "/business#refunds" },
  ],
  Products: [
    { label: "EterPay Pay", href: "/products#pay" },
    { label: "EterPay Invest", href: "/products#invest" },
    { label: "EterPay Commerce", href: "/products#commerce" },
    { label: "EterPay Travel", href: "/products#travel" },
    { label: "Security", href: "/security" },
    { label: "Developer APIs", href: "/developer" },
  ],
  Company: [
    { label: "About EterPay", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Help Centre", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Resources", href: "/developer#resources" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-[#111111] text-[#fbf9f5]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.2"/>
                <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.5"/>
                <circle cx="24" cy="24" r="5" fill="#fbf9f5"/>
                <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <circle cx="38" cy="24" r="2.5" fill="#fbf9f5"/>
              </svg>
              <span className="font-serif text-xl text-[#fbf9f5]">EterPay</span>
            </Link>
            <p className="text-sm text-[rgba(251,249,245,0.5)] leading-relaxed mb-6">
              Your Money. Everywhere. Intelligently Connected.
            </p>
            <div className="flex flex-col gap-2 text-xs text-[rgba(251,249,245,0.4)]">
              <div className="flex items-center gap-2"><Shield size={12} /> Bank-grade security</div>
              <div className="flex items-center gap-2"><Globe size={12} /> 200+ countries</div>
              <div className="flex items-center gap-2"><Zap size={12} /> AI-powered insights</div>
            </div>
          </div>

          {/* Nav cols */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[rgba(251,249,245,0.4)] mb-5">{section}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[rgba(251,249,245,0.65)] hover:text-[#fbf9f5] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Demo notice */}
      <div className="border-t border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[rgba(251,249,245,0.35)]">
            <span className="demo-badge" style={{ color: "#d97706", backgroundColor: "rgba(217,119,6,0.12)", borderColor: "rgba(217,119,6,0.2)" }}>DEMO</span>
            EterPay operates in interactive simulation mode with sandbox rails. No live sovereign currency is exposed to loss.
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[rgba(251,249,245,0.3)]">© 2026 EterPay. Autonomous Financial Infrastructure & Universal Payment Rails.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-[rgba(251,249,245,0.3)] hover:text-[rgba(251,249,245,0.6)] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-[rgba(251,249,245,0.3)] hover:text-[rgba(251,249,245,0.6)] transition-colors">Terms</Link>
            <Link href="/security" className="text-xs text-[rgba(251,249,245,0.3)] hover:text-[rgba(251,249,245,0.6)] transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
