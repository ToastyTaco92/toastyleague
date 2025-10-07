"use server";

import { revalidatePath } from "next/cache";
import { getMockMatch, resolveDispute } from "@/lib/mock-data";

export async function resolveDisputeAction(matchId: string, finalHomeScore: number, finalAwayScore: number) {
  try {
    // Verify the match exists and is disputed
    const match = getMockMatch(matchId);
    
    if (!match) {
      return { success: false, error: "Match not found." };
    }

    if (match.status !== 'DISPUTED') {
      return { success: false, error: "Match is not in disputed status." };
    }

    // Validate scores
    if (finalHomeScore < 0 || finalAwayScore < 0) {
      return { success: false, error: "Scores cannot be negative." };
    }

    // Resolve the dispute
    const resolvedMatch = resolveDispute(matchId, finalHomeScore, finalAwayScore);

    if (!resolvedMatch) {
      return { success: false, error: "Failed to resolve dispute." };
    }

    // Revalidate relevant paths
    revalidatePath(`/admin/disputes`);
    revalidatePath(`/admin/disputes/${matchId}`);
    revalidatePath(`/matches/${matchId}`);
    revalidatePath(`/matches`);
    revalidatePath(`/divisions/${match.divisionId}/standings`);

    return { 
      success: true, 
      message: `Dispute resolved successfully! Final score: ${finalHomeScore} - ${finalAwayScore}. Match has been finalized.`,
      match: resolvedMatch
    };
  } catch (error) {
    console.error("Error resolving dispute:", error);
    return { success: false, error: "An unexpected error occurred while resolving the dispute." };
  }
}
