"use client";

import { LucideIcon, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="card p-8 sm:p-12 bg-white border border-[rgba(17,17,17,0.08)] rounded-2xl text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-[rgba(15,77,64,0.08)] text-[#0f4d40] flex items-center justify-center mb-1">
        <Icon size={24} />
      </div>
      <h3 className="font-serif text-lg text-[#111111]">{title}</h3>
      <p className="text-xs text-[#666666] max-w-sm leading-relaxed">{description}</p>

      {actionLabel && actionHref && (
        <div className="pt-2">
          <Link href={actionHref} className="btn btn-primary text-xs px-4 py-2 rounded-full">
            {actionLabel}
          </Link>
        </div>
      )}

      {actionLabel && onAction && !actionHref && (
        <div className="pt-2">
          <button onClick={onAction} className="btn btn-primary text-xs px-4 py-2 rounded-full">
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
