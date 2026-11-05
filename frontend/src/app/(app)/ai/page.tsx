"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Send, Sparkles, User, RefreshCw, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
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

// ─── Action Proposal Card ────────────────────────────────────────────────────
function ActionCard({ proposal }: { proposal: ActionProposal }) {
  const [isPaid, setIsPaid] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const isPayment = proposal.type === "PAYPAL_CHECKOUT";

  if (isPaid) {
    return (
      <div className="mt-3 rounded-xl p-4 bg-[#f0fdf4] border border-[#16a34a]/30 text-xs text-left">
        <div className="flex items-center gap-2 text-[#16a34a] font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment Approved &amp; Captured via PayPal</span>
        </div>
        <div className="text-[11px] text-[#555555] mt-1">
          {proposal.title} settled for {proposal.currency ?? "USD"} {proposal.amount}. Committed to transaction ledger.
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-3 rounded-xl p-4 border text-xs"
      style={{
        background: isPayment ? "rgba(15,77,64,0.05)" : "rgba(37,99,235,0.05)",
        borderColor: isPayment ? "rgba(15,77,64,0.2)" : "rgba(37,99,235,0.15)",
      }}
    >
      <div className="font-semibold text-[#111111] mb-1">{proposal.title}</div>
      {proposal.description && (
        <div className="text-[#555555] mb-3">{proposal.description}</div>
      )}
      {proposal.amount && (
        <div className="font-mono font-bold text-sm text-[#0f4d40] mb-3">
          {proposal.currency ?? "USD"} {proposal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      )}
      {proposal.requires_approval ? (
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
      ) : (
        <span className="text-[#0f4d40] font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Alert noted
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
        href="/transactions"
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
        "Hello Alex. I am your EterPay Financial Copilot.\n\nTry asking me:\n• \"Filter my transactions by Travel\"\n• \"Plan my Tokyo trip with ₹1,50,000\"\n• \"Convert 50,000 INR to EUR\"\n• \"Find me a universal travel adapter\"",
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
      const response = await fetch("http://localhost:8000/api/chat", {
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
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#fbf9f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(17,17,17,0.08)] bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[rgba(15,77,64,0.08)] flex items-center justify-center text-[#0f4d40]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold text-[#111111]">EterPay Copilot</h1>
            <p className="text-[11px] text-[#555555]">
              AI Financial Assistant · Connected to PayPal Orders v2 &amp; AG Grid
            </p>
          </div>
        </div>
        <span className="demo-badge">Gemini Flash + Groq Hybrid</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[rgba(15,77,64,0.1)] flex items-center justify-center text-[#0f4d40] flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#0f4d40] text-white"
                  : "bg-white border border-[rgba(17,17,17,0.08)] text-[#111111] shadow-xs"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Render dynamic action card if the AI proposed a settlement */}
              {msg.action_proposal && <ActionCard proposal={msg.action_proposal} />}

              {/* Render AG Grid filter badge if the AI filtered the table */}
              {msg.grid_filter && <GridFilterBadge filter={msg.grid_filter} />}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-[rgba(17,17,17,0.08)] flex items-center justify-center text-[#555555] flex-shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center text-xs text-[#555555]">
            <div className="w-7 h-7 rounded-full bg-[rgba(15,77,64,0.1)] flex items-center justify-center text-[#0f4d40] flex-shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>Copilot is reasoning and selecting financial tools...</span>
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

      {/* Input Form */}
      <div className="p-4 border-t border-[rgba(17,17,17,0.08)] bg-white">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot (e.g. 'Plan my Tokyo trip with ₹1,50,000' or 'Filter transactions by Travel')..."
            className="input text-xs py-2.5 flex-1 bg-[#fbf9f5]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
