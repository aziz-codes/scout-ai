import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOrUpdateUser } from "@/lib/db";
import type { AlertTeam } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/alerts
 * Create or update a user alert subscription with their selected teams
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teams, email } = body;

    // ─── Validation ───────────────────────────────────────────────────────
    if (!teams || !Array.isArray(teams) || teams.length !== 2) {
      return NextResponse.json(
        { message: "Please select exactly 2 teams" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Validate team structure
    for (const team of teams) {
      if (!team.name || !team.code || !team.flag) {
        return NextResponse.json(
          { message: "Invalid team data" },
          { status: 400 },
        );
      }
    }

    // ─── Save to Supabase ─────────────────────────────────────────────────
    const user = await createOrUpdateUser(email, teams);

    if (!user) {
      throw new Error("Failed to create/update user in database");
    }

    // ─── Send Confirmation Email ──────────────────────────────────────────
    try {
      await resend.emails.send({
        from: "alerts@scoutai.com",
        to: email,
        subject: "✓ Match Alerts Created - ScoutAI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Match Alerts Active</h2>
            <p>You'll receive email notifications when these teams have upcoming matches:</p>
            <div style="margin: 20px 0;">
              ${teams.map((team: AlertTeam) => `<p style="font-size: 16px; margin: 8px 0;">🔔 ${team.flag} <strong>${team.name}</strong></p>`).join("")}
            </div>
            <p style="color: #666; font-size: 14px;">We'll send you notifications:</p>
            <ul style="color: #666; font-size: 14px;">
              <li>Before the match starts</li>
              <li>When the match goes live</li>
              <li>When the match ends</li>
            </ul>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">ScoutAI © 2026</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails, as user data is already saved
    }

    return NextResponse.json(
      {
        success: true,
        message: "Alert created! Check your email for confirmation.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Alert creation error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create alert",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/alerts
 * List all user alerts (for admin/debug purposes)
 * Note: In production, add proper authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    const authHeader = request.headers.get("authorization");
    if (process.env.NODE_ENV === "production" && !authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      // Return a single user's alerts
      const { getUserByEmail } = await import("@/lib/db");
      const user = await getUserByEmail(email);

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        user,
      });
    }

    return NextResponse.json(
      { message: "Email parameter required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { message: "Failed to fetch alerts" },
      { status: 500 },
    );
  }
}
