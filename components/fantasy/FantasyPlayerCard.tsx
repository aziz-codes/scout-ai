import type { FantasyPlayer } from "@/types";
import { cn } from "@/lib/utils";

interface FantasyPlayerCardProps {
  player: FantasyPlayer;
}

const positionColors: Record<string, string> = {
  GK:  "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  DEF: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  MID: "text-green-400 bg-green-400/10 border-green-400/20",
  AMF: "text-green-400 bg-green-400/10 border-green-400/20",
  FWD: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function FantasyPlayerCard({ player }: FantasyPlayerCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-center hover:border-white/20 transition-colors">
      <div className="text-[28px] mb-1">{player.flag}</div>
      <div className="text-[12px] font-bold truncate">{player.name}</div>
      <div className="text-[10px] text-white/40 mt-0.5">{player.team}</div>

      {/* Position badge */}
      <div
        className={cn(
          "inline-flex items-center text-[9px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 mt-1.5",
          positionColors[player.position] ?? "text-white/50 bg-white/5 border-white/10"
        )}
      >
        {player.position}
      </div>

      {/* Projected points */}
      <div className="mt-2 pt-2 border-t border-white/[0.06]">
        <span className="text-[14px] font-bold text-yellow-400">
          {player.projectedPoints}
        </span>
        <span className="text-[10px] text-white/35 ml-1">pts</span>
      </div>

      {/* Form bar */}
      <div className="mt-1.5 h-1 bg-white/[0.07] rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 rounded-full"
          style={{ width: `${(player.form / 10) * 100}%` }}
        />
      </div>
      <div className="text-[9px] text-white/25 mt-0.5">Form {player.form}/10</div>
    </div>
  );
}
