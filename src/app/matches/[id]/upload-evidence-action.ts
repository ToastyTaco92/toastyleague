"use server";

import { revalidatePath } from "next/cache";
import { getMockMatch, createMockEvidence } from "@/lib/mock-data";

export async function uploadEvidence(
  matchId: string, 
  evidenceUrl: string, 
  submittedBy: string, 
  description?: string
) {
  try {
    const match = getMockMatch(matchId);
    if (!match) {
      return { success: false, error: "Match not found" };
    }

    // Validate URL format
    try {
      new URL(evidenceUrl);
    } catch {
      return { success: false, error: "Invalid URL format" };
    }

    // Create evidence record
    const evidence = createMockEvidence(matchId, evidenceUrl, submittedBy, description);

    revalidatePath(`/matches/${matchId}`);
    
    return { 
      success: true, 
      message: "Evidence uploaded successfully! It will be reviewed by administrators." 
    };

  } catch (error) {
    console.error("Evidence upload error:", error);
    return { success: false, error: "An error occurred while uploading evidence" };
  }
}
