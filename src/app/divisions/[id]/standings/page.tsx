import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal, Award, Users } from "lucide-react";
import Link from "next/link";
import { getMockDivision, getDivisionStandings, StandingEntry } from "@/lib/mock-data";

async function getStandingsData(divisionId: string) {
  const division = getMockDivision(divisionId);
  if (!division) return null;

  const standings = getDivisionStandings(divisionId);
  return { division, standings };
}

interface StandingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StandingsPage({ params }: StandingsPageProps) {
  const { id } = await params;
  const data = await getStandingsData(id);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Division Not Found</CardTitle>
            <CardDescription>The requested division could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/divisions">
              <Button>Back to Divisions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { division, standings } = data;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">
          {index + 1}
        </span>;
    }
  };

  const getRankBadgeClass = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 2:
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/divisions/${id}`}>
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Division
            </Button>
          </Link>
          <Badge variant="outline" className="text-sm">
            {division.platform}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {division.league.title} - {division.name}
            </CardTitle>
            <CardDescription>
              Current standings based on completed matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            {standings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Standings Available</h3>
                <p className="text-gray-600 mb-4">
                  No completed matches found for this division yet.
                </p>
                <Link href={`/divisions/${id}`}>
                  <Button>View Division</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Standings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Rank</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Player</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">W-L</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Games</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Point Diff</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Win %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((standing, index) => (
                        <tr key={standing.entry.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getRankIcon(index)}
                              <Badge className={getRankBadgeClass(index)}>
                                #{index + 1}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">{standing.entry.user.gamerTag}</p>
                              <p className="text-sm text-gray-600">{standing.entry.user.name}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-semibold">
                              {standing.wins}-{standing.losses}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-600">
                            {standing.gamesPlayed}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-semibold ${
                              standing.pointDifferential > 0 
                                ? 'text-green-600' 
                                : standing.pointDifferential < 0 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                            }`}>
                              {standing.pointDifferential > 0 ? '+' : ''}{standing.pointDifferential}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-600">
                            {standing.gamesPlayed > 0 
                              ? `${Math.round((standing.wins / standing.gamesPlayed) * 100)}%`
                              : '0%'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {standings.reduce((sum, s) => sum + s.gamesPlayed, 0)}
                    </p>
                    <p className="text-sm text-gray-600">Total Games Played</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {standings.filter(s => s.gamesPlayed > 0).length}
                    </p>
                    <p className="text-sm text-gray-600">Active Players</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {standings.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Players</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Standings Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Ranking Criteria:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>1. Win-Loss Record</li>
                  <li>2. Point Differential (tiebreaker)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Point Differential:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Positive: More points scored than allowed</li>
                  <li>• Negative: More points allowed than scored</li>
                  <li>• Zero: Equal points scored and allowed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
