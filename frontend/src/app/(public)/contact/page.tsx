"use client";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#fbf9f5] pt-24 pb-20">
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="label-eyebrow mb-2">Get In Touch</div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#111111] mb-4">We are here to assist.</h1>
          <p className="text-sm text-[#555555]">
            Reach out regarding business partnerships, integration support, or developer collaboration.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="card p-6 bg-white">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-xl w-fit mb-3">
                <Mail className="w-5 h-5 text-[#0f4d40]" />
              </div>
              <h3 className="font-semibold text-sm text-[#111111] mb-1">Direct Correspondence</h3>
              <p className="text-xs text-[#666666] mb-3">Questions regarding API keys and sandbox clearance.</p>
              <span className="text-xs font-semibold text-[#0f4d40]">support@eterpay.demo</span>
            </div>

            <div className="card p-6 bg-white">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-xl w-fit mb-3">
                <MessageSquare className="w-5 h-5 text-[#0f4d40]" />
              </div>
              <h3 className="font-semibold text-sm text-[#111111] mb-1">Interactive AI Copilot</h3>
              <p className="text-xs text-[#666666] mb-3">Real-time troubleshooting and routing assistance.</p>
              <Link href="/ai" className="text-xs font-semibold text-[#0f4d40] hover:underline">
                Chat with Assistant →
              </Link>
            </div>

            <div className="card p-6 bg-white">
              <div className="p-3 bg-[rgba(15,77,64,0.06)] rounded-xl w-fit mb-3">
                <MapPin className="w-5 h-5 text-[#0f4d40]" />
              </div>
              <h3 className="font-semibold text-sm text-[#111111] mb-1">Global Engineering HQ</h3>
              <p className="text-xs text-[#666666]">Universal Protocol Interoperability Group</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 bg-white">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#111111] mb-2">Message Dispatched (Simulation)</h3>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto mb-6">
                    Thank you for reaching out. In this interactive demonstration, your submission has been logged into the event audit telemetry.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary text-xs px-6 py-2.5">
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl text-[#111111] mb-2">Send an inquiry</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input text-sm"
                        placeholder="Alex Rivera"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input text-sm"
                        placeholder="alex@domain.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Topic of Interest</label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="input text-sm"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="business">Merchant Solutions & Invoicing</option>
                      <option value="developer">PayPal API & Webhooks Integration</option>
                      <option value="press">Partnership & Investor Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#555555] mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input text-sm"
                      placeholder="Detail your inquiry or integration use-case..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 text-sm">
                    Submit Inquiry <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
