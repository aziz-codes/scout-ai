import type { Metadata } from "next";
import { FIXTURE_GROUPS } from "@/data";
import { FixtureGroupSection } from "@/components/fixtures/FixtureGroupSection";
import { SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Fixtures — ScoutAI" };

const KNOCKOUT_ROUNDS = [
  { stage: "Round of 32",  note: "×16 matches",                         date: "Jun 29 – Jul 4", gold: false },
  { stage: "Quarter-finals", note: "×8 matches",                        date: "Jul 8–9",         gold: false },
  { stage: "Semi-finals",  note: "AT&T Dallas · Mercedes-Benz Atlanta", date: "Jul 14–15",       gold: false },
  { stage: "FINAL",        note: "MetLife Stadium, New Jersey",          date: "Jul 19",          gold: true  },
];

export default function FixturesPage() {
  return (
    <div>
      <SectionHeader>Group Stage · June 11–27</SectionHeader>
      {FIXTURE_GROUPS.map((group) => (
        <FixtureGroupSection key={group.name} group={group} />
      ))}

      <SectionHeader className="mt-2">Knockout Rounds</SectionHeader>
      {KNOCKOUT_ROUNDS.map((r) => (
        <div
          key={r.stage}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border mb-1.5 ${
            r.gold
              ? "border-yellow-400/30 bg-yellow-400/[0.04]"
              : "border-white/[0.06] bg-white/[0.03] opacity-60"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">🏆</span>
            <div>
              <p className={`text-[13px] font-semibold ${r.gold ? "text-yellow-400" : ""}`}>
                {r.stage}
              </p>
              <p className="text-[11px] text-white/35">{r.note}</p>
            </div>
          </div>
          <span className={`text-[11px] ${r.gold ? "text-yellow-400" : "text-white/35"}`}>
            {r.date}
          </span>
        </div>
      ))}
    </div>
  );
}
