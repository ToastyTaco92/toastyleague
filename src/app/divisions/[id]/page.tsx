import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, Gamepad2, Trophy } from "lucide-react";
import Link from "next/link";
import { RegisterButton } from "./register-button";
import { getMockDivision, MockDivision } from "@/lib/mock-data";

async function getDivision(id: string): Promise<MockDivision | null> {
  // Using mock data for now - will be replaced with Prisma queries
  return getMockDivision(id);
}

interface DivisionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DivisionPage({ params }: DivisionPageProps) {
  const { id } = await params;
  const division = await getDivision(id);

  if (!division) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Division Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              The division you're looking for doesn't exist.
            </p>
            <Link href="/divisions">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Divisions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const slotsRemaining = division.slots - division.entries.length;
  const isFull = slotsRemaining <= 0;
  const isRegistered = division.entries.some(entry => entry.userId === "dev-user");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/divisions" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Divisions
          </Link>

          {/* Division Header */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{division.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {division.league.title} • {division.league.season.name}
                  </CardDescription>
                </div>
                <Badge variant={isFull ? "destructive" : "default"} className="text-lg px-4 py-2">
                  {isFull ? "Full" : `${slotsRemaining} slots remaining`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Platform</p>
                    <p className="font-semibold">{division.platform}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Game</p>
                    <p className="font-semibold">{division.league.game}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Slots</p>
                    <p className="font-semibold">{division.slots}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Season</p>
                    <p className="font-semibold">{division.league.season.name}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Registration Progress</span>
                  <span>{division.entries.length} / {division.slots}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isFull ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ 
                      width: `${Math.min((division.entries.length / division.slots) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Section */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRegistered ? (
                <div className="text-center py-6">
                  <Badge variant="default" className="mb-4 text-lg px-4 py-2">
                    ✓ Already Registered
                  </Badge>
                  <p className="text-gray-600 mb-4">
                    You're already registered for this division. Good luck!
                  </p>
                  <Link href={`/divisions/${division.id}/standings`}>
                    <Button variant="outline">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Standings
                    </Button>
                  </Link>
                </div>
              ) : isFull ? (
                <div className="text-center py-6">
                  <Badge variant="destructive" className="mb-4 text-lg px-4 py-2">
                    Division Full
                  </Badge>
                  <p className="text-gray-600 mb-4">
                    This division is currently full. Check back later or try another division.
                  </p>
                  <Link href={`/divisions/${division.id}/standings`}>
                    <Button variant="outline">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Standings
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    Ready to compete? Register now to secure your spot in this division.
                  </p>
                  <div className="space-y-3">
                    <RegisterButton divisionId={division.id} />
                    <div>
                      <Link href={`/divisions/${division.id}/standings`}>
                        <Button variant="outline" className="w-full">
                          <Trophy className="w-4 h-4 mr-2" />
                          View Standings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registered Players */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Registered Players ({division.entries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {division.entries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No players registered yet. Be the first to join!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {division.entries.map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {entry.user.name?.charAt(0) || entry.user.gamerTag?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {entry.user.gamerTag || entry.user.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.user.name && entry.user.gamerTag ? entry.user.name : 'Player'}
                        </p>
                      </div>
                      <Badge variant={entry.paid ? "default" : "secondary"} className="text-xs">
                        {entry.paid ? "Paid" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
