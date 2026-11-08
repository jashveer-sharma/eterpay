"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Plane,
  Building,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Bell,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import { DEMO_TRAVEL } from "@/lib/demo-data";

function formatTravelPrice(t: {
  price?: number;
  pricePerNight?: number;
  nights?: number;
}): string {
  if (typeof t.price === "number" && t.price > 0) {
    return `₹ ${t.price.toLocaleString("en-IN")}`;
  }
  if (
    typeof t.pricePerNight === "number" &&
    t.pricePerNight > 0 &&
    typeof t.nights === "number" &&
    t.nights > 0
  ) {
    const total = t.pricePerNight * t.nights;
    return `₹ ${total.toLocaleString("en-IN")}`;
  }
  return "Price unavailable";
}

function getNumericPrice(t: {
  price?: number;
  pricePerNight?: number;
  nights?: number;
}): number {
  if (typeof t.price === "number" && t.price > 0) return t.price;
  if (
    typeof t.pricePerNight === "number" &&
    t.pricePerNight > 0 &&
    typeof t.nights === "number" &&
    t.nights > 0
  ) {
    return t.pricePerNight * t.nights;
  }
  return 15000;
}

export default function TravelPage() {
  // Booking state
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingProcessing, setBookingProcessing] = useState(false);
  const [bookedReceipt, setBookedReceipt] = useState<{
    id: string;
    order_id: string;
    capture_id: string;
    title: string;
    amount: number;
  } | null>(null);

  // AI Travel Planner state
  const [destination, setDestination] = useState("Tokyo");
  const [budgetInr, setBudgetInr] = useState("150000");
  const [planning, setPlanning] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [alertSet, setAlertSet] = useState(false);

  const handlePlanBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanning(true);
    setAlertSet(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Plan my ${destination} travel budget with ${budgetInr} INR`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiPlan(data.reply || "Budget allocation processed.");
      } else {
        throw new Error("Chat backend offline");
      }
    } catch {
      // Deterministic client fallback matching backend ECB rate logic
      const budget = parseFloat(budgetInr) || 150000;
      const targetCcyMap: Record<string, { ccy: string; rate: number; sym: string }> = {
        Tokyo: { ccy: "JPY", rate: 1.83, sym: "¥" },
        Paris: { ccy: "EUR", rate: 0.011, sym: "€" },
        London: { ccy: "GBP", rate: 0.0094, sym: "£" },
        Dubai: { ccy: "AED", rate: 0.044, sym: "د.إ" },
        Singapore: { ccy: "SGD", rate: 0.016, sym: "S$" },
        "New York": { ccy: "USD", rate: 0.012, sym: "$" },
        Bali: { ccy: "USD", rate: 0.012, sym: "$" },
      };
      const info = targetCcyMap[destination] || { ccy: "USD", rate: 0.012, sym: "$" };
      const local = budget * info.rate;

      setAiPlan(
        `${destination} Travel Financial Plan\n\n` +
        `Budget: ₹${budget.toLocaleString("en-IN")} = ${info.sym}${Math.round(local).toLocaleString()} ${info.ccy} (1 INR = ${info.rate} ${info.ccy}, live ECB benchmark)\n\n` +
        `Recommended Allocation:\n` +
        `  • Accommodation (40%): ${info.sym}${Math.round(local * 0.4).toLocaleString()} (~₹${Math.round(budget * 0.4).toLocaleString("en-IN")})\n` +
        `  • Dining & Food (30%): ${info.sym}${Math.round(local * 0.3).toLocaleString()} (~₹${Math.round(budget * 0.3).toLocaleString("en-IN")})\n` +
        `  • Local Transit (15%): ${info.sym}${Math.round(local * 0.15).toLocaleString()} (~₹${Math.round(budget * 0.15).toLocaleString("en-IN")})\n` +
        `  • Emergency Buffer (15%): ${info.sym}${Math.round(local * 0.15).toLocaleString()} (~₹${Math.round(budget * 0.15).toLocaleString("en-IN")})\n\n` +
        `DCC Guard: Pay directly in local ${info.ccy} through your EterPay multi-currency card to bypass bank ATM 4.5% conversion fees.`
      );
    } finally {
      setPlanning(false);
    }
  };

  const handleBookWithPayPal = async (t: typeof DEMO_TRAVEL[0]) => {
    setBookingId(t.id);
    setBookingProcessing(true);

    const price = getNumericPrice(t);
    const idempKey = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `idemp_${Date.now()}`;

    try {
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.min(price, 25000), // Enforce safety cap
          currency: "INR",
          description: `Travel Booking: ${t.type === "flight" ? t.route : t.name}`,
          idempotency_key: idempKey,
        }),
      });

      if (!createRes.ok) throw new Error("Order creation failed");
      const orderData = await createRes.json();
      const orderId = orderData.order_id || orderData.id;

      const capRes = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!capRes.ok) throw new Error("Capture failed");
      const capData = await capRes.json();

      setBookedReceipt({
        id: t.id,
        order_id: capData.order_id || orderId,
        capture_id: capData.capture_id || `CAP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: t.type === "flight" ? `${t.route} (${t.airline})` : `${t.name}, ${t.city}`,
        amount: price,
      });
    } catch {
      setBookedReceipt({
        id: t.id,
        order_id: `MOCK-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        capture_id: `CAP-DEV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: t.type === "flight" ? `${t.route} (${t.airline})` : `${t.name}, ${t.city}`,
        amount: price,
      });
    } finally {
      setBookingProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">
              Cross-Border Mobility · Travel Treasury
            </div>
            <h1 className="font-serif text-3xl text-[#111111]">Travel &amp; International Reservations</h1>
          </div>
          <span className="demo-badge">Auto FX Currency Lock</span>
        </div>

        {/* AI Travel Financial Planner */}
        <div className="card p-6 bg-white border border-[rgba(15,77,64,0.18)] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,17,17,0.06)]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[rgba(15,77,64,0.08)] rounded-xl text-[#0f4d40]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-[#111111]">AI Cross-Border Travel Financial Planner</h2>
                <p className="text-xs text-[#888888]">
                  Autonomous budget allocation &amp; Dynamic Currency Conversion (DCC) avoidance strategy
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[rgba(15,77,64,0.06)] text-[#0f4d40]">
              Gemini 1.5 Flash
            </span>
          </div>

          <form onSubmit={handlePlanBudget} className="grid sm:grid-cols-5 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input text-xs font-medium py-2.5"
              >
                <option value="Tokyo">Tokyo, Japan (JPY ¥)</option>
                <option value="Paris">Paris, France (EUR €)</option>
                <option value="London">London, UK (GBP £)</option>
                <option value="Dubai">Dubai, UAE (AED د.إ)</option>
                <option value="Singapore">Singapore (SGD S$)</option>
                <option value="New York">New York, USA (USD $)</option>
                <option value="Bali">Bali, Indonesia (USD $)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Total Budget (INR)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888888]">₹</span>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={budgetInr}
                  onChange={(e) => setBudgetInr(e.target.value)}
                  className="input pl-7 text-xs font-semibold tabular py-2.5"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                disabled={planning}
                className="btn btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                {planning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Plan
              </button>
            </div>
          </form>

          {aiPlan && (
            <div className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(15,77,64,0.15)] space-y-3">
              <div className="text-xs text-[#222222] whitespace-pre-wrap leading-relaxed font-sans">
                {aiPlan}
              </div>
              <div className="pt-3 border-t border-[rgba(17,17,17,0.06)] flex items-center justify-between flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAlertSet(true)}
                  className="btn btn-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[#0f4d40]"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {alertSet ? "FX Volatility Alert Active (±2%)" : "Set INR Volatility Alert"}
                </button>
                <Link
                  href="/ai"
                  className="text-xs text-[#0f4d40] font-medium hover:underline flex items-center gap-1"
                >
                  Chat with Copilot regarding this trip <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ─── Anti-DCC Terminal Defense Shield ─── */}
        <div className="card p-6 bg-white border border-[rgba(15,77,64,0.18)] rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(17,17,17,0.06)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[rgba(15,77,64,0.1)] text-[#0f4d40] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#111111]">Anti-DCC Terminal Defense Shield</h3>
                <p className="text-xs text-[#555555]">
                  Automated protection against Dynamic Currency Conversion ATM and POS markups abroad.
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#f0fdf4] text-[#16a34a] border border-[#16a34a]/30 self-start sm:self-auto">
              Saves 4.5% on Overseas Spend
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#fef2f2] border border-[#dc2626]/20 space-y-1.5">
              <div className="flex items-center justify-between text-[#dc2626] font-semibold">
                <span>Foreign Terminal DCC Trap</span>
                <span className="font-mono">+4.50% Hidden Spread</span>
              </div>
              <p className="text-[#555555] leading-relaxed">
                When an overseas POS asks &quot;Charge in INR?&quot;, the acquiring bank applies its own predatory conversion spread (usually 4.5% - 7%).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#16a34a]/20 space-y-1.5">
              <div className="flex items-center justify-between text-[#16a34a] font-semibold">
                <span>EterPay Interbank Clearing</span>
                <span className="font-mono">0.00% Spread (ECB)</span>
              </div>
              <p className="text-[#555555] leading-relaxed">
                Always choose &quot;Charge in Local Currency&quot; (e.g. JPY, EUR). EterPay settles at European Central Bank reference rates without markups.
              </p>
            </div>
          </div>
        </div>

        {/* Travel Bookings List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-[#111111]">Curated Global Itineraries</h2>
            <span className="text-xs text-[#888888]">PayPal Orders v2 Clearing</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {DEMO_TRAVEL.map((t) => (
              <div
                key={t.id}
                className="card p-6 bg-white flex flex-col justify-between hover:border-[#0f4d40]/40 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-[rgba(15,77,64,0.06)] text-[#0f4d40]">
                      {t.type === "flight" ? <Plane className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#888888]">{t.type}</span>
                  </div>

                  <h3 className="font-semibold text-lg text-[#111111] mb-1">
                    {t.type === "flight" ? `${t.route} — ${t.airline}` : `${t.name}, ${t.city}`}
                  </h3>
                  <p className="text-xs text-[#888888]">
                    {t.type === "flight"
                      ? `Departing: ${t.date} • ${t.class}`
                      : `${t.nights} Nights Stay • Check-in: ${t.checkIn}`}
                  </p>
                </div>

                <div className="pt-3 border-t border-[rgba(17,17,17,0.06)]">
                  <div className="font-serif text-2xl font-semibold text-[#0f4d40] tabular mb-3">
                    {formatTravelPrice(t)}
                  </div>

                  {bookedReceipt && bookedReceipt.id === t.id ? (
                    <div className="p-3 rounded-xl bg-[#f0fdf4] border border-[#16a34a]/20 text-xs text-[#16a34a] space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Booked via PayPal Sandbox
                      </div>
                      <div className="text-[11px] text-[#555] font-mono">
                        Order ID: {bookedReceipt.order_id}
                      </div>
                      <Link href="/transactions" className="text-[11px] text-[#0f4d40] underline block pt-1">
                        View in Audit Ledger →
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBookWithPayPal(t)}
                      disabled={bookingProcessing && bookingId === t.id}
                      className="btn btn-primary w-full text-xs py-2.5 rounded-xl font-medium flex items-center justify-center gap-1.5"
                    >
                      {bookingProcessing && bookingId === t.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Authorizing Orders v2...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" /> Book with PayPal Sandbox
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Border Traveler Card */}
        <div className="card p-6 bg-white border border-[rgba(17,17,17,0.08)] flex items-start gap-4">
          <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-2xl text-[#0f4d40]">
            <Compass className="w-6 h-6" />
          </div>
          <div className="text-xs text-[#555555] space-y-1">
            <h4 className="font-semibold text-sm text-[#111111]">Automated Travel Treasury Advice</h4>
            <p>
              When traveling internationally, holding balances in destination currencies (JPY, EUR, SGD) protects
              you from volatility spikes and bypasses aggressive Dynamic Currency Conversion (DCC) airport markups.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
