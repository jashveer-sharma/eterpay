"use client";
import { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, Award } from "lucide-react";
import { DEMO_USER } from "@/lib/demo-data";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(DEMO_USER.name);
  const [phone, setPhone] = useState(DEMO_USER.phone);

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
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Account Identity</div>
            <h1 className="font-serif text-3xl text-[#111111]">User Profile & Credentials</h1>
          </div>
          <span className="demo-badge">KYC Verified</span>
        </div>

        {/* Profile Header Card */}
        <div className="card p-8 bg-white flex flex-col sm:flex-row items-center gap-6 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#0f4d40] text-white flex items-center justify-center font-serif text-3xl font-medium">
            {DEMO_USER.firstName[0]}{DEMO_USER.lastName[0]}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="font-serif text-2xl text-[#111111]">{DEMO_USER.name}</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] w-fit mx-auto sm:mx-0">
                Tier 2 Identity Verified
              </span>
            </div>
            <p className="text-xs text-[#888888] font-mono">Member ID: {DEMO_USER.id} • Active since 2024</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold uppercase text-[#888888] block">Membership Tier</span>
            <span className="text-sm font-semibold text-[#0f4d40]">{DEMO_USER.plan}</span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card p-8 bg-white shadow-xs">
          <h3 className="font-serif text-xl text-[#111111] mb-6">Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={DEMO_USER.email}
                  className="input text-xs bg-[#fbf9f5] cursor-not-allowed text-[#888888]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Operating Region</label>
                <input
                  type="text"
                  disabled
                  value={`${DEMO_USER.countryName} (${DEMO_USER.country})`}
                  className="input text-xs bg-[#fbf9f5] cursor-not-allowed text-[#888888]"
                />
              </div>
            </div>

            {saved && (
              <p className="text-xs text-[#16a34a] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile updates persisted to simulated session storage.
              </p>
            )}

            <button type="submit" className="btn btn-primary text-xs py-2.5 px-6">
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
