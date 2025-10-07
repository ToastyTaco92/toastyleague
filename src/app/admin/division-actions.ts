"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getMockDivisions, addMockDivision, updateMockDivision, deleteMockDivision } from "@/lib/mock-divisions";

const prisma = new PrismaClient();

export async function createDivision(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const game = formData.get("game") as string;
  const platform = formData.get("platform") as string;
  const maxPlayers = parseInt(formData.get("maxPlayers") as string);
  const entryFee = parseFloat(formData.get("entryFee") as string);
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const rules = formData.get("rules") as string;

  if (!name || !description || !game || !platform || !maxPlayers || !entryFee || !startDate || !endDate || !rules) {
    return { success: false, error: "All fields are required" };
  }

  try {

    // First, ensure we have a default season
    let season = await prisma.season.findFirst();
    if (!season) {
      season = await prisma.season.create({
        data: {
          name: "Season 1 (Pilot)",
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
          isOpen: true
        }
      });
    }

    // Then ensure we have a default league
    let league = await prisma.league.findFirst();
    if (!league) {
      league = await prisma.league.create({
        data: {
          title: "Toast League",
          game: "Multi-Game",
          seasonId: season.id
        }
      });
    }

    const division = await prisma.division.create({
      data: {
        name,
        description,
        game,
        platform,
        maxPlayers,
        entryFee,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rules,
        status: "OPEN",
        leagueId: league.id,
        seasonId: season.id
      }
    });

    revalidatePath("/admin");
    return { success: true, division };
  } catch (error) {
    console.error("Error creating division:", error);
    // Fallback to mock data
    try {
      const mockDivision = addMockDivision({
        name: name,
        description: description,
        game: game,
        platform: platform,
        maxPlayers: maxPlayers,
        entryFee: entryFee,
        startDate: startDate,
        endDate: endDate,
        rules: rules
      });
      revalidatePath("/admin");
      return { success: true, division: mockDivision, message: "Division created (using temporary storage)" };
    } catch (mockError) {
      return { success: false, error: `Failed to create division: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
}

export async function updateDivision(divisionId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const game = formData.get("game") as string;
    const platform = formData.get("platform") as string;
    const maxPlayers = parseInt(formData.get("maxPlayers") as string);
    const entryFee = parseFloat(formData.get("entryFee") as string);
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const rules = formData.get("rules") as string;

    if (!name || !description || !game || !platform || !maxPlayers || !entryFee || !startDate || !endDate || !rules) {
      return { success: false, error: "All fields are required" };
    }

    const division = await prisma.division.update({
      where: { id: divisionId },
      data: {
        name,
        description,
        game,
        platform,
        maxPlayers,
        entryFee,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rules
      }
    });

    revalidatePath("/admin");
    return { success: true, division };
  } catch (error) {
    console.error("Error updating division:", error);
    return { success: false, error: "Failed to update division" };
  }
}

export async function deleteDivision(divisionId: string) {
  try {
    await prisma.division.delete({
      where: { id: divisionId }
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting division:", error);
    return { success: false, error: "Failed to delete division" };
  }
}

export async function getDivisions() {
  try {
    const divisions = await prisma.division.findMany({
      include: {
        entries: true,
        league: true,
        season: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return { success: true, divisions: divisions || [] };
  } catch (error) {
    console.error("Error fetching divisions:", error);
    // Fallback to mock data
    const mockDivisions = getMockDivisions();
    return { success: true, divisions: mockDivisions, message: "Using temporary storage" };
  }
}
