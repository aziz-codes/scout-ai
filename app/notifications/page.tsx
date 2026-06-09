import type { Metadata } from "next";
import { fetchGames, extractTeamsFromGames } from "@/lib/api";
import { NotificationAlertsBuilder } from "@/components/notifications";

export const metadata: Metadata = { title: "Alerts — ScoutAI" };

export default async function NotificationsPage() {
  const games = await fetchGames();
  const teams = extractTeamsFromGames(games);

  return (
    <div>
      <NotificationAlertsBuilder teams={teams} />
    </div>
  );
}
