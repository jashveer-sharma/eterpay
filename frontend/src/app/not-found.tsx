"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Send, ArrowLeftRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-6 text-center">
      {/* Dimensional EterPay Orbit Illustration */}
      <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[rgba(15,77,64,0.18)] animate-spin-slow" />
        <div className="absolute w-24 h-24 rounded-full border border-dashed border-[rgba(15,77,64,0.3)] [animation:spin-slow_12s_linear_infinite_reverse]" />
        <div className="w-16 h-16 rounded-full bg-[#0f4d40] text-white flex items-center justify-center shadow-lg">
          <span className="font-serif text-2xl font-semibold">404</span>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#0f4d40]">
          Lost in Financial Space
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111]">Page Not Found</h1>
        <p className="text-sm text-[#666666] leading-relaxed">
          The requested payment corridor or page does not exist or has been relocated to another settlement rail.
        </p>

        {/* Suggested Quick Nav */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="btn btn-secondary text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <Link
            href="/dashboard"
            className="btn btn-primary text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5"
          >
            <LayoutDashboard size={14} /> Open Dashboard
          </Link>
        </div>

        {/* Corridor shortcuts */}
        <div className="pt-8 border-t border-[rgba(17,17,17,0.08)] mt-8">
          <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-3">
            Popular Corridors
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#0f4d40]">
            <Link href="/pay" className="hover:underline flex items-center gap-1">
              <Send size={12} /> Pay &amp; Transfer
            </Link>
            <span className="text-[#cccccc]">·</span>
            <Link href="/currency" className="hover:underline flex items-center gap-1">
              <ArrowLeftRight size={12} /> Live Rates
            </Link>
            <span className="text-[#cccccc]">·</span>
            <Link href="/ai" className="hover:underline">
              Eter AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
