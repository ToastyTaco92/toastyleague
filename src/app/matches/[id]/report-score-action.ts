"use server";

import { revalidatePath } from "next/cache";
import { getMockMatch, updateMockMatch } from "@/lib/mock-data";

export async function reportScore(matchId: string, homeScore: number, awayScore: number) {
  try {
    const match = getMockMatch(matchId);
    if (!match) {
      return { success: false, error: "Match not found" };
    }

    if (match.status !== "SCHEDULED") {
      return { success: false, error: "Cannot report score for a match that's not scheduled" };
    }

    // Check if this is the first score report
    if (match.homeScore === null && match.awayScore === null) {
      // First report - just store the scores
      const updatedMatch = updateMockMatch(matchId, {
        homeScore,
        awayScore,
        status: "SCHEDULED" // Keep as scheduled until both teams report
      });

      if (!updatedMatch) {
        return { success: false, error: "Failed to update match" };
      }

      revalidatePath(`/matches/${matchId}`);
      return { 
        success: true, 
        message: "Score reported successfully. Waiting for the other team to report their score." 
      };
    }

    // Check if scores match
    if (match.homeScore === homeScore && match.awayScore === awayScore) {
      // Scores match - complete the match
      const updatedMatch = updateMockMatch(matchId, {
        homeScore,
        awayScore,
        status: "COMPLETED"
      });

      if (!updatedMatch) {
        return { success: false, error: "Failed to update match" };
      }

      revalidatePath(`/matches/${matchId}`);
      return { 
        success: true, 
        message: "Match completed successfully! Both teams reported matching scores." 
      };
    } else {
      // Scores don't match - mark as disputed
      const updatedMatch = updateMockMatch(matchId, {
        homeScore,
        awayScore,
        status: "DISPUTED"
      });

      if (!updatedMatch) {
        return { success: false, error: "Failed to update match" };
      }

      revalidatePath(`/matches/${matchId}`);
      return { 
        success: true, 
        message: "Score reported, but it doesn't match the other team's report. The match has been marked as disputed. Please upload evidence and contact an admin." 
      };
    }

  } catch (error) {
    console.error("Score reporting error:", error);
    return { success: false, error: "An error occurred while reporting the score" };
  }
}
