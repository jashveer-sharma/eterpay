"use client";
import { useState } from "react";
import Link from "next/link";
import { Plane, Building, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { DEMO_TRAVEL } from "@/lib/demo-data";

export default function TravelPage() {
  const [booked, setBooked] = useState<string | null>(null);

  const handleBook = (id: string) => {
    setBooked(id);
    setTimeout(() => setBooked(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Cross-Border Mobility</div>
            <h1 className="font-serif text-3xl text-[#111111]">Travel & International Reservations</h1>
          </div>
          <span className="demo-badge">Auto FX Currency Lock</span>
        </div>

        {/* Travel Bookings List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl text-[#111111]">Curated Global Itineraries</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {DEMO_TRAVEL.map((t) => (
              <div key={t.id} className="card p-6 bg-white flex flex-col justify-between hover:border-[#0f4d40]/40 transition-all">
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
                  <p className="text-xs text-[#888888] mb-4">
                    {t.type === "flight" ? `Departing: ${t.date} • ${t.class}` : `${t.nights} Nights Stay • Check-in: ${t.checkIn}`}
                  </p>
                </div>

                <div>
                  <div className="font-serif text-2xl font-semibold text-[#0f4d40] tabular mb-4">
                    ₹ {t.price ? t.price.toLocaleString("en-IN") : (t.pricePerNight * t.nights).toLocaleString("en-IN")}
                  </div>

                  {booked === t.id ? (
                    <div className="p-2.5 rounded-xl bg-[#f0fdf4] text-xs font-semibold text-[#16a34a] flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Reservation Confirmed (Simulation)
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBook(t.id)}
                      className="btn btn-primary w-full text-xs py-2.5 rounded-xl font-medium"
                    >
                      Book with Multi-Currency Wallet
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
              When traveling between India and Singapore, holding S$500 in your EterPay SGD sub-wallet ensures zero dynamic currency conversion fees at local point-of-sale terminals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
