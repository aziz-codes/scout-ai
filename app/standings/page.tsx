import type { Metadata } from "next";
import { STANDING_GROUPS } from "@/data";
import { StandingsTable } from "@/components/standings/StandingsTable";
import { SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Standings — ScoutAI" };

export default function StandingsPage() {
  return (
    <div>
      <SectionHeader>Group Stage Standings</SectionHeader>
      {STANDING_GROUPS.map((group) => (
        <StandingsTable key={group.name} group={group} />
      ))}
    </div>
  );
}
