import type { Fixture } from "@/types";
import { Badge } from "@/components/ui";

interface FixtureRowProps {
  fixture: Fixture;
}

export function FixtureRow({ fixture }: FixtureRowProps) {
  const statusBadge = {
    live:     <Badge variant="live">● Live</Badge>,
    soon:     <Badge variant="gold">Soon</Badge>,
    upcoming: <Badge variant="gold">Upcoming</Badge>,
    done:     <Badge variant="muted">FT</Badge>,
  }[fixture.status];

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] mb-1.5">
      {/* Teams */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[15px]">{fixture.homeFlag}</span>
        <span className="font-medium">{fixture.homeTeam}</span>
        <span className="text-white/25 text-[11px]">vs</span>
        <span className="text-[15px]">{fixture.awayFlag}</span>
        <span className="font-medium">{fixture.awayTeam}</span>
      </div>

      {/* Right side */}
      <div className="text-right flex flex-col items-end gap-0.5">
        {statusBadge}
        {fixture.score && (
          <span className="font-display text-[16px] text-white/90 tracking-wide leading-none mt-0.5">
            {fixture.score}
          </span>
        )}
        <span className="text-[11px] text-white/35">{fixture.time}</span>
      </div>
    </div>
  );
}
