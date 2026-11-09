"use client";

import { useState, useEffect } from "react";

export default function StartupIntro() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only run once per browser session
    const seen = sessionStorage.getItem("eterpay_intro_seen");
    if (!seen) {
      setShow(true);
      // Begin fadeout at 1000ms
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 1000);
      // Remove completely at 1400ms
      const removeTimer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("eterpay_intro_seen", "true");
      }, 1450);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.02)" : "scale(1)",
        pointerEvents: fading ? "none" : "auto",
      }}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] flex flex-col items-center justify-center bg-[#111111] text-[#fbf9f5] select-none p-4 m-0"
    >
      {/* Subtle Ambient Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at 50% 50%, #0f4d40 0%, transparent 70%)",
        }}
      />

      {/* Centered Content Wrapper */}
      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Logo Animation */}
        <div className="relative mb-5 transform transition-all duration-700 ease-out animate-in fade-in zoom-in-75">
          <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16 mx-auto">
            <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.25" />
            <circle
              cx="24"
              cy="24"
              r="14"
              stroke="#0f4d40"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="88"
              strokeDashoffset="0"
              className="animate-spin-slow"
            />
            <circle cx="24" cy="24" r="5" fill="#fbf9f5" />
            <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="24" r="2.5" fill="#16a34a" />
          </svg>
        </div>

        {/* Brand Typography Reveal */}
        <div className="text-center space-y-1 relative">
          <h1 className="font-serif text-2xl text-[#fbf9f5] tracking-wide">EterPay</h1>
          <p className="text-[10px] uppercase font-sans font-medium tracking-[0.25em] text-[#fbf9f5]/50">
            Universal Financial Network
          </p>
        </div>

        {/* Precision Micro Progress Bar */}
        <div className="w-36 h-0.5 bg-white/10 rounded-full mt-6 overflow-hidden relative mx-auto">
          <div
            style={{
              animation: "eterpay-progress 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
            className="h-full bg-[#0f4d40] rounded-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
