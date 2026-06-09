import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "gold" | "red" | "muted" | "live";
  className?: string;
}

export function Badge({ children, variant = "muted", className }: BadgeProps) {
  const variants = {
    green: "bg-green-500/15 text-green-400 border-green-500/25",
    gold:  "bg-yellow-400/10 text-yellow-400 border-yellow-400/25",
    red:   "bg-red-500/15 text-red-400 border-red-500/25",
    muted: "bg-white/5 text-white/50 border-white/10",
    live:  "bg-green-500/15 text-green-400 border-green-500/25",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border",
        variants[variant],
        className
      )}
    >
      {variant === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      {children}
    </span>
  );
}
