"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getStoredDivisions, addStoredDivision, updateStoredDivision, deleteStoredDivision } from "@/lib/divisions-storage";

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
    // Fallback to stored data
    try {
      const storedDivision = addStoredDivision({
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
      revalidatePath("/divisions");
      return { success: true, division: storedDivision, message: "Division created successfully!" };
    } catch (storageError) {
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
    revalidatePath("/divisions");
    return { success: true, division };
  } catch (error) {
    console.error("Error updating division:", error);
    // Fallback to cached data
    try {
      const storedDivision = updateStoredDivision(divisionId, {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        game: formData.get("game") as string,
        platform: formData.get("platform") as string,
        maxPlayers: parseInt(formData.get("maxPlayers") as string),
        entryFee: parseFloat(formData.get("entryFee") as string),
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        rules: formData.get("rules") as string
      });
      if (storedDivision) {
        revalidatePath("/admin");
        revalidatePath("/divisions");
        return { success: true, division: storedDivision };
      }
    } catch (cacheError) {
      console.error("Error updating cached division:", cacheError);
    }
    return { success: false, error: "Failed to update division" };
  }
}

export async function deleteDivision(divisionId: string) {
  try {
    await prisma.division.delete({
      where: { id: divisionId }
    });

    revalidatePath("/admin");
    revalidatePath("/divisions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting division:", error);
    // Fallback to cached data
    try {
      const deleted = deleteStoredDivision(divisionId);
      if (deleted) {
        revalidatePath("/admin");
        revalidatePath("/divisions");
        return { success: true };
      }
    } catch (cacheError) {
      console.error("Error deleting cached division:", cacheError);
    }
    return { success: false, error: "Failed to delete division" };
  }
}

export async function getDivisions() {
  try {
    console.log("Attempting to fetch divisions from database...");
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

    console.log("Database divisions found:", divisions.length);
    return { success: true, divisions: divisions || [] };
  } catch (error) {
    console.error("Error fetching divisions from database:", error);
    // Fallback to stored data
    const storedDivisions = getStoredDivisions();
    console.log("Using stored divisions:", storedDivisions.length);
    return { success: true, divisions: storedDivisions, message: "Using stored data" };
  }
}
