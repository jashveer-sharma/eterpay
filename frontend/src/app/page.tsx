"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export default function DashboardPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Welcome to **EterPay**. I am your cross-border financial copilot. Try asking me:\n• *'I am traveling to Tokyo with ₹1,50,000. Help me plan my budget.'*\n• *'Find me a universal travel adapter under ₹2,000.'*\n• *'Filter my transactions by Travel category.'*"
    }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "grid" | "commerce" | "invest">("overview");
  const [actionProposal, setActionProposal] = useState<{
    title: string;
    description: string;
    amount: number;
    currency: string;
    merchant: string;
    requires_approval: boolean;
  } | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  // Quick Action Handler
  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
    sendMessage(promptText);
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");

    // Simulate conversational AI response & tool proposal
    const lower = textToSend.toLowerCase();

    if (lower.includes("japan") || lower.includes("tokyo")) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "🗼 **Tokyo Travel Budget Prepared!**\n\n• **Budget:** ₹1,50,000 INR ≈ **¥273,000 JPY** (Rate: 1 INR = 1.82 JPY)\n• **Allocation:**\n  - 🏨 Hotel: ¥109,200 (40%)\n  - 🍜 Dining: ¥81,900 (30%)\n  - 🚅 JR Transit: ¥40,950 (15%)\n  - 🛡️ Buffer: ¥40,950 (15%)\n\n💡 *Tip: Avoid Dynamic Currency Conversion (DCC) at Japanese ATMs to save 4.5% in bank spreads.*"
          }
        ]);
        setActiveTab("grid");
      }, 600);
    } else if (lower.includes("adapter") || lower.includes("buy") || lower.includes("shop")) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "🔍 **Channel3 Product Search:** Found **Anker Universal Global Travel Adapter** with Japanese Type A pins for **₹1,499 INR ($17.80 USD)**.\n\nI have generated your PayPal Sandbox checkout authorization card below."
          }
        ]);
        setActionProposal({
          title: "Approve Purchase via PayPal",
          description: "Anker Universal Travel Adapter (Type A Pins)",
          amount: 17.80,
          currency: "USD",
          merchant: "Anker Direct Store",
          requires_approval: true
        });
        setIsApproved(false);
        setActiveTab("commerce");
      }, 600);
    } else {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "💱 **Live ECB Rate Conversion:**\n• **₹10,000 INR** = **$118.80 USD** (Rate: 0.01188)\n• Traditional Bank Fee: ₹420.00 | EterPay Fee: ₹40.00\n• **Net Savings: ₹380.00 (90% lower markup)**"
          }
        ]);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#090A0F] text-white">
      {/* 1. Header Ticker */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#181C28] bg-[#0D0F17]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00E676] flex items-center justify-center font-black text-black text-lg">
            E
          </div>
          <span className="font-bold text-xl tracking-wide">ETERPAY</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#16201A] border border-[#00E676]/30 text-[#00E676] font-mono">
            SANDBOX MODE
          </span>
        </div>

        {/* Live Rates Ticker */}
        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-[#8B949E]">
          <div>INR/USD: <span className="text-white font-bold">0.0119</span> <span className="text-[#00E676]">+0.4%</span></div>
          <div>INR/EUR: <span className="text-white font-bold">0.0110</span> <span className="text-[#00E676]">+0.2%</span></div>
          <div>INR/JPY: <span className="text-white font-bold">1.8240</span> <span className="text-[#00B0FF]">-0.1%</span></div>
          <div className="text-[10px] text-[#555E6D]">Source: European Central Bank (Frankfurter)</div>
        </div>
      </header>

      {/* 2. Main Two-Column Cockpit */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Conversational AI Copilot (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-[#181C28] bg-[#0D0F17]/60">
          <div className="p-4 border-b border-[#181C28] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00E676]" />
              <h2 className="font-semibold text-sm">EterPay AI Copilot</h2>
            </div>
            <span className="text-xs text-[#00E676] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span> Gemini 1.5 Flash
            </span>
          </div>

          {/* Quick Action Pills */}
          <div className="p-3 border-b border-[#181C28]/60 flex gap-2 overflow-x-auto text-xs">
            <button 
              onClick={() => handleQuickPrompt("I'm traveling to Tokyo with ₹1,50,000. Help me plan my money.")}
              className="px-3 py-1.5 rounded-full bg-[#181C28] hover:bg-[#202636] text-[#A0AEC0] whitespace-nowrap transition"
            >
              🇯🇵 Plan Tokyo Trip
            </button>
            <button 
              onClick={() => handleQuickPrompt("Find me a universal travel adapter under ₹2,000.")}
              className="px-3 py-1.5 rounded-full bg-[#181C28] hover:bg-[#202636] text-[#A0AEC0] whitespace-nowrap transition"
            >
              🔌 Shop Travel Adapter
            </button>
            <button 
              onClick={() => handleQuickPrompt("Filter my transactions by Travel category.")}
              className="px-3 py-1.5 rounded-full bg-[#181C28] hover:bg-[#202636] text-[#A0AEC0] whitespace-nowrap transition"
            >
              📊 Filter AG Grid
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#181C28] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#00E676]" />
                  </div>
                )}
                <div 
                  className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                    m.role === 'user' 
                      ? 'bg-[#00E676] text-black font-medium' 
                      : 'bg-[#141724] border border-[#202638] text-[#E0E6ED]'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Action Proposal Card (Human Approval Gate) */}
            {actionProposal && (
              <div className="p-4 rounded-xl border border-[#00E676]/40 bg-[#101915] text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#00E676] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> DETERMINISTIC PAYMENT GATE
                  </span>
                  <span className="text-[10px] text-[#A0AEC0]">Explicit Human Approval Required</span>
                </div>
                <div className="text-sm font-semibold text-white">{actionProposal.title}</div>
                <div className="text-xs text-[#A0AEC0]">{actionProposal.description}</div>
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-[#181C28]">
                  <span>Merchant: <strong className="text-white">{actionProposal.merchant}</strong></span>
                  <span>Amount: <strong className="text-[#00E676] text-sm">${actionProposal.amount.toFixed(2)} {actionProposal.currency}</strong></span>
                </div>

                {!isApproved ? (
                  <button 
                    onClick={() => {
                      setIsApproved(true);
                      setMessages(prev => [
                        ...prev,
                        {
                          role: "assistant",
                          content: "✅ **Payment Captured via PayPal Sandbox!**\n• Order ID: `8AB12345CD67890`\n• Capture ID: `CAP-987654321`\n• Transaction committed to AG Grid audit ledger.\n• Remaining trip budget updated to: **₹1,48,501 INR**."
                        }
                      ]);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#00E676] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#00C853] transition shadow-lg shadow-[#00E676]/20"
                  >
                    <span>Approve & Pay with PayPal Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-2 rounded bg-[#00E676]/10 border border-[#00E676] text-[#00E676] text-center font-bold">
                    ✓ Transaction Captured & Logged to Ledger
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-[#181C28] bg-[#090A0F]">
            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex gap-2"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask EterPay to plan a trip, compare FX, or prepare checkout..."
                className="flex-1 bg-[#121520] border border-[#202638] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
              />
              <button 
                type="submit"
                className="p-2.5 bg-[#00E676] text-black rounded-lg hover:bg-[#00C853] transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Terminal, Grids & Commerce (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-[#090A0F] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#181C28] px-6 pt-3 bg-[#0D0F17]/40 gap-6 text-xs">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`pb-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "overview" 
                  ? "border-[#00E676] text-[#00E676]" 
                  : "border-transparent text-[#8B949E] hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4" /> Multi-Currency Terminal
            </button>
            <button 
              onClick={() => setActiveTab("grid")}
              className={`pb-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "grid" 
                  ? "border-[#00E676] text-[#00E676]" 
                  : "border-transparent text-[#8B949E] hover:text-white"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> AG Grid Ledger
            </button>
            <button 
              onClick={() => setActiveTab("commerce")}
              className={`pb-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "commerce" 
                  ? "border-[#00E676] text-[#00E676]" 
                  : "border-transparent text-[#8B949E] hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Agentic Commerce (Channel3)
            </button>
            <button 
              onClick={() => setActiveTab("invest")}
              className={`pb-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === "invest" 
                  ? "border-[#00E676] text-[#00E676]" 
                  : "border-transparent text-[#8B949E] hover:text-white"
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Simulated Invest & Risk
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 space-y-6">
            {/* 1. Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                    <div className="text-xs text-[#8B949E]">Total Available Worth</div>
                    <div className="text-2xl font-bold mt-1 text-white">₹1,50,000 <span className="text-xs text-[#8B949E]">INR</span></div>
                    <div className="text-xs text-[#00E676] mt-2">≈ $1,782.00 USD</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                    <div className="text-xs text-[#8B949E]">Estimated Travel Allocation</div>
                    <div className="text-2xl font-bold mt-1 text-[#00B0FF]">¥273,000 <span className="text-xs text-[#8B949E]">JPY</span></div>
                    <div className="text-xs text-[#A0AEC0] mt-2">7 Days Tokyo Trip Budget</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                    <div className="text-xs text-[#8B949E]">Total FX Spread Saved</div>
                    <div className="text-2xl font-bold mt-1 text-[#00E676]">₹5,700 <span className="text-xs text-[#8B949E]">INR</span></div>
                    <div className="text-xs text-[#A0AEC0] mt-2">vs. Standard 4.5% Bank Markup</div>
                  </div>
                </div>

                {/* AG Grid Mock Preview for Fast Visualization */}
                <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Multi-Currency Balances & 7-Day Sparklines (AG Grid)</h3>
                    <span className="text-xs text-[#00E676] font-mono">Live Feed Connected</span>
                  </div>
                  <div className="divide-y divide-[#181C28] text-xs">
                    <div className="grid grid-cols-5 py-2 font-mono text-[#8B949E]">
                      <span>CURRENCY</span>
                      <span>BALANCE</span>
                      <span>RATE (ECB)</span>
                      <span>24H DELTA</span>
                      <span>SPARKLINE</span>
                    </div>
                    <div className="grid grid-cols-5 py-3 items-center">
                      <span className="font-bold text-white flex items-center gap-1.5">🇮🇳 INR</span>
                      <span>₹75,000.00</span>
                      <span>1.0000</span>
                      <span className="text-[#8B949E]">0.0%</span>
                      <span className="text-[#00E676] font-mono">───────</span>
                    </div>
                    <div className="grid grid-cols-5 py-3 items-center">
                      <span className="font-bold text-white flex items-center gap-1.5">🇺🇸 USD</span>
                      <span>$535.00</span>
                      <span>0.0119</span>
                      <span className="text-[#00E676]">+0.4%</span>
                      <span className="text-[#00E676] font-mono">──↗───</span>
                    </div>
                    <div className="grid grid-cols-5 py-3 items-center">
                      <span className="font-bold text-white flex items-center gap-1.5">🇯🇵 JPY</span>
                      <span>¥54,600.00</span>
                      <span>1.8240</span>
                      <span className="text-[#FF1744]">-0.1%</span>
                      <span className="text-[#FF1744] font-mono">──↘───</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Commerce Tab */}
            {activeTab === "commerce" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#00E676]" /> Travel Essentials (Channel3 API)
                  </h3>
                  <span className="text-xs text-[#A0AEC0]">Universal Product Graph (100M+ Products)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3">
                    <div className="w-full h-32 rounded-lg bg-[#181C28] flex items-center justify-center text-4xl">
                      🔌
                    </div>
                    <div className="font-semibold text-xs text-white">Anker Universal Travel Adapter</div>
                    <div className="text-xs text-[#8B949E]">Type A, C, G with Dual USB-C Fast Charge</div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-[#00E676] text-sm">₹1,499 INR</span>
                      <span className="text-[10px] text-[#A0AEC0]">$17.80 USD</span>
                    </div>
                    <button 
                      onClick={() => handleQuickPrompt("Find me a universal travel adapter under ₹2,000.")}
                      className="w-full py-2 rounded bg-[#181C28] hover:bg-[#00E676] hover:text-black font-semibold text-xs transition"
                    >
                      Prepare Checkout
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3 opacity-60">
                    <div className="w-full h-32 rounded-lg bg-[#181C28] flex items-center justify-center text-4xl">
                      ⚖️
                    </div>
                    <div className="font-semibold text-xs text-white">Samsonite Luggage Scale</div>
                    <div className="text-xs text-[#8B949E]">Digital Precision up to 50kg</div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-white text-sm">₹1,899 INR</span>
                    </div>
                    <button disabled className="w-full py-2 rounded bg-[#181C28] text-xs">Available via Search</button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3 opacity-60">
                    <div className="w-full h-32 rounded-lg bg-[#181C28] flex items-center justify-center text-4xl">
                      📶
                    </div>
                    <div className="font-semibold text-xs text-white">Airalo Japan eSIM 10GB</div>
                    <div className="text-xs text-[#8B949E]">High-speed 5G across Japan</div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-white text-sm">₹1,250 INR</span>
                    </div>
                    <button disabled className="w-full py-2 rounded bg-[#181C28] text-xs">Available via Search</button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Invest Tab */}
            {activeTab === "invest" && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span><strong>Simulated Portfolio:</strong> For educational & scenario stress-testing only. No real capital at risk. Complies with RBI FEMA boundaries.</span>
                </div>
                <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-4">
                  <h3 className="font-bold text-sm text-white">Macro FX Stress-Test Simulator</h3>
                  <p className="text-xs text-[#8B949E]">
                    Simulate how macro shocks affect your foreign exchange holdings before traveling.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Simulate JPY Shock: -5.0%</span>
                      <span className="text-[#FF1744] font-mono">-₹1,500 INR Impact</span>
                    </div>
                    <input type="range" min="-20" max="20" defaultValue="-5" className="w-full accent-[#00E676]" />
                  </div>
                </div>
              </div>
            )}

            {/* 4. AG Grid Ledger Tab */}
            {activeTab === "grid" && (
              <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Transaction Audit Ledger (AG Grid)</h3>
                  <span className="text-xs text-[#00E676]">Auto-Filter: Travel Expenses</span>
                </div>
                <div className="divide-y divide-[#181C28] text-xs">
                  <div className="grid grid-cols-5 py-2 font-mono text-[#8B949E]">
                    <span>ORDER ID</span>
                    <span>DESCRIPTION</span>
                    <span>CATEGORY</span>
                    <span>AMOUNT</span>
                    <span>STATUS</span>
                  </div>
                  <div className="grid grid-cols-5 py-3 items-center">
                    <span className="font-mono text-[#A0AEC0]">8AB12345CD67</span>
                    <span>Anker Travel Adapter</span>
                    <span><span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-400">Travel</span></span>
                    <span className="font-bold text-white">$17.80 USD</span>
                    <span><span className="px-2 py-0.5 rounded bg-[#00E676]/20 text-[#00E676]">COMPLETED</span></span>
                  </div>
                  <div className="grid grid-cols-5 py-3 items-center">
                    <span className="font-mono text-[#A0AEC0]">7XY98765LK12</span>
                    <span>Tokyo Metro Pass</span>
                    <span><span className="px-2 py-0.5 rounded bg-blue-900/30 text-blue-400">Travel</span></span>
                    <span className="font-bold text-white">¥8,500 JPY</span>
                    <span><span className="px-2 py-0.5 rounded bg-[#00E676]/20 text-[#00E676]">COMPLETED</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
