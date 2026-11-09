"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons, PayPalMessages } from "@paypal/react-paypal-js";
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface PayPalCheckoutButtonProps {
  amount: number;
  currency: string;
  description: string;
  merchantName?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export function PayPalCheckoutButton({
  amount,
  currency,
  description,
  merchantName = "EterPay Network",
  onSuccess,
  onError,
  onCancel,
}: PayPalCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [capturedData, setCapturedData] = useState<any | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "sb";

  const apiBase = "";

  const handleCreateOrder = async (): Promise<string> => {
    setPaymentError(null);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/paypal/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          currency: currency.toUpperCase(),
          description: description,
          merchant_name: merchantName,
          idempotency_key:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `idemp_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Order creation failed (${res.status})`);
      }

      const data = await res.json();
      const orderId = data.order_id || data.id;
      if (!orderId) {
        throw new Error("No Order ID returned by PayPal Orders v2");
      }
      return orderId;
    } catch (err: any) {
      const msg = err.message || "Failed to initialize PayPal Order";
      setPaymentError(msg);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (data: any): Promise<void> => {
    setLoading(true);
    setPaymentError(null);

    try {
      const res = await fetch(`${apiBase}/api/paypal/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: data.orderID }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Capture failed (${res.status})`);
      }

      const captureResult = await res.json();
      setCapturedData(captureResult);
      onSuccess?.(captureResult);
    } catch (err: any) {
      const msg = err.message || "Payment capture failed";
      setPaymentError(msg);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  if (capturedData) {
    return (
      <div className="rounded-2xl p-6 bg-[rgba(15,77,64,0.06)] border border-[#0f4d40]/20 space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#0f4d40]/10 text-[#0f4d40] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-serif text-xl text-[#111111]">Payment Settled via EterPay</h4>
          <p className="text-xs text-[#555555] mt-1">
            Capture ID: <span className="font-mono text-[#0f4d40] font-semibold">{capturedData.capture_id}</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-left bg-white p-4 rounded-xl border border-[rgba(17,17,17,0.06)] text-xs">
          <div>
            <span className="text-[#888888]">Settled Amount:</span>
            <div className="font-semibold text-[#111111]">{capturedData.currency} {capturedData.amount}</div>
          </div>
          <div>
            <span className="text-[#888888]">Payer Account:</span>
            <div className="font-semibold text-[#111111] truncate">{capturedData.payer_email || "sandbox-user"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Sandbox Badge */}
      <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-[rgba(15,77,64,0.05)] border border-[#0f4d40]/20 text-[#0f4d40]">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0f4d40]" />
          <span>EterPay Secure Checkout · PayPal Orders v2</span>
        </div>
        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#0f4d40]/30 font-semibold">
          SANDBOX VERIFIED
        </span>
      </div>

      {paymentError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{paymentError}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#555555]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#0f4d40]" />
          <span>Connecting with PayPal Sandbox Orders API...</span>
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId: clientId,
          currency: currency.toUpperCase() === "INR" ? "USD" : currency.toUpperCase(),
          intent: "capture",
          components: "buttons,messages",
        }}
      >
        <div className="relative z-10 min-h-[140px] space-y-3">
          <div className="p-2.5 rounded-lg bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] text-[11px]">
            <PayPalMessages
              amount={currency.toUpperCase() === "INR" ? Math.max(Math.round(amount / 83), 1) : Math.max(amount, 1)}
              style={{ layout: "text", logo: { type: "primary" } }}
            />
          </div>
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
              height: 48,
            }}
            createOrder={handleCreateOrder}
            onApprove={handleApprove}
            onCancel={() => {
              onCancel?.();
            }}
            onError={(err) => {
              setPaymentError("PayPal window encountered an error or was closed.");
              onError?.(err);
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}
