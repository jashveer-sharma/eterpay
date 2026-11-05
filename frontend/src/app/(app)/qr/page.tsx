"use client";
import { useState } from "react";
import Link from "next/link";
import { QrCode, Camera, CheckCircle2, Copy, Download, RefreshCw, ArrowRight } from "lucide-react";
import { DEMO_USER } from "@/lib/demo-data";

export default function QrPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"receive" | "scan">("receive");
  const [fixedAmount, setFixedAmount] = useState("");
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Contactless Rails</div>
            <h1 className="font-serif text-3xl text-[#111111]">QR Payments</h1>
          </div>
          <span className="demo-badge">UPI & Interoperable QR</span>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[rgba(17,17,17,0.08)] gap-6">
          <button
            onClick={() => setActiveTab("receive")}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "receive" ? "text-[#0f4d40]" : "text-[#888888] hover:text-[#111111]"
            }`}
          >
            My Receive QR Code
            {activeTab === "receive" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4d40]" />}
          </button>
          <button
            onClick={() => {
              setActiveTab("scan");
              setScanned(false);
            }}
            className={`pb-3 text-sm font-semibold transition-all relative ${
              activeTab === "scan" ? "text-[#0f4d40]" : "text-[#888888] hover:text-[#111111]"
            }`}
          >
            Scan & Pay Merchant
            {activeTab === "scan" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4d40]" />}
          </button>
        </div>

        {activeTab === "receive" && (
          <div className="card p-8 bg-white text-center max-w-md mx-auto space-y-6 shadow-sm">
            <div>
              <h2 className="font-serif text-2xl text-[#111111]">{DEMO_USER.name}</h2>
              <span className="font-mono text-xs text-[#888888]">alex@eterpay (UPI / Global QR)</span>
            </div>

            {/* Stylized QR SVG */}
            <div className="p-6 bg-white border border-[rgba(17,17,17,0.12)] rounded-3xl w-64 h-64 mx-auto flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#111111]" fill="currentColor">
                {/* 3 Corner Positioning Boxes */}
                <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="12" width="14" height="14" rx="2" />
                <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="74" y="12" width="14" height="14" rx="2" />
                <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="74" width="14" height="14" rx="2" />
                {/* Center matrix elements */}
                <rect x="42" y="10" width="8" height="8" />
                <rect x="54" y="18" width="6" height="6" />
                <rect x="42" y="42" width="16" height="16" fill="#0f4d40" rx="3" />
                <rect x="15" y="45" width="6" height="8" />
                <rect x="70" y="45" width="10" height="6" />
                <rect x="45" y="70" width="8" height="10" />
                <rect x="65" y="68" width="8" height="8" />
                <rect x="78" y="78" width="12" height="12" />
              </svg>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Embed Specific Amount (Optional)</label>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#888888]">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="input pl-7 text-xs text-center font-semibold tabular"
                />
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => alert("QR asset downloaded to device (PNG simulation).")}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                <Download className="w-3.5 h-3.5 mr-1 inline" /> Save QR Code
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("alex@eterpay");
                  alert("UPI VPA copied to clipboard!");
                }}
                className="btn btn-primary text-xs px-4 py-2"
              >
                <Copy className="w-3.5 h-3.5 mr-1 inline" /> Copy VPA
              </button>
            </div>
          </div>
        )}

        {activeTab === "scan" && (
          <div className="card p-8 bg-white max-w-md mx-auto text-center space-y-6">
            {!scanned ? (
              <>
                <div className="w-48 h-48 border-2 border-dashed border-[#0f4d40] rounded-3xl mx-auto flex flex-col items-center justify-center p-4 bg-[#fbf9f5]">
                  <Camera className="w-10 h-10 text-[#0f4d40] mb-2" />
                  <span className="text-xs text-[#888888]">Camera Viewfinder</span>
                </div>
                <p className="text-xs text-[#666666]">
                  Point camera at an interoperable BharatQR, UPI QR, or PayPal Merchant QR code.
                </p>
                <button
                  onClick={simulateScan}
                  disabled={scanning}
                  className="btn btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
                >
                  {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                  {scanning ? "Decoding Merchant Payload..." : "Simulate Merchant QR Scan"}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#f0fdf4] text-[#16a34a] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#16a34a] uppercase">Merchant Discovered</span>
                  <h3 className="font-serif text-2xl text-[#111111]">Kyoto Artisan Tea Shop</h3>
                  <span className="font-mono text-xs text-[#888888]">ID: PAYPAL-MERCH-KYOTO-449</span>
                </div>
                <div className="p-4 rounded-xl bg-[#fbf9f5] text-left text-xs space-y-2 border border-[rgba(17,17,17,0.06)]">
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Due Amount:</span>
                    <span className="font-bold text-[#111111]">¥ 1,800 JPY (₹ 996.67 INR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#888888]">Conversion Rail:</span>
                    <span className="text-[#0f4d40] font-semibold">ECB Instant Settlement</span>
                  </div>
                </div>
                <Link href="/pay" className="btn btn-primary w-full py-3 text-xs">
                  Authorize & Pay ¥ 1,800 <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
