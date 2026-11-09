"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Send, QrCode, Bot, Wallet, ArrowLeftRight } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Transfer", href: "/pay", icon: Send },
    { label: "QR Pay", href: "/qr", icon: QrCode, highlight: true },
    { label: "Eter AI", href: "/ai", icon: Bot },
    { label: "Wallet", href: "/wallet", icon: Wallet },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[rgba(17,17,17,0.08)] px-3 py-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(17,17,17,0.04)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const Icon = item.icon;

        if (item.highlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-5 group"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform active:scale-95 ${
                  isActive ? "bg-[#0a352c] ring-2 ring-[#0f4d40]/40" : "bg-[#0f4d40]"
                }`}
              >
                <Icon size={22} />
              </div>
              <span
                className={`text-[10px] font-medium mt-1 ${
                  isActive ? "text-[#0f4d40] font-semibold" : "text-[#666666]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors active:scale-95 ${
              isActive ? "text-[#0f4d40]" : "text-[#777777] hover:text-[#111111]"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0f4d40]" />
              )}
            </div>
            <span
              className={`text-[10px] tracking-tight mt-1 ${
                isActive ? "font-semibold text-[#0f4d40]" : "font-normal"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
