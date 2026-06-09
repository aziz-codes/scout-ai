import type { MatchStat } from "@/types";

interface StatBarsProps {
  stats: MatchStat[];
}

export function StatBars({ stats }: StatBarsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
      {stats.map((stat) => {
        const homePct = Math.round((stat.homeValue / stat.max) * 100);
        const awayPct = Math.round((stat.awayValue / stat.max) * 100);
        return (
          <div key={stat.name}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] text-white/45">{stat.name}</span>
              <div className="flex gap-1.5 text-[12px] font-bold">
                <span className="text-green-400">{stat.homeValue}{stat.unit ?? ""}</span>
                <span className="text-white/20">vs</span>
                <span className="text-red-400">{stat.awayValue}{stat.unit ?? ""}</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden flex gap-0.5">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${homePct}%` }}
              />
              <div
                className="h-full bg-red-400 rounded-full"
                style={{ width: `${awayPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
