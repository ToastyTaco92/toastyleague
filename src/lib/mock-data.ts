// Mock data for testing the divisions functionality
// This will be replaced with actual Prisma queries once the database is set up

export interface MockUser {
  id: string;
  name: string;
  gamerTag: string;
  image?: string;
}

export interface MockEntry {
  id: string;
  userId: string;
  divisionId: string;
  paid: boolean;
  status: string;
  user: MockUser;
}

export interface MockSeason {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
}

export interface MockLeague {
  id: string;
  title: string;
  game: string;
  rulesUrl?: string;
  seasonId: string;
  season: MockSeason;
}

export interface MockDivision {
  id: string;
  name: string;
  platform: string;
  leagueId: string;
  league: MockLeague;
  slots: number;
  entries: MockEntry[];
}

export interface MockMatch {
  id: string;
  divisionId: string;
  homeEntryId: string;
  awayEntryId: string;
  homeScore: number | null;
  awayScore: number | null;
  scheduledAt: Date;
  status: "SCHEDULED" | "COMPLETED" | "DISPUTED" | "CANCELLED";
  roundNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockEvidence {
  id: string;
  matchId: string;
  submittedBy: string;
  evidenceUrl: string;
  description?: string;
  createdAt: Date;
}

export const mockDivisions: MockDivision[] = [
  {
    id: "div-1",
    name: "Diamond Division",
    platform: "PC",
    leagueId: "league-1",
    league: {
      id: "league-1",
      title: "Valorant Championship",
      game: "Valorant",
      seasonId: "season-1",
      season: {
        id: "season-1",
        name: "Season 1 (Pilot)",
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-03-15T00:00:00Z",
        isOpen: true
      }
    },
    slots: 64,
    entries: [
      {
        id: "entry-1",
        userId: "user-1",
        divisionId: "div-1",
        paid: true,
        status: "CONFIRMED",
        user: {
          id: "user-1",
          name: "John Doe",
          gamerTag: "ProGamer123"
        }
      },
      {
        id: "entry-2",
        userId: "user-2",
        divisionId: "div-1",
        paid: false,
        status: "CONFIRMED",
        user: {
          id: "user-2",
          name: "Jane Smith",
          gamerTag: "ElitePlayer"
        }
      }
    ]
  },
  {
    id: "div-2",
    name: "Platinum Division",
    platform: "PlayStation",
    leagueId: "league-2",
    league: {
      id: "league-2",
      title: "Call of Duty League",
      game: "Call of Duty: Modern Warfare III",
      seasonId: "season-1",
      season: {
        id: "season-1",
        name: "Season 1 (Pilot)",
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-03-15T00:00:00Z",
        isOpen: true
      }
    },
    slots: 32,
    entries: [
      {
        id: "entry-3",
        userId: "user-3",
        divisionId: "div-2",
        paid: true,
        status: "CONFIRMED",
        user: {
          id: "user-3",
          name: "Mike Johnson",
          gamerTag: "COD_Master"
        }
      }
    ]
  },
  {
    id: "div-3",
    name: "Gold Division",
    platform: "Xbox",
    leagueId: "league-3",
    league: {
      id: "league-3",
      title: "Rocket League Championship",
      game: "Rocket League",
      seasonId: "season-1",
      season: {
        id: "season-1",
        name: "Season 1 (Pilot)",
        startDate: "2024-01-15T00:00:00Z",
        endDate: "2024-03-15T00:00:00Z",
        isOpen: true
      }
    },
    slots: 16,
    entries: []
  }
];

export function getMockDivisions(): MockDivision[] {
  return mockDivisions;
}

export function getMockDivision(id: string): MockDivision | null {
  return mockDivisions.find(div => div.id === id) || null;
}

export function createMockEntry(divisionId: string, userId: string = "dev-user"): MockEntry {
  const division = getMockDivision(divisionId);
  if (!division) {
    throw new Error("Division not found");
  }

  const newEntry: MockEntry = {
    id: `entry-${Date.now()}`,
    userId,
    divisionId,
    paid: false,
    status: "CONFIRMED",
    user: {
      id: userId,
      name: "Dev User",
      gamerTag: "dev-user"
    }
  };

  division.entries.push(newEntry);
  return newEntry;
}

// Mock storage for matches and evidence
let mockMatches: MockMatch[] = [
  // Pre-generated test matches
  {
    id: 'match-test-1',
    divisionId: 'div-1',
    homeEntryId: 'entry-1',
    awayEntryId: 'entry-2',
    homeScore: null,
    awayScore: null,
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    status: 'SCHEDULED',
    roundNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match-test-2',
    divisionId: 'div-1',
    homeEntryId: 'entry-1',
    awayEntryId: 'entry-2',
    homeScore: 2,
    awayScore: 1,
    scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'COMPLETED',
    roundNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'match-test-3',
    divisionId: 'div-1',
    homeEntryId: 'entry-1',
    awayEntryId: 'entry-2',
    homeScore: 3,
    awayScore: 2,
    scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'DISPUTED',
    roundNumber: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
let mockEvidence: MockEvidence[] = [
  {
    id: 'evidence-test-1',
    matchId: 'match-test-3',
    submittedBy: 'ProGamer123',
    evidenceUrl: 'https://example.com/screenshot1.jpg',
    description: 'Screenshot showing final score of 3-2',
    createdAt: new Date()
  }
];

export function getMockEntries(divisionId: string): MockEntry[] {
  const division = getMockDivision(divisionId);
  return division ? division.entries : [];
}

export function addMockMatches(matches: MockMatch[]): void {
  mockMatches.push(...matches);
}

export function getMockMatches(divisionId?: string): MockMatch[] {
  if (divisionId) {
    return mockMatches.filter(match => match.divisionId === divisionId);
  }
  return mockMatches;
}

export function getMockMatch(id: string): MockMatch | null {
  return mockMatches.find(match => match.id === id) || null;
}

export function updateMockMatch(id: string, updates: Partial<MockMatch>): MockMatch | null {
  const matchIndex = mockMatches.findIndex(match => match.id === id);
  if (matchIndex === -1) return null;
  
  mockMatches[matchIndex] = { ...mockMatches[matchIndex], ...updates, updatedAt: new Date() };
  return mockMatches[matchIndex];
}

export function createMockEvidence(matchId: string, evidenceUrl: string, submittedBy: string, description?: string): MockEvidence {
  const newEvidence: MockEvidence = {
    id: `evidence-${Date.now()}`,
    matchId,
    submittedBy,
    evidenceUrl,
    description,
    createdAt: new Date()
  };
  
  mockEvidence.push(newEvidence);
  return newEvidence;
}

export function getMockEvidence(matchId: string): MockEvidence[] {
  return mockEvidence.filter(evidence => evidence.matchId === matchId);
}

export interface StandingEntry {
  entry: MockEntry;
  wins: number;
  losses: number;
  pointDifferential: number;
  gamesPlayed: number;
}

export function getDivisionStandings(divisionId: string): StandingEntry[] {
  const division = getMockDivision(divisionId);
  if (!division) return [];

  const entries = division.entries;
  const completedMatches = mockMatches.filter(
    match => match.divisionId === divisionId && match.status === 'COMPLETED'
  );

  // Initialize standings for all entries
  const standings: StandingEntry[] = entries.map(entry => ({
    entry,
    wins: 0,
    losses: 0,
    pointDifferential: 0,
    gamesPlayed: 0
  }));

  // Process each completed match
  completedMatches.forEach(match => {
    if (match.homeScore === null || match.awayScore === null) return;

    const homeStanding = standings.find(s => s.entry.id === match.homeEntryId);
    const awayStanding = standings.find(s => s.entry.id === match.awayEntryId);

    if (homeStanding && awayStanding) {
      // Update games played
      homeStanding.gamesPlayed++;
      awayStanding.gamesPlayed++;

      // Update point differential
      const homeDiff = match.homeScore - match.awayScore;
      const awayDiff = match.awayScore - match.homeScore;
      
      homeStanding.pointDifferential += homeDiff;
      awayStanding.pointDifferential += awayDiff;

      // Update wins/losses
      if (match.homeScore > match.awayScore) {
        homeStanding.wins++;
        awayStanding.losses++;
      } else if (match.awayScore > match.homeScore) {
        awayStanding.wins++;
        homeStanding.losses++;
      }
      // Note: Ties are not handled in this simple implementation
    }
  });

  // Sort by wins (descending), then by point differential (descending)
  return standings.sort((a, b) => {
    if (a.wins !== b.wins) {
      return b.wins - a.wins;
    }
    return b.pointDifferential - a.pointDifferential;
  });
}

export function getDisputedMatches(): MockMatch[] {
  return mockMatches.filter(match => match.status === 'DISPUTED');
}

export function resolveDispute(matchId: string, finalHomeScore: number, finalAwayScore: number): MockMatch | null {
  const matchIndex = mockMatches.findIndex(match => match.id === matchId);
  
  if (matchIndex === -1) {
    return null;
  }

  // Update the match with final scores and mark as COMPLETED
  mockMatches[matchIndex] = {
    ...mockMatches[matchIndex],
    homeScore: finalHomeScore,
    awayScore: finalAwayScore,
    status: 'COMPLETED',
    updatedAt: new Date()
  };

  return mockMatches[matchIndex];
}
