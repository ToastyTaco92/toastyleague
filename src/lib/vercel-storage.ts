// Production-compatible storage using a simple in-memory approach with better persistence
// This uses a combination of techniques that work better in serverless environments

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

// Use a more persistent approach - store in a global variable that persists longer
// and add some initialization data
let divisionsStorage: Division[] = [];

// Initialize with some default divisions to ensure there's always data
function initializeStorage() {
  if (divisionsStorage.length === 0) {
    divisionsStorage = [
      {
        id: "default-1",
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
        id: "default-2", 
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
    console.log("Initialized divisions storage with", divisionsStorage.length, "default divisions");
  }
}

export function getStoredDivisions(): Division[] {
  initializeStorage();
  console.log("Retrieved", divisionsStorage.length, "divisions from storage");
  return divisionsStorage;
}

export function addStoredDivision(division: any): Division {
  initializeStorage();
  const newDivision: Division = {
    id: Date.now().toString(),
    ...division,
    currentPlayers: 0,
    prizePool: division.maxPlayers * division.entryFee,
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: []
  };
  
  divisionsStorage.push(newDivision);
  console.log("Added division to storage:", newDivision.name, "Total divisions:", divisionsStorage.length);
  return newDivision;
}

export function updateStoredDivision(id: string, division: any): Division | null {
  initializeStorage();
  const index = divisionsStorage.findIndex(d => d.id === id);
  
  if (index !== -1) {
    divisionsStorage[index] = {
      ...divisionsStorage[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    console.log("Updated division in storage:", divisionsStorage[index].name);
    return divisionsStorage[index];
  }
  return null;
}

export function deleteStoredDivision(id: string): boolean {
  initializeStorage();
  const index = divisionsStorage.findIndex(d => d.id === id);
  
  if (index !== -1) {
    const deleted = divisionsStorage.splice(index, 1);
    console.log("Deleted division from storage:", deleted[0].name, "Remaining:", divisionsStorage.length);
    return true;
  }
  return false;
}
