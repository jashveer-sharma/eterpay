"use client";
import { useState } from "react";
import Link from "next/link";
import { Link2, Copy, Check, Plus, ExternalLink, QrCode } from "lucide-react";

export default function PaymentLinksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [title, setTitle] = useState("1-on-1 Architecture Consultation");
  const [amount, setAmount] = useState("7500");

  const [links, setLinks] = useState([
    { id: "pl_01", title: "1-on-1 Architecture Consultation", amount: 7500, currency: "INR", url: "https://eterpay.link/pay_arch_01", paidCount: 4, active: true },
    { id: "pl_02", title: "Quarterly Advisory Retainer", amount: 45000, currency: "INR", url: "https://eterpay.link/pay_adv_02", paidCount: 2, active: true },
    { id: "pl_03", title: "Design Sprint Workshop Ticket", amount: 2499, currency: "INR", url: "https://eterpay.link/pay_ds_03", paidCount: 18, active: true },
  ]);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newLink = {
      id: `pl_${Date.now()}`,
      title,
      amount: Number(amount),
      currency: "INR",
      url: `https://eterpay.link/pay_${Date.now().toString().slice(-4)}`,
      paidCount: 0,
      active: true,
    };
    setLinks([newLink, ...links]);
    setCreated(true);
    setTimeout(() => setCreated(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">No-Code Commerce</div>
            <h1 className="font-serif text-3xl text-[#111111]">Payment Links</h1>
          </div>
          <span className="demo-badge">Instant Checkout</span>
        </div>

        {/* Create Link Box */}
        <div className="card p-6 bg-white shadow-xs">
          <h2 className="font-serif text-xl text-[#111111] mb-4">Create Instant Payment Link</h2>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Product / Purpose</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Fixed Price (INR)</label>
              <input
                type="number"
                required
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input text-xs font-semibold tabular"
              />
            </div>
            <button type="submit" className="btn btn-primary text-xs py-2.5">
              <Plus className="w-4 h-4 mr-1 inline" /> Generate Link
            </button>
          </form>
          {created && (
            <p className="text-xs text-[#16a34a] font-semibold mt-3">
              Payment link generated and appended below!
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="card p-6 bg-white shadow-xs">
          <h3 className="font-serif text-xl text-[#111111] mb-4">Active Payment Links</h3>
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="p-4 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#111111]">{link.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#888888]">
                    <span className="font-mono">{link.url}</span>
                    <span>• {link.paidCount} payments collected</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-serif text-base font-semibold text-[#0f4d40] tabular">
                    ₹ {link.amount.toLocaleString("en-IN")}
                  </div>
                  <button
                    onClick={() => handleCopy(link.id, link.url)}
                    className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                  >
                    {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === link.id ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
