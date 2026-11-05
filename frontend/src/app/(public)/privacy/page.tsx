"use client";
import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="p-4 rounded-xl bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.2)] mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#d97706] flex-shrink-0" />
          <span className="text-xs text-[#888888]">
            <strong className="text-[#d97706]">Demonstration Notice:</strong> This privacy documentation specifies GDPR & PCI compliance architecture for the EterPay platform.
          </span>
        </div>

        <h1 className="font-serif text-4xl text-[#111111] mb-2">Privacy & Telemetry Policy</h1>
        <p className="text-xs text-[#888888] mb-8">Last revised: November 2026</p>

        <div className="prose text-xs text-[#555555] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-[#111111] mb-2">1. Architectural Privacy Philosophy</h2>
            <p>
              EterPay adheres to a privacy-by-design posture. We isolate sensitive payment method numbers, debit card CVVs, and banking passwords from our core application database. Payment authorization tokens are delegated to licensed clearing infrastructure including PayPal and certified card networks.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#111111] mb-2">2. Data We Collect in Simulation</h2>
            <p>
              During this demonstration environment, we collect simulated profile data including test usernames, mock email addresses, test invoice line items, and simulated payment requests. No real banking credentials or live identity documents are requested or retained.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#111111] mb-2">3. Artificial Intelligence Safety & Model Context</h2>
            <p>
              Our integration with Google Gemini 1.5 Flash and open reasoning models enforces strict data sanitization. Personally identifiable financial identifiers are redacted prior to payload transmission to cloud inference engines. The model receives only structured tool-calling parameters required to format advice.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#111111] mb-2">4. User Rights and Telemetry Opt-Out</h2>
            <p>
              Users retain full rights to purge their local state, reset simulated ledgers, or wipe local storage tokens at any time via the Settings module.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
