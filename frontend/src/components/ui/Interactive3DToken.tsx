"use client";

import { useState, useRef, useEffect } from "react";

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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    // Rotate range: -18 to 18 deg on Y, 16 to -16 deg on X
    setTilt({
      x: -yPct * 28,
      y: xPct * 32,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
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
      style={{ perspective: "1200px" }}
    >
      {/* 3D Rotational Canvas Wrapper with Hardware Acceleration */}
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center pointer-events-none"
      >
        {/* Outer 3D Gyroscope Ring 1 */}
        <div
          style={{
            transformStyle: "preserve-3d",
            animation: "eterpay-spin 32s linear infinite",
          }}
          className="absolute inset-0 rounded-full border border-[rgba(15,77,64,0.22)] shadow-[0_0_20px_rgba(15,77,64,0.08)] pointer-events-none"
        />

        {/* Middle 3D Gyroscope Ring 2 (Counter-Rotating with Tilt) */}
        <div
          style={{
            transform: "rotateX(55deg) rotateY(25deg)",
            transformStyle: "preserve-3d",
            animation: "eterpay-spin-reverse 22s linear infinite",
          }}
          className="absolute w-64 h-64 rounded-full border-2 border-dashed border-[rgba(15,77,64,0.3)] pointer-events-none"
        />

        {/* Inner Precision Ring 3 */}
        <div
          style={{
            transform: "rotateX(-45deg) rotateY(35deg)",
            transformStyle: "preserve-3d",
            animation: "eterpay-spin 16s linear infinite",
          }}
          className="absolute w-52 h-52 rounded-full border border-[rgba(15,77,64,0.4)] pointer-events-none"
        />

        {/* Central 3D Embossed EterPay Token with Real Depth */}
        <div
          style={{
            transform: "translateZ(38px)",
            transformStyle: "preserve-3d",
          }}
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#166b59] via-[#0f4d40] to-[#0a352c] p-1 shadow-[0_12px_32px_rgba(15,77,64,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center pointer-events-auto"
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
        </div>

        {/* Orbiting 3D Currency Nodes with Depth Stacking */}
        {SATELLITE_CURRENCIES.map((sat, idx) => {
          const rad = (sat.angle * Math.PI) / 180;
          const x = Math.round(Math.cos(rad) * sat.distance);
          const y = Math.round(Math.sin(rad) * sat.distance);
          const zDepth = idx % 2 === 0 ? 24 : -16;

          return (
            <div
              key={sat.code}
              style={{
                transform: `translate3d(${x}px, ${y}px, ${zDepth}px)`,
                transformStyle: "preserve-3d",
                animation: `eterpay-float ${4 + (idx % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${idx * 0.4}s`,
              }}
              className={`absolute w-9 h-9 rounded-full ${sat.bg} text-white flex flex-col items-center justify-center shadow-md border border-white/20 select-none pointer-events-auto`}
            >
              <span className="text-[10px] font-bold font-serif leading-none">{sat.symbol}</span>
              <span className="text-[7px] font-mono tracking-tighter opacity-80 leading-none">{sat.code}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
