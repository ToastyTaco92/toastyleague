"use server";

import { revalidatePath } from "next/cache";
import { getMockDivision, getMockEntries, addMockMatches, MockMatch, MockEntry } from "@/lib/mock-data";
import { addWeeks, nextWednesday } from "date-fns";

// Mock matches storage (in real app, this would be in database)
let mockMatches: MockMatch[] = [];

export async function generateSchedule(divisionId: string) {
  try {
    // Get division and entries
    const division = getMockDivision(divisionId);
    if (!division) {
      return { success: false, error: "Division not found" };
    }

    const entries = getMockEntries(divisionId);
    if (entries.length < 2) {
      return { success: false, error: "Need at least 2 players to generate a schedule" };
    }

    // Check if schedule already exists
    const existingMatches = mockMatches.filter(m => m.divisionId === divisionId);
    if (existingMatches.length > 0) {
      return { success: false, error: "Schedule already exists for this division" };
    }

    // Generate round-robin matches
    const matches: MockMatch[] = [];
    const players = entries;
    
    // Calculate total matches needed (n(n-1)/2 for round-robin)
    const totalMatches = (players.length * (players.length - 1)) / 2;
    const matchesPerWeek = 2; // Maximum matches per week
    const totalWeeks = Math.ceil(totalMatches / matchesPerWeek);
    
    let matchIndex = 0;
    let roundNumber = 1;
    
    // Generate matches for each round
    for (let round = 1; round <= totalWeeks; round++) {
      const roundMatches: MockMatch[] = [];
      
      // Create matches for this round
      for (let i = 0; i < players.length - 1; i += 2) {
        if (i + 1 < players.length) {
          const homePlayer = players[i];
          const awayPlayer = players[i + 1];
          
          // Calculate scheduled date (next Wednesday + (round-1) weeks at 8 PM)
          const baseDate = nextWednesday(new Date());
          const scheduledDate = addWeeks(baseDate, round - 1);
          scheduledDate.setHours(20, 0, 0, 0); // 8 PM
          
          const match: MockMatch = {
            id: `match-${divisionId}-${matchIndex + 1}`,
            divisionId,
            homeEntryId: homePlayer.id,
            awayEntryId: awayPlayer.id,
            homeScore: null,
            awayScore: null,
            scheduledAt: scheduledDate,
            status: "SCHEDULED",
            roundNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          roundMatches.push(match);
          matchIndex++;
        }
      }
      
      // Add round matches to main matches array
      matches.push(...roundMatches);
      roundNumber++;
    }
    
    // Store matches
    mockMatches.push(...matches);
    
    // Revalidate admin page
    revalidatePath("/admin");
    
    return { 
      success: true, 
      matches: matches.length,
      weeks: totalWeeks,
      message: `Generated ${matches.length} matches across ${totalWeeks} weeks`
    };
    
  } catch (error) {
    console.error("Schedule generation error:", error);
    return { success: false, error: "Failed to generate schedule" };
  }
}

// Helper function to get matches for a division (for future use)
export async function getDivisionMatches(divisionId: string) {
  return mockMatches.filter(m => m.divisionId === divisionId);
}