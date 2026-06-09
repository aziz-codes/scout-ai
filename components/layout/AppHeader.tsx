import { daysUntil } from "@/lib/utils";

export function AppHeader() {
  const daysLeft = daysUntil(
    process.env.NEXT_PUBLIC_TOURNAMENT_END ?? "2026-07-19"
  );

  return (
    <header className="px-5 pt-8 pb-0">
      {/* Logo row */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="font-display text-[52px] leading-none tracking-wide">
            SCOUT<span className="text-green-400">AI</span>
          </h1>
          <p className="text-[12px] text-white/40 font-medium uppercase tracking-[0.14em] mt-1">
            FIFA World Cup 2026 · Match Intelligence
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-green-500/12 border border-green-500/25 text-[11px] font-bold text-green-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Tournament banner */}
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 flex justify-between items-center gap-4">
        <div>
          <p className="text-[14px] font-semibold text-white">
            FIFA World Cup 2026™
          </p>
          <p className="text-[13px] text-white/45 mt-0.5">
            June 11 – July 19 · USA / Mexico / Canada
          </p>
        </div>
        <div className="flex gap-5 shrink-0">
          <Stat value="104" label="Matches" />
          <Stat value="48"  label="Teams" />
          <Stat value={String(daysLeft)} label="Days Left" highlight />
        </div>
      </div>
    </header>
  );
}

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`font-display text-[28px] leading-none ${
          highlight ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] text-white/35 uppercase tracking-[0.1em] mt-1">
        {label}
      </div>
    </div>
  );
}
