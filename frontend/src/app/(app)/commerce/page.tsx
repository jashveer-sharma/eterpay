"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star, CheckCircle2, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { DEMO_PRODUCTS_COMMERCE } from "@/lib/demo-data";

export default function CommercePage() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const addToCart = (product: typeof DEMO_PRODUCTS_COMMERCE[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    setPurchased(true);
    setCart([]);
    setTimeout(() => {
      setPurchased(false);
      setShowCart(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Universal Commerce</div>
            <h1 className="font-serif text-3xl text-[#111111]">Product Discovery & Checkout</h1>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="btn btn-secondary text-xs px-4 py-2 rounded-full relative"
          >
            <ShoppingCart className="w-4 h-4 mr-1 inline" /> Cart ({cart.reduce((a, b) => a + b.qty, 0)})
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PRODUCTS_COMMERCE.map((p) => (
            <div key={p.id} className="card p-6 bg-white flex flex-col justify-between hover:border-[#0f4d40]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[rgba(17,17,17,0.05)] text-[#555555]">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#d97706] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {p.rating}
                  </div>
                </div>
                <h3 className="font-semibold text-base text-[#111111] mb-2">{p.name}</h3>
                <div className="font-serif text-xl font-medium text-[#0f4d40] tabular mb-4">
                  ₹ {p.price.toLocaleString("en-IN")}
                </div>
              </div>

              <button
                onClick={() => addToCart(p)}
                className="btn btn-primary w-full text-xs py-2.5 rounded-xl font-medium"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Cart Drawer Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card p-6 bg-white max-w-md w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(17,17,17,0.08)]">
                <h3 className="font-serif text-xl text-[#111111]">Shopping Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-[#888888] text-sm">✕</button>
              </div>

              {purchased ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
                  <h4 className="font-serif text-xl text-[#111111]">Order Placed (Simulation)!</h4>
                  <p className="text-xs text-[#888888]">Simulated transaction recorded in audit ledger.</p>
                </div>
              ) : cart.length === 0 ? (
                <p className="text-xs text-[#888888] text-center py-6">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#fbf9f5]">
                        <div>
                          <div className="font-semibold text-[#111111]">{item.name}</div>
                          <span className="text-[#888888]">Qty: {item.qty}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-semibold tabular">
                            ₹ {(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#dc2626]">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[rgba(17,17,17,0.06)] flex justify-between font-serif text-lg font-medium text-[#111111]">
                    <span>Total Due:</span>
                    <span className="text-[#0f4d40] tabular">₹ {cartTotal.toLocaleString("en-IN")}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary w-full py-3 text-xs font-semibold"
                  >
                    Simulate PayPal Fast Checkout <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
