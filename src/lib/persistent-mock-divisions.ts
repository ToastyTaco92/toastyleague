import fs from 'fs';
import path from 'path';

// File path for persistent mock data
const MOCK_DATA_FILE = path.join(process.cwd(), 'data', 'mock-divisions.json');

// Ensure data directory exists
const dataDir = path.dirname(MOCK_DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize empty array if file doesn't exist
if (!fs.existsSync(MOCK_DATA_FILE)) {
  fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify([]));
}

export function getMockDivisions() {
  try {
    const data = fs.readFileSync(MOCK_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock divisions:', error);
    return [];
  }
}

export function addMockDivision(division: any) {
  try {
    const divisions = getMockDivisions();
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
    fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(divisions, null, 2));
    return newDivision;
  } catch (error) {
    console.error('Error adding mock division:', error);
    return null;
  }
}

export function updateMockDivision(id: string, division: any) {
  try {
    const divisions = getMockDivisions();
    const index = divisions.findIndex((d: any) => d.id === id);
    
    if (index !== -1) {
      divisions[index] = {
        ...divisions[index],
        ...division,
        prizePool: division.maxPlayers * division.entryFee,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(divisions, null, 2));
      return divisions[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating mock division:', error);
    return null;
  }
}

export function deleteMockDivision(id: string) {
  try {
    const divisions = getMockDivisions();
    const index = divisions.findIndex((d: any) => d.id === id);
    
    if (index !== -1) {
      divisions.splice(index, 1);
      fs.writeFileSync(MOCK_DATA_FILE, JSON.stringify(divisions, null, 2));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting mock division:', error);
    return false;
  }
}
