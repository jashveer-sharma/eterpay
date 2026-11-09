"use client";
import Link from "next/link";
import { ArrowRight, Globe, Zap, Shield, CheckCircle2, ArrowLeftRight, QrCode, CreditCard, RefreshCw } from "lucide-react";
import { useState } from "react";
import { DEMO_PAYMENT_NETWORKS_ANYWHERE } from "@/lib/demo-data";

export default function PublicAnywherePage() {
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [amount, setAmount] = useState(10000);

  const countries = [
    { code: "USA", name: "United States", currency: "USD", rate: 0.01198, symbol: "$", network: "PayPal Sandbox / Visa Direct", latency: "Instant", fee: "₹ 0.00" },
    { code: "GBR", name: "United Kingdom", currency: "GBP", rate: 0.00947, symbol: "£", network: "Faster Payments / PayPal", latency: "Instant", fee: "₹ 0.00" },
    { code: "EUR", name: "Germany (Eurozone)", currency: "EUR", rate: 0.01102, symbol: "€", network: "SEPA Instant / PayPal", latency: "Instant", fee: "₹ 0.00" },
    { code: "JPN", name: "Japan", currency: "JPY", rate: 1.806, symbol: "¥", network: "Zengin / PayPal", latency: "1-2 mins", fee: "₹ 0.00" },
    { code: "SGP", name: "Singapore", currency: "SGD", rate: 0.01603, symbol: "S$", network: "PayNow / PayPal", latency: "Instant", fee: "₹ 0.00" },
    { code: "ARE", name: "United Arab Emirates", currency: "AED", rate: 0.04399, symbol: "د.إ", network: "Aani / Visa Direct", latency: "Instant", fee: "₹ 0.00" },
    { code: "BRA", name: "Brazil", currency: "BRL", rate: 0.0682, symbol: "R$", network: "PIX Bridge (Planned)", latency: "Planned", fee: "₹ 0.00" },
  ];

  const current = countries.find((c) => c.code === selectedCountry) || countries[0];
  const converted = (amount * current.rate).toFixed(2);

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Globe className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">Global Universal Payment & Interoperability System</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-6">
          Pay Beyond Borders.<br />One Intelligent Experience.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mb-8">
          The long-term vision of global money movement. One unified app connecting you to local merchants, friends, and enterprises worldwide without worrying about local clearing protocols.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/anywhere" className="btn btn-primary px-8 py-3.5 text-sm">
            Launch Anywhere In App <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Link>
          <a href="#simulator" className="btn btn-secondary px-8 py-3.5 text-sm">
            Test Route Simulator
          </a>
        </div>
      </section>

      {/* Product Vision Callout */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="card-dark p-8 sm:p-12 rounded-3xl bg-[#111111] text-[#fbf9f5] text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#34d399] mb-3 block">
            Long-Term Interoperability Vision
          </span>
          <p className="font-serif text-2xl sm:text-3xl text-[#fbf9f5] mb-6 leading-snug">
            "An Indian traveler paying a merchant in Tokyo, or an American patron settling a bill in Bengaluru, using the exact same intuitive interface."
          </p>
          <p className="text-xs text-[rgba(251,249,245,0.6)] max-w-xl mx-auto leading-relaxed">
            EterPay Anywhere orchestrates method discovery, currency conversion, fee estimation, and cryptographic authorization into a seamless single step.
          </p>
        </div>
      </section>

      {/* Interactive Simulator */}
      <section id="simulator" className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="label-eyebrow mb-2">Real-Time Routing Engine</div>
          <h2 className="heading-section text-3xl sm:text-4xl text-[#111111]">Interactive Route & Fee Discovery</h2>
        </div>

        <div className="card p-8 bg-white max-w-3xl mx-auto shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="text-xs font-medium text-[#111111]">Clearing Rail: Active</span>
            </div>
            <span className="demo-badge">European Central Bank Rates</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            {/* Input Side */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">You Send (India)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#888888]">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="input pl-8 font-semibold text-lg tabular"
                  min="100"
                />
              </div>
              <span className="text-[11px] text-[#888888] mt-1 block">Debited from primary INR balance</span>
            </div>

            {/* Destination Side */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Recipient Destination</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="input font-medium text-sm"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#0f4d40] mt-1 block font-medium">Auto-detected compatible rail</span>
            </div>
          </div>

          {/* Settlement Preview */}
          <div className="mt-8 p-6 rounded-2xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(17,17,17,0.06)]">
              <div>
                <span className="text-xs text-[#888888]">Beneficiary Receives Exactly:</span>
                <div className="text-3xl font-serif text-[#0f4d40] mt-0.5 tabular font-medium">
                  {current.symbol} {converted} <span className="text-sm font-sans text-[#555555] font-normal">{current.currency}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#888888]">Target Clearing Network:</span>
                <div className="text-sm font-semibold text-[#111111]">{current.network}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 text-center">
              <div>
                <span className="text-[10px] uppercase text-[#888888] font-semibold block">Mid-Market Rate</span>
                <span className="text-xs font-medium text-[#111111] tabular">1 INR = {current.rate} {current.currency}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#888888] font-semibold block">Clearing Speed</span>
                <span className="text-xs font-medium text-[#16a34a]">{current.latency}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#888888] font-semibold block">Interchange Spread</span>
                <span className="text-xs font-semibold text-[#0f4d40]">0.00% (Demo)</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/anywhere" className="btn btn-primary w-full py-3.5 text-sm">
              Authorize Payment via EterPay Anywhere <ArrowRight className="w-4 h-4 ml-1 inline" />
            </Link>
          </div>
        </div>
      </section>

      {/* Network Connectivity Matrix */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="label-eyebrow mb-2">Connected Rails</div>
          <h2 className="heading-section text-3xl sm:text-4xl text-[#111111]">Supported & Planned Payment Networks</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_PAYMENT_NETWORKS_ANYWHERE.map((net) => (
            <div key={net.id} className="card p-5 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#111111]">{net.name}</span>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                      net.status === "live"
                        ? "bg-[#f0fdf4] text-[#16a34a]"
                        : net.status === "demo"
                        ? "bg-[#fffbeb] text-[#d97706]"
                        : "bg-[rgba(17,17,17,0.06)] text-[#666666]"
                    }`}
                  >
                    {net.status}
                  </span>
                </div>
                <p className="text-xs text-[#666666]">
                  {net.type.toUpperCase()} rail operating across {net.countries}+ territories.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(17,17,17,0.06)] text-[11px] text-[#0f4d40] font-medium">
                {net.connected ? "Direct Protocol Plug" : "Sandbox Planned"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-12 text-center max-w-4xl mx-auto">
        <div className="p-10 rounded-3xl bg-[#0f4d40] text-white">
          <h2 className="font-serif text-3xl mb-4">Experience Borderless Commerce</h2>
          <p className="text-sm text-[rgba(251,249,245,0.8)] max-w-md mx-auto mb-8">
            Access the live Anywhere terminal in your application dashboard.
          </p>
          <Link href="/anywhere" className="btn bg-white text-[#0f4d40] hover:bg-[#fbf9f5] px-8 py-3.5 rounded-full text-sm font-medium">
            Open Anywhere Module
          </Link>
        </div>
      </section>
    </div>
  );
}
