// Temporary in-memory storage for divisions until database is properly set up
let mockDivisions: any[] = [];

export function getMockDivisions() {
  return mockDivisions;
}

export function addMockDivision(division: any) {
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
  mockDivisions.push(newDivision);
  return newDivision;
}

export function updateMockDivision(id: string, division: any) {
  const index = mockDivisions.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDivisions[index] = {
      ...mockDivisions[index],
      ...division,
      prizePool: division.maxPlayers * division.entryFee,
      updatedAt: new Date().toISOString()
    };
    return mockDivisions[index];
  }
  return null;
}

export function deleteMockDivision(id: string) {
  const index = mockDivisions.findIndex(d => d.id === id);
  if (index !== -1) {
    mockDivisions.splice(index, 1);
    return true;
  }
  return false;
}
