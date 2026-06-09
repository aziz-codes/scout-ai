"use client";

import { useState, useCallback } from "react";
import type { FantasyPlayer } from "@/types";
import { FANTASY_PLAYERS, FANTASY_AI_PROMPT } from "@/data";
import { FantasyPlayerCard } from "./FantasyPlayerCard";

function pickLineup(): FantasyPlayer[] {
  return [...FANTASY_PLAYERS].sort(() => Math.random() - 0.5).slice(0, 8);
}

export function FantasyLineupBuilder() {
  const [lineup, setLineup] = useState<FantasyPlayer[]>(() => pickLineup());
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const regenerate = useCallback(async () => {
    setLineup(pickLineup());
    setAiText("");
    setLoading(true);
    setGenerated(false);

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: FANTASY_AI_PROMPT }),
      });

      if (!res.ok) throw new Error();

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { setGenerated(true); break; }
          try {
            const json = JSON.parse(data);
            if (json.text) setAiText((p) => p + json.text);
          } catch { /* skip */ }
        }
      }
    } catch {
      setAiText("Could not generate AI rationale. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPts = lineup.reduce((s, p) => s + p.projectedPoints, 0);

  return (
    <div>
      {/* Player grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {lineup.map((player) => (
          <FantasyPlayerCard key={player.id} player={player} />
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.04] mb-4">
        <div>
          <p className="text-[11px] text-white/40 uppercase tracking-widest">Total Projected</p>
          <p className="font-display text-[28px] text-yellow-400 leading-none mt-0.5">{totalPts} pts</p>
        </div>
        <button
          onClick={regenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-green-400 text-[#07100d] font-bold text-[13px] rounded-xl px-5 py-2.5 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#07100d]/30 border-t-[#07100d] animate-spin" />
          ) : (
            "⚡"
          )}
          {loading ? "Building lineup…" : "Regenerate AI Lineup"}
        </button>
      </div>

      {/* AI rationale */}
      {(aiText || loading) && (
        <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/[0.05] p-4">
          <div className="flex items-center gap-2 mb-2">
            {loading && !generated ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
            ) : (
              <span className="text-yellow-400">★</span>
            )}
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.14em]">
              AI Lineup Rationale
            </span>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed">
            {aiText}
            {loading && (
              <span className="inline-block w-0.5 h-3.5 bg-yellow-400 ml-0.5 animate-pulse" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}
