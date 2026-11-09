"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Info,
  DollarSign,
  CreditCard,
  KeyRound,
} from "lucide-react";
import { DEMO_USER } from "@/lib/demo-data";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySwitcher from "@/components/shared/CurrencySwitcher";

export default function LoansPage() {
  const { formatAmount } = useCurrency();
  const [fdBalance] = useState(500000); // ₹5,00,000
  const maxLtv = 0.85; // 85% LTV Cap
  const maxCredit = fdBalance * maxLtv; // ₹4,25,000
  const [requestedAmount, setRequestedAmount] = useState(150000);
  const [isLienActive, setIsLienActive] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);

  const fdYield = 7.2; // 7.20% earned p.a.
  const borrowRate = 8.45; // 8.45% borrow p.a.
  const netEffectiveSpread = (borrowRate - fdYield).toFixed(2); // 1.25% net cost

  const handleOpenPin = () => {
    setPinError("");
    setPin("");
    setPinModalOpen(true);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234" || pin.length === 4) {
      setPinModalOpen(false);
      setIsLienActive(true);
      setSuccessNotice(true);
    } else {
      setPinError("Invalid security PIN. Please enter 4 digits (e.g. 1234 for sandbox).");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(17,17,17,0.08)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#0f4d40] bg-[rgba(15,77,64,0.08)] px-2 py-0.5 rounded">
              EterPay ReserveLien™
            </span>
            <span className="text-xs text-[#666666] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              Deterministic Collateral Vault
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111111]">
            Fixed Deposit Backed Credit Line
          </h1>
          <p className="text-xs sm:text-sm text-[#555555] mt-1">
            Borrow against locked Fixed Deposits &amp; foreign currency reserves without breaking principal or sacrificing yield.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <CurrencySwitcher />
          <Link
            href="/ai"
            className="btn btn-secondary text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Zap size={14} className="text-[#0f4d40]" />
            Ask Eter AI about FD Rates
          </Link>
        </div>
      </div>

      {/* Security & Risk Isolation Banner */}
      <div className="p-4 rounded-2xl bg-[rgba(15,77,64,0.04)] border border-[rgba(15,77,64,0.18)] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#0f4d40] flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-semibold text-[#0f4d40]">
            Deterministic Collateral Shield — Zero Capital at Risk
          </div>
          <p className="text-[#555555] leading-relaxed">
            All credit lines are strictly over-collateralized with an immutable 85% Loan-to-Value (LTV) ceiling. Pledged deposits remain securely locked in regulated partner bank escrow. AI and external systems have zero authority to liquidate or alter collateral without cryptographic 2FA approval.
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#16a34a]/30 flex items-center justify-between text-xs text-[#16a34a]">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              ReserveLien™ Activated! {formatAmount(requestedAmount)} has been credited to your active spending ledger.
            </span>
          </div>
          <Link
            href="/transactions"
            className="text-[11px] underline underline-offset-2 font-semibold hover:no-underline"
          >
            View Ledger
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-white border border-[rgba(17,17,17,0.08)]">
          <div className="text-[11px] uppercase font-semibold text-[#888888] mb-1">Pledged Fixed Deposit</div>
          <div className="font-serif text-2xl font-bold text-[#111111]">
            {formatAmount(fdBalance)}
          </div>
          <div className="text-[11px] text-[#16a34a] font-medium mt-1">
            Earning +{fdYield}% p.a. compound yield
          </div>
        </div>

        <div className="card p-5 bg-white border border-[rgba(17,17,17,0.08)]">
          <div className="text-[11px] uppercase font-semibold text-[#888888] mb-1">Max Credit Capacity (85% LTV)</div>
          <div className="font-serif text-2xl font-bold text-[#0f4d40]">
            {formatAmount(maxCredit)}
          </div>
          <div className="text-[11px] text-[#555555] mt-1">
            Hard collateral ceiling enforced
          </div>
        </div>

        <div className="card p-5 bg-white border border-[rgba(17,17,17,0.08)]">
          <div className="text-[11px] uppercase font-semibold text-[#888888] mb-1">Borrow Interest Rate</div>
          <div className="font-serif text-2xl font-bold text-[#111111]">
            {borrowRate}% p.a.
          </div>
          <div className="text-[11px] text-[#0f4d40] font-semibold mt-1">
            Net effective spread: only {netEffectiveSpread}%
          </div>
        </div>

        <div className="card p-5 bg-white border border-[rgba(17,17,17,0.08)]">
          <div className="text-[11px] uppercase font-semibold text-[#888888] mb-1">Vault Status</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isLienActive ? "bg-[#16a34a] animate-pulse" : "bg-[#888888]"
              }`}
            />
            <span className="font-serif text-lg font-semibold text-[#111111]">
              {isLienActive ? "Lien Active" : "Available"}
            </span>
          </div>
          <div className="text-[11px] text-[#555555] mt-1">
            {isLienActive ? "Principal locked in vault" : "Ready to activate"}
          </div>
        </div>
      </div>

      {/* Main Interactive Control & Collateral Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Credit Request Slider */}
        <div className="lg:col-span-2 card p-6 sm:p-8 bg-white border border-[rgba(17,17,17,0.08)] space-y-6">
          <div className="border-b border-[rgba(17,17,17,0.06)] pb-4">
            <h2 className="font-serif text-xl font-semibold text-[#111111]">
              Configure Credit Line Draw
            </h2>
            <p className="text-xs text-[#555555] mt-0.5">
              Select the amount you want to draw against your ₹5,00,000 SBI Collateralized Fixed Deposit.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#555555] uppercase tracking-wider">
                Requested Credit Line
              </span>
              <span className="font-serif text-2xl font-bold text-[#0f4d40]">
                {formatAmount(requestedAmount)}
              </span>
            </div>

            <input
              type="range"
              min={25000}
              max={maxCredit}
              step={5000}
              value={requestedAmount}
              disabled={isLienActive}
              onChange={(e) => setRequestedAmount(Number(e.target.value))}
              className="w-full accent-[#0f4d40] cursor-pointer h-2 bg-[#f4f0e8] rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-[#888888]">
              <span>Min: {formatAmount(25000)}</span>
              <span>Selected: {((requestedAmount / fdBalance) * 100).toFixed(1)}% LTV</span>
              <span>Max (85% LTV): {formatAmount(maxCredit)}</span>
            </div>
          </div>

          {/* Rate Breakdown Grid */}
          <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#888888]">FD Interest Earned:</span>
              <div className="font-serif text-base font-semibold text-[#16a34a] mt-0.5">
                +{formatAmount((fdBalance * fdYield) / 100)}/yr
              </div>
              <span className="text-[10px] text-[#888888]">Fixed at 7.20%</span>
            </div>

            <div>
              <span className="text-[#888888]">Credit Line Cost:</span>
              <div className="font-serif text-base font-semibold text-[#111111] mt-0.5">
                -{formatAmount((requestedAmount * borrowRate) / 100)}/yr
              </div>
              <span className="text-[10px] text-[#888888]">At 8.45% borrow rate</span>
            </div>

            <div>
              <span className="text-[#888888]">Net Out-of-Pocket Cost:</span>
              <div className="font-serif text-base font-semibold text-[#0f4d40] mt-0.5">
                {formatAmount(Math.abs(Math.round((requestedAmount * (borrowRate - fdYield)) / 100)))}/yr
              </div>
              <span className="text-[10px] text-[#0f4d40] font-semibold">1.25% effective cost</span>
            </div>
          </div>

          {/* Action Button */}
          {isLienActive ? (
            <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#16a34a]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-semibold text-[#16a34a]">Lien Active &amp; Verified</span>
                <p className="text-[11px] text-[#555555]">
                  Funds available in your Multi-Currency Wallet &amp; PayPal checkout.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsLienActive(false);
                  setSuccessNotice(false);
                }}
                className="btn btn-secondary text-xs px-4 py-2 text-[#dc2626] border-red-200 hover:bg-red-50"
              >
                Release Lien &amp; Repay Draw
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpenPin}
              className="btn btn-primary w-full py-3.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              Authenticate with Security PIN &amp; Unlock Credit Line
            </button>
          )}
        </div>

        {/* Right Col: Collateral Certificate & Security Details */}
        <div className="card p-6 bg-white border border-[rgba(17,17,17,0.08)] space-y-5">
          <h3 className="font-serif text-lg font-semibold text-[#111111]">
            Collateral Instrument
          </h3>

          <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-[#888888]">Certificate #</span>
              <span className="font-mono font-semibold text-[#111111]">FD-IN-2026-78291</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Beneficiary</span>
              <span className="font-semibold text-[#111111]">{DEMO_USER.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Deposit Institution</span>
              <span className="font-semibold text-[#111111]">State Bank of India</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Maturity Date</span>
              <span className="font-mono text-[#111111]">18 March 2028</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888888]">Lock Status</span>
              <span className="text-[#16a34a] font-semibold">
                {isLienActive ? "Lien Pledged" : "Unencumbered"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#555555]">
            <div className="font-semibold text-[#111111] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#0f4d40]" />
              Why this is zero-risk:
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] leading-relaxed text-[#666666]">
              <li>You never break your fixed deposit, preserving full interest.</li>
              <li>You only pay interest on the money you actually spend.</li>
              <li>No external credit bureau rating score inquiry.</li>
              <li>Instant liquidation protection with automatic currency routing.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2FA PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card p-6 sm:p-8 bg-white max-w-sm w-full space-y-5 rounded-2xl shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(15,77,64,0.1)] flex items-center justify-center text-[#0f4d40]">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#111111]">
                  Security Verification
                </h3>
                <p className="text-xs text-[#888888]">Enter your 4-digit EterPay PIN</p>
              </div>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Confirm your authorization to pledge ₹{requestedAmount.toLocaleString("en-IN")} against your Fixed Deposit collateral.
            </p>

            <form onSubmit={handleConfirmPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="input text-center text-2xl tracking-[0.5em] font-mono py-2.5 w-full bg-[#fbf9f5]"
              />

              {pinError && (
                <div className="text-[11px] text-[#dc2626] font-medium text-center">
                  {pinError}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinModalOpen(false)}
                  className="btn btn-secondary text-xs flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex-1 py-2.5 font-semibold"
                >
                  Verify &amp; Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}