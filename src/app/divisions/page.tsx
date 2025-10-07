import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDivisions } from "@/app/admin/division-actions";

async function getDivisionsData() {
  try {
    const result = await getDivisions();
    return result.success ? result.divisions : [];
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return [];
  }
}

export default async function DivisionsPage() {
  const divisions = await getDivisionsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Divisions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your division and join the competition. Each division has limited slots available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {divisions.map((division: any) => {
            const entries = division.entries || [];
            const slotsRemaining = division.maxPlayers - entries.length;
            const isFull = slotsRemaining <= 0;
            
            return (
              <Link key={division.id} href={`/divisions/${division.id}`}>
                <Card className={`h-full hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  isFull ? 'opacity-75' : 'hover:scale-105'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{division.name}</CardTitle>
                      <Badge variant={isFull ? "destructive" : "default"}>
                        {isFull ? "Full" : `${slotsRemaining} slots`}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {division.league?.title || "Toast League"} • {division.season?.name || "Season 1 (Pilot)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Platform:</span>
                        <span className="font-medium">{division.platform}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Game:</span>
                        <span className="font-medium">{division.game || division.league?.game || "Multi-Game"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Slots:</span>
                        <span className="font-medium">{division.maxPlayers}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Registered:</span>
                        <span className="font-medium">{entries.length}</span>
                      </div>
                      
                      <div className="pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isFull ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: `${Math.min((entries.length / division.maxPlayers) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {divisions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No divisions available
            </h3>
            <p className="text-gray-500">
              Check back later for new divisions and seasons.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
