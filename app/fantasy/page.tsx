import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui";
import { FantasyLineupBuilder } from "@/components/fantasy/FantasyLineupBuilder";

export const metadata: Metadata = { title: "Fantasy — ScoutAI" };

export default function FantasyPage() {
  return (
    <div>
      {/* Intro card */}
      <Card className="p-4 mb-5">
        <h2 className="text-[16px] font-bold mb-1.5">AI Fantasy Lineup Builder</h2>
        <p className="text-[13px] text-white/45 leading-relaxed">
          ScoutAI selects your optimal World Cup fantasy XI based on form,
          projected minutes, and today&apos;s matchups. Hit regenerate for a
          new AI-powered lineup with a fresh tactical rationale.
        </p>
      </Card>

      <SectionHeader>Your AI-Selected XI</SectionHeader>
      <FantasyLineupBuilder />

      {/* Stats footer */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { value: "48",  label: "Players tracked" },
          { value: "12",  label: "Matchdays left" },
          { value: "104", label: "Total matches" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-center"
          >
            <div className="font-display text-[28px] text-green-400 leading-none">{s.value}</div>
            <div className="text-[10px] text-white/35 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
