"use client";
import Link from "next/link";
import { ArrowRight, Code2, Terminal, Key, ShieldCheck, CheckCircle2, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function DeveloperPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const createOrderCode = `import httpx
import uuid

# Create PayPal v2 Order via EterPay Backend
async def create_cross_border_order(amount: float, currency: str):
    headers = {
        "PayPal-Request-Id": str(uuid.uuid4()), # Enforce Idempotency
        "Content-Type": "application/json"
    }
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": f"{amount:.2f}"
            },
            "description": "EterPay Anywhere Cross-Border Settlement"
        }]
    }
    async with httpx.AsyncClient() as client:
        res = await client.post("/api/paypal/create-order", json=payload, headers=headers)
        return res.json()`;

  const ecbFxCode = `# Fetch European Central Bank Free FX Rates
import httpx

async def get_ecb_fx_benchmark(base: str = "INR"):
    async with httpx.AsyncClient() as client:
        # Zero API key required, 100% free ECB data
        resp = await client.get(f"https://api.frankfurter.app/latest?from={base}")
        return resp.json()["rates"]`;

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      <section className="px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(15,77,64,0.08)] border border-[rgba(15,77,64,0.15)] mb-6">
          <Terminal className="w-3.5 h-3.5 text-[#0f4d40]" />
          <span className="text-xs font-medium text-[#0f4d40]">Developer Platform & API Architecture</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#111111] tracking-tight leading-[1.08] mb-6">
          Integrate the universal payment rail.
        </h1>
        <p className="text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mb-8">
          Build on top of EterPay's robust APIs. Featuring PayPal Orders v2 integration, real-time ECB benchmark quotes, and structured AI function calling.
        </p>
      </section>

      {/* Code Snippets */}
      <section className="px-6 py-10 max-w-5xl mx-auto space-y-8">
        {/* PayPal Orders v2 */}
        <div className="card-dark p-6 sm:p-8 bg-[#111111] rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#34d399]" />
              <span className="text-xs font-semibold text-[#fbf9f5]">PayPal Orders v2 Creation (Idempotent)</span>
            </div>
            <button
              onClick={() => copyCode("order", createOrderCode)}
              className="text-xs flex items-center gap-1 text-[rgba(251,249,245,0.6)] hover:text-white"
            >
              {copied === "order" ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "order" ? "Copied" : "Copy Python"}
            </button>
          </div>
          <pre className="text-xs font-mono text-[rgba(251,249,245,0.85)] overflow-x-auto p-2 leading-relaxed">
            <code>{createOrderCode}</code>
          </pre>
        </div>

        {/* ECB FX Rates */}
        <div className="card-dark p-6 sm:p-8 bg-[#111111] rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#34d399]" />
              <span className="text-xs font-semibold text-[#fbf9f5]">Zero-Key European Central Bank Rates Pipeline</span>
            </div>
            <button
              onClick={() => copyCode("fx", ecbFxCode)}
              className="text-xs flex items-center gap-1 text-[rgba(251,249,245,0.6)] hover:text-white"
            >
              {copied === "fx" ? <Check className="w-3.5 h-3.5 text-[#34d399]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === "fx" ? "Copied" : "Copy Python"}
            </button>
          </div>
          <pre className="text-xs font-mono text-[rgba(251,249,245,0.85)] overflow-x-auto p-2 leading-relaxed">
            <code>{ecbFxCode}</code>
          </pre>
        </div>
      </section>

      {/* Developer Checklist */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="card p-8 bg-white">
          <h3 className="font-serif text-2xl text-[#111111] mb-4">Fintech Security Standards for Developers</h3>
          <div className="space-y-3 text-xs text-[#555555]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f4d40]" />
              <span>Always pass UUID v4 <code>PayPal-Request-Id</code> to prevent double charging on retry.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f4d40]" />
              <span>Validate PayPal webhook signatures using cert URL and HMAC verification.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0f4d40]" />
              <span>Isolate client secrets in server-side <code>.env</code> files; never expose in Next.js public bundles.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
