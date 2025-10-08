// Global cache for divisions that persists across requests in the same server instance
// This is a simple in-memory solution that works better in serverless environments

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

// Global cache - this will persist for the lifetime of the server instance
let globalDivisionsCache: Division[] = [];

export function getCachedDivisions(): Division[] {
  return globalDivisionsCache;
}

export function addCachedDivision(division: any): Division {
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
  
  globalDivisionsCache.push(newDivision);
  console.log("Added division to cache:", newDivision);
  console.log("Total divisions in cache:", globalDivisionsCache.length);
  return newDivision;
}

export function updateCachedDivision(id: string, division: any): Division | null {
  const index = globalDivisionsCache.findIndex(d => d.id === id);
  if (index !== -1) {
    globalDivisionsCache[index] = {
      ...globalDivisionsCache[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    return globalDivisionsCache[index];
  }
  return null;
}

export function deleteCachedDivision(id: string): boolean {
  const index = globalDivisionsCache.findIndex(d => d.id === id);
  if (index !== -1) {
    globalDivisionsCache.splice(index, 1);
    return true;
  }
  return false;
}

// Initialize with some test data if cache is empty
if (globalDivisionsCache.length === 0) {
  console.log("Initializing divisions cache...");
  // Add a test division to verify the system is working
  addCachedDivision({
    name: "Test Division",
    description: "A test division to verify the system is working",
    game: "Test Game",
    platform: "PC",
    maxPlayers: 8,
    entryFee: 10,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    rules: "Test rules"
  });
  console.log("Initialized with test division");
}
