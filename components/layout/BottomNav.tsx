"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-5 mt-5">
      <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-150",
                isActive
                  ? "bg-green-500/15 text-green-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold bg-yellow-400/15 text-yellow-400 border border-yellow-400/25 rounded px-1 py-px uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
