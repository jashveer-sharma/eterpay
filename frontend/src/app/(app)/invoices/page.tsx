"use client";
import { useState } from "react";
import Link from "next/link";
import { Receipt, Plus, Download, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { DEMO_INVOICES } from "@/lib/demo-data";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(DEMO_INVOICES);
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState("Venture Studio LLP");
  const [clientEmail, setClientEmail] = useState("billing@venture.llp");
  const [amount, setAmount] = useState("55000");
  const [desc, setDesc] = useState("AI Product Architecture & Security Audit");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = {
      id: `inv_${Date.now()}`,
      number: `INV-2026-${Math.floor(Math.random() * 900 + 100)}`,
      client,
      clientEmail,
      amount: Number(amount),
      currency: "INR",
      status: "pending",
      due: "2026-11-30",
      issued: new Date().toISOString().split("T")[0],
      items: [{ desc, qty: 1, rate: Number(amount), total: Number(amount) }],
    };
    setInvoices([newInv, ...invoices]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Billing Operations</div>
            <h1 className="font-serif text-3xl text-[#111111]">Invoices & Receivables</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-full"
          >
            <Plus className="w-4 h-4 mr-1 inline" /> New Invoice
          </button>
        </div>

        {/* Invoices Table */}
        <div className="card bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbf9f5] text-[#888888] uppercase font-semibold border-b border-[rgba(17,17,17,0.06)]">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Client / Recipient</th>
                  <th className="p-4">Issued</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(17,17,17,0.06)]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#fbf9f5]/60 transition-colors">
                    <td className="p-4 font-mono font-semibold text-[#111111]">{inv.number}</td>
                    <td className="p-4">
                      <div className="font-semibold text-[#111111]">{inv.client}</div>
                      <div className="text-[11px] text-[#888888]">{inv.clientEmail}</div>
                    </td>
                    <td className="p-4 text-[#555555]">{inv.issued}</td>
                    <td className="p-4 text-[#555555]">{inv.due}</td>
                    <td className="p-4">
                      <span
                        className={`capitalize font-semibold text-[10px] px-2 py-0.5 rounded-full ${
                          inv.status === "paid"
                            ? "bg-[#f0fdf4] text-[#16a34a]"
                            : inv.status === "pending"
                            ? "bg-[#fffbeb] text-[#d97706]"
                            : "bg-[#fef2f2] text-[#dc2626]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-serif text-sm font-semibold tabular text-[#111111]">
                      {inv.currency === "INR" ? "₹" : "$"} {inv.amount.toLocaleString("en-IN")} {inv.currency}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => alert(`Invoice ${inv.number} downloaded as PDF (simulation).`)}
                        className="text-[#0f4d40] hover:underline font-semibold"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card p-6 bg-white max-w-lg w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-[#111111]">Generate Tax Invoice</h3>
                <button onClick={() => setShowModal(false)} className="text-[#888888] text-sm">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Client Entity</label>
                    <input
                      type="text"
                      required
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Billing Email</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Item Description</label>
                  <input
                    type="text"
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#555555] mb-1">Total Fee (INR)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input text-xs font-semibold tabular"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1 text-xs py-2.5">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary flex-1 text-xs py-2.5">
                    Create & Issue Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
