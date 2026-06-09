interface WinProbBarProps {
  homePct: number;
  drawPct: number;
  awayPct: number;
  homeTeam: string;
  awayTeam: string;
}

export function WinProbBar({
  homePct,
  drawPct,
  awayPct,
  homeTeam,
  awayTeam,
}: WinProbBarProps) {
  return (
    <div className="mb-3">
      <div className="flex h-7 rounded-lg overflow-hidden gap-0.5 mb-1.5">
        <div
          className="flex items-center justify-center text-[11px] font-bold text-white bg-green-500/45 rounded-l-lg transition-all duration-500"
          style={{ width: `${homePct}%` }}
        >
          {homePct}%
        </div>
        <div
          className="flex items-center justify-center text-[11px] font-bold text-white/50 bg-white/10 transition-all duration-500"
          style={{ width: `${drawPct}%` }}
        >
          {drawPct}%
        </div>
        <div
          className="flex items-center justify-center text-[11px] font-bold text-white bg-red-500/40 rounded-r-lg transition-all duration-500"
          style={{ width: `${awayPct}%` }}
        >
          {awayPct}%
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-white/40">
        <span>{homeTeam} win</span>
        <span>Draw</span>
        <span>{awayTeam} win</span>
      </div>
    </div>
  );
}
