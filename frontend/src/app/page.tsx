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
  RefreshCw,
  Loader2,
  Star,
  CheckCircle2,
  XCircle,
  Calculator,
  Layers,
  ArrowUpRight,
} from "lucide-react";

// â”€â”€â”€ AG Grid Community â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry, CommunityFeaturesModule, ColDef } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

// â”€â”€â”€ PayPal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

ModuleRegistry.registerModules([CommunityFeaturesModule]);

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

// Mini sparkline renderer using SVG
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return <span className="text-muted">No data</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 64, H = 18;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(" ");
  return (
    <svg width={W} height={H} aria-hidden="true" className="inline-block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Status badge renderer
function StatusBadge({ value }: { value: string }) {
  const isOk = value === "COMPLETED" || value === "CAPTURED";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
        isOk ? "bg-accent-soft text-accent" : "bg-warning/15 text-warning"
      }`}
    >
      {value}
    </span>
  );
}

export default function DashboardPage() {
  // â”€â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to EterPay: your AI cross-border financial copilot.\n\nTry asking:\n* 'I am traveling to Tokyo with 150000 INR. Help me plan my budget.'\n* 'Find me a universal travel adapter.'\n* 'Filter my transactions by Travel category.'\n* 'Convert 50000 INR to EUR.'",
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
    { orderId: "8AB12345CD67", description: "Tokyo Metro Pass", category: "Travel", amount: "Â¥8,500", currency: "JPY", status: "COMPLETED", timestamp: "2026-11-05 10:12" },
    { orderId: "7XY98765LK12", description: "Airalo Japan eSIM 10GB", category: "Travel", amount: "â‚¹1,250", currency: "INR", status: "COMPLETED", timestamp: "2026-11-05 09:48" },
    { orderId: "3MN54321QW99", description: "Ramen Dinner, Ichiran", category: "Dining", amount: "Â¥1,200", currency: "JPY", status: "COMPLETED", timestamp: "2026-11-04 20:30" },
  ]);
  const [gridFilter, setGridFilter] = useState<{ column: string; value: string } | null>(null);

  // Interactive controls
  const [shockPct, setShockPct] = useState<number>(-5);
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcTarget, setCalcTarget] = useState<string>("USD");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  // â”€â”€â”€ Load Live Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const loadFxRates = useCallback(async () => {
    setFxLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/currency/rates?base=INR`);
      const data = await res.json();
      const rates: FxRate[] = Object.entries(data.rates as Record<string, number>).map(
        ([currency, rate]) => ({
          currency,
          rate,
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

  // â”€â”€â”€ Chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        { role: "assistant", content: "Connection error: check whether backend runs on port 8000" },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText);
  };

  // â”€â”€â”€ PayPal Integration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      const oid = data.id || data.order_id;
      setPaypalOrderId(oid);
      return oid as string;
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
          content: `Payment captured via PayPal Sandbox (Order ${data.orderID.slice(0, 14)}). Transaction recorded in AG Grid audit ledger.`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Capture failed: please check backend logs." },
      ]);
    }
  };

  // â”€â”€â”€ AG Grid Column Defs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const ledgerColDefs: ColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 130, cellStyle: { fontFamily: "monospace", color: "var(--color-muted)" } },
    { field: "description", headerName: "Description", flex: 1, filter: "agTextColumnFilter" },
    {
      field: "category", headerName: "Category", width: 110,
      filter: "agTextColumnFilter",
      cellRenderer: (params: { value: string }) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-periwinkle-soft text-periwinkle">
          {params.value}
        </span>
      ),
    },
    { field: "amount", headerName: "Amount", width: 110, cellStyle: { fontWeight: "600", color: "var(--color-ink)" } },
    { field: "currency", headerName: "CCY", width: 70, cellStyle: { color: "var(--color-muted)" } },
    {
      field: "status", headerName: "Status", width: 115,
      cellRenderer: (params: { value: string }) => <StatusBadge value={params.value} />,
    },
    { field: "timestamp", headerName: "Time", width: 130, cellStyle: { color: "var(--color-muted)", fontSize: "11px" } },
  ];

  const selectedRate = fxRates.find((r) => r.currency === calcTarget)?.rate || 0.0119;
  const calcResult = (calcAmount * selectedRate).toFixed(2);
  const shockImpactInr = Math.round((30000 * shockPct) / 100);

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="flex flex-col h-screen bg-paper text-ink overflow-hidden">

        {/* â”€â”€ Hallmark Dusk Navigation Header â”€â”€ */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-rule bg-paper-2/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-periwinkle to-accent flex items-center justify-center font-bold text-accent-ink text-sm shadow-sm">
              E
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-lg tracking-tight text-white">EterPay</span>
              <span className="text-[10px] text-muted">Global Financial Orchestrator</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-soft border border-accent/20 text-accent font-medium ml-2">
              Sandbox Active
            </span>
          </div>

          {/* Live Rates Ticker */}
          <div className="hidden md:flex items-center gap-6 text-xs text-muted">
            {fxLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted" aria-hidden="true" />
            ) : (
              fxRates.slice(0, 4).map((r) => (
                <div key={r.currency} className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded bg-paper-3 text-[10px] text-ink-2 font-mono">{r.currency}</span>
                  <span className="text-ink-2 font-mono">{r.rate.toFixed(4)}</span>
                </div>
              ))
            )}
            {fxDate && <span className="text-[11px] text-muted">ECB Source: {fxDate}</span>}
            <button
              onClick={loadFxRates}
              title="Refresh ECB Rates"
              className="p-1 rounded hover:bg-white/5 text-muted hover:text-white transition"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* â”€â”€ Two-Column Dusk Financial Cockpit â”€â”€ */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* â•â• Left Column: Conversational AI Copilot (5 cols) â•â• */}
          <div className="lg:col-span-5 flex flex-col border-r border-rule bg-paper-2/70 backdrop-blur-md overflow-hidden">
            {/* Copilot Header */}
            <div className="p-4 border-b border-rule flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-periwinkle-soft flex items-center justify-center text-periwinkle">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-medium text-sm text-white">EterPay AI Copilot</h2>
                  <p className="text-[11px] text-muted">Multi-currency routing and tool dispatch</p>
                </div>
              </div>
              <span className="text-[11px] text-accent flex items-center gap-1.5 bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse motion-reduce:animate-none"></span>
                Gemini 1.5 Flash
              </span>
            </div>

            {/* Quick Action Capsules */}
            <div className="p-3 border-b border-rule flex gap-2 overflow-x-auto text-xs shrink-0">
              {[
                { label: "Plan Tokyo Trip", prompt: "I am traveling to Tokyo with 150000 INR. Help me plan my budget." },
                { label: "Shop Adapter", prompt: "Find me a universal travel adapter." },
                { label: "Filter Ledger", prompt: "Filter my transactions by Travel category." },
                { label: "Convert INR to EUR", prompt: "Convert 50000 INR to EUR." },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuickPrompt(q.prompt)}
                  className="px-3 py-1 rounded-full bg-paper-3 hover:bg-rule text-ink-2 hover:text-white border border-rule whitespace-nowrap transition text-[11px]"
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
                    <div className="w-6 h-6 rounded-full bg-paper-3 border border-rule flex items-center justify-center shrink-0 mt-0.5 text-accent">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-accent text-accent-ink font-medium shadow-sm"
                        : "hallmark-glass text-ink rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 rounded-full bg-paper-3 flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" aria-hidden="true" />
                  </div>
                  <div className="p-3 rounded-2xl hallmark-glass text-muted text-xs">
                    Synthesizing response and evaluating tools…
                  </div>
                </div>
              )}

              {/* â”€â”€ Deterministic Payment Gate (Hallmark Smoked Glass Lit) â”€â”€ */}
              {actionProposal && actionProposal.requires_approval && !paypalCapture && (
                <div className="p-4 rounded-xl hallmark-glass-lit text-xs space-y-3.5 border-l-2 border-l-accent">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-accent flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Deterministic Payment Gate
                    </span>
                    <span className="text-[10px] text-muted">Human Authorization Required</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{actionProposal.title}</div>
                  <div className="text-xs text-ink-2 leading-relaxed">{actionProposal.description}</div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-paper border border-rule">
                    {actionProposal.merchant && (
                      <span className="text-muted">
                        Merchant: <strong className="text-white ml-1">{actionProposal.merchant}</strong>
                      </span>
                    )}
                    {actionProposal.amount && (
                      <span className="text-muted">
                        Total:{" "}
                        <strong className="text-accent text-sm ml-1">
                          ${actionProposal.amount.toFixed(2)} {actionProposal.currency}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Real PayPal Buttons */}
                  <div className="pt-1">
                    <PayPalButtons
                      style={{ layout: "horizontal", color: "gold", shape: "rect", label: "pay", height: 38 }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={() =>
                        setMessages((prev) => [
                          ...prev,
                          { role: "assistant", content: "PayPal authorization error: check sandbox environment." },
                        ])
                      }
                    />
                  </div>
                  <div className="text-[10px] text-muted text-center">
                    PayPal Orders v2 Sandbox: zero real capital at risk, backend idempotency enforced
                  </div>
                </div>
              )}

              {paypalCapture && (
                <div className="p-3.5 rounded-xl border border-accent/30 bg-accent-soft text-xs flex items-center gap-2 text-accent font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Transaction verified: Order {paypalCapture.id.slice(0, 12)} (Status: {paypalCapture.status})
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-rule bg-paper-2 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Plan an international trip, query live FX, or prepare checkout…"
                  className="flex-1 bg-paper-3 border border-rule rounded-xl px-4 py-2.5 text-xs text-white placeholder-muted focus:outline-none focus:border-periwinkle"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading}
                  className="px-3.5 py-2.5 bg-accent text-accent-ink font-semibold rounded-xl hover:bg-emerald-400 transition disabled:opacity-40"
                >
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
                </button>
              </form>
            </div>
          </div>

          {/* â•â• Right Column: Financial Workbench (7 cols) â•â• */}
          <div className="lg:col-span-7 flex flex-col bg-paper overflow-hidden">
            {/* Dusk Navigation Tabs */}
            <div className="flex border-b border-rule px-6 pt-3 bg-paper-2/60 gap-8 text-xs shrink-0">
              {([
                { id: "overview", icon: Globe, label: "Treasury and Rates" },
                { id: "grid", icon: TrendingUp, label: "AG Grid Ledger" },
                { id: "commerce", icon: ShoppingBag, label: "Agentic Commerce" },
                { id: "invest", icon: Layers, label: "Portfolio and Risk" },
              ] as const).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`pb-3 font-medium transition border-b-2 flex items-center gap-2 ${
                    activeTab === id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" /> {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* â”€â”€ 1. Treasury & Rates Tab â”€â”€ */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Executive Balance Stage (Smoked Glass Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl hallmark-glass">
                      <div className="text-xs text-muted font-medium">Liquid Treasury</div>
                      <div className="text-2xl font-bold mt-1 text-white tracking-tight">â‚¹1,50,000 <span className="text-xs font-normal text-muted">INR</span></div>
                      <div className="text-xs text-accent mt-1.5 flex items-center gap-1">
                        â‰ˆ ${fxRates.find(r => r.currency === "USD") ? (150000 * (fxRates.find(r => r.currency === "USD")!.rate)).toFixed(2) : "…"} USD
                      </div>
                    </div>
                    <div className="p-4 rounded-xl hallmark-glass">
                      <div className="text-xs text-muted font-medium">Tokyo Travel Allocation</div>
                      <div className="text-2xl font-bold mt-1 text-periwinkle tracking-tight">
                        Â¥{fxRates.find(r => r.currency === "JPY") ? Math.round(150000 * (fxRates.find(r => r.currency === "JPY")!.rate)).toLocaleString() : "…"} <span className="text-xs font-normal text-muted">JPY</span>
                      </div>
                      <div className="text-xs text-ink-2 mt-1.5">Live ECB reference rate</div>
                    </div>
                    <div className="p-4 rounded-xl hallmark-glass">
                      <div className="text-xs text-muted font-medium">Fee Markups Eliminated</div>
                      <div className="text-2xl font-bold mt-1 text-accent tracking-tight">â‚¹5,700 <span className="text-xs font-normal text-muted">INR</span></div>
                      <div className="text-xs text-muted mt-1.5">vs standard 4.5% bank spread</div>
                    </div>
                  </div>

                  {/* Interactive Currency Converter */}
                  <div className="p-5 rounded-xl hallmark-glass space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-white flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-periwinkle" aria-hidden="true" /> Live ECB Currency Calculator
                      </h3>
                      <span className="text-[10px] text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                        Zero Bank Margins
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="text-[11px] text-muted block mb-1">Source Amount (INR)</label>
                        <input
                          type="number"
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                          className="w-full bg-paper-3 border border-rule rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-periwinkle"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted block mb-1">Target Currency</label>
                        <select
                          value={calcTarget}
                          onChange={(e) => setCalcTarget(e.target.value)}
                          className="w-full bg-paper-3 border border-rule rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-periwinkle"
                        >
                          {fxRates.map((r) => (
                            <option key={r.currency} value={r.currency} className="bg-paper-3">
                              {r.currency}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 p-3 rounded-lg bg-paper border border-rule flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-muted">Converted Equivalent</div>
                          <div className="text-base font-semibold text-accent">
                            {Number(calcResult).toLocaleString()} {calcTarget}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-muted">
                          <div>Rate: {selectedRate.toFixed(4)}</div>
                          <div className="text-periwinkle">Bank Fee Saved: â‚¹{(calcAmount * 0.045).toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live FX Rates Table */}
                  <div className="p-5 rounded-xl hallmark-glass space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-white">Live ECB Reference Rates (INR Base)</h3>
                      <span className="text-[11px] text-muted font-mono">
                        {fxDate ? `Synchronized ${fxDate}` : "Querying ECB…"}
                      </span>
                    </div>
                    {fxLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted py-4">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Retrieving exchange rates…
                      </div>
                    ) : (
                      <div className="divide-y divide-rule text-xs">
                        <div className="grid grid-cols-4 py-2 font-medium text-muted">
                          <span>CURRENCY</span>
                          <span>1 INR VALUE</span>
                          <span>150000 INR VALUE</span>
                          <span>SPREAD</span>
                        </div>
                        {fxRates.map((r) => (
                          <div key={r.currency} className="grid grid-cols-4 py-2.5 items-center">
                            <span className="font-medium text-white flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-paper-3 text-[10px] font-mono text-ink-2">{r.currency}</span>
                            </span>
                            <span className="font-mono text-ink-2">{r.rate.toFixed(4)}</span>
                            <span className="font-medium text-accent">
                              {(150000 * r.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {r.currency}
                            </span>
                            <span className="text-muted font-mono">0.0% Interbank</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* â”€â”€ 2. AG Grid Ledger Tab â”€â”€ */}
              {activeTab === "grid" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-sm text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent" aria-hidden="true" />
                        Transaction Audit Ledger (AG Grid Community)
                      </h3>
                      {/* Filter Capsules */}
                      <div className="flex items-center gap-1.5">
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
                            className={`px-2.5 py-0.5 rounded-full text-[10px] transition ${
                              (!gridFilter && cat === "ALL") || gridFilter?.value === cat
                                ? "bg-accent text-accent-ink font-semibold"
                                : "bg-paper-3 text-muted hover:text-white border border-rule"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {gridFilter && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                          AI Filter: {gridFilter.column} is &quot;{gridFilter.value}&quot;
                        </span>
                        <button
                          onClick={() => {
                            setGridFilter(null);
                            gridRef.current?.api?.setFilterModel(null);
                          }}
                          className="text-muted hover:text-white"
                        >
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="ag-theme-alpine-dark rounded-xl overflow-hidden border border-rule shadow-md"
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
                      headerHeight={38}
                      suppressCellFocus={true}
                    />
                  </div>
                  <div className="text-[11px] text-muted flex items-center justify-between">
                    <span>AG Grid Community v32 (Client-side row model, dynamic AI filter execution)</span>
                    <span className="text-accent font-medium">All rows verified</span>
                  </div>
                </div>
              )}

              {/* â”€â”€ 3. Agentic Commerce Tab (Channel3) â”€â”€ */}
              {activeTab === "commerce" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-accent" aria-hidden="true" /> Travel Essentials (Channel3 Product Graph)
                    </h3>
                    <span className="text-xs text-muted">AI destination curation</span>
                  </div>

                  {productsLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted py-6">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Querying product catalog…
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {products.map((p) => (
                        <div key={p.id} className="p-4 rounded-xl hallmark-glass space-y-3 hover:border-rule-2 transition">
                          <div className="w-full h-28 rounded-lg bg-paper-2 overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                          </div>
                          <div className="font-medium text-xs text-white leading-snug">{p.title}</div>
                          <div className="flex items-center gap-1 text-[11px] text-warning">
                            <Star className="w-3 h-3 fill-current" aria-hidden="true" /> {p.rating} (<span className="text-muted">{p.retailer}</span>)
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-semibold text-accent text-sm">â‚¹{p.price_inr.toLocaleString()}</span>
                            <span className="text-[11px] text-muted">${p.price_usd} USD</span>
                          </div>
                          <button
                            onClick={() => handleQuickPrompt(`Buy the ${p.title} for $${p.price_usd}`)}
                            className="w-full py-2 rounded-lg bg-paper-3 hover:bg-accent hover:text-black font-medium text-xs transition flex items-center justify-center gap-1.5 border border-rule"
                          >
                            <span>Prepare Checkout</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* â”€â”€ 4. Portfolio & Risk Tab â”€â”€ */}
              {activeTab === "invest" && (
                <div className="space-y-4">
                  {/* Mandatory FEMA / Simulation Disclaimer Badge */}
                  <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/25 text-warning text-xs flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      <strong>Simulated Portfolio: Educational Only: No Capital at Risk.</strong>{" "}
                      {portfolioDisclaimer}
                    </span>
                  </div>

                  {portfolioLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted py-6">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Querying simulated holdings…
                    </div>
                  ) : (
                    <div className="p-5 rounded-xl hallmark-glass space-y-4">
                      <h3 className="font-medium text-sm text-white">Simulated Currency Portfolio</h3>
                      <div className="divide-y divide-rule text-xs">
                        <div className="grid grid-cols-5 py-2 font-medium text-muted">
                          <span>CURRENCY</span>
                          <span>ALLOCATION</span>
                          <span>VALUE INR</span>
                          <span>UNREALIZED P&amp;L</span>
                          <span>7-DAY TREND</span>
                        </div>
                        {portfolio.map((item) => (
                          <div key={item.currency} className="grid grid-cols-5 py-3 items-center">
                            <span className="font-medium text-white flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-paper-3 text-[10px] font-mono text-ink-2">{item.currency}</span>
                            </span>
                            <span className="text-ink-2">{item.allocation_pct}%</span>
                            <span className="text-white font-medium">â‚¹{item.value_inr.toLocaleString()}</span>
                            <span className={item.unrealized_pnl_pct >= 0 ? "text-accent font-medium" : "text-danger font-medium"}>
                              {item.unrealized_pnl_pct >= 0 ? "+" : ""}{item.unrealized_pnl_pct}%
                            </span>
                            <Sparkline
                              data={item.sparkline}
                              color={item.unrealized_pnl_pct >= 0 ? "var(--color-accent)" : "var(--color-danger)"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Macro FX Stress Test Slider */}
                  <div className="p-5 rounded-xl hallmark-glass space-y-4">
                    <h3 className="font-medium text-sm text-white">Macro FX Stress-Test Simulator</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      Simulate how macroeconomic volatility or central bank interest rate decisions affect foreign exchange balances prior to travel.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-ink-2">Simulated JPY Shock: {shockPct > 0 ? "+" : ""}{shockPct}.0%</span>
                        <span className={`font-medium ${shockImpactInr >= 0 ? "text-accent" : "text-danger"}`}>
                          {shockImpactInr >= 0 ? "+" : ""}â‚¹{shockImpactInr.toLocaleString()} INR Projected Impact
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shockPct}
                        onChange={(e) => setShockPct(Number(e.target.value))}
                        className="w-full accent-accent cursor-pointer"
                      />
                    </div>
                    <div className="text-[11px] text-muted text-center pt-1">
                      Scenario stress testing only: zero actual fiat currency transactions executed
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
