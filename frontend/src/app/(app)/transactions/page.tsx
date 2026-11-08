"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Sparkles, ArrowDownLeft, ArrowUpRight, Calendar, Tag } from "lucide-react";
import { AgGridReact } from "@ag-grid-community/react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { DEMO_TRANSACTIONS } from "@/lib/demo-data";

// Cast demo data to our typed interface (demo-data.ts uses widened string literals)
const ROW_DATA = DEMO_TRANSACTIONS as Transaction[];

// ─── Types ──────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  title: string;
  counterparty: string;
  note: string;
  amount: number;
  currency: string;
  symbol: string;
  date: string;
  status: string;
  ref: string;
}

// ─── Custom Cell Renderers ───────────────────────────────────────────────────
function TitleCell({ data }: ICellRendererParams<Transaction>) {
  if (!data) return null;
  return (
    <div className="flex flex-col justify-center h-full py-1">
      <span className="font-semibold text-[#111111] text-xs leading-tight">{data.title}</span>
      <span className="text-[10px] text-[#888888] mt-0.5">{data.counterparty} · {data.note}</span>
    </div>
  );
}

function CategoryCell({ value }: ICellRendererParams<Transaction>) {
  const palettes: Record<string, string> = {
    travel:       "bg-[#eff6ff] text-[#1d4ed8]",
    commerce:     "bg-[#fdf4ff] text-[#9333ea]",
    subscription: "bg-[#f0f9ff] text-[#0369a1]",
    transfer:     "bg-[rgba(17,17,17,0.05)] text-[#555555]",
    invest:       "bg-[#f0fdf4] text-[#15803d]",
    refund:       "bg-[#fff7ed] text-[#c2410c]",
  };
  const cls = palettes[value as string] ?? "bg-[rgba(17,17,17,0.05)] text-[#555555]";
  return (
    <div className="flex items-center h-full">
      <span className={`capitalize px-2 py-0.5 rounded-full font-semibold text-[10px] ${cls}`}>
        {value}
      </span>
    </div>
  );
}

function StatusCell({ value }: ICellRendererParams<Transaction>) {
  const styles: Record<string, string> = {
    completed: "bg-[#f0fdf4] text-[#16a34a]",
    pending:   "bg-[#fffbeb] text-[#d97706]",
    failed:    "bg-[#fef2f2] text-[#dc2626]",
  };
  const cls = styles[value as string] ?? "bg-[rgba(17,17,17,0.05)] text-[#555555]";
  return (
    <div className="flex items-center h-full">
      <span className={`capitalize font-semibold text-[10px] px-2 py-0.5 rounded-full ${cls}`}>
        {value}
      </span>
    </div>
  );
}

function AmountCell({ data }: ICellRendererParams<Transaction>) {
  if (!data) return null;
  const isCredit = data.type === "credit";
  return (
    <div className="flex items-center justify-end h-full">
      <span className={`font-serif text-sm font-semibold tabular-nums ${isCredit ? "text-[#16a34a]" : "text-[#111111]"}`}>
        {isCredit ? "+" : "−"}&nbsp;{data.symbol}&nbsp;
        {data.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}

// ─── Column Definitions ──────────────────────────────────────────────────────
const COL_DEFS: ColDef<Transaction>[] = [
  {
    headerName: "Transaction / Counterparty",
    field: "title",
    cellRenderer: TitleCell,
    flex: 2.5,
    minWidth: 220,
    filter: "agTextColumnFilter",
    filterParams: { buttons: ["reset"], filterOptions: ["contains"] },
    sortable: true,
  },
  {
    headerName: "Category",
    field: "category",
    cellRenderer: CategoryCell,
    flex: 1,
    minWidth: 120,
    filter: "agTextColumnFilter",
    filterParams: { buttons: ["reset"], filterOptions: ["equals"] },
    sortable: true,
  },
  {
    headerName: "Reference",
    field: "ref",
    flex: 1.4,
    minWidth: 150,
    cellStyle: { fontFamily: "monospace", fontSize: "11px", color: "#888888" },
    filter: "agTextColumnFilter",
    sortable: false,
  },
  {
    headerName: "Date",
    field: "date",
    flex: 1,
    minWidth: 110,
    cellStyle: { color: "#555555", fontSize: "12px" },
    sortable: true,
    sort: "desc",
    filter: "agTextColumnFilter",
  },
  {
    headerName: "Status",
    field: "status",
    cellRenderer: StatusCell,
    flex: 0.9,
    minWidth: 100,
    filter: "agTextColumnFilter",
    filterParams: { buttons: ["reset"], filterOptions: ["equals"] },
    sortable: true,
  },
  {
    headerName: "Amount",
    field: "amount",
    cellRenderer: AmountCell,
    flex: 1.2,
    minWidth: 140,
    type: "rightAligned",
    sortable: true,
    filter: "agNumberColumnFilter",
  },
];

// ─── AG Grid CSS overrides to match EterPay cream theme ─────────────────────
const GRID_STYLE = `
  .eterpay-grid .ag-root-wrapper { border: none; border-radius: 0; background: #fff; }
  .eterpay-grid .ag-header { background: #fbf9f5; border-bottom: 1px solid rgba(17,17,17,0.06); }
  .eterpay-grid .ag-header-cell-text { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #888; }
  .eterpay-grid .ag-row { border-bottom: 1px solid rgba(17,17,17,0.05); }
  .eterpay-grid .ag-row:hover { background: rgba(251,249,245,0.6) !important; }
  .eterpay-grid .ag-cell { display: flex; align-items: center; padding: 0 16px; }
  .eterpay-grid .ag-paging-panel { border-top: 1px solid rgba(17,17,17,0.06); background: #fbf9f5; color: #555; font-size: 11px; }
  .eterpay-grid .ag-paging-button { color: #0f4d40; }
`;

// ─── Page Component ──────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const gridApiRef = useRef<GridApi<Transaction> | null>(null);
  const [gridData, setGridData] = useState<Transaction[]>(ROW_DATA);
  const [aiFilterActive, setAiFilterActive] = useState<string | null>(null);

  // Fetch immutable ledger transactions from SQLite backend
  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch("/api/transactions?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: Transaction[] = data.map((d) => ({
              id: d.id,
              type: d.type === "credit" ? "credit" : "debit",
              category: d.category || "transfer",
              title: d.title,
              counterparty: d.counterparty || "EterPay Network",
              note: d.note || "",
              amount: d.amount,
              currency: d.currency || "INR",
              symbol: d.symbol || "₹",
              date: d.created_at ? new Date(d.created_at).toISOString().split("T")[0] : "2026-11-05",
              status: d.status || "completed",
              ref: d.ref || `TXN-${d.id.substring(0, 8)}`,
            }));
            setGridData(mapped);
          }
        }
      } catch {
        // Retain initial ROW_DATA fallback
      }
    }
    loadTransactions();
  }, []);

  // Expose a global hook so the AI chat page can drive this grid
  useEffect(() => {
    (window as Window & typeof globalThis & { __eterPayGridFilter?: (col: string, val: string) => void }).__eterPayGridFilter = (col: string, val: string) => {
      const api = gridApiRef.current;
      if (!api) return;
      if (!val || val === "all") {
        api.setFilterModel(null);
        setAiFilterActive(null);
      } else {
        api.setFilterModel({
          [col]: { filterType: "text", type: "equals", filter: val },
        });
        setAiFilterActive(`${col} = "${val}"`);
      }
      api.onFilterChanged();
    };
    return () => {
      delete (window as Window & typeof globalThis & { __eterPayGridFilter?: (col: string, val: string) => void }).__eterPayGridFilter;
    };
  }, []);

  const onGridReady = useCallback((e: GridReadyEvent<Transaction>) => {
    gridApiRef.current = e.api;
    // Apply cross-route filter if passed from AI Copilot
    if (typeof window !== "undefined") {
      let filterCol: string | null = null;
      let filterVal: string | null = null;
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("filterCol") && searchParams.get("filterVal")) {
        filterCol = searchParams.get("filterCol");
        filterVal = searchParams.get("filterVal");
      } else {
        const stored = sessionStorage.getItem("eterpay_grid_filter");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            filterCol = parsed.column;
            filterVal = parsed.value;
          } catch {}
        }
      }

      if (filterCol && filterVal) {
        e.api.setFilterModel({
          [filterCol]: { filterType: "text", type: "contains", filter: filterVal },
        });
        setAiFilterActive(`${filterCol} = "${filterVal}"`);
        e.api.onFilterChanged();
      }
    }
  }, []);

  const handleExport = useCallback(() => {
    gridApiRef.current?.exportDataAsCsv({ fileName: "eterpay-transactions.csv" });
  }, []);

  const clearAiFilter = useCallback(() => {
    gridApiRef.current?.setFilterModel(null);
    gridApiRef.current?.onFilterChanged();
    setAiFilterActive(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("eterpay_grid_filter");
      const url = new URL(window.location.href);
      url.searchParams.delete("filterCol");
      url.searchParams.delete("filterVal");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return (
    <>
      <style>{GRID_STYLE}</style>
      <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(17,17,17,0.08)]">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Audit Ledger · AG Grid</div>
              <h1 className="font-serif text-3xl text-[#111111]">Transaction History</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="demo-badge">Immutable Records</span>
              <button
                onClick={handleExport}
                className="btn btn-secondary text-xs px-4 py-2.5 rounded-full"
              >
                <Download className="w-3.5 h-3.5 mr-1 inline" /> Export CSV
              </button>
            </div>
          </div>

          {/* AI Filter Banner */}
          {aiFilterActive && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-medium"
              style={{ background: "rgba(15,77,64,0.07)", border: "1px solid rgba(15,77,64,0.18)", color: "#0f4d40" }}>
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                AI filter active: <code className="font-mono font-bold">{aiFilterActive}</code>
              </span>
              <button onClick={clearAiFilter} className="underline underline-offset-2 hover:no-underline">
                Clear filter
              </button>
            </div>
          )}

          {/* Desktop: AG Grid Table */}
          <div className="hidden md:block card bg-white overflow-hidden shadow-xs">
            <div
              className="eterpay-grid ag-theme-quartz"
              style={{ height: 540, width: "100%" }}
            >
              <AgGridReact<Transaction>
                rowData={gridData}
                columnDefs={COL_DEFS}
                rowHeight={60}
                headerHeight={40}
                pagination
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 20, 50]}
                onGridReady={onGridReady}
                suppressCellFocus
                enableCellTextSelection
                defaultColDef={{
                  resizable: true,
                  suppressMovable: false,
                }}
                noRowsOverlayComponent={() => (
                  <div className="p-8 text-center text-xs text-[#888888]">
                    No transactions match the active filter.
                  </div>
                )}
              />
            </div>
          </div>

          {/* Mobile: Dedicated Responsive Transaction Cards */}
          <div className="md:hidden space-y-3">
            {gridData.map((txn) => {
              const isCredit = txn.type === "credit";
              return (
                <div
                  key={txn.id}
                  className="card p-4 bg-white border border-[rgba(17,17,17,0.08)] rounded-2xl shadow-xs space-y-2.5 active:bg-[#fbf9f5] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCredit ? "bg-[#f0fdf4] text-[#16a34a]" : "bg-[#f4f0e8] text-[#111111]"
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#111111] leading-snug">{txn.title}</h4>
                        <p className="text-[10px] text-[#777777]">{txn.counterparty}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`font-serif text-sm font-semibold tabular-nums ${
                          isCredit ? "text-[#16a34a]" : "text-[#111111]"
                        }`}
                      >
                        {isCredit ? "+" : "−"} {txn.symbol}
                        {txn.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,17,17,0.05)] text-[10px] text-[#666666]">
                    <div className="flex items-center gap-2">
                      <span className="capitalize px-2 py-0.5 rounded-full font-medium bg-[rgba(15,77,64,0.07)] text-[#0f4d40]">
                        {txn.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[9px] text-[#888888]">
                        <Calendar size={10} /> {txn.date}
                      </span>
                    </div>
                    <span
                      className={`capitalize font-semibold text-[9px] px-2 py-0.5 rounded-full ${
                        txn.status === "completed"
                          ? "bg-[#f0fdf4] text-[#16a34a]"
                          : txn.status === "pending"
                          ? "bg-[#fffbeb] text-[#d97706]"
                          : "bg-[#fef2f2] text-[#dc2626]"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
