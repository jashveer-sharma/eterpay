"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Send, Sparkles, User, RefreshCw, ArrowRight, AlertCircle } from "lucide-react";

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
  const isPayment = proposal.type === "PAYPAL_CHECKOUT";
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
        <button
          onClick={() => alert("PayPal sandbox checkout coming in P1-03.")}
          className="btn btn-primary text-xs px-4 py-2 rounded-lg flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Approve &amp; Pay via PayPal
        </button>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setError(null);

    // Build history for multi-turn context (last 8 turns)
    const historyForApi = messages.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    const newHistory: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: historyForApi }),
      });

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }

      const data = await res.json();

      // ── P1-02: Drive AG Grid from AI tool response ──────────────────────────
      const gridFilter: GridFilter | null = data.grid_filter ?? null;
      if (gridFilter?.column && gridFilter?.value) {
        // Call the AG Grid API bridge registered by the transactions page
        if (typeof window.__eterPayGridFilter === "function") {
          window.__eterPayGridFilter(gridFilter.column, gridFilter.value);
        }
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply ?? "Intent processed.",
        tool_executed: data.tool_executed ?? null,
        grid_filter: gridFilter,
        action_proposal: data.action_proposal ?? null,
      };

      setMessages([...newHistory, assistantMsg]);
    } catch {
      setError("Could not connect to the AI service. Please ensure the backend is running on port 8000.");
      setMessages([...newHistory, {
        role: "assistant",
        content: "I'm having trouble reaching the backend right now. Please try again in a moment.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[rgba(15,77,64,0.08)] rounded-2xl text-[#0f4d40]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">
                Gemini 1.5 Flash · Groq Llama 3.3 70B · Deterministic Fallback
              </div>
              <h1 className="font-serif text-3xl text-[#111111]">EterPay AI Copilot</h1>
            </div>
          </div>
          <span className="demo-badge">Human Approval Gate Enforced</span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium"
            style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626" }}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Chat History */}
        <div className="card bg-white flex-1 p-6 overflow-y-auto space-y-5 min-h-[400px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === "user" ? "bg-[#111111] text-white" : "bg-[#0f4d40] text-white"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-lg ${m.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#111111] text-[#fbf9f5]"
                      : "bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] text-[#222222]"
                  }`}
                >
                  {m.content}
                </div>

                {/* Tool badge */}
                {m.tool_executed && (
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0f4d40] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(15,77,64,0.07)" }}>
                    <Sparkles className="w-2.5 h-2.5" />
                    {m.tool_executed.replace(/_/g, " ")}
                  </span>
                )}

                {/* Grid filter bridge badge + link */}
                {m.grid_filter && <GridFilterBadge filter={m.grid_filter} />}

                {/* Action proposal card */}
                {m.action_proposal && <ActionCard proposal={m.action_proposal} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#888888]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0f4d40]" />
              Copilot evaluating financial intent…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Filter transactions by Travel · Plan Tokyo trip · Convert 50,000 INR to EUR"
            className="input text-xs py-3.5 flex-1"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="btn btn-primary px-6 text-xs font-semibold">
            <Send className="w-4 h-4 mr-1 inline" /> Send
          </button>
        </form>

        <div className="text-[11px] text-[#888888] flex items-center justify-between">
          <span>Zero Client Secrets In Context · Deterministic Mathematical Validation</span>
          <Link href="/terms" className="hover:underline">Advisory Disclaimer</Link>
        </div>

      </div>
    </div>
  );
}
