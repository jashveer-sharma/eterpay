"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const SATELLITE_CURRENCIES = [
  { code: "USD", symbol: "$", bg: "bg-[#0f4d40]", angle: 0, distance: 130 },
  { code: "EUR", symbol: "€", bg: "bg-[#0a352c]", angle: 60, distance: 140 },
  { code: "GBP", symbol: "£", bg: "bg-[#166b59]", angle: 120, distance: 130 },
  { code: "INR", symbol: "₹", bg: "bg-[#0f4d40]", angle: 180, distance: 145 },
  { code: "JPY", symbol: "¥", bg: "bg-[#0a352c]", angle: 240, distance: 135 },
  { code: "SGD", symbol: "S$", bg: "bg-[#166b59]", angle: 300, distance: 140 },
];

export default function Interactive3DToken() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring smoothing for natural tactile physics
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), { stiffness: 140, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 140, damping: 20 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!mounted) {
    return <div className="w-80 h-80 mx-auto" />;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center w-80 h-80 sm:w-96 sm:h-96 mx-auto cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Rotational Canvas Wrapper */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center"
      >
        {/* Outer 3D Gyroscope Ring 1 */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute inset-0 rounded-full border border-[rgba(15,77,64,0.22)] shadow-[0_0_20px_rgba(15,77,64,0.08)]"
        />

        {/* Middle 3D Gyroscope Ring 2 (Counter-Rotating with Tilt) */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          style={{
            transform: "rotateX(55deg) rotateY(25deg)",
            transformStyle: "preserve-3d",
          }}
          className="absolute w-64 h-64 rounded-full border-2 border-dashed border-[rgba(15,77,64,0.3)]"
        />

        {/* Inner Precision Ring 3 */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 16, ease: "linear", repeat: Infinity }}
          style={{
            transform: "rotateX(-45deg) rotateY(35deg)",
            transformStyle: "preserve-3d",
          }}
          className="absolute w-52 h-52 rounded-full border border-[rgba(15,77,64,0.4)]"
        />

        {/* Central 3D Embossed EterPay Token */}
        <motion.div
          style={{
            transform: "translateZ(35px)",
            transformStyle: "preserve-3d",
          }}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#166b59] via-[#0f4d40] to-[#0a352c] p-1 shadow-[0_12px_32px_rgba(15,77,64,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center"
        >
          {/* Token Rim Reflection */}
          <div className="absolute inset-0.5 rounded-full border border-white/20 pointer-events-none" />

          {/* Central EterPay Brand Monogram */}
          <svg viewBox="0 0 48 48" fill="none" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md">
            <circle cx="24" cy="24" r="22" stroke="#fbf9f5" strokeWidth="1.5" fill="none" opacity="0.3" />
            <circle cx="24" cy="24" r="14" stroke="#fbf9f5" strokeWidth="1.8" fill="none" opacity="0.7" />
            <circle cx="24" cy="24" r="5" fill="#fbf9f5" />
            <path d="M24 10 A14 14 0 0 1 38 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M24 38 A14 14 0 0 1 10 24" stroke="#fbf9f5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="24" r="2.5" fill="#fbf9f5" />
          </svg>
        </motion.div>

        {/* Orbiting 3D Currency Nodes with Depth Stacking */}
        {SATELLITE_CURRENCIES.map((sat, idx) => {
          const rad = (sat.angle * Math.PI) / 180;
          const x = Math.cos(rad) * sat.distance;
          const y = Math.sin(rad) * sat.distance;

          return (
            <motion.div
              key={sat.code}
              animate={{
                x: [x, Math.cos(rad + Math.PI) * sat.distance, x],
                y: [y, Math.sin(rad + Math.PI) * sat.distance, y],
                z: [20 * (idx % 2 === 0 ? 1 : -1), -20 * (idx % 2 === 0 ? 1 : -1), 20 * (idx % 2 === 0 ? 1 : -1)],
              }}
              transition={{
                duration: 18 + idx * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
              className={`absolute w-9 h-9 rounded-full ${sat.bg} text-white flex flex-col items-center justify-center shadow-md border border-white/20 select-none`}
            >
              <span className="text-[10px] font-bold font-serif leading-none">{sat.symbol}</span>
              <span className="text-[7px] font-mono tracking-tighter opacity-80 leading-none">{sat.code}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
