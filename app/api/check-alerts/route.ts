import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchGames } from "@/lib/api";
import {
  getUsersByTeams,
  checkNotificationExists,
  insertNotification,
} from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/check-alerts
 * Cron job to check for upcoming matches and send notifications to subscribed users
 *
 * This should be called periodically (e.g., every 30 minutes) from an external cron service
 * like Vercel Cron, AWS EventBridge, or GitHub Actions
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Verify the request is coming from a trusted source (cron service)
    const authToken = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authToken !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ─── Step 1: Fetch all matches from the API ────────────────────────────
    const games = await fetchGames();

    if (!games || games.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No games found",
        processed: 0,
        sent: 0,
      });
    }

    let totalSent = 0;
    const results: Array<{
      matchId: string;
      teams: string;
      usersSent: number;
      skipped: number;
    }> = [];

    // ─── Step 2: Loop through each match ───────────────────────────────────
    for (const game of games) {
      const homeTeam = game.home_team_name_en;
      const awayTeam = game.away_team_name_en;
      const matchId = game.id;

      if (!homeTeam || !awayTeam) {
        console.log(`[SKIP] Match ${matchId} missing team names`);
        continue;
      }

      // ─── Step 3: Find users whose teams match ────────────────────────────
      const qualifiedUsers = await getUsersByTeams(homeTeam, awayTeam);

      if (qualifiedUsers.length === 0) {
        console.log(
          `[NO_USERS] Match ${homeTeam} vs ${awayTeam} has no subscribers`,
        );
        continue;
      }

      let usersSent = 0;
      let skipped = 0;

      // ─── Step 4 & 5: Dedup check + Send emails ──────────────────────────
      for (const user of qualifiedUsers) {
        // Determine notification type based on match status
        let notificationType: "pre-match" | "live" | "ended" = "pre-match";

        if (game.finished === "TRUE") {
          notificationType = "ended";
        } else if (game.time_elapsed && parseInt(game.time_elapsed) > 0) {
          notificationType = "live";
        }

        // Check if notification already sent
        const alreadySent = await checkNotificationExists(
          user.id,
          matchId,
          notificationType,
        );

        if (alreadySent) {
          console.log(
            `[DUPLICATE] Skipping ${user.email} for ${matchId} (${notificationType})`,
          );
          skipped++;
          continue;
        }

        try {
          // Build email based on match status
          const emailSubject = buildEmailSubject(
            homeTeam,
            awayTeam,
            notificationType,
          );
          const emailHtml = buildEmailHtml(
            homeTeam,
            awayTeam,
            game,
            notificationType,
            user.teams,
          );

          // Send email via Resend
          await resend.emails.send({
            from: "alerts@scoutai.com",
            to: user.email,
            subject: emailSubject,
            html: emailHtml,
          });

          // ─── Step 6: Log notification (insert record) ──────────────────────
          await insertNotification(user.id, matchId, notificationType);

          usersSent++;
          totalSent++;

          console.log(
            `[SENT] ${user.email} - ${homeTeam} vs ${awayTeam} (${notificationType})`,
          );
        } catch (emailError) {
          console.error(
            `[ERROR] Failed to send email to ${user.email}:`,
            emailError,
          );
          // Continue with next user on individual email failures
        }
      }

      results.push({
        matchId,
        teams: `${homeTeam} vs ${awayTeam}`,
        usersSent,
        skipped,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Alert check completed",
      processed: games.length,
      sent: totalSent,
      results,
    });
  } catch (error) {
    console.error("Alert check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Alert check failed",
      },
      { status: 500 },
    );
  }
}

/**
 * Build email subject based on match status
 */
function buildEmailSubject(
  homeTeam: string,
  awayTeam: string,
  type: "pre-match" | "live" | "ended",
): string {
  switch (type) {
    case "pre-match":
      return `⏰ Upcoming: ${homeTeam} vs ${awayTeam} - ScoutAI`;
    case "live":
      return `🔴 LIVE: ${homeTeam} vs ${awayTeam} - ScoutAI`;
    case "ended":
      return `✓ Finished: ${homeTeam} vs ${awayTeam} - ScoutAI`;
    default:
      return `Match Alert: ${homeTeam} vs ${awayTeam}`;
  }
}

/**
 * Build email HTML content based on match status
 */
function buildEmailHtml(
  homeTeam: string,
  awayTeam: string,
  game: any,
  type: "pre-match" | "live" | "ended",
  userTeams: any[],
): string {
  const homeScore = game.home_score || "–";
  const awayScore = game.away_score || "–";
  const homeFlag = "🏴"; // Placeholder, could be enriched with actual flags
  const awayFlag = "🏴"; // Placeholder

  const userTeamNames = userTeams.map((t) => t.name).join(", ");

  let content = "";
  let statusColor = "#10b981"; // green

  if (type === "live") {
    content = `
      <p style="font-size: 18px; margin: 15px 0;"><strong>Match is LIVE NOW</strong></p>
      <p style="font-size: 14px;">Current Score: <strong>${homeScore} - ${awayScore}</strong></p>
    `;
    statusColor = "#ef4444"; // red
  } else if (type === "ended") {
    content = `
      <p style="font-size: 18px; margin: 15px 0;"><strong>Match Finished</strong></p>
      <p style="font-size: 14px;">Final Score: <strong>${homeScore} - ${awayScore}</strong></p>
    `;
    statusColor = "#6366f1"; // indigo
  } else {
    content = `
      <p style="font-size: 14px; margin: 15px 0;">Match Time: <strong>${game.local_date}</strong></p>
      <p style="font-size: 14px;">Stadium: ${game.stadium_id || "TBA"}</p>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 8px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <div style="border-left: 4px solid ${statusColor}; padding-left: 15px; margin-bottom: 20px;">
          <p style="font-size: 12px; color: ${statusColor}; margin: 0; text-transform: uppercase; font-weight: bold;">
            ${
              type === "pre-match"
                ? "⏰ UPCOMING MATCH"
                : type === "live"
                  ? "🔴 LIVE MATCH"
                  : "✓ MATCH FINISHED"
            }
          </p>
        </div>

        <h2 style="margin: 0 0 20px 0; font-size: 24px;">
          ${homeTeam} vs ${awayTeam}
        </h2>

        ${content}

        <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 6px;">
          <p style="font-size: 12px; color: #666; margin: 0;">You're receiving this because you're following:</p>
          <p style="font-size: 13px; color: #10b981; font-weight: bold; margin: 5px 0;">${userTeamNames}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

        <p style="font-size: 12px; color: #999; margin: 0;">
          ScoutAI © 2026 | <a href="https://scoutai.com" style="color: #10b981; text-decoration: none;">View on ScoutAI</a>
        </p>
      </div>
    </div>
  `;
}

/**
 * GET /api/check-alerts
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Check alerts endpoint is active",
    note: "Use POST method to trigger alert check",
  });
}
