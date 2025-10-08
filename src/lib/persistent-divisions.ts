// Persistent divisions storage for production environment
// This uses a combination of techniques to ensure data persists

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

// Use a more persistent approach - store in process.env or use a simple file
// that gets committed to the repository for now
let persistentDivisions: Division[] = [];

// Initialize with default divisions that will always be there
function initializePersistentDivisions() {
  if (persistentDivisions.length === 0) {
    persistentDivisions = [
      {
        id: "valorant-champ",
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
        id: "rocket-league-tourney",
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
    console.log("Initialized persistent divisions with", persistentDivisions.length, "divisions");
  }
}

// For now, let's use a simple approach - store in a JSON file that gets committed
// This ensures the data persists across deployments
export function getPersistentDivisions(): Division[] {
  initializePersistentDivisions();
  
  // Try to load from a committed JSON file
  try {
    // This will be a static file that gets committed to the repo
    const fs = require('fs');
    const path = require('path');
    const dataFile = path.join(process.cwd(), 'data', 'divisions.json');
    
    if (fs.existsSync(dataFile)) {
      const fileData = fs.readFileSync(dataFile, 'utf8');
      const fileDivisions = JSON.parse(fileData);
      if (fileDivisions.length > 0) {
        persistentDivisions = fileDivisions;
        console.log("Loaded", persistentDivisions.length, "divisions from file");
        return persistentDivisions;
      }
    }
  } catch (error) {
    console.log("Could not load from file, using defaults");
  }
  
  console.log("Using default divisions:", persistentDivisions.length);
  return persistentDivisions;
}

export function addPersistentDivision(division: any): Division {
  const divisions = getPersistentDivisions();
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
  
  divisions.push(newDivision);
  
  // Try to save to file
  try {
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data');
    const dataFile = path.join(dataDir, 'divisions.json');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(divisions, null, 2));
    console.log("Saved", divisions.length, "divisions to file");
  } catch (error) {
    console.log("Could not save to file, using memory only");
  }
  
  persistentDivisions = divisions;
  console.log("Added division:", newDivision.name, "Total:", persistentDivisions.length);
  return newDivision;
}

export function updatePersistentDivision(id: string, division: any): Division | null {
  const divisions = getPersistentDivisions();
  const index = divisions.findIndex(d => d.id === id);
  
  if (index !== -1) {
    divisions[index] = {
      ...divisions[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    
    // Try to save to file
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'data', 'divisions.json');
      fs.writeFileSync(dataFile, JSON.stringify(divisions, null, 2));
    } catch (error) {
      console.log("Could not save update to file");
    }
    
    persistentDivisions = divisions;
    console.log("Updated division:", divisions[index].name);
    return divisions[index];
  }
  return null;
}

export function deletePersistentDivision(id: string): boolean {
  const divisions = getPersistentDivisions();
  const index = divisions.findIndex(d => d.id === id);
  
  if (index !== -1) {
    const deleted = divisions.splice(index, 1);
    
    // Try to save to file
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'data', 'divisions.json');
      fs.writeFileSync(dataFile, JSON.stringify(divisions, null, 2));
    } catch (error) {
      console.log("Could not save deletion to file");
    }
    
    persistentDivisions = divisions;
    console.log("Deleted division:", deleted[0].name, "Remaining:", persistentDivisions.length);
    return true;
  }
  return false;
}
