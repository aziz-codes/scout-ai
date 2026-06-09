"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFlagUrl } from "@/lib/country-flags";
import type { APIGame } from "@/lib/api";
import { getMatchTime, getMatchStatus } from "@/lib/api";

interface TodayMatchesProps {
  games: APIGame[];
  dateLabel: string;
  isToday: boolean;
}

export function TodayMatches({ games, dateLabel, isToday }: TodayMatchesProps) {
  if (games.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-8 text-center">
        <div className="text-[40px] mb-3">⚽</div>
        <p className="text-white/50 text-[14px]">No matches scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.14em] whitespace-nowrap flex items-center gap-1.5">
          {isToday && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          )}
          {dateLabel}
        </span>
        <div className="flex-1 h-px bg-white/[0.08]" />
      </div>

      {/* Featured hero match - first game gets the big card */}
      {games.length > 0 && (
        <HeroMatchCard game={games[0]} />
      )}

      {/* Remaining matches in compact cards */}
      {games.length > 1 && (
        <div className="grid gap-2.5">
          {games.slice(1).map((game) => (
            <CompactMatchCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Hero Match Card (featured/first match) ──────────────────────────────────

function HeroMatchCard({ game }: { game: APIGame }) {
  const homeName = game.home_team_name_en || game.home_team_label || "TBD";
  const awayName = game.away_team_name_en || game.away_team_label || "TBD";
  const time = getMatchTime(game.local_date);
  const status = getMatchStatus(game);
  const hasTeamNames = !!game.home_team_name_en;

  const groupLabel = getGroupLabel(game);

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.06] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-green-500/[0.05] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 p-5 pb-4">
        {/* Badge row */}
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border bg-green-500/15 text-green-400 border-green-500/25">
            {status === "live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
            {groupLabel}
          </span>
          <StatusBadge status={status} time={time} />
        </div>

        {/* Teams display */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Home team */}
          <div className="flex flex-col items-center text-center">
            {hasTeamNames ? (
              <div className="relative w-16 h-16 mb-3">
                <div className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.1]" />
                <Image
                  src={getFlagUrl(homeName, 80)}
                  alt={homeName}
                  width={80}
                  height={60}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 mb-3 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <span className="text-[24px] text-white/30">?</span>
              </div>
            )}
            <div className="text-[16px] font-bold leading-tight">{homeName}</div>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center px-2">
            {status === "finished" || status === "live" ? (
              <>
                <div className="font-display text-[46px] leading-none text-white tracking-wider">
                  {game.home_score}
                  <span className="text-white/25 mx-1">–</span>
                  {game.away_score}
                </div>
                {status === "live" && game.time_elapsed !== "notstarted" && (
                  <div className="text-[11px] text-green-400 font-bold mt-1.5 animate-pulse">
                    {game.time_elapsed}&apos;
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="font-display text-[20px] text-white/20 mb-1">VS</div>
                <div className="text-[13px] text-white/50 font-semibold">{time}</div>
                <div className="text-[10px] text-white/30 mt-0.5">Local Time</div>
              </>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center text-center">
            {hasTeamNames ? (
              <div className="relative w-16 h-16 mb-3">
                <div className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.1]" />
                <Image
                  src={getFlagUrl(awayName, 80)}
                  alt={awayName}
                  width={80}
                  height={60}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 mb-3 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <span className="text-[24px] text-white/30">?</span>
              </div>
            )}
            <div className="text-[16px] font-bold leading-tight">{awayName}</div>
          </div>
        </div>

        {/* Scorers */}
        {(status === "finished" || status === "live") && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ScorersList
              scorers={game.home_scorers}
              teamName={homeName}
              align="left"
            />
            <ScorersList
              scorers={game.away_scorers}
              teamName={awayName}
              align="right"
            />
          </div>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="border-t border-white/[0.06] px-5 py-3 flex justify-between items-center bg-white/[0.02]">
        <span className="text-[11px] text-white/35">
          Match {game.id}
        </span>
        <span className={cn(
          "text-[11px] font-semibold",
          status === "live" ? "text-green-400" : status === "finished" ? "text-white/40" : "text-yellow-400"
        )}>
          {status === "live" ? "LIVE NOW" : status === "finished" ? "FULL TIME" : `KICKS OFF AT ${time}`}
        </span>
      </div>
    </div>
  );
}

// ─── Compact Match Card (remaining matches of the day) ───────────────────────

function CompactMatchCard({ game }: { game: APIGame }) {
  const homeName = game.home_team_name_en || game.home_team_label || "TBD";
  const awayName = game.away_team_name_en || game.away_team_label || "TBD";
  const time = getMatchTime(game.local_date);
  const status = getMatchStatus(game);
  const hasTeamNames = !!game.home_team_name_en;
  const groupLabel = getGroupLabel(game);

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 hover:border-green-500/20 hover:bg-green-500/[0.02] transition-all duration-200">
      {/* Badge row */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border bg-white/5 text-white/50 border-white/10">
          {groupLabel}
        </span>
        <StatusBadge status={status} time={time} compact />
      </div>

      {/* Teams row */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Home */}
        <div className="flex items-center gap-2.5">
          {hasTeamNames ? (
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] overflow-hidden shrink-0 relative">
              <Image
                src={getFlagUrl(homeName, 48)}
                alt={homeName}
                width={48}
                height={36}
                className="absolute inset-0 w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[14px] text-white/30 shrink-0">
              ?
            </div>
          )}
          <span className="text-[14px] font-bold leading-tight truncate">{homeName}</span>
        </div>

        {/* Score / Time */}
        <div className="text-center px-2">
          {status === "finished" || status === "live" ? (
            <div className="font-display text-[22px] leading-none text-white tracking-wider">
              {game.home_score}
              <span className="text-white/25 mx-0.5">–</span>
              {game.away_score}
            </div>
          ) : (
            <div className="font-display text-[14px] text-white/20">VS</div>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-2.5 flex-row-reverse">
          {hasTeamNames ? (
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] overflow-hidden shrink-0 relative">
              <Image
                src={getFlagUrl(awayName, 48)}
                alt={awayName}
                width={48}
                height={36}
                className="absolute inset-0 w-full h-full object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[14px] text-white/30 shrink-0">
              ?
            </div>
          )}
          <span className="text-[14px] font-bold leading-tight truncate text-right">{awayName}</span>
        </div>
      </div>

      {/* Time for upcoming matches */}
      {status === "upcoming" && (
        <div className="mt-2.5 text-center">
          <span className="text-[12px] text-white/35">{time} Local Time</span>
        </div>
      )}
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  time,
  compact = false,
}: {
  status: "live" | "finished" | "upcoming";
  time: string;
  compact?: boolean;
}) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-500/15 text-green-400 border border-green-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live
      </span>
    );
  }

  if (status === "finished") {
    return (
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
        FT
      </span>
    );
  }

  return (
    <span className={cn(
      "text-[10px] font-bold tracking-widest",
      compact ? "text-white/35" : "text-yellow-400/80"
    )}>
      {time}
    </span>
  );
}

// ─── Scorers list ────────────────────────────────────────────────────────────

function ScorersList({
  scorers,
  teamName,
  align,
}: {
  scorers: string;
  teamName: string;
  align: "left" | "right";
}) {
  if (!scorers || scorers === "null") return <div />;

  // Parse scorers - format can vary, try to split on commas
  const scorerList = scorers.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className={cn("space-y-0.5", align === "right" && "text-right")}>
      <div className="text-[9px] text-white/25 uppercase tracking-wide font-bold mb-1">
        {teamName}
      </div>
      {scorerList.map((scorer, i) => (
        <div
          key={`${teamName}-scorer-${i}`}
          className="text-[11px] text-white/50 flex items-center gap-1"
          style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
        >
          <span className="text-[10px]">⚽</span>
          <span>{scorer}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGroupLabel(game: APIGame): string {
  switch (game.type) {
    case "group":
      return `Group ${game.group} · Matchday ${game.matchday}`;
    case "r32":
      return "Round of 32";
    case "r16":
      return "Round of 16";
    case "qf":
      return "Quarter-final";
    case "sf":
      return "Semi-final";
    case "third":
      return "3rd Place Play-off";
    case "final":
      return "Final";
    default:
      return game.group;
  }
}
