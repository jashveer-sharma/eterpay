"use client";
import { useState } from "react";
import Link from "next/link";
import { Settings, Shield, Bell, Key, RefreshCw, CheckCircle2, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const [twoFa, setTwoFa] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [fraudAudit, setFraudAudit] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Platform Preferences</div>
            <h1 className="font-serif text-3xl text-[#111111]">Security & Settings</h1>
          </div>
          <span className="demo-badge">Configuration State</span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Security Card */}
          <div className="card p-6 bg-white space-y-4 shadow-xs">
            <h2 className="font-serif text-xl text-[#111111]">Security & Authentication</h2>
            
            <div className="flex items-center justify-between py-2 border-b border-[rgba(17,17,17,0.06)]">
              <div>
                <div className="text-xs font-semibold text-[#111111]">Two-Factor Authentication (2FA)</div>
                <div className="text-[11px] text-[#888888]">Enforce biometric or SMS OTP confirmation for all cross-border clearing.</div>
              </div>
              <input
                type="checkbox"
                checked={twoFa}
                onChange={(e) => setTwoFa(e.target.checked)}
                className="w-4 h-4 text-[#0f4d40] rounded focus:ring-[#0f4d40]"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[rgba(17,17,17,0.06)]">
              <div>
                <div className="text-xs font-semibold text-[#111111]">Autonomous Fraud Detection Telemetry</div>
                <div className="text-[11px] text-[#888888]">Run ML model inference on outbound transaction velocity.</div>
              </div>
              <input
                type="checkbox"
                checked={fraudAudit}
                onChange={(e) => setFraudAudit(e.target.checked)}
                className="w-4 h-4 text-[#0f4d40] rounded focus:ring-[#0f4d40]"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-xs font-semibold text-[#111111]">Real-Time Security Notifications</div>
                <div className="text-[11px] text-[#888888]">Receive alerts on new browser session logins or credential edits.</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0f4d40] rounded focus:ring-[#0f4d40]"
              />
            </div>
          </div>

          {/* Connected Services */}
          <div className="card p-6 bg-white space-y-4 shadow-xs">
            <h2 className="font-serif text-xl text-[#111111]">Connected Service Gateways</h2>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#111111]">PayPal Developer Sandbox</div>
                  <div className="text-[11px] text-[#888888]">Orders v2 & Webhook Capture Client</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#111111]">Frankfurter European Central Bank API</div>
                  <div className="text-[11px] text-[#888888]">Zero-Key Live FX Reference Clearing</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#111111]">Google Gemini 1.5 Flash Copilot</div>
                  <div className="text-[11px] text-[#888888]">Multi-Tier Free Model Fallback Engine</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {saved && (
            <p className="text-xs text-[#16a34a] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved and enforced across app routers.
            </p>
          )}

          <button type="submit" className="btn btn-primary text-xs py-2.5 px-6">
            Update Security Configurations
          </button>
        </form>
      </div>
    </div>
  );
}
