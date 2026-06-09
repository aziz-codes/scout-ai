"use client";

import { useState, useMemo } from "react";
import type { AlertTeam } from "@/types";
import { Card, SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import { X, Bell, Mail, CheckCircle } from "lucide-react";

interface NotificationAlertsBuilderProps {
  teams: Array<{
    name: string;
    flag: string;
    code: string;
  }>;
}

export function NotificationAlertsBuilder({
  teams,
}: NotificationAlertsBuilderProps) {
  const [selectedTeams, setSelectedTeams] = useState<AlertTeam[]>([]);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Filter teams based on search query
  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.code.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, teams]);

  // Toggle team selection
  const toggleTeam = (team: AlertTeam) => {
    setSelectedTeams((prev) => {
      const isSelected = prev.some((t) => t.code === team.code);
      if (isSelected) {
        return prev.filter((t) => t.code !== team.code);
      } else {
        // Limit to 2 teams
        if (prev.length < 2) {
          return [...prev, team];
        }
        return prev;
      }
    });
  };

  // Remove selected team
  const removeTeam = (code: string) => {
    setSelectedTeams((prev) => prev.filter((t) => t.code !== code));
  };

  // Validate and submit
  const handleCreateAlert = async () => {
    // Validation
    if (selectedTeams.length !== 2) {
      setErrorMessage("Please select exactly 2 teams");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teams: selectedTeams,
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create alert");
      }

      setSuccessMessage(
        "✓ Alert created! You'll receive notifications for these teams' matches.",
      );
      setSelectedTeams([]);
      setEmail("");
      setSearchQuery("");

      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create alert";
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader>Match Alerts</SectionHeader>

      {/* Info Section */}
      <Card className="bg-blue-500/10 border border-blue-400/20">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Get Match Notifications</p>
            <p>
              Select 2 teams and we'll notify you via email when their matches
              are coming up.
            </p>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/15 border border-green-400/30">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-300">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="px-4 py-3 rounded-lg bg-red-500/15 border border-red-400/30">
          <p className="text-sm text-red-300">{errorMessage}</p>
        </div>
      )}

      {/* Selected Teams */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white/70">
            Selected Teams
          </label>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full",
              selectedTeams.length === 2
                ? "bg-green-500/20 text-green-400 border border-green-400/30"
                : "bg-white/5 text-white/50 border border-white/10",
            )}
          >
            {selectedTeams.length}/2
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTeams.map((team) => (
            <div
              key={team.code}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-400/40"
            >
              <span className="text-lg">{team.flag}</span>
              <span className="text-sm font-medium text-green-300">
                {team.name}
              </span>
              <button
                onClick={() => removeTeam(team.code)}
                className="ml-1 text-green-400 hover:text-green-300 transition-colors"
                aria-label={`Remove ${team.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {selectedTeams.length === 0 && (
            <p className="text-sm text-white/40">No teams selected yet</p>
          )}
        </div>
      </div>

      {/* Team Search and Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white/70 block">
          Search & Select Teams
        </label>

        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border text-white placeholder-white/30",
            "transition-colors duration-150 focus:outline-none focus:ring-2",
            "border-white/[0.08] focus:ring-green-400/40 focus:border-green-400/30",
          )}
        />

        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
          {filteredTeams.map((team) => {
            const isSelected = selectedTeams.some((t) => t.code === team.code);
            const isDisabled = !isSelected && selectedTeams.length === 2;

            return (
              <button
                key={team.code}
                onClick={() => toggleTeam(team)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm transition-all",
                  "border duration-150 text-left",
                  isSelected
                    ? "bg-green-500/25 border-green-400/50 text-green-300"
                    : isDisabled
                      ? "bg-white/[0.02] border-white/[0.05] text-white/30 cursor-not-allowed opacity-50"
                      : "bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.08] hover:border-white/15",
                )}
              >
                <span className="text-lg">{team.flag}</span>
                <span className="flex-1">{team.name}</span>
                {isSelected && <span className="text-green-400">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-white/70 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border text-white placeholder-white/30",
            "transition-colors duration-150 focus:outline-none focus:ring-2",
            "border-white/[0.08] focus:ring-green-400/40 focus:border-green-400/30",
          )}
        />
      </div>

      {/* Create Alert Button */}
      <button
        onClick={handleCreateAlert}
        disabled={isLoading || selectedTeams.length !== 2 || !email}
        className={cn(
          "w-full py-3 px-4 rounded-lg font-bold text-base transition-all duration-150",
          "flex items-center justify-center gap-2",
          selectedTeams.length === 2 && email && !isLoading
            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
            : "bg-white/[0.05] text-white/40 cursor-not-allowed border border-white/[0.1]",
        )}
      >
        <Bell className="w-5 h-5" />
        {isLoading ? "Creating Alert..." : "Create Alert"}
      </button>

      {/* Info Text */}
      <p className="text-xs text-white/40 text-center">
        You can create multiple alerts for different team combinations. Alerts
        are active until you remove them.
      </p>
    </div>
  );
}
