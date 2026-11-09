"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Shield, ArrowDownLeft, Receipt, RefreshCw, CheckCheck, CheckCircle2 } from "lucide-react";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(DEMO_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItem = (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "credit":
        return <ArrowDownLeft className="w-4 h-4 text-[#16a34a]" />;
      case "security":
        return <Shield className="w-4 h-4 text-[#dc2626]" />;
      case "invoice":
        return <Receipt className="w-4 h-4 text-[#d97706]" />;
      default:
        return <Bell className="w-4 h-4 text-[#0f4d40]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-[rgba(17,17,17,0.08)]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0f4d40]">Audit Alerts</div>
            <h1 className="font-serif text-3xl text-[#111111]">Notifications &amp; Security Feed</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="btn btn-secondary text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark Read
            </button>
            <button
              onClick={() => setNotifs([])}
              className="btn btn-secondary text-xs px-3.5 py-2 rounded-full hover:text-[#dc2626]"
            >
              Clear Feed
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="card bg-white shadow-xs overflow-hidden">
          {notifs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-[#f0fdf4] text-[#16a34a] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#111111]">You&apos;re All Caught Up</h3>
              <p className="text-xs text-[#888888] max-w-sm mx-auto">
                No active notifications or financial security alerts require your attention.
              </p>
              <button
                onClick={() => setNotifs(DEMO_NOTIFICATIONS)}
                className="btn btn-secondary text-xs px-4 py-2 rounded-full mt-2"
              >
                Restore Demo Alerts
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(17,17,17,0.06)]">
              {notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markItem(n.id)}
                  className={`p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-[#fbf9f5] ${
                    !n.read ? "bg-[rgba(15,77,64,0.02)]" : ""
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-[#fbf9f5] border border-[rgba(17,17,17,0.06)] flex-shrink-0">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-semibold ${!n.read ? "text-[#111111]" : "text-[#555555]"}`}>
                        {n.title}
                      </h3>
                      <span className="text-[11px] text-[#888888]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#666666] mt-1 leading-relaxed">{n.body}</p>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#0f4d40] mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
