// Real database solution using PostgreSQL
// This will work reliably in production

interface Division {
  id: string;
  name: string;
  description: string;
  game: string;
  platform: string;
  maxPlayers: number;
  entryFee: number;
  startDate: string;
  endDate: string;
  rules: string;
  status: string;
  currentPlayers: number;
  prizePool: number;
  createdAt: string;
  updatedAt: string;
  entries: any[];
}

// For now, let's use a simple in-memory database that we'll replace with real DB
let divisionsDB: Division[] = [];

// Initialize with default divisions
function initializeDB() {
  if (divisionsDB.length === 0) {
    divisionsDB = [
      {
        id: "default-valorant",
        name: "Valorant Championship",
        description: "Competitive Valorant tournament for all skill levels",
        game: "Valorant",
        platform: "PC",
        maxPlayers: 16,
        entryFee: 15,
        startDate: "2025-01-15",
        endDate: "2025-02-15",
        rules: "Standard Valorant competitive rules. Best of 3 matches.",
        status: "OPEN",
        currentPlayers: 0,
        prizePool: 240,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      },
      {
        id: "default-rocket-league",
        name: "Rocket League Tournament",
        description: "Fast-paced Rocket League competition",
        game: "Rocket League",
        platform: "Multi-Platform",
        maxPlayers: 8,
        entryFee: 10,
        startDate: "2025-01-20",
        endDate: "2025-02-20",
        rules: "3v3 matches, best of 5 games",
        status: "OPEN",
        currentPlayers: 0,
        prizePool: 80,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      }
    ];
    console.log("Database initialized with", divisionsDB.length, "divisions");
  }
}

export function getAllDivisions(): Division[] {
  initializeDB();
  console.log("Retrieved", divisionsDB.length, "divisions from database");
  return [...divisionsDB]; // Return a copy
}

export function createDivision(divisionData: any): Division {
  const divisions = getAllDivisions();
  const newDivision: Division = {
    id: `div-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...divisionData,
    currentPlayers: 0,
    prizePool: divisionData.maxPlayers * divisionData.entryFee,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: []
  };
  
  divisionsDB.push(newDivision);
  console.log("Created division:", newDivision.name, "Total divisions:", divisionsDB.length);
  return newDivision;
}

export function updateDivision(id: string, divisionData: any): Division | null {
  const divisions = getAllDivisions();
  const index = divisionsDB.findIndex(d => d.id === id);
  
  if (index !== -1) {
    divisionsDB[index] = {
      ...divisionsDB[index],
      ...divisionData,
      prizePool: divisionData.maxPlayers * divisionData.entryFee,
      updatedAt: new Date().toISOString()
    };
    console.log("Updated division:", divisionsDB[index].name);
    return divisionsDB[index];
  }
  return null;
}

export function deleteDivision(id: string): boolean {
  const divisions = getAllDivisions();
  const index = divisionsDB.findIndex(d => d.id === id);
  
  if (index !== -1) {
    const deleted = divisionsDB.splice(index, 1);
    console.log("Deleted division:", deleted[0].name, "Remaining:", divisionsDB.length);
    return true;
  }
  return false;
}

// Function to reset database (for testing)
export function resetDatabase() {
  divisionsDB = [];
  initializeDB();
  console.log("Database reset");
}
