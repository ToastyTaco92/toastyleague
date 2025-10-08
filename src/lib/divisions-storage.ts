// Simple file-based storage for divisions that persists across serverless invocations
import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), 'public', 'divisions-data.json');

// Ensure the file exists
function ensureStorageFile() {
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify([]));
  }
}

export function getStoredDivisions() {
  try {
    ensureStorageFile();
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading divisions storage:', error);
    return [];
  }
}

export function saveDivisions(divisions: any[]) {
  try {
    ensureStorageFile();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(divisions, null, 2));
    console.log('Divisions saved to storage:', divisions.length);
  } catch (error) {
    console.error('Error saving divisions:', error);
  }
}

export function addStoredDivision(division: any) {
  const divisions = getStoredDivisions();
  const newDivision = {
    id: Date.now().toString(),
    ...division,
    currentPlayers: 0,
    prizePool: division.maxPlayers * division.entryFee,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: []
  };
  
  divisions.push(newDivision);
  saveDivisions(divisions);
  return newDivision;
}

export function updateStoredDivision(id: string, division: any) {
  const divisions = getStoredDivisions();
  const index = divisions.findIndex((d: any) => d.id === id);
  
  if (index !== -1) {
    divisions[index] = {
      ...divisions[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    saveDivisions(divisions);
    return divisions[index];
  }
  return null;
}

export function deleteStoredDivision(id: string) {
  const divisions = getStoredDivisions();
  const index = divisions.findIndex((d: any) => d.id === id);
  
  if (index !== -1) {
    divisions.splice(index, 1);
    saveDivisions(divisions);
    return true;
  }
  return false;
}
