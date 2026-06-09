import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Days remaining until tournament end ─────────────────────────────────────
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// ─── Format odds to 2 decimal places ─────────────────────────────────────────
export function formatOdds(value: number): string {
  return value.toFixed(2);
}

// ─── Confidence color based on percentage ────────────────────────────────────
export function confidenceColor(pct: number): string {
  if (pct >= 75) return "text-green-400";
  if (pct >= 55) return "text-yellow-400";
  return "text-red-400";
}

// ─── Goal diff display ────────────────────────────────────────────────────────
export function formatGD(gd: number): string {
  if (gd > 0) return `+${gd}`;
  return String(gd);
}

// ─── Qualification badge color ────────────────────────────────────────────────
export function qualColor(status: string): string {
  switch (status) {
    case "through": return "bg-green-500";
    case "maybe":   return "bg-yellow-500";
    case "out":     return "bg-red-500";
    default:        return "bg-white/20";
  }
}

// ─── Form badge colors ────────────────────────────────────────────────────────
export function formColor(result: string): string {
  switch (result) {
    case "W": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "D": return "bg-white/10 text-white/50 border-white/20";
    case "L": return "bg-red-500/20 text-red-400 border-red-500/30";
    default:  return "bg-white/5 text-white/30 border-white/10";
  }
}

// ─── Truncate text ────────────────────────────────────────────────────────────
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}
