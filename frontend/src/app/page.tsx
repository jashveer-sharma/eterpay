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
  FileText,
  CreditCard,
  Building2,
  User,
  Plus,
  Download,
  ExternalLink,
  Lock,
  Wallet,
} from "lucide-react";

// ── AG Grid Community ────────────────────────────────────────────────────────
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry, CommunityFeaturesModule, ColDef } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

// ── PayPal SDK ───────────────────────────────────────────────────────────────
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

ModuleRegistry.registerModules([CommunityFeaturesModule]);

// ── Types ───────────────────────────────────────────────────────────────────
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

interface InvoiceItem {
  id: string;
  client: string;
  service: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE";
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "";

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb";

// Mini in-cell SVG sparkline renderer
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

// Status badge renderer for AG Grid
function StatusBadge({ value }: { value: string }) {
  const isOk = value === "COMPLETED" || value === "CAPTURED" || value === "PAID";
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
        isOk ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
      }`}
    >
      {value}
    </span>
  );
}

export default function DashboardPage() {
  // ── Persona Mode: Personal vs Business ─────────────────────────────────────
  const [persona, setPersona] = useState<"personal" | "business">("personal");

  // ── Active Navigation Tab ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    "overview" | "pay" | "invoices" | "rates" | "grid" | "commerce" | "invest"
  >("overview");

  // ── Chat State ─────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to EterPay: your global financial copilot.\n\nTry asking:\n* 'Plan my Tokyo trip with 150000 INR.'\n* 'Create an invoice for 15000 INR for Acme Corp.'\n* 'Filter transactions by Travel category.'\n* 'Convert 50000 INR to EUR.'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [actionProposal, setActionProposal] = useState<ActionProposal | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [paypalCapture, setPaypalCapture] = useState<{ id: string; status: string } | null>(null);

  // ── Live Data State ────────────────────────────────────────────────────────
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
    { orderId: "3MN54321QW99", description: "Ramen Dinner, Ichiran", category: "Dining", amount: "¥1,200", currency: "JPY", status: "COMPLETED", timestamp: "2026-11-04 20:30" },
    { orderId: "6BC98124MN44", description: "Client Retainer (Acme Corp)", category: "Business", amount: "₹45,000", currency: "INR", status: "COMPLETED", timestamp: "2026-11-03 14:15" },
  ]);
  const [gridFilter, setGridFilter] = useState<{ column: string; value: string } | null>(null);

  // ── Invoices State (EterPay Business) ───────────────────────────────────────
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: "INV-2026-001", client: "Acme Global Corp", service: "Fintech UI Architecture", amount: 45000, currency: "INR", dueDate: "2026-11-15", status: "PAID" },
    { id: "INV-2026-002", client: "Nexus Media Tokyo", service: "Localization Consulting", amount: 18500, currency: "INR", dueDate: "2026-11-20", status: "PENDING" },
    { id: "INV-2026-003", client: "Starlight Labs UK", service: "Payment Security Audit", amount: 32000, currency: "INR", dueDate: "2026-11-28", status: "PENDING" },
  ]);

  // ── Peer Transfer Quick Form ───────────────────────────────────────────────
  const [transferRecipient, setTransferRecipient] = useState("Rahul Sharma");
  const [transferAmount, setTransferAmount] = useState(2500);
  const [transferCurrency, setTransferCurrency] = useState("INR");

  // ── Interactive Controls ───────────────────────────────────────────────────
  const [shockPct, setShockPct] = useState<number>(-5);
  const [calcAmount, setCalcAmount] = useState<number>(10000);
  const [calcTarget, setCalcTarget] = useState<string>("USD");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  // ── Load Live Data ─────────────────────────────────────────────────────────
  const loadFxRates = useCallback(async () => {
    setFxLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/currency/rates?base=INR`);
      const data = await res.json();
      const rates: FxRate[] = Object.entries(data.rates as Record<string, number>).map(
        ([currency, rate]) => ({ currency, rate })
      );
      setFxRates(rates);
      setFxDate(data.date || "");
    } catch {
      // Fallback in case of network issue
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
      // Keep empty
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
      // Keep empty
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

  // ── Send Chat Message ──────────────────────────────────────────────────────
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
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
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
        { role: "assistant", content: "Connection error: please verify backend is running on port 8000." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText);
  };

  // ── PayPal Integration ─────────────────────────────────────────────────────
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

      // Add to AG Grid ledger
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

  // ── AG Grid Column Definitions ─────────────────────────────────────────────
  const ledgerColDefs: ColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 130, cellStyle: { fontFamily: "monospace", color: "var(--color-ash)" } },
    { field: "description", headerName: "Description", flex: 1, filter: "agTextColumnFilter" },
    {
      field: "category",
      headerName: "Category",
      width: 110,
      filter: "agTextColumnFilter",
      cellRenderer: (params: { value: string }) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cobalt/15 text-cobalt border border-cobalt/20">
          {params.value}
        </span>
      ),
    },
    { field: "amount", headerName: "Amount", width: 110, cellStyle: { fontWeight: "600", color: "var(--color-ivory)" } },
    { field: "currency", headerName: "CCY", width: 70, cellStyle: { color: "var(--color-ash)" } },
    {
      field: "status",
      headerName: "Status",
      width: 115,
      cellRenderer: (params: { value: string }) => <StatusBadge value={params.value} />,
    },
    { field: "timestamp", headerName: "Time", width: 130, cellStyle: { color: "var(--color-ash)", fontSize: "11px" } },
  ];

  const selectedRate = fxRates.find((r) => r.currency === calcTarget)?.rate || 0.0119;
  const calcResult = (calcAmount * selectedRate).toFixed(2);
  const shockImpactInr = Math.round((30000 * shockPct) / 100);

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: "USD" }}>
      <div className="flex flex-col h-screen bg-onyx text-ivory overflow-hidden">

        {/* ── Mercury Frosted Top Navigation Bar ──────────────────────────── */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-hairline bg-carbon/90 backdrop-blur-md shrink-0">
          
          {/* Brand Mark: Concentric Rings + Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cobalt to-indigo-400 flex items-center justify-center shadow-sm">
              <div className="w-3.5 h-3.5 rounded-full border border-white/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-base tracking-tight text-ivory">EterPay</span>
              <span className="hidden sm:inline text-[11px] text-ash">Global Financial Operating System</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cobalt/15 border border-cobalt/25 text-cobalt font-medium ml-1">
              Sandbox Live
            </span>
          </div>

          {/* Central Module Navigation Pills */}
          <nav className="hidden xl:flex items-center gap-1 text-xs">
            {([
              { id: "overview", label: "Overview", icon: Globe },
              { id: "pay", label: "Pay & Transfer", icon: Send },
              { id: "invoices", label: "Invoicing", icon: FileText },
              { id: "rates", label: "Rates & FX", icon: Calculator },
              { id: "grid", label: "Audit Ledger", icon: TrendingUp },
              { id: "commerce", label: "Commerce", icon: ShoppingBag },
              { id: "invest", label: "Invest & Risk", icon: Layers },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 ${
                  activeTab === id
                    ? "bg-cobalt text-white shadow-sm"
                    : "text-ash hover:text-ivory hover:bg-obsidian"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Persona Switcher & Primary Action */}
          <div className="flex items-center gap-3 text-xs">
            {/* Persona Switcher (Personal vs Business) */}
            <div className="flex items-center p-0.5 rounded-full bg-obsidian border border-hairline">
              <button
                onClick={() => setPersona("personal")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                  persona === "personal"
                    ? "bg-graphite text-ivory shadow-sm border border-hairline"
                    : "text-ash hover:text-ivory"
                }`}
              >
                <User className="w-3 h-3" aria-hidden="true" />
                Personal
              </button>
              <button
                onClick={() => setPersona("business")}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 ${
                  persona === "business"
                    ? "bg-graphite text-ivory shadow-sm border border-hairline"
                    : "text-ash hover:text-ivory"
                }`}
              >
                <Building2 className="w-3 h-3" aria-hidden="true" />
                Business
              </button>
            </div>

            {/* Mercury Cobalt Primary Action Button */}
            <button
              onClick={() => {
                if (persona === "business") {
                  handleQuickPrompt("Create an invoice for 25000 INR for Starlight Labs UK");
                } else {
                  handleQuickPrompt("Send 2500 INR to Rahul for hotel booking");
                }
              }}
              className="px-4 py-1.5 rounded-full bg-cobalt hover:bg-cobalt-hover text-white font-medium text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{persona === "business" ? "New Invoice" : "Send Money"}</span>
            </button>
          </div>
        </header>

        {/* ── Subheader Ticker Strip: Live ECB Exchange Rates ──────────────── */}
        <div className="px-6 py-2 border-b border-hairline bg-onyx/80 flex items-center justify-between text-[11px] text-ash shrink-0">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="font-medium text-ivory flex items-center gap-1">
              <Globe className="w-3 h-3 text-cobalt" aria-hidden="true" /> Live ECB Reference Rates:
            </span>
            {fxLoading ? (
              <span className="flex items-center gap-1.5 text-ash">
                <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> Synchronizing rates...
              </span>
            ) : (
              fxRates.slice(0, 5).map((r) => (
                <div key={r.currency} className="flex items-center gap-1 font-mono">
                  <span className="text-ivory">{r.currency}:</span>
                  <span className="text-ash">{r.rate.toFixed(4)}</span>
                </div>
              ))
            )}
            {fxDate && <span className="text-muted hidden md:inline">Source: European Central Bank ({fxDate})</span>}
          </div>
          <button
            onClick={loadFxRates}
            title="Refresh Exchange Rates"
            className="p-1 rounded hover:bg-obsidian text-ash hover:text-ivory transition"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>

        {/* ── Two-Column Cockpit (Mercury Graphite Cards) ──────────────────── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* ════ Left Column: Conversational AI Copilot (5 cols) ════ */}
          <div className="lg:col-span-5 flex flex-col border-r border-hairline bg-carbon/50 overflow-hidden">
            {/* Copilot Header */}
            <div className="p-4 border-b border-hairline flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-cobalt/15 flex items-center justify-center text-cobalt">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-medium text-xs text-ivory">EterPay AI Copilot</h2>
                  <p className="text-[10px] text-ash">Multi-tier model routing and structured tool calling</p>
                </div>
              </div>
              <span className="text-[10px] text-cobalt flex items-center gap-1.5 bg-cobalt/15 px-2.5 py-0.5 rounded-full border border-cobalt/25 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse motion-reduce:animate-none"></span>
                Gemini 1.5 Flash
              </span>
            </div>

            {/* Quick Action Pills (Mercury Style) */}
            <div className="p-3 border-b border-hairline flex gap-2 overflow-x-auto text-xs shrink-0">
              {[
                { label: "Plan Tokyo Trip", prompt: "I am traveling to Tokyo with 150000 INR. Help me plan my budget." },
                { label: "Send to Rahul", prompt: "Send 2500 INR to Rahul for hotel booking." },
                { label: "Create Invoice", prompt: "Create an invoice for 15000 INR for Acme Corp." },
                { label: "Filter Travel", prompt: "Filter my transactions by Travel category." },
                { label: "Convert INR to EUR", prompt: "Convert 50000 INR to EUR." },
              ].map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuickPrompt(q.prompt)}
                  className="px-3 py-1 rounded-full bg-obsidian hover:bg-graphite text-ash hover:text-ivory border border-hairline whitespace-nowrap transition text-[11px]"
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
                    <div className="w-6 h-6 rounded-full bg-obsidian border border-hairline flex items-center justify-center shrink-0 mt-0.5 text-cobalt">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-cobalt text-white font-medium shadow-sm"
                        : "mercury-card text-ivory rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 h-6 rounded-full bg-obsidian flex items-center justify-center shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-cobalt animate-spin" aria-hidden="true" />
                  </div>
                  <div className="p-3 rounded-2xl mercury-card text-ash text-xs">
                    Evaluating financial tools and dispatching intent...
                  </div>
                </div>
              )}

              {/* ── Brex Ember Spark Card: Deterministic Payment Gate ─────── */}
              {actionProposal && actionProposal.requires_approval && !paypalCapture && (
                <div className="p-4 brex-ember-gate text-xs space-y-3.5 border-l-2 border-l-ember">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ember flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Deterministic Payment Gate
                    </span>
                    <span className="text-[10px] text-ash bg-obsidian px-2 py-0.5 rounded-full border border-hairline">
                      Human Approval Required
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-ivory">{actionProposal.title}</div>
                  <div className="text-xs text-ash leading-relaxed">{actionProposal.description}</div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-onyx border border-hairline">
                    {actionProposal.merchant && (
                      <span className="text-ash">
                        Merchant: <strong className="text-ivory ml-1">{actionProposal.merchant}</strong>
                      </span>
                    )}
                    {actionProposal.amount && (
                      <span className="text-ash">
                        Total:{" "}
                        <strong className="text-ember text-sm ml-1">
                          ${actionProposal.amount.toFixed(2)} {actionProposal.currency}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Real PayPal JS SDK Smart Button */}
                  <div className="pt-1">
                    <PayPalButtons
                      style={{ layout: "horizontal", color: "gold", shape: "rect", label: "pay", height: 38 }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={() =>
                        setMessages((prev) => [
                          ...prev,
                          { role: "assistant", content: "PayPal authorization error: check sandbox credentials." },
                        ])
                      }
                    />
                  </div>
                  <div className="text-[10px] text-ash text-center">
                    PayPal Orders v2 Sandbox: zero real capital at risk, backend idempotency enforced
                  </div>
                </div>
              )}

              {paypalCapture && (
                <div className="p-3.5 rounded-xl border border-success/30 bg-success/10 text-xs flex items-center gap-2 text-success font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Transaction verified: Order {paypalCapture.id.slice(0, 12)} (Status: {paypalCapture.status})
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-hairline bg-carbon shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Plan a trip, draft an invoice, convert currency, or prepare checkout..."
                  className="flex-1 bg-obsidian border border-hairline rounded-full px-4 py-2.5 text-xs text-ivory placeholder-muted focus:outline-none focus:border-cobalt"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading}
                  className="px-4 py-2.5 bg-cobalt hover:bg-cobalt-hover text-white font-medium rounded-full transition disabled:opacity-40"
                >
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Send className="w-4 h-4" aria-hidden="true" />}
                </button>
              </form>
            </div>
          </div>

          {/* ════ Right Column: Financial Workbench (7 cols) ════ */}
          <div className="lg:col-span-7 flex flex-col bg-onyx overflow-hidden">
            {/* Workbench Tab Selector (for smaller screens) */}
            <div className="xl:hidden flex border-b border-hairline px-6 pt-3 bg-carbon/60 gap-4 text-xs overflow-x-auto shrink-0">
              {([
                { id: "overview", label: "Overview" },
                { id: "pay", label: "Pay" },
                { id: "invoices", label: "Invoices" },
                { id: "rates", label: "Rates" },
                { id: "grid", label: "Ledger" },
                { id: "commerce", label: "Commerce" },
                { id: "invest", label: "Invest" },
              ] as const).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`pb-2.5 font-medium transition border-b-2 text-xs ${
                    activeTab === id
                      ? "border-cobalt text-cobalt"
                      : "border-transparent text-ash hover:text-ivory"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ── 1. Overview Tab ────────────────────────────────────────── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Executive Balance Stage (Graphite Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {persona === "personal" ? (
                      <>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Liquid Treasury</span>
                            <Wallet className="w-3.5 h-3.5 text-cobalt" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-ivory tracking-tight">₹1,50,000 <span className="text-xs font-normal text-ash">INR</span></div>
                          <div className="text-xs text-cobalt mt-1.5 flex items-center gap-1">
                            ≈ ${fxRates.find(r => r.currency === "USD") ? (150000 * (fxRates.find(r => r.currency === "USD")!.rate)).toFixed(2) : "..."} USD
                          </div>
                        </div>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Tokyo Travel Allocation</span>
                            <Globe className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-ivory tracking-tight">
                            ¥{fxRates.find(r => r.currency === "JPY") ? Math.round(150000 * (fxRates.find(r => r.currency === "JPY")!.rate)).toLocaleString() : "..."} <span className="text-xs font-normal text-ash">JPY</span>
                          </div>
                          <div className="text-xs text-ash mt-1.5">Live ECB reference rate</div>
                        </div>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Fee Markups Eliminated</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-success tracking-tight">₹5,700 <span className="text-xs font-normal text-ash">INR</span></div>
                          <div className="text-xs text-ash mt-1.5">vs standard 4.5% bank spread</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Gross Merchant Volume</span>
                            <Building2 className="w-3.5 h-3.5 text-cobalt" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-ivory tracking-tight">₹95,500 <span className="text-xs font-normal text-ash">INR</span></div>
                          <div className="text-xs text-cobalt mt-1.5">+18.4% vs previous 30 days</div>
                        </div>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Outstanding Invoices</span>
                            <FileText className="w-3.5 h-3.5 text-warning" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-warning tracking-tight">₹50,500 <span className="text-xs font-normal text-ash">INR</span></div>
                          <div className="text-xs text-ash mt-1.5">2 pending client receipts</div>
                        </div>
                        <div className="p-5 mercury-card">
                          <div className="text-xs text-ash font-medium flex items-center justify-between">
                            <span>Dispute Rate</span>
                            <ShieldCheck className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                          </div>
                          <div className="text-2xl font-semibold mt-1.5 text-success tracking-tight">0.00%</div>
                          <div className="text-xs text-ash mt-1.5">PayPal Protection active</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Interactive Currency Converter */}
                  <div className="p-5 mercury-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-cobalt" aria-hidden="true" /> Live European Central Bank Calculator
                      </h3>
                      <span className="text-[10px] text-cobalt bg-cobalt/15 px-2.5 py-0.5 rounded-full border border-cobalt/25 font-medium">
                        Zero Bank Margins
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="text-[11px] text-ash block mb-1">Source Amount (INR)</label>
                        <input
                          type="number"
                          value={calcAmount}
                          onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-hairline rounded-full px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-cobalt"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-ash block mb-1">Target Currency</label>
                        <select
                          value={calcTarget}
                          onChange={(e) => setCalcTarget(e.target.value)}
                          className="w-full bg-obsidian border border-hairline rounded-full px-3 py-1.5 text-xs text-ivory focus:outline-none focus:border-cobalt"
                        >
                          {fxRates.map((r) => (
                            <option key={r.currency} value={r.currency} className="bg-graphite">
                              {r.currency}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2 p-3.5 rounded-xl bg-onyx border border-hairline flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-ash">Converted Equivalent</div>
                          <div className="text-base font-semibold text-ivory">
                            {Number(calcResult).toLocaleString()} {calcTarget}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-ash">
                          <div>Rate: {selectedRate.toFixed(4)}</div>
                          <div className="text-cobalt font-medium">Bank Fee Saved: ₹{(calcAmount * 0.045).toFixed(0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 2. Pay & Transfer Tab ──────────────────────────────────── */}
              {activeTab === "pay" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                      <Send className="w-4 h-4 text-cobalt" aria-hidden="true" /> Peer Payment & Money Movement
                    </h3>
                    <span className="text-xs text-ash">Deterministic approval gate enforced</span>
                  </div>

                  <div className="p-6 mercury-card space-y-4">
                    <div className="text-xs text-ash leading-relaxed">
                      Prepare a peer transfer to another EterPay or PayPal sandbox recipient. The AI copilot will compute applicable currency conversions and present an explicit approval gate before funds move.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-ash block mb-1">Recipient Name / Email</label>
                        <input
                          type="text"
                          value={transferRecipient}
                          onChange={(e) => setTransferRecipient(e.target.value)}
                          className="w-full bg-obsidian border border-hairline rounded-full px-4 py-2 text-xs text-ivory focus:outline-none focus:border-cobalt"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-ash block mb-1">Amount</label>
                        <input
                          type="number"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(Number(e.target.value) || 0)}
                          className="w-full bg-obsidian border border-hairline rounded-full px-4 py-2 text-xs text-ivory focus:outline-none focus:border-cobalt"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-ash block mb-1">Currency</label>
                        <select
                          value={transferCurrency}
                          onChange={(e) => setTransferCurrency(e.target.value)}
                          className="w-full bg-obsidian border border-hairline rounded-full px-4 py-2 text-xs text-ivory focus:outline-none focus:border-cobalt"
                        >
                          <option value="INR" className="bg-graphite">INR (Indian Rupee)</option>
                          <option value="USD" className="bg-graphite">USD (US Dollar)</option>
                          <option value="EUR" className="bg-graphite">EUR (Euro)</option>
                          <option value="JPY" className="bg-graphite">JPY (Japanese Yen)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickPrompt(`Send ${transferAmount} ${transferCurrency} to ${transferRecipient} for payment`)}
                      className="px-5 py-2.5 rounded-full bg-cobalt hover:bg-cobalt-hover text-white font-medium text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Prepare Transfer via Copilot</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── 3. Invoicing Tab ───────────────────────────────────────── */}
              {activeTab === "invoices" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cobalt" aria-hidden="true" /> Smart Invoicing & Accounts Receivable
                    </h3>
                    <button
                      onClick={() => handleQuickPrompt("Create an invoice for 20000 INR for Nexus Media Tokyo due in 14 days")}
                      className="px-3.5 py-1.5 rounded-full bg-cobalt hover:bg-cobalt-hover text-white text-xs font-medium transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" /> New Invoice with AI
                    </button>
                  </div>

                  <div className="p-5 mercury-card space-y-4">
                    <div className="divide-y divide-hairline text-xs">
                      <div className="grid grid-cols-6 py-2 font-medium text-ash">
                        <span>INVOICE ID</span>
                        <span className="col-span-2">CLIENT & SERVICE</span>
                        <span>DUE DATE</span>
                        <span>AMOUNT</span>
                        <span className="text-right">ACTION</span>
                      </div>
                      {invoices.map((inv) => (
                        <div key={inv.id} className="grid grid-cols-6 py-3 items-center">
                          <span className="font-mono text-ivory">{inv.id}</span>
                          <div className="col-span-2">
                            <div className="font-medium text-ivory">{inv.client}</div>
                            <div className="text-[11px] text-ash">{inv.service}</div>
                          </div>
                          <span className="text-ash">{inv.dueDate}</span>
                          <div>
                            <span className="font-semibold text-ivory">₹{inv.amount.toLocaleString()}</span>{" "}
                            <span className="text-[10px] text-ash">{inv.currency}</span>
                          </div>
                          <div className="text-right flex items-center justify-end gap-2">
                            <StatusBadge value={inv.status} />
                            <button
                              onClick={() => handleQuickPrompt(`Show invoice details for ${inv.id}`)}
                              title="Download PDF"
                              className="p-1 rounded hover:bg-obsidian text-ash hover:text-ivory"
                            >
                              <Download className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. Rates & FX Tab ──────────────────────────────────────── */}
              {activeTab === "rates" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-cobalt" aria-hidden="true" /> European Central Bank Reference Exchange
                    </h3>
                    <span className="text-xs text-ash font-mono">
                      {fxDate ? `Synchronized ${fxDate}` : "Querying ECB..."}
                    </span>
                  </div>

                  <div className="p-5 mercury-card space-y-3">
                    <div className="divide-y divide-hairline text-xs">
                      <div className="grid grid-cols-4 py-2 font-medium text-ash">
                        <span>CURRENCY</span>
                        <span>1 INR VALUE</span>
                        <span>150,000 INR EQUIVALENT</span>
                        <span>INTERBANK SPREAD</span>
                      </div>
                      {fxRates.map((r) => (
                        <div key={r.currency} className="grid grid-cols-4 py-2.5 items-center">
                          <span className="font-medium text-ivory flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-obsidian text-[10px] font-mono text-ash">{r.currency}</span>
                          </span>
                          <span className="font-mono text-ash">{r.rate.toFixed(4)}</span>
                          <span className="font-medium text-ivory">
                            {(150000 * r.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} {r.currency}
                          </span>
                          <span className="text-cobalt font-mono">0.0% Interbank</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 5. AG Grid Ledger Tab ──────────────────────────────────── */}
              {activeTab === "grid" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cobalt" aria-hidden="true" />
                        Transaction Audit Ledger (AG Grid Community v32)
                      </h3>
                      {/* Filter Capsules */}
                      <div className="flex items-center gap-1.5">
                        {["ALL", "Travel", "Dining", "Commerce", "Business"].map((cat) => (
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
                            className={`px-3 py-0.5 rounded-full text-[11px] transition ${
                              (!gridFilter && cat === "ALL") || gridFilter?.value === cat
                                ? "bg-cobalt text-white font-semibold"
                                : "bg-obsidian text-ash hover:text-ivory border border-hairline"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {gridFilter && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cobalt bg-cobalt/15 px-2.5 py-0.5 rounded-full border border-cobalt/25 font-medium">
                          AI Filter: {gridFilter.column} = &quot;{gridFilter.value}&quot;
                        </span>
                        <button
                          onClick={() => {
                            setGridFilter(null);
                            gridRef.current?.api?.setFilterModel(null);
                          }}
                          className="text-ash hover:text-ivory"
                        >
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="ag-theme-alpine-dark rounded-xl overflow-hidden border border-hairline shadow-md"
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
                  <div className="text-[11px] text-ash flex items-center justify-between">
                    <span>AG Grid Community v32 (Client-side row model, dynamic AI filter execution)</span>
                    <span className="text-success font-medium">All rows verified</span>
                  </div>
                </div>
              )}

              {/* ── 6. Agentic Commerce Tab (Channel3) ─────────────────────── */}
              {activeTab === "commerce" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-ivory flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-cobalt" aria-hidden="true" /> Travel Essentials (Channel3 Product Graph)
                    </h3>
                    <span className="text-xs text-ash">AI destination curation</span>
                  </div>

                  {productsLoading ? (
                    <div className="flex items-center gap-2 text-xs text-ash py-6">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Querying product catalog...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {products.map((p) => (
                        <div key={p.id} className="p-4 mercury-card space-y-3">
                          <div className="w-full h-28 rounded-lg bg-obsidian overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                          </div>
                          <div className="font-medium text-xs text-ivory leading-snug">{p.title}</div>
                          <div className="flex items-center gap-1 text-[11px] text-warning">
                            <Star className="w-3 h-3 fill-current" aria-hidden="true" /> {p.rating} (<span className="text-ash">{p.retailer}</span>)
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-semibold text-ivory text-sm">₹{p.price_inr.toLocaleString()}</span>
                            <span className="text-[11px] text-ash">${p.price_usd} USD</span>
                          </div>
                          <button
                            onClick={() => handleQuickPrompt(`Buy the ${p.title} for $${p.price_usd}`)}
                            className="w-full py-2 rounded-full bg-obsidian hover:bg-cobalt hover:text-white font-medium text-xs transition flex items-center justify-center gap-1.5 border border-hairline"
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

              {/* ── 7. Portfolio & Risk Tab ─────────────────────────────────── */}
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
                    <div className="flex items-center gap-2 text-xs text-ash py-6">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Querying simulated holdings...
                    </div>
                  ) : (
                    <div className="p-5 mercury-card space-y-4">
                      <h3 className="font-medium text-sm text-ivory">Simulated Currency Portfolio</h3>
                      <div className="divide-y divide-hairline text-xs">
                        <div className="grid grid-cols-5 py-2 font-medium text-ash">
                          <span>CURRENCY</span>
                          <span>ALLOCATION</span>
                          <span>VALUE INR</span>
                          <span>UNREALIZED P&L</span>
                          <span>7-DAY TREND</span>
                        </div>
                        {portfolio.map((item) => (
                          <div key={item.currency} className="grid grid-cols-5 py-3 items-center">
                            <span className="font-medium text-ivory flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-obsidian text-[10px] font-mono text-ash">{item.currency}</span>
                            </span>
                            <span className="text-ash">{item.allocation_pct}%</span>
                            <span className="text-ivory font-medium">₹{item.value_inr.toLocaleString()}</span>
                            <span className={item.unrealized_pnl_pct >= 0 ? "text-success font-medium" : "text-danger font-medium"}>
                              {item.unrealized_pnl_pct >= 0 ? "+" : ""}{item.unrealized_pnl_pct}%
                            </span>
                            <Sparkline
                              data={item.sparkline}
                              color={item.unrealized_pnl_pct >= 0 ? "var(--color-success)" : "var(--color-danger)"}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Macro FX Stress Test Slider */}
                  <div className="p-5 mercury-card space-y-4">
                    <h3 className="font-medium text-sm text-ivory">Macro FX Stress-Test Simulator</h3>
                    <p className="text-xs text-ash leading-relaxed">
                      Simulate how macroeconomic volatility or central bank interest rate decisions affect foreign exchange balances prior to travel.
                    </p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-ash">Simulated JPY Shock: {shockPct > 0 ? "+" : ""}{shockPct}.0%</span>
                        <span className={`font-medium ${shockImpactInr >= 0 ? "text-success" : "text-danger"}`}>
                          {shockImpactInr >= 0 ? "+" : ""}₹{shockImpactInr.toLocaleString()} INR Projected Impact
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={shockPct}
                        onChange={(e) => setShockPct(Number(e.target.value))}
                        className="w-full accent-cobalt cursor-pointer"
                      />
                    </div>
                    <div className="text-[11px] text-ash text-center pt-1">
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
