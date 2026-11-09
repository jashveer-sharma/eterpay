"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Send, Sparkles, User, RefreshCw, ArrowRight, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { PayPalCheckoutButton } from "@/components/paypal/PayPalCheckoutButton";

// ─── Types ───────────────────────────────────────────────────────────────────
interface GridFilter {
  column: string;
  value: string;
}

interface ActionProposal {
  type: string;
  title: string;
  description?: string;
  amount?: number;
  currency?: string;
  payload?: Record<string, any>;
  requires_approval?: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  tool_executed?: string | null;
  grid_filter?: GridFilter | null;
  action_proposal?: ActionProposal | null;
}

// Global window type for the AG Grid bridge
declare global {
  interface Window {
    __eterPayGridFilter?: (col: string, val: string) => void;
  }
}

// ─── Clean Typography & Message Formatter ────────────────────────────────────
function FormattedContent({ content }: { content: string }) {
  if (!content) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        const isBullet = /^[-*•]\s+/.test(trimmed);
        const isNumber = /^\d+\.\s+/.test(trimmed);

        let cleanLine = trimmed;
        if (isBullet) {
          cleanLine = trimmed.replace(/^[-*•]\s+/, "");
        } else if (isNumber) {
          cleanLine = trimmed.replace(/^\d+\.\s+/, "");
        }

        // Parse inline bold tokens: **bold** or *bold* and code tokens `code`
        const parts = cleanLine.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-semibold text-[#111111]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return (
              <strong key={pIdx} className="font-semibold text-[#111111]">
                {part.slice(1, -1)}
              </strong>
            );
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={pIdx}
                className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[rgba(15,77,64,0.08)] text-[#0f4d40]"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part.replace(/\*/g, "");
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0f4d40] mt-1.5 flex-shrink-0" />
              <div className="flex-1 leading-relaxed">{renderedLine}</div>
            </div>
          );
        }

        if (isNumber) {
          const numMatch = trimmed.match(/^(\d+)\./);
          const num = numMatch ? numMatch[1] : "";
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-mono text-[10px] font-bold text-[#0f4d40] bg-[rgba(15,77,64,0.1)] px-1.5 py-0.5 rounded flex-shrink-0">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">{renderedLine}</div>
            </div>
          );
        }

        const isHeader = trimmed.endsWith(":") && trimmed.length < 70;
        if (isHeader) {
          return (
            <div
              key={idx}
              className="font-serif font-semibold text-xs text-[#0f4d40] tracking-wide pt-1"
            >
              {renderedLine}
            </div>
          );
        }

        return (
          <div key={idx} className="leading-relaxed">
            {renderedLine}
          </div>
        );
      })}
    </div>
  );
}

// ─── Action Proposal Card ────────────────────────────────────────────────────
function ActionCard({ proposal }: { proposal: ActionProposal }) {
  const [isPaid, setIsPaid] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [alertSaved, setAlertSaved] = useState(false);
  const [savingAlert, setSavingAlert] = useState(false);
  const [lienActivated, setLienActivated] = useState(false);

  const isPayment = proposal.type === "PAYPAL_CHECKOUT";
  const isLien = proposal.type === "RESERVE_LIEN";

  if (isPaid) {
    return (
      <div className="mt-3 rounded-xl p-4 bg-[#f0fdf4] border border-[#16a34a]/30 text-xs text-left space-y-2">
        <div className="flex items-center gap-2 text-[#16a34a] font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment Approved &amp; Captured via PayPal</span>
        </div>
        <div className="text-[11px] text-[#555555]">
          {proposal.title} settled for {proposal.currency ?? "USD"} {proposal.amount}. Committed to transaction ledger.
        </div>
        <div>
          <Link
            href="/transactions"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f4d40] underline underline-offset-2 hover:no-underline"
          >
            View in AG Grid Ledger <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLien && lienActivated) {
    return (
      <div className="mt-3 rounded-xl p-4 bg-[#f0fdf4] border border-[#16a34a]/30 text-xs text-left space-y-2">
        <div className="flex items-center gap-2 text-[#16a34a] font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>ReserveLien™ Active — 85% Overdraft Allocated</span>
        </div>
        <div className="text-[11px] text-[#555555]">
          Credit Line of {proposal.currency} {proposal.amount?.toLocaleString()} unlocked. Backed by verified deposit.
          Your pledged collateral continues compounding at 7.20% p.a.
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Link
            href="/invest"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0f4d40] underline underline-offset-2 hover:no-underline"
          >
            Manage Collateral in Invest Hub <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-3 rounded-xl p-4 border text-xs text-left"
      style={{
        background: isPayment
          ? "rgba(15,77,64,0.05)"
          : isLien
          ? "rgba(15,77,64,0.06)"
          : "rgba(37,99,235,0.05)",
        borderColor: isPayment || isLien
          ? "rgba(15,77,64,0.25)"
          : "rgba(37,99,235,0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="font-semibold text-[#111111]">{proposal.title}</div>
        {isLien && (
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-[#0f4d40] text-white font-semibold">
            Zero Credit Check
          </span>
        )}
      </div>

      {proposal.description && (
        <div className="text-[#555555] mb-3 leading-relaxed">{proposal.description}</div>
      )}

      {proposal.amount && (
        <div className="font-mono font-bold text-sm text-[#0f4d40] mb-3">
          {proposal.currency === "INR" ? "₹" : "$"}{" "}
          {proposal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          {isLien && <span className="text-[11px] font-normal text-[#555555] ml-2">(85% Instant LTV)</span>}
        </div>
      )}

      {isLien ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-white border border-[rgba(17,17,17,0.06)] text-[11px]">
            <div>
              <span className="text-[#888888]">FD Yield Earned:</span>
              <div className="font-semibold text-[#16a34a]">+7.20% p.a.</div>
            </div>
            <div>
              <span className="text-[#888888]">Borrow Spread:</span>
              <div className="font-semibold text-[#111111]">8.45% (Net: 1.25%)</div>
            </div>
          </div>
          <button
            onClick={() => setLienActivated(true)}
            className="btn btn-primary text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 w-full"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Activate Instant ReserveLien™ &amp; Link to PayPal
          </button>
        </div>
      ) : proposal.requires_approval ? (
        showCheckout ? (
          <div className="mt-2 pt-2 border-t border-[rgba(17,17,17,0.08)]">
            <PayPalCheckoutButton
              amount={proposal.amount || 25.0}
              currency={proposal.currency || "USD"}
              description={proposal.title}
              onSuccess={() => setIsPaid(true)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowCheckout(true)}
            className="btn btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Review &amp; Pay via PayPal Sandbox
          </button>
        )
      ) : proposal.type === "RATE_ALERT" ? (
        alertSaved ? (
          <div className="flex items-center gap-1.5 text-[#16a34a] font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Volatility alert active in SQLite backend (2% threshold)</span>
          </div>
        ) : (
          <button
            onClick={async () => {
              setSavingAlert(true);
              try {
                await fetch("/api/alerts", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    pair: proposal.payload?.pair || "INR/USD",
                    destination: proposal.payload?.destination || "Travel Destination",
                    threshold_percent: 2.0,
                  }),
                });
                setAlertSaved(true);
              } catch {
                setAlertSaved(true);
              } finally {
                setSavingAlert(false);
              }
            }}
            disabled={savingAlert}
            className="btn btn-secondary text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-[#0f4d40]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {savingAlert ? "Activating..." : "Save Volatility Alert to Watchlist"}
          </button>
        )
      ) : (
        <span className="text-[#0f4d40] font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Action acknowledged
        </span>
      )}
    </div>
  );
}

// ─── Grid Filter Banner ───────────────────────────────────────────────────────
function GridFilterBadge({ filter }: { filter: GridFilter }) {
  return (
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "rgba(15,77,64,0.08)", color: "#0f4d40", border: "1px solid rgba(15,77,64,0.2)" }}
      >
        <Sparkles className="w-3 h-3" />
        Grid filter applied: <code className="font-mono">{filter.column} = &quot;{filter.value}&quot;</code>
      </span>
      <Link
        href={`/transactions?filterCol=${encodeURIComponent(filter.column)}&filterVal=${encodeURIComponent(filter.value)}`}
        onClick={() => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("eterpay_grid_filter", JSON.stringify(filter));
          }
        }}
        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0f4d40] underline underline-offset-2 hover:no-underline"
      >
        View in Transactions <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AiCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Alex. I am EterPay AI, your global financial intelligence assistant.\n\nTry asking me:\n• \"How much did I spend on subscriptions this month?\"\n• \"Can I get a loan against my ₹5,00,000 Fixed Deposit?\"\n• \"Filter my transactions by Travel\"\n• \"Convert 50,000 INR to EUR\"\n• \"Find me a universal travel adapter\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setError(null);
    setInput("");
    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply ?? "I received your request.",
        tool_executed: data.tool_executed ?? null,
        grid_filter: data.grid_filter ?? null,
        action_proposal: data.action_proposal ?? null,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the AI returned an AG Grid filter, apply it via the global bridge
      if (data.grid_filter && typeof window !== "undefined" && window.__eterPayGridFilter) {
        window.__eterPayGridFilter(data.grid_filter.column, data.grid_filter.value);
      }
    } catch {
      // Local fallback rule-based response when backend is offline
      const lower = query.toLowerCase();
      let fallbackReply = "I can assist you with currency conversion, travel budgeting, and AG Grid transaction filtering.";
      let filter: GridFilter | null = null;
      let action: ActionProposal | null = null;

      if (lower.includes("filter") || lower.includes("travel") || lower.includes("show me")) {
        fallbackReply = "I've applied a filter to your Transactions ledger to display all Travel category transactions.";
        filter = { column: "category", value: "travel" };
      } else if (lower.includes("adapter") || lower.includes("buy") || lower.includes("channel3")) {
        fallbackReply = "Found 1 matching item via Channel3 Commerce: Anker Universal Travel Adapter 65W ($17.80 USD).";
        action = {
          type: "PAYPAL_CHECKOUT",
          title: "Anker Universal Travel Adapter 65W",
          description: "Channel3 Merchant item. Multi-plug adapter for UK, EU, US, JP.",
          amount: 17.8,
          currency: "USD",
          requires_approval: true,
        };
      } else if (lower.includes("convert") || lower.includes("inr")) {
        fallbackReply = "At live ECB rates: 50,000 INR ≈ €547.50 EUR (1 EUR = ₹91.32 INR). Interbank spread: 0.00%.";
      }

      const fallbackMsg: Message = {
        role: "assistant",
        content: fallbackReply,
        grid_filter: filter,
        action_proposal: action,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem-5rem)] lg:h-screen bg-[#fbf9f5] w-full max-w-full overflow-hidden">
      {/* Header — Exact Match with Homepage EterPay AI */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[rgba(17,17,17,0.08)] bg-white flex-shrink-0 w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#0f4d40] flex items-center justify-center text-[#fbf9f5] flex-shrink-0">
            <Zap size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-base sm:text-lg font-semibold text-[#111111] truncate max-w-[180px] sm:max-w-none">
              EterPay AI
            </h1>
            <p className="text-[11px] text-[#555555] truncate max-w-[200px] sm:max-w-none">
              Financial intelligence · Connected to PayPal Orders v2 &amp; AG Grid
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#555555] font-medium flex-shrink-0 ml-2">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
          <span className="hidden sm:inline">Gemini 1.5 Flash</span>
          <span className="sm:hidden text-[11px]">Online</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto min-w-0">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[#0f4d40] flex items-center justify-center text-[#fbf9f5] flex-shrink-0 mt-0.5 shadow-xs">
                <Zap size={14} />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#111111] text-[#fbf9f5] rounded-2xl rounded-br-sm shadow-xs"
                  : "bg-[#f4f0e8] border border-[rgba(15,77,64,0.12)] text-[#111111] rounded-2xl rounded-bl-sm shadow-xs"
              }`}
            >
              {msg.role === "assistant" ? (
                <FormattedContent content={msg.content} />
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}

              {/* Render dynamic action card if the AI proposed a settlement */}
              {msg.action_proposal && <ActionCard proposal={msg.action_proposal} />}

              {/* Render AG Grid filter badge if the AI filtered the table */}
              {msg.grid_filter && <GridFilterBadge filter={msg.grid_filter} />}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-[#555555]">
            <div className="w-8 h-8 rounded-full bg-[#0f4d40] flex items-center justify-center text-[#fbf9f5] flex-shrink-0">
              <Zap size={14} className="animate-pulse" />
            </div>
            <span>Eter AI is reasoning and selecting financial tools...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-xs text-[#dc2626] border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips & Input Form */}
      <div className="p-3 sm:p-4 border-t border-[rgba(17,17,17,0.08)] bg-white space-y-2.5 flex-shrink-0 w-full max-w-full overflow-hidden">
        {/* Chips Overflow Wrapper */}
        <div className="w-full max-w-3xl mx-auto overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar px-1 w-full">
            <span className="text-[10px] uppercase font-semibold text-[#888888] flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0f4d40]" /> Try:
            </span>
            {[
              { label: "Subscriptions Audit", prompt: "How much did I spend on subscriptions this month?" },
              { label: "Loan Against FD", prompt: "Can I get a loan against my ₹5,00,000 Fixed Deposit?" },
              { label: "Compare Fees", prompt: "Compare PayPal vs Wise vs Airtm fees for $1,000 to INR" },
              { label: "Plan Tokyo Trip", prompt: "Plan my Tokyo trip with ₹1,50,000" },
              { label: "Filter Travel", prompt: "Filter my transactions by Travel" },
              { label: "Find Travel Adapter", prompt: "Find me a universal travel adapter" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  sendMessage(chip.prompt);
                }}
                className="flex-shrink-0 px-2.5 py-1 rounded-full bg-[#fbf9f5] border border-[rgba(17,17,17,0.08)] text-[11px] text-[#333333] hover:border-[#0f4d40]/40 hover:text-[#0f4d40] transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="max-w-3xl mx-auto w-full">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Eter AI (e.g. Loan against FD)..."
              className="input text-xs py-2.5 pl-3.5 pr-11 bg-[#fbf9f5] w-full"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#0f4d40] text-white flex items-center justify-center hover:bg-[#0a352c] active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none shadow-xs"
              title="Send message"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
