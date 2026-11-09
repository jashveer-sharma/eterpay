"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/context/CurrencyContext";

interface CurrencySwitcherProps {
  compact?: boolean;
}

export default function CurrencySwitcher({ compact = false }: CurrencySwitcherProps) {
  const { currentCurrency, currencyConfig, setCurrency, rawRate, ratesDate } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-[rgba(17,17,17,0.12)] text-xs font-semibold text-[#111111] shadow-xs transition-all active:scale-95"
        title="Change Global Currency"
        aria-label="Change Global Display Currency"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{currencyConfig.flag}</span>
        <span>{currencyConfig.code}</span>
        <span className="font-mono text-[11px] text-[#0f4d40]">({currencyConfig.symbol})</span>
        <ChevronDown size={12} className={`text-[#888888] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[rgba(17,17,17,0.12)] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 border-b border-[rgba(17,17,17,0.06)] mb-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#888888] flex items-center justify-between">
              <span>Display Currency</span>
              <span className="text-[#16a34a] font-mono lowercase">live ecb</span>
            </div>
            <p className="text-[10px] text-[#555555] mt-0.5">
              1-click currency recalculation
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5 no-scrollbar">
            {SUPPORTED_CURRENCIES.map((curr) => {
              const isSelected = curr.code === currentCurrency;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-[rgba(15,77,64,0.08)] text-[#0f4d40] font-semibold"
                      : "text-[#333333] hover:bg-[#fbf9f5] font-normal"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{curr.flag}</span>
                    <div className="text-left">
                      <div className="leading-tight">{curr.code} <span className="text-[#888888]">· {curr.symbol}</span></div>
                      <div className="text-[10px] text-[#888888]">{curr.label}</div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-[#0f4d40] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
