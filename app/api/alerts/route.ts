import { NextRequest, NextResponse } from "next/server";
import type { AlertTeam } from "@/types";

// In-memory storage (in production, use a proper database)
const alerts: Array<{
  id: string;
  email: string;
  teams: AlertTeam[];
  createdAt: string;
  active: boolean;
}> = [];

/**
 * Send email notification to user
 * This is a placeholder implementation. In production, integrate with:
 * - SendGrid
 * - Resend (resend.com)
 * - AWS SES
 * - Nodemailer
 */
async function sendEmailNotification(
  email: string,
  teams: AlertTeam[],
): Promise<void> {
  // Placeholder: Replace with actual email service
  console.log(
    `[EMAIL] Sending confirmation to ${email} for teams: ${teams.map((t) => t.name).join(", ")}`,
  );

  // Example with Resend (uncomment and set RESEND_API_KEY in .env.local):
  // const { Resend } = require("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // await resend.emails.send({
  //   from: "alerts@scoutai.com",
  //   to: email,
  //   subject: "Match Alert Created - ScoutAI",
  //   html: `<h1>Alert Created!</h1><p>You'll receive notifications for ${teams.map((t) => t.name).join(" and ")} matches.</p>`,
  // });

  // Example with SendGrid (uncomment and set SENDGRID_API_KEY in .env.local):
  // const sgMail = require("@sendgrid/mail");
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //
  // await sgMail.send({
  //   to: email,
  //   from: "alerts@scoutai.com",
  //   subject: "Match Alert Created - ScoutAI",
  //   html: `<h1>Alert Created!</h1><p>You'll receive notifications for ${teams.map((t) => t.name).join(" and ")} matches.</p>`,
  // });
}

/**
 * POST /api/alerts
 * Create a new team alert for the user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { teams, email } = body;

    // Validation
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

    // Create alert
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAlert = {
      id: alertId,
      email,
      teams,
      createdAt: new Date().toISOString(),
      active: true,
    };

    // Store alert (in production, save to database)
    alerts.push(newAlert);

    // Send confirmation email (with placeholder/actual implementation)
    try {
      await sendEmailNotification(email, teams);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: "Alert created successfully",
        alertId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Alert creation error:", error);

    return NextResponse.json(
      { message: "Failed to create alert. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * GET /api/alerts
 * List all alerts (optional, for user dashboard)
 */
export async function GET() {
  return NextResponse.json({
    alerts,
    count: alerts.length,
  });
}
