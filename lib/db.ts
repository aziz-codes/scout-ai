import { supabase } from "./supabase";
import type { AlertTeam } from "@/types";

/**
 * Create or update a user with their alert teams
 */
export async function createOrUpdateUser(
  email: string,
  teams: AlertTeam[],
): Promise<{ id: string; email: string; teams: AlertTeam[] } | null> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      // Update existing user's teams
      const { data, error } = await supabase
        .from("users")
        .update({ teams: teams, updated_at: new Date().toISOString() })
        .eq("id", existingUser.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          email,
          teams: teams,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

/**
 * Get all users whose teams match the given teams
 */
export async function getUsersByTeams(
  homeTeam: string,
  awayTeam: string,
): Promise<Array<{ id: string; email: string; teams: AlertTeam[] }>> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, teams")
      .or(`teams->>'code'.eq."${homeTeam}",teams->>'code'.eq."${awayTeam}"`);

    if (error) {
      // Fallback: fetch all users and filter in JS (less efficient but more compatible)
      const { data: allUsers, error: fetchError } = await supabase
        .from("users")
        .select("id, email, teams");

      if (fetchError) throw fetchError;

      return (
        allUsers?.filter((user) => {
          return user.teams?.some(
            (team: AlertTeam) =>
              team.code === homeTeam || team.code === awayTeam,
          );
        }) || []
      );
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching users by teams:", error);
    throw error;
  }
}

/**
 * Check if a notification has already been sent for this match + type
 */
export async function checkNotificationExists(
  userId: string,
  matchId: string,
  type: "pre-match" | "live" | "ended",
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", userId)
      .eq("match_id", matchId)
      .eq("type", type)
      .single();

    if (error && error.code === "PGRST116") {
      // No rows returned - notification doesn't exist
      return false;
    }

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking notification exists:", error);
    throw error;
  }
}

/**
 * Insert a notification record after successful email send
 */
export async function insertNotification(
  userId: string,
  matchId: string,
  type: "pre-match" | "live" | "ended",
): Promise<{ id: string } | null> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        match_id: matchId,
        type,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error inserting notification:", error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string,
): Promise<{ id: string; email: string; teams: AlertTeam[] } | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, teams")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      return null; // User not found
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
}
