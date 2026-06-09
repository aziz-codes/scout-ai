import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionHeader({ children, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
      <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.14em] whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}
