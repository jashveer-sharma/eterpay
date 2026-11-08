"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StartupIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only run once per session
    const seen = sessionStorage.getItem("eterpay_intro_seen");
    if (!seen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("eterpay_intro_seen", "true");
      }, 1250);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="eterpay-startup-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111111] text-[#fbf9f5] pointer-events-auto"
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at 50% 50%, #0f4d40 0%, transparent 70%)",
            }}
          />

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6"
          >
            <svg viewBox="0 0 48 48" fill="none" className="w-16 h-16">
              <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.25" />
              <motion.circle
                cx="24"
                cy="24"
                r="14"
                stroke="#0f4d40"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
              <circle cx="24" cy="24" r="5" fill="#fbf9f5" />
              <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="38" cy="24" r="2.5" fill="#16a34a" />
            </svg>
          </motion.div>

          {/* Brand Typography Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-1 relative"
          >
            <h1 className="font-serif text-2xl text-[#fbf9f5] tracking-wide">EterPay</h1>
            <p className="text-[10px] uppercase font-sans font-medium tracking-[0.25em] text-[#fbf9f5]/50">
              Universal Financial Network
            </p>
          </motion.div>

          {/* Precision Micro Progress Bar */}
          <motion.div className="w-36 h-0.5 bg-white/10 rounded-full mt-7 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.05, ease: "easeInOut" }}
              className="h-full bg-[#0f4d40] rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
