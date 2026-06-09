"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Calendar, Trophy, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFlagUrl } from "@/lib/country-flags";
import type { APIGame } from "@/lib/api";
import { getMatchTime, getMatchStatus, getGameDateKey } from "@/lib/api";

interface FixturesListProps {
  initialGames: APIGame[];
}

type TabType = "all" | "group" | "knockout";

export function FixturesList({ initialGames }: FixturesListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Get all unique groups in the group stage for the filter pill
  const groupStageGroups = useMemo(() => {
    const groups = new Set<string>();
    initialGames.forEach((g) => {
      if (g.type === "group" && g.group) {
        groups.add(g.group);
      }
    });
    return Array.from(groups).sort();
  }, [initialGames]);

  // Filter games based on search query, active tab, and selected group stage group
  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      // 1. Stage filter
      if (activeTab === "group" && game.type !== "group") return false;
      if (activeTab === "knockout" && game.type === "group") return false;

      // 2. Group filter (only applicable when group stage or all is selected)
      if (
        selectedGroup !== "all" &&
        (game.type !== "group" || game.group !== selectedGroup)
      ) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const homeName = (
          game.home_team_name_en ||
          game.home_team_label ||
          ""
        ).toLowerCase();
        const awayName = (
          game.away_team_name_en ||
          game.away_team_label ||
          ""
        ).toLowerCase();
        const groupName = game.group ? game.group.toLowerCase() : "";
        const stadium = game.stadium_id ? `stadium ${game.stadium_id}` : "";

        const matchesSearch =
          homeName.includes(query) ||
          awayName.includes(query) ||
          groupName.includes(query) ||
          stadium.includes(query);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [initialGames, activeTab, selectedGroup, searchQuery]);

  // Group filtered games by date key (YYYY-MM-DD)
  const groupedGames = useMemo(() => {
    const groups: Record<string, APIGame[]> = {};
    filteredGames.forEach((game) => {
      const dateKey = getGameDateKey(game.local_date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(game);
    });

    // Sort dates ascending
    return Object.keys(groups)
      .sort()
      .map((dateKey) => ({
        dateKey,
        dateLabel: formatDateHeader(dateKey),
        games: groups[dateKey],
      }));
  }, [filteredGames]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedGroup("all"); // Reset group filter when tab changes
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/30">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search team, group, or match..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-green-500/30 focus:bg-green-500/[0.01] transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[11px] font-bold text-white/30 hover:text-white/60"
          >
            Clear
          </button>
        )}
      </div>

      {/* Navigation / Stage Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
        {(
          [
            { id: "all", label: "All Matches", icon: <Calendar size={14} /> },
            { id: "group", label: "Group Stage", icon: <SlidersHorizontal size={14} /> },
            { id: "knockout", label: "Knockout Stage", icon: <Trophy size={14} /> },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-green-500/15 text-green-400 border border-green-500/10"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Group filters (only for group stage/all) */}
      {(activeTab === "group" || activeTab === "all") && (
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none mask-image-horizontal">
          <button
            onClick={() => setSelectedGroup("all")}
            className={cn(
              "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer",
              selectedGroup === "all"
                ? "bg-green-400 text-black font-extrabold"
                : "bg-white/[0.04] text-white/50 border border-white/[0.08] hover:text-white"
            )}
          >
            All Groups
          </button>
          {groupStageGroups.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer",
                selectedGroup === g
                  ? "bg-green-400 text-black font-extrabold"
                  : "bg-white/[0.04] text-white/50 border border-white/[0.08] hover:text-white"
              )}
            >
              Group {g}
            </button>
          ))}
        </div>
      )}

      {/* Fixtures list */}
      <div className="space-y-6 pt-1">
        {groupedGames.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <span className="text-[32px] block mb-2">🔍</span>
            <p className="text-[14px] text-white/40">No matching fixtures found</p>
          </div>
        ) : (
          groupedGames.map(({ dateLabel, games }) => (
            <div key={dateLabel} className="space-y-2">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.14em] whitespace-nowrap">
                  {dateLabel}
                </span>
                <div className="flex-1 h-px bg-white/[0.05]" />
                <span className="text-[10px] text-white/20 whitespace-nowrap">
                  {games.length} {games.length === 1 ? "match" : "matches"}
                </span>
              </div>

              {/* Day's games */}
              <div className="grid gap-2">
                {games.map((game) => (
                  <FixtureItem key={game._id} game={game} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Individual Fixture Item ────────────────────────────────────────────────

function FixtureItem({ game }: { game: APIGame }) {
  const homeName = game.home_team_name_en || game.home_team_label || "TBD";
  const awayName = game.away_team_name_en || game.away_team_label || "TBD";
  const time = getMatchTime(game.local_date);
  const status = getMatchStatus(game);
  const isGroupStage = game.type === "group";

  // Check if we have real team names (not placeholders like "Winner Group A")
  const hasHomeFlag = !!game.home_team_name_en;
  const hasAwayFlag = !!game.away_team_name_en;

  const stageBadge = isGroupStage
    ? `Group ${game.group}`
    : getKnockoutRoundName(game.type);

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-green-500/15 hover:bg-green-500/[0.01] transition-all duration-200">
      {/* Teams and Flags */}
      <div className="flex-1 min-w-0">
        {/* Stage Badge & Match ID info */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-extrabold text-white/35 uppercase tracking-wider bg-white/5 border border-white/10 rounded px-1.5 py-px">
            {stageBadge}
          </span>
          {isGroupStage && (
            <span className="text-[9px] font-semibold text-white/20 uppercase tracking-wider">
              MD {game.matchday}
            </span>
          )}
          <span className="text-[9px] font-semibold text-white/20 uppercase tracking-wider">
            Match {game.id}
          </span>
        </div>

        {/* Teams row */}
        <div className="flex flex-col gap-2">
          {/* Home team */}
          <div className="flex items-center gap-2 min-w-0">
            {hasHomeFlag ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/5 border border-white/10">
                <Image
                  src={getFlagUrl(homeName, 40)}
                  alt={homeName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[10px] text-white/30 shrink-0">
                ?
              </div>
            )}
            <span className={cn(
              "text-[13px] font-semibold truncate",
              game.finished === "TRUE" && Number(game.home_score) < Number(game.away_score) ? "text-white/40" : "text-white"
            )}>
              {homeName}
            </span>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 min-w-0">
            {hasAwayFlag ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/5 border border-white/10">
                <Image
                  src={getFlagUrl(awayName, 40)}
                  alt={awayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[10px] text-white/30 shrink-0">
                ?
              </div>
            )}
            <span className={cn(
              "text-[13px] font-semibold truncate",
              game.finished === "TRUE" && Number(game.away_score) < Number(game.home_score) ? "text-white/40" : "text-white"
            )}>
              {awayName}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Score / Kickoff time & Status */}
      <div className="flex flex-col items-end justify-center pl-4 shrink-0 text-right">
        {status === "live" ? (
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-green-500/15 text-green-400 border border-green-500/25">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
            <div className="font-display text-[20px] text-white tracking-widest leading-none mt-1">
              {game.home_score} - {game.away_score}
            </div>
            {game.time_elapsed !== "notstarted" && (
              <span className="text-[10px] text-green-400 font-bold leading-none animate-pulse">
                {game.time_elapsed}&apos;
              </span>
            )}
          </div>
        ) : status === "finished" ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-extrabold text-white/30 bg-white/5 border border-white/10 rounded px-1.5 py-px uppercase tracking-wider">
              FT
            </span>
            <div className="font-display text-[20px] text-white/90 tracking-widest leading-none mt-1">
              {game.home_score} - {game.away_score}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[12px] font-display text-white/80 leading-none">
              {time}
            </span>
            <span className="text-[10px] text-white/30 font-medium">
              Local Time
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDateHeader(dateKey: string): string {
  // Format: "YYYY-MM-DD"
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  return `${weekday} · ${monthName} ${day}, ${year}`;
}

function getKnockoutRoundName(type: string): string {
  switch (type) {
    case "r32": return "Round of 32";
    case "r16": return "Round of 16";
    case "qf":  return "Quarter-finals";
    case "sf":  return "Semi-finals";
    case "third": return "3rd Place Play-off";
    case "final": return "Final";
    default:    return "Knockout";
  }
}
