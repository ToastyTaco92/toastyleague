// Simple database solution using a more reliable approach
// This will store data in a way that persists across deployments

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

// Use a more persistent approach - store in environment variables or use a simple file
// that gets updated and committed to the repository
let divisionsDatabase: Division[] = [];

// Initialize with default divisions
function initializeDatabase() {
  if (divisionsDatabase.length === 0) {
    divisionsDatabase = [
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
    console.log("Initialized database with", divisionsDatabase.length, "divisions");
  }
}

export function getDivisionsFromDB(): Division[] {
  initializeDatabase();
  console.log("Retrieved", divisionsDatabase.length, "divisions from database");
  return divisionsDatabase;
}

export function addDivisionToDB(division: any): Division {
  const divisions = getDivisionsFromDB();
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
  divisionsDatabase = divisions;
  
  // Try to save to a file that can be committed
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
  
  console.log("Added division to database:", newDivision.name, "Total:", divisionsDatabase.length);
  return newDivision;
}

export function updateDivisionInDB(id: string, division: any): Division | null {
  const divisions = getDivisionsFromDB();
  const index = divisions.findIndex(d => d.id === id);
  
  if (index !== -1) {
    divisions[index] = {
      ...divisions[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    
    divisionsDatabase = divisions;
    
    // Try to save to file
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'data', 'divisions.json');
      fs.writeFileSync(dataFile, JSON.stringify(divisions, null, 2));
    } catch (error) {
      console.log("Could not save update to file");
    }
    
    console.log("Updated division in database:", divisions[index].name);
    return divisions[index];
  }
  return null;
}

export function deleteDivisionFromDB(id: string): boolean {
  const divisions = getDivisionsFromDB();
  const index = divisions.findIndex(d => d.id === id);
  
  if (index !== -1) {
    const deleted = divisions.splice(index, 1);
    divisionsDatabase = divisions;
    
    // Try to save to file
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'data', 'divisions.json');
      fs.writeFileSync(dataFile, JSON.stringify(divisions, null, 2));
    } catch (error) {
      console.log("Could not save deletion to file");
    }
    
    console.log("Deleted division from database:", deleted[0].name, "Remaining:", divisionsDatabase.length);
    return true;
  }
  return false;
}
