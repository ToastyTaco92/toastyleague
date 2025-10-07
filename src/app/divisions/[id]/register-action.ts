"use server";

import { revalidatePath } from 'next/cache';
import { getMockDivision, createMockEntry } from '@/lib/mock-data';

export async function registerForDivision(divisionId: string) {
  try {
    // Check if division exists and has available slots
    const division = getMockDivision(divisionId);

    if (!division) {
      return { success: false, error: "Division not found" };
    }

    const slotsRemaining = division.slots - division.entries.length;
    if (slotsRemaining <= 0) {
      return { success: false, error: "Division is full" };
    }

    // Check if user is already registered
    const existingEntry = division.entries.find(entry => entry.userId === "dev-user");

    if (existingEntry) {
      return { success: false, error: "You are already registered for this division" };
    }

    // Create the entry using mock data
    const entry = createMockEntry(divisionId, "dev-user");

    // Revalidate the division page to show updated data
    revalidatePath(`/divisions/${divisionId}`);
    revalidatePath('/divisions');

    return { success: true, entry };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: "An error occurred during registration" };
  }
}
