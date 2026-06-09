import type { StandingGroup } from "@/types";
import { SectionHeader } from "@/components/ui";
import { cn, formatGD, qualColor, formColor } from "@/lib/utils";

interface StandingsTableProps {
  group: StandingGroup;
}

export function StandingsTable({ group }: StandingsTableProps) {
  return (
    <div className="mb-6">
      <SectionHeader>{group.name}</SectionHeader>

      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_repeat(5,_auto)] gap-x-3 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
          {["", "Team", "P", "GD", "W", "L", "Pts"].map((h, i) => (
            <span
              key={i}
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.12em] text-white/35",
                i > 1 ? "text-center" : ""
              )}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {group.rows.map((row, idx) => (
          <div
            key={row.code}
            className={cn(
              "grid grid-cols-[auto_1fr_repeat(5,_auto)] gap-x-3 px-3 py-2.5 items-center",
              idx < group.rows.length - 1 && "border-b border-white/[0.04]"
            )}
          >
            {/* Qual marker */}
            <div className={cn("w-1 h-5 rounded-full", qualColor(row.qualification))} />

            {/* Team name */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] text-white/30 w-4 shrink-0">{row.position}</span>
              <span className="text-[15px]">{row.flag}</span>
              <span className="text-[13px] font-medium truncate">{row.team}</span>
              {/* Form badges */}
              <div className="hidden sm:flex gap-1 ml-1">
                {row.form.map((f, fi) => (
                  <span
                    key={fi}
                    className={cn(
                      "w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center border",
                      formColor(f)
                    )}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <span className="text-[12px] text-white/50 text-center">{row.played}</span>
            <span
              className={cn(
                "text-[12px] font-semibold text-center",
                row.goalDiff > 0 ? "text-green-400" : row.goalDiff < 0 ? "text-red-400" : "text-white/50"
              )}
            >
              {formatGD(row.goalDiff)}
            </span>
            <span className="text-[12px] text-white/50 text-center">{row.won}</span>
            <span className="text-[12px] text-white/50 text-center">{row.lost}</span>
            <span className="text-[13px] font-bold text-green-400 text-center">{row.points}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2 px-1">
        {[
          { color: "bg-green-500", label: "Advancing" },
          { color: "bg-yellow-500", label: "Bubble" },
          { color: "bg-red-500",   label: "Eliminated" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", item.color)} />
            <span className="text-[10px] text-white/30">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
