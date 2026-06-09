// ─── Team ────────────────────────────────────────────────────────────────────
export interface Team {
  name: string;
  flag: string;
  rank: number;
  code: string;
}

// ─── Match ───────────────────────────────────────────────────────────────────
export type MatchStatus = "live" | "upcoming" | "done" | "soon";

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export interface MatchPrediction {
  score: string;
  confidence: number;
  homeWinPct: number;
  drawPct: number;
  awayWinPct: number;
  btts: boolean; // both teams to score
}

export interface MatchStat {
  name: string;
  homeValue: number;
  awayValue: number;
  max: number;
  unit?: string;
}

export interface KeyPlayer {
  flag: string;
  name: string;
  role: string;
  teamCode: string;
}

export interface Match {
  id: string;
  group: string;
  matchNumber: number;
  kickoff: string; // ISO or human-readable
  kickoffLabel: string;
  status: MatchStatus;
  venue: string;
  home: Team;
  away: Team;
  odds: MatchOdds;
  prediction: MatchPrediction;
  stats: MatchStat[];
  keyPlayers: KeyPlayer[];
  aiPrompt: string;
  result?: string; // e.g. "2-1" for completed matches
}

// ─── Fixture ─────────────────────────────────────────────────────────────────
export interface Fixture {
  homeTeam: string;
  homeFlag: string;
  awayTeam: string;
  awayFlag: string;
  score: string | null;
  status: MatchStatus;
  time: string;
  venue: string;
}

export interface FixtureGroup {
  name: string;
  fixtures: Fixture[];
}

// ─── Standings ───────────────────────────────────────────────────────────────
export type QualificationStatus = "through" | "maybe" | "out" | "pending";

export interface StandingRow {
  position: number;
  flag: string;
  team: string;
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: string[]; // e.g. ["W", "D", "L"]
  qualification: QualificationStatus;
}

export interface StandingGroup {
  name: string;
  rows: StandingRow[];
}

// ─── Fantasy ─────────────────────────────────────────────────────────────────
export type PlayerPosition = "GK" | "DEF" | "MID" | "AMF" | "FWD";

export interface FantasyPlayer {
  id: string;
  flag: string;
  name: string;
  team: string;
  teamCode: string;
  position: PlayerPosition;
  basePoints: number;
  projectedPoints: number;
  form: number; // 0-10
  ownership: number; // % of fantasy teams
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface AnalysisRequest {
  matchId: string;
  prompt: string;
}

export interface AnalysisResponse {
  content: string;
  error?: string;
}
// ─── Alerts ──────────────────────────────────────────────────────────────────────
export interface AlertTeam {
  name: string;
  flag: string;
  code: string;
}

export interface TeamAlert {
  id: string;
  email: string;
  teams: AlertTeam[];
  createdAt: string;
  active: boolean;
}
// ─── Navigation ──────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}
