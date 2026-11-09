"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception safely without exposing credentials
    console.error("[EterPay Error Boundary]", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fbf9f5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="max-w-md mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
          Unexpected Circuit Interruption
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#111111]">Something went wrong</h1>
        <p className="text-sm text-[#666666] leading-relaxed">
          An unexpected error interrupted this session. No transactions were executed and your funds remain safe in their reserves.
        </p>

        <div className="pt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn btn-primary text-xs px-5 py-2.5 rounded-full flex items-center gap-1.5"
          >
            <RefreshCw size={14} /> Retry Operation
          </button>

          <Link
            href="/dashboard"
            className="btn btn-secondary text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5"
          >
            <Home size={14} /> Safe Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
