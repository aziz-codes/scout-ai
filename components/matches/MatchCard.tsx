"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Match } from "@/types";
import { cn, formatOdds } from "@/lib/utils";
import { Card, Badge } from "@/components/ui";
import { WinProbBar } from "./WinProbBar";
import { StatBars } from "./StatBars";
import { AIAnalysisBlock } from "./AIAnalysisBlock";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOdd, setSelectedOdd] = useState<"home" | "draw" | "away" | null>(null);

  function handleOddClick(e: React.MouseEvent, type: "home" | "draw" | "away") {
    e.stopPropagation();
    setSelectedOdd((prev) => (prev === type ? null : type));
  }

  return (
    <Card hover glow={expanded} className="overflow-hidden mb-3">
      {/* ── Match header (clickable) ─────────────────────────────────────── */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Meta row */}
        <div className="flex justify-between items-center mb-3.5">
          <Badge variant={match.status === "live" ? "live" : "green"}>
            {match.status === "live" && "Live · "}
            {match.group} · Match {match.matchNumber}
          </Badge>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[11px]",
                match.status === "soon" ? "text-yellow-400" : "text-white/40"
              )}
            >
              {match.kickoffLabel}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "text-white/30 transition-transform duration-200",
                expanded && "rotate-180 text-green-400"
              )}
            />
          </div>
        </div>

        {/* Teams row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Home */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-[22px] shrink-0">
              {match.home.flag}
            </div>
            <div>
              <div className="text-[15px] font-bold leading-tight">{match.home.name}</div>
              <div className="text-[11px] text-white/40">FIFA #{match.home.rank}</div>
            </div>
          </div>

          {/* VS */}
          <div className="font-display text-[18px] text-white/25 text-center px-1">VS</div>

          {/* Away */}
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center text-[22px] shrink-0">
              {match.away.flag}
            </div>
            <div className="text-right">
              <div className="text-[15px] font-bold leading-tight">{match.away.name}</div>
              <div className="text-[11px] text-white/40">FIFA #{match.away.rank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Odds row ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 px-4 pb-4 border-t border-white/[0.06] pt-3">
        {(
          [
            { key: "home" as const, label: `${match.home.name} Win`, value: match.odds.home },
            { key: "draw" as const, label: "Draw",                   value: match.odds.draw },
            { key: "away" as const, label: `${match.away.name} Win`, value: match.odds.away },
          ] as const
        ).map(({ key, label, value }) => (
          <button
            key={key}
            onClick={(e) => handleOddClick(e, key)}
            className={cn(
              "flex-1 rounded-lg border py-2 px-2 text-center transition-all duration-150",
              selectedOdd === key
                ? "border-yellow-400/60 bg-yellow-400/10 text-yellow-400"
                : "border-white/[0.08] bg-transparent text-white hover:bg-white/[0.07] hover:border-white/20"
            )}
          >
            <span
              className={cn(
                "block text-[10px] mb-0.5",
                selectedOdd === key ? "text-yellow-400/60" : "text-white/40"
              )}
            >
              {label}
            </span>
            <span className="block text-[15px] font-bold">{formatOdds(value)}</span>
          </button>
        ))}
      </div>

      {/* ── Expanded analysis ─────────────────────────────────────────────── */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.08] pt-4 bg-black/20">
          {/* Prediction box */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/[0.08] p-4 mb-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.14em] mb-1.5">
                  ⚡ AI Predicted Score
                </p>
                <p className="font-display text-[38px] leading-none text-white tracking-wide">
                  {match.prediction.score}
                </p>
                <p className="text-[12px] text-white/40 mt-1.5">
                  {match.home.name} to win
                  {match.prediction.btts && " · Both teams to score"}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-green-500/20 bg-green-500/10">
                <span className="font-display text-[22px] text-green-400 leading-none">
                  {match.prediction.confidence}%
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-wide">conf.</span>
              </div>
            </div>
          </div>

          {/* Win probability */}
          <WinProbBar
            homePct={match.prediction.homeWinPct}
            drawPct={match.prediction.drawPct}
            awayPct={match.prediction.awayWinPct}
            homeTeam={match.home.name}
            awayTeam={match.away.name}
          />

          {/* Stats */}
          <StatBars stats={match.stats} />

          {/* Key players */}
          <div className="flex gap-2 mb-1">
            {match.keyPlayers.map((player) => (
              <div
                key={player.name}
                className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2.5 text-center"
              >
                <div className="text-[20px]">{player.flag}</div>
                <div className="text-[12px] font-bold mt-1">{player.name}</div>
                <div className="text-[10px] text-white/40">
                  {player.role} · {player.teamCode}
                </div>
              </div>
            ))}
          </div>

          {/* AI analysis */}
          <AIAnalysisBlock prompt={match.aiPrompt} />
        </div>
      )}
    </Card>
  );
}
