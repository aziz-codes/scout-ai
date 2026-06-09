import type { Metadata } from "next";
import { fetchGames } from "@/lib/api";
import { FixturesList } from "@/components/fixtures";

export const metadata: Metadata = { title: "Fixtures — ScoutAI" };

export default async function FixturesPage() {
  const games = await fetchGames();

  return (
    <div className="pb-10">
      <FixturesList initialGames={games} />
    </div>
  );
}
