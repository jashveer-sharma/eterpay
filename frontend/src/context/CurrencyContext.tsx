"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEMO_CURRENCIES_FX } from "@/lib/demo-data";

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee", flag: "🇮🇳" },
  { code: "USD", symbol: "$", label: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", label: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", label: "British Pound", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", flag: "🇯🇵" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar", flag: "🇸🇬" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham", flag: "🇦🇪" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar", flag: "🇦🇺" },
];

// Fallback rates from INR (1 INR = X currency) based on live ECB rates
const DEFAULT_INR_RATES: Record<string, number> = {
  INR: 1.0,
  USD: 0.01065,
  EUR: 0.00954,
  GBP: 0.00795,
  JPY: 1.6858,
  SGD: 0.01365,
  AED: 0.03911,
  CAD: 0.01498,
  AUD: 0.01550,
};

interface CurrencyContextType {
  currentCurrency: string;
  currencyConfig: CurrencyConfig;
  rates: Record<string, number>;
  ratesDate: string;
  setCurrency: (code: string) => void;
  convert: (amountInInr: number) => number;
  formatAmount: (amountInInr: number, options?: { hideSymbol?: boolean; decimals?: number }) => string;
  rawRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrencyState] = useState<string>("INR");
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_INR_RATES);
  const [ratesDate, setRatesDate] = useState<string>("2026-11-06 (ECB Live)");

  // Load saved currency preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eterpay_global_currency");
      if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        setCurrentCurrencyState(saved);
      }
    }
  }, []);

  // Fetch live rates from backend or fallback to Frankfurter
  const fetchLiveRates = useCallback(async () => {
    try {
      const res = await fetch("/api/currency/rates?base=INR");
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          const live: Record<string, number> = { ...DEFAULT_INR_RATES, ...data.rates, INR: 1.0 };
          setRates(live);
          if (data.date) setRatesDate(data.date);
        }
      }
    } catch {
      // Backend offline: use defaults
    }
  }, []);

  useEffect(() => {
    fetchLiveRates();
  }, [fetchLiveRates]);

  const setCurrency = (code: string) => {
    const valid = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (!valid) return;
    setCurrentCurrencyState(code);
    if (typeof window !== "undefined") {
      localStorage.setItem("eterpay_global_currency", code);
    }
  };

  const currencyConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  const rawRate = rates[currentCurrency] ?? DEFAULT_INR_RATES[currentCurrency] ?? 1.0;

  const convert = (amountInInr: number): number => {
    if (currentCurrency === "INR") return amountInInr;
    return Number((amountInInr * rawRate).toFixed(2));
  };

  const formatAmount = (
    amountInInr: number,
    options?: { hideSymbol?: boolean; decimals?: number }
  ): string => {
    const converted = convert(amountInInr);
    const decimals =
      options?.decimals !== undefined
        ? options.decimals
        : currentCurrency === "JPY"
        ? 0
        : 2;

    const formatted = converted.toLocaleString(
      currentCurrency === "INR" ? "en-IN" : "en-US",
      {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }
    );

    if (options?.hideSymbol) return formatted;
    return `${currencyConfig.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        currencyConfig,
        rates,
        ratesDate,
        setCurrency,
        convert,
        formatAmount,
        rawRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Graceful fallback if rendered outside provider
    return {
      currentCurrency: "INR",
      currencyConfig: SUPPORTED_CURRENCIES[0],
      rates: DEFAULT_INR_RATES,
      ratesDate: "2026-11-06",
      setCurrency: () => {},
      convert: (amt: number) => amt,
      formatAmount: (amt: number) => `₹${amt.toLocaleString("en-IN")}`,
      rawRate: 1.0,
    };
  }
  return ctx;
}
