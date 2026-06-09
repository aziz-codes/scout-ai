import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white/[0.04] border-white/[0.08]",
        hover && "transition-colors duration-200 hover:border-green-500/30 hover:bg-green-500/[0.03]",
        glow && "border-green-500/35",
        className
      )}
    >
      {children}
    </div>
  );
}
