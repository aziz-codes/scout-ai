import type { Metadata } from "next";
import { fetchGames, findRelevantGames } from "@/lib/api";
import { TodayMatches } from "@/components/matches/TodayMatches";
import { PaywallCard } from "@/components/predictions/PaywallCard";

export const metadata: Metadata = {
  title: "Predictions — ScoutAI",
};

export default async function PredictionsPage() {
  const allGames = await fetchGames();
  const { games, dateLabel, isToday } = findRelevantGames(allGames);

  return (
    <div>
      <TodayMatches games={games} dateLabel={dateLabel} isToday={isToday} />
      <div className="mt-5">
        <PaywallCard />
      </div>
    </div>
  );
}
