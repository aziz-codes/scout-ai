"use client";

import { useState } from "react";

interface AIAnalysisBlockProps {
  prompt: string;
}

export function AIAnalysisBlock({ prompt }: AIAnalysisBlockProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  async function loadAnalysis() {
    setLoading(true);
    setError("");
    setText("");

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("API error");

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
          if (data === "[DONE]") {
            setLoaded(true);
            break;
          }
          try {
            const json = JSON.parse(data);
            if (json.text) setText((prev) => prev + json.text);
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch {
      setError("Could not load AI analysis. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-yellow-400/15 bg-yellow-400/[0.06] p-3.5 mt-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        {loading ? (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin" />
        ) : (
          <span className="text-yellow-400 text-sm">★</span>
        )}
        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.14em]">
          {loading ? "Generating Scout Report…" : "AI Scout Report"}
        </span>
      </div>

      {/* Content */}
      {!text && !loading && !error && (
        <p className="text-[12px] text-white/30 italic mb-3">
          Click below to generate a live tactical analysis for this match.
        </p>
      )}

      {error && (
        <p className="text-[12px] text-red-400 mb-3">{error}</p>
      )}

      {text && (
        <p className="text-[13px] text-white/70 leading-relaxed mb-2">
          {text}
          {loading && (
            <span className="inline-block w-0.5 h-3.5 bg-yellow-400 ml-0.5 animate-pulse" />
          )}
        </p>
      )}

      {/* CTA button */}
      {!loaded && !loading && (
        <button
          onClick={loadAnalysis}
          className="text-[12px] font-semibold text-yellow-400 border border-yellow-400/25 rounded-lg px-3 py-1.5 hover:bg-yellow-400/10 transition-colors"
        >
          {error ? "Retry Analysis" : "Load AI Analysis ↗"}
        </button>
      )}
    </div>
  );
}
