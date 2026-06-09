// ─── World Cup API data fetching ─────────────────────────────────────────────

export interface APIGame {
  _id: string;
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string;
  away_score: string;
  home_scorers: string;
  away_scorers: string;
  group: string;
  matchday: string;
  local_date: string; // "MM/DD/YYYY HH:mm"
  persian_date: string;
  stadium_id: string;
  finished: string; // "TRUE" or "FALSE"
  time_elapsed: string;
  type: string;
  // Group stage games have team names
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
  // Knockout games have labels instead
  home_team_label?: string;
  away_team_label?: string;
}

export interface APIResponse {
  games: APIGame[];
}

/**
 * Parse the API's "MM/DD/YYYY HH:mm" format to a JavaScript Date.
 * The dates appear to be in local US time (ET). We'll treat them as UTC-4 for display.
 */
export function parseGameDate(localDate: string): Date {
  // Format: "06/11/2026 13:00"
  const [datePart, timePart] = localDate.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  // Create date in UTC, treating the times as US Eastern (UTC-4 during summer / EDT)
  return new Date(Date.UTC(year, month - 1, day, hours + 4, minutes));
}

/**
 * Get just the date string "YYYY-MM-DD" from the game's local_date for grouping by day.
 */
export function getGameDateKey(localDate: string): string {
  const [datePart] = localDate.split(" ");
  const [month, day, year] = datePart.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Fetch all games from the World Cup API.
 */
export async function fetchGames(): Promise<APIGame[]> {
  try {
    const res = await fetch("https://worldcup26.ir/get/games", {
      next: { revalidate: 300 }, // revalidate every 5 minutes
    });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data: APIResponse = await res.json();
    return data.games;
  } catch (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
}

/**
 * Find today's matches, or the nearest upcoming match day if no games today.
 * Returns the games and the date label.
 */
export function findRelevantGames(games: APIGame[]): {
  games: APIGame[];
  dateLabel: string;
  isToday: boolean;
} {
  // Current date in UTC (we'll compare date parts)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Group games by date
  const gamesByDate = new Map<string, APIGame[]>();
  for (const game of games) {
    const dateKey = getGameDateKey(game.local_date);
    if (!gamesByDate.has(dateKey)) {
      gamesByDate.set(dateKey, []);
    }
    gamesByDate.get(dateKey)!.push(game);
  }

  // Sort dates
  const sortedDates = Array.from(gamesByDate.keys()).sort();

  // Check if today has games
  if (gamesByDate.has(todayStr)) {
    return {
      games: gamesByDate.get(todayStr)!,
      dateLabel: formatDateLabel(todayStr, true),
      isToday: true,
    };
  }

  // Find nearest future date with games
  const futureDate = sortedDates.find((d) => d > todayStr);
  if (futureDate) {
    return {
      games: gamesByDate.get(futureDate)!,
      dateLabel: formatDateLabel(futureDate, false),
      isToday: false,
    };
  }

  // If no future games, show the most recent past games
  const pastDates = sortedDates.filter((d) => d <= todayStr);
  if (pastDates.length > 0) {
    const lastDate = pastDates[pastDates.length - 1];
    return {
      games: gamesByDate.get(lastDate)!,
      dateLabel: formatDateLabel(lastDate, false, true),
      isToday: false,
    };
  }

  return { games: [], dateLabel: "No matches scheduled", isToday: false };
}

function formatDateLabel(dateStr: string, isToday: boolean, isPast: boolean = false): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date.toLocaleDateString("en-US", { month: "long" });
  const dayNum = date.getDate();
  const yearStr = date.getFullYear();

  if (isToday) {
    return `Today · ${monthName} ${dayNum}, ${yearStr}`;
  }

  // Check if it's tomorrow
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()
  ) {
    return `Tomorrow · ${monthName} ${dayNum}, ${yearStr}`;
  }

  if (isPast) {
    return `Last Played · ${monthName} ${dayNum}, ${yearStr}`;
  }

  // Calculate days until
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.ceil((date.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${weekday} · ${monthName} ${dayNum}, ${yearStr}`;
  }

  return `Upcoming · ${monthName} ${dayNum}, ${yearStr}`;
}

/**
 * Get the match time from the local_date string formatted nicely.
 */
export function getMatchTime(localDate: string): string {
  const [, timePart] = localDate.split(" ");
  return timePart; // "13:00", "20:00", etc.
}

/**
 * Determine match status from API data.
 */
export function getMatchStatus(game: APIGame): "live" | "finished" | "upcoming" {
  if (game.finished === "TRUE") return "finished";
  if (game.time_elapsed !== "notstarted") return "live";
  return "upcoming";
}
