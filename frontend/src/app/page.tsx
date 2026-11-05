"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Loader2,
  Star,
  CheckCircle2,
  XCircle,
  Calculator,
} from "lucide-react";

// ─── AG Grid Community ─────────────────────────────────────────────────────────
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry, CommunityFeaturesModule, ColDef } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

// ─── PayPal ────────────────────────────────────────────────────────────────────
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

ModuleRegistry.registerModules([CommunityFeaturesModule]);

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ActionProposal {
  type: string;
  title: string;
  description: string;
  amount: number | null;
  currency: string | null;
  merchant: string | null;
  requires_approval: boolean;
}

interface Product {
  id: string;
  title: string;
  price_inr: number;
  price_usd: number;
  image_url: string;
  rating: number;
  retailer: string;
}

interface PortfolioItem {
  currency: string;
  allocation_pct: number;
  units: number;
  value_inr: number;
  unrealized_pnl_pct: number;
  sparkline: number[];
}

interface FxRate {
  currency: string;
  rate: number;
  flag: string;
}

interface LedgerRow {
  orderId: string;
  description: string;
  category: string;
  amount: string;
  currency: string;
  status: string;
  timestamp: string;
}

const API_BASE = "http://localhost:8000";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", JPY: "🇯🇵", GBP: "🇬🇧",
  AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳",
  INR: "🇮🇳",
};

// Mini sparkline renderer using SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return <span className="text-[#555]">─</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 60, H = 20;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");
  return (
    <svg width={W} height={H} className="inline-block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// Status badge renderer
function StatusBadge({ value }: { value: string }) {
  const isOk = value === "COMPLETED" || value === "CAPTURED";
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
        isOk ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"
      }`}
    >
      {value}
    </span>
  );
}

export default function DashboardPage() {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to **EterPay** — your AI cross-border financial copilot.\n\nTry asking:\n• *\"I'm traveling to Tokyo with ₹1,50,000. Help me plan my budget.\"*\n• *\"Find me a universal travel adapter.\"*\n• *\"Filter my transactions by Travel category.\"*\n• *\"Convert 50,000 INR to EUR.\"*",
    },
  ]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "grid" | "commerce" | "invest">("overview");
  const [actionProposal, setActionProposal] = useState<ActionProposal | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [paypalCapture, setPaypalCapture] = useState<{ id: string; status: string } | null>(null);

  // Live data
  const [fxRates, setFxRates] = useState<FxRate[]>([]);
  const [fxDate, setFxDate] = useState<string>("");
  const [fxLoading, setFxLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [portfolioDisclaimer, setPortfolioDisclaimer] = useState("");
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ledgerRows, setLedgerRows] = useState<LedgerRow[]>([
    { orderId: "8AB12345CD67", description: "Tokyo Metro Pass", category: "Travel", amount: "¥8,500", currency: "JPY", status: "COMPLETED", timestamp: "2026-11-05 10:12" },
    { orderId: "7XY98765LK12", description: "Airalo Japan eSIM 10GB", category: "Travel", amount: "₹1,250", currency: "INR", status: "COMPLETED", timestamp: "2026-11-05 09:48" },
    { orderId: "3MN54321QW99", description: "Ramen Dinner – Ichiran", category: "Dining", amount: "¥1,200", currency: "JPY", status: "COMPLETED", timestamp: "2026-11-04 20:30" },
  ]);
  const [gridFilter, setGridFilter] = useState<{ column: string; value: string } | null>(null);

  // Interactive controls
  const [shockPct, setShockPct] = useState<number>(-5);
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcTarget, setCalcTarget] = useState<string>("USD");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  // ─── Load Live Data ─────────────────────────────────────────────────────────
  const loadFxRates = useCallback(async () => {
    setFxLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/currency/rates?base=INR`);
      const data = await res.json();
      const rates: FxRate[] = Object.entries(data.rates as Record<string, number>).map(
        ([currency, rate]) => ({
          currency,
          rate,
          flag: CURRENCY_FLAGS[currency] || "🌐",
        })
      );
      setFxRates(rates);
      setFxDate(data.date || "");
    } catch {
      // keep empty
    } finally {
      setFxLoading(false);
    }
  }, []);

  const loadPortfolio = useCallback(async () => {
    setPortfolioLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/invest/portfolio`);
      const data = await res.json();
      setPortfolio(data.items || []);
      setPortfolioDisclaimer(data.simulation_disclaimer || "");
    } catch {
      /* keep empty */
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/commerce/search?q=travel`);
      const data = await res.json();
      setProducts(data.value || (Array.isArray(data) ? data : []));
    } catch {
      /* keep empty */
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFxRates();
    loadPortfolio();
    loadProducts();
  }, [loadFxRates, loadPortfolio, loadProducts]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Apply AG Grid filter from AI
  useEffect(() => {
    if (gridFilter && gridRef.current?.api) {
      const model: Record<string, { type: string; filter: string }> = {};
      model[gridFilter.column] = { type: "contains", filter: gridFilter.value };
      gridRef.current.api.setFilterModel(model);
      setActiveTab("grid");
    }
  }, [gridFilter]);

  // ─── Chat ────────────────────────────────────────────────────────────────────
  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : input;
    if (!textToSend.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "I could not process that request." },
      ]);

      if (data.action_proposal) {
        setActionProposal(data.action_proposal);
        setPaypalOrderId(null);
        setPaypalCapture(null);
      }

      if (data.grid_filter) {
        setGridFilter(data.grid_filter);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error — is the backend running on port 8000?" },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText);
  };

  // ─── PayPal Integration ──────────────────────────────────────────────────────
  const createOrder = async () => {
    if (!actionProposal?.amount || !actionProposal?.currency) {
      return "mock-order-id";
    }
    try {
      const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: actionProposal.amount,
          currency: actionProposal.currency,
          description: actionProposal.description,
        }),
      });
      const data = await res.json();
      setPaypalOrderId(data.id || data.order_id);
      return (data.id || data.order_id) as string;
    } catch {
      return "error";
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/paypal/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: data.orderID }),
      });
      const capture = await res.json();
      setPaypalCapture({ id: data.orderID, status: capture.status || "CAPTURED" });

      // Add to ledger
      const newRow: LedgerRow = {
        orderId: data.orderID.slice(0, 12),
        description: actionProposal?.description || "PayPal Purchase",
        category: "Commerce",
        amount: `$${actionProposal?.amount?.toFixed(2) || "0.00"}`,
        currency: actionProposal?.currency || "USD",
        status: "CAPTURED",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      };
      setLedgerRows((prev) => [newRow, ...prev]);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ **Payment Captured!**\n• Order: \`${data.orderID.slice(0, 14)}\`\n• Status: CAPTURED\n• Transaction logged to AG Grid ledger automatically.`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Capture failed. Please check the backend logs." },
      ]);
    }
  };

  // ─── AG Grid Column Defs ──────────────────────────────────────────────────
  const ledgerColDefs: ColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 130, cellStyle: { fontFamily: "monospace", color: "#A0AEC0" } },
    { field: "description", headerName: "Description", flex: 1, filter: "agTextColumnFilter" },
    {
      field: "category", headerName: "Category", width: 110,
      filter: "agTextColumnFilter",
      cellRenderer: (params: { value: string }) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900/30 text-blue-400">
          {params.value}
        </span>
      ),
    },
    { field: "amount", headerName: "Amount", width: 110, cellStyle: { fontWeight: "bold", color: "#fff" } },
    { field: "currency", headerName: "CCY", width: 70, cellStyle: { color: "#8B949E" } },
    {
      field: "status", headerName: "Status", width: 110,
      cellRenderer: (params: { value: string }) => <StatusBadge value={params.value} />,
    },
    { field: "timestamp", headerName: "Time", width: 130, cellStyle: { color: "#8B949E", fontSize: "11px" } },
  ];

  const selectedRate = fxRates.find((r) => r.currency === calcTarget)?.rate || 0.0119;
  const calcResult = (calcAmount * selectedRate).toFixed(2);
  const shockImpactInr = Math.round((30000 * shockPct) / 100);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="flex flex-col h-screen bg-[#090A0F] text-white overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[#181C28] bg-[#0D0F17] shrink-0">
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
          <div className="hidden md:flex items-center gap-5 text-xs font-mono text-[#8B949E]">
            {fxLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-[#555]" />
            ) : (
              fxRates.slice(0, 4).map((r) => (
                <div key={r.currency}>
                  {r.flag} INR/{r.currency}:{" "}
                  <span className="text-white font-bold">{r.rate.toFixed(4)}</span>
                </div>
              ))
            )}
            {fxDate && <div className="text-[10px] text-[#555E6D]">ECB · {fxDate}</div>}
            <button onClick={loadFxRates} className="text-[#555E6D] hover:text-white transition">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* ── Two-Column Cockpit ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* ══ Left: AI Copilot (5 cols) ══ */}
          <div className="lg:col-span-5 flex flex-col border-r border-[#181C28] bg-[#0D0F17]/60 overflow-hidden">
            <div className="p-4 border-b border-[#181C28] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#00E676]" />
                <h2 className="font-semibold text-sm">EterPay AI Copilot</h2>
              </div>
              <span className="text-xs text-[#00E676] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                Gemini 1.5 Flash
              </span>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b border-[#181C28]/60 flex gap-2 overflow-x-auto text-xs shrink-0">
              {[
                { label: "🇯🇵 Plan Tokyo Trip", prompt: "I'm traveling to Tokyo with ₹1,50,000. Help me plan my budget." },
                { label: "🔌 Shop Adapter", prompt: "Find me a universal travel adapter." },
                { label: "📊 Filter Ledger", prompt: "Filter my transactions by Travel category." },
                { label: "💱 Convert INR→EUR", prompt: "Convert 50000 INR to EUR." },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuickPrompt(q.prompt)}
                  className="px-3 py-1.5 rounded-full bg-[#181C28] hover:bg-[#202636] text-[#A0AEC0] whitespace-nowrap transition"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Chat Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-[#181C28] flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-[#00E676]" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-[#00E676] text-black font-medium"
                        : "bg-[#141724] border border-[#202638] text-[#E0E6ED]"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#181C28] flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 text-[#00E676] animate-spin" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#141724] border border-[#202638] text-[#8B949E] text-xs">
                    Thinking…
                  </div>
                </div>
              )}

              {/* ── Deterministic Payment Gate ── */}
              {actionProposal && actionProposal.requires_approval && !paypalCapture && (
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
                    {actionProposal.merchant && (
                      <span>
                        Merchant: <strong className="text-white">{actionProposal.merchant}</strong>
                      </span>
                    )}
                    {actionProposal.amount && (
                      <span>
                        Amount:{" "}
                        <strong className="text-[#00E676] text-sm">
                          ${actionProposal.amount.toFixed(2)} {actionProposal.currency}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Real PayPal Buttons */}
                  <PayPalButtons
                    style={{ layout: "horizontal", color: "gold", shape: "rect", label: "pay", height: 36 }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={() =>
                      setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: "⚠️ PayPal error. Try the sandbox flow again." },
                      ])
                    }
                  />
                  <div className="text-[10px] text-[#555E6D] text-center">
                    PayPal Sandbox · No real money charged · AI intent validated by backend
                  </div>
                </div>
              )}

              {paypalCapture && (
                <div className="p-3 rounded-xl border border-[#00E676] bg-[#00E676]/10 text-xs flex items-center gap-2 text-[#00E676] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Transaction Captured · Order {paypalCapture.id.slice(0, 12)} · {paypalCapture.status}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[#181C28] bg-[#090A0F] shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask EterPay to plan a trip, compare FX, or prepare checkout…"
                  className="flex-1 bg-[#121520] border border-[#202638] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading}
                  className="p-2.5 bg-[#00E676] text-black rounded-lg hover:bg-[#00C853] transition disabled:opacity-50"
                >
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* ══ Right: Terminal (7 cols) ══ */}
          <div className="lg:col-span-7 flex flex-col bg-[#090A0F] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#181C28] px-6 pt-3 bg-[#0D0F17]/40 gap-6 text-xs shrink-0">
              {([
                { id: "overview", icon: Globe, label: "FX Terminal" },
                { id: "grid", icon: TrendingUp, label: "AG Grid Ledger" },
                { id: "commerce", icon: ShoppingBag, label: "Agentic Commerce" },
                { id: "invest", icon: AlertTriangle, label: "Simulated Invest" },
              ] as const).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`pb-3 font-semibold transition border-b-2 flex items-center gap-2 ${
                    activeTab === id
                      ? "border-[#00E676] text-[#00E676]"
                      : "border-transparent text-[#8B949E] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ── 1. FX Terminal Tab ── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                      <div className="text-xs text-[#8B949E]">Simulated Balance</div>
                      <div className="text-2xl font-bold mt-1 text-white">₹1,50,000 <span className="text-xs text-[#8B949E]">INR</span></div>
                      <div className="text-xs text-[#00E676] mt-2">
                        ≈ ${fxRates.find(r => r.currency === "USD") ? (150000 * (fxRates.find(r => r.currency === "USD")!.rate)).toFixed(2) : "..."} USD
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                      <div className="text-xs text-[#8B949E]">Tokyo Travel (JPY)</div>
                      <div className="text-2xl font-bold mt-1 text-[#00B0FF]">
                        ¥{fxRates.find(r => r.currency === "JPY") ? Math.round(150000 * (fxRates.find(r => r.currency === "JPY")!.rate)).toLocaleString() : "..."} <span className="text-xs text-[#8B949E]">JPY</span>
                      </div>
                      <div className="text-xs text-[#A0AEC0] mt-2">Live ECB rate</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28]">
                      <div className="text-xs text-[#8B949E]">FX Spread Saved</div>
                      <div className="text-2xl font-bold mt-1 text-[#00E676]">₹5,700 <span className="text-xs text-[#8B949E]">INR</span></div>
                      <div className="text-xs text-[#A0AEC0] mt-2">vs. Standard 4.5% bank markup</div>
                    </div>
                  </div>

                  {/* Interactive Currency Converter */}
                  <div className="p-4 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-[#00E676]" /> Live ECB Currency Calculator
                      </h3>
                      <span className="text-[10px] text-[#00E676] font-mono">Real-time ECB Reference</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="text-[10px] text-[#8B949E] block mb-1">Source Amount (INR)</label>
                        <input
                          type="number"
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                          className="w-full bg-[#121520] border border-[#202638] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#8B949E] block mb-1">Target Currency</label>
                        <select
                          value={calcTarget}
                          onChange={(e) => setCalcTarget(e.target.value)}
                          className="w-full bg-[#121520] border border-[#202638] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                        >
                          {fxRates.map((r) => (
                            <option key={r.currency} value={r.currency}>
                              {r.flag} {r.currency}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 p-3 rounded-lg bg-[#090A0F] border border-[#181C28] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#8B949E]">Converted Result</div>
                          <div className="text-lg font-bold text-[#00E676]">
                            {Number(calcResult).toLocaleString()} {calcTarget}
                          </div>
                        </div>
                        <div className="text-right text-[10px] text-[#8B949E]">
                          <div>Rate: {selectedRate.toFixed(4)}</div>
                          <div className="text-[#00B0FF]">Est. Bank Markup Saved: ₹{(calcAmount * 0.045).toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live FX Rate Table */}
                  <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white">Live FX Rates (INR base · European Central Bank)</h3>
                      <span className="text-xs text-[#00E676] font-mono flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                        {fxDate ? `Updated ${fxDate}` : "Connecting…"}
                      </span>
                    </div>
                    {fxLoading ? (
                      <div className="flex items-center gap-2 text-xs text-[#555]">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading ECB rates…
                      </div>
                    ) : (
                      <div className="divide-y divide-[#181C28] text-xs">
                        <div className="grid grid-cols-4 py-2 font-mono text-[#8B949E]">
                          <span>CURRENCY</span>
                          <span>1 INR =</span>
                          <span>₹1,50,000 =</span>
                          <span>TREND</span>
                        </div>
                        {fxRates.map((r) => (
                          <div key={r.currency} className="grid grid-cols-4 py-3 items-center">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              {r.flag} {r.currency}
                            </span>
                            <span className="font-mono text-[#E0E6ED]">{r.rate.toFixed(4)}</span>
                            <span className="font-bold text-[#00E676]">
                              {(150000 * r.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {r.currency}
                            </span>
                            <span className="text-[#555E6D] font-mono">────</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── 2. AG Grid Ledger Tab ── */}
              {activeTab === "grid" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#00E676]" />
                        Transaction Audit Ledger (AG Grid Community)
                      </h3>
                      {/* Quick Filter Pills */}
                      <div className="hidden sm:flex items-center gap-1">
                        {["ALL", "Travel", "Dining", "Commerce"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              if (cat === "ALL") {
                                setGridFilter(null);
                                gridRef.current?.api?.setFilterModel(null);
                              } else {
                                setGridFilter({ column: "category", value: cat });
                                const model: Record<string, { type: string; filter: string }> = {
                                  category: { type: "contains", filter: cat },
                                };
                                gridRef.current?.api?.setFilterModel(model);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] transition ${
                              (!gridFilter && cat === "ALL") || gridFilter?.value === cat
                                ? "bg-[#00E676] text-black font-bold"
                                : "bg-[#181C28] text-[#8B949E] hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {gridFilter && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#00E676] font-mono">
                          Filter: {gridFilter.column} = &quot;{gridFilter.value}&quot;
                        </span>
                        <button
                          onClick={() => {
                            setGridFilter(null);
                            gridRef.current?.api?.setFilterModel(null);
                          }}
                          className="text-[#555E6D] hover:text-white"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="ag-theme-alpine-dark rounded-xl overflow-hidden border border-[#181C28]"
                    style={{ height: 380 }}
                  >
                    <AgGridReact
                      ref={gridRef}
                      rowData={ledgerRows}
                      columnDefs={ledgerColDefs}
                      defaultColDef={{ sortable: true, resizable: true, filter: true }}
                      pagination={true}
                      paginationPageSize={8}
                      rowHeight={40}
                      headerHeight={36}
                      suppressCellFocus={true}
                    />
                  </div>
                  <div className="text-[10px] text-[#555E6D]">
                    AG Grid Community · Client-side filtering · AI-driven column filters via /api/chat
                  </div>
                </div>
              )}

              {/* ── 3. Commerce Tab ── */}
              {activeTab === "commerce" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#00E676]" /> Travel Essentials (Channel3 API)
                    </h3>
                    <span className="text-xs text-[#A0AEC0]">AI-curated for your trip</span>
                  </div>

                  {productsLoading ? (
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading products…
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {products.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl bg-[#10121A] border border-[#181C28] space-y-3 hover:border-[#00E676]/30 transition">
                          <div className="w-full h-28 rounded-lg bg-[#181C28] overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                          </div>
                          <div className="font-semibold text-xs text-white leading-tight">{p.title}</div>
                          <div className="flex items-center gap-1 text-[10px] text-[#FFD600]">
                            <Star className="w-3 h-3 fill-current" /> {p.rating} · {p.retailer}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-bold text-[#00E676] text-sm">₹{p.price_inr.toLocaleString()}</span>
                            <span className="text-[10px] text-[#A0AEC0]">${p.price_usd} USD</span>
                          </div>
                          <button
                            onClick={() => handleQuickPrompt(`Buy the ${p.title} for $${p.price_usd}`)}
                            className="w-full py-2 rounded bg-[#181C28] hover:bg-[#00E676] hover:text-black font-semibold text-xs transition flex items-center justify-center gap-1"
                          >
                            Prepare PayPal Checkout <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── 4. Invest/Simulate Tab ── */}
              {activeTab === "invest" && (
                <div className="space-y-4">
                  {/* Mandatory disclaimer */}
                  <div className="p-3 rounded-lg bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      <strong>Simulated Portfolio — Educational Only — No Capital at Risk.</strong>{" "}
                      {portfolioDisclaimer}
                    </span>
                  </div>

                  {portfolioLoading ? (
                    <div className="flex items-center gap-2 text-xs text-[#555]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading portfolio…
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-4">
                      <h3 className="font-bold text-sm text-white">Currency Portfolio Simulator</h3>
                      <div className="divide-y divide-[#181C28] text-xs">
                        <div className="grid grid-cols-5 py-2 font-mono text-[#8B949E]">
                          <span>CURRENCY</span>
                          <span>ALLOC %</span>
                          <span>VALUE INR</span>
                          <span>P&amp;L %</span>
                          <span>7-DAY TREND</span>
                        </div>
                        {portfolio.map((item) => (
                          <div key={item.currency} className="grid grid-cols-5 py-3 items-center">
                            <span className="font-bold text-white flex items-center gap-1">
                              {CURRENCY_FLAGS[item.currency] || "🌐"} {item.currency}
                            </span>
                            <span className="text-[#A0AEC0]">{item.allocation_pct}%</span>
                            <span className="text-white">₹{item.value_inr.toLocaleString()}</span>
                            <span className={item.unrealized_pnl_pct >= 0 ? "text-[#00E676]" : "text-[#FF1744]"}>
                              {item.unrealized_pnl_pct >= 0 ? "+" : ""}{item.unrealized_pnl_pct}%
                            </span>
                            <Sparkline
                              data={item.sparkline}
                              color={item.unrealized_pnl_pct >= 0 ? "#00E676" : "#FF1744"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stress Test Slider */}
                  <div className="p-5 rounded-xl bg-[#10121A] border border-[#181C28] space-y-4">
                    <h3 className="font-bold text-sm text-white">Macro FX Stress-Test Simulator</h3>
                    <p className="text-xs text-[#8B949E]">
                      Simulate how macro shocks affect your foreign exchange holdings before traveling.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Simulate JPY Shock: {shockPct > 0 ? "+" : ""}{shockPct}.0%</span>
                        <span className={`font-mono font-bold ${shockImpactInr >= 0 ? "text-[#00E676]" : "text-[#FF1744]"}`}>
                          {shockImpactInr >= 0 ? "+" : ""}₹{shockImpactInr.toLocaleString()} INR Impact
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shockPct}
                        onChange={(e) => setShockPct(Number(e.target.value))}
                        className="w-full accent-[#00E676]"
                      />
                    </div>
                    <div className="text-[10px] text-[#555E6D] text-center">
                      Educational simulation only · No real transactions executed
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
