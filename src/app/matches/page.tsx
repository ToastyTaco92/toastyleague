import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getMockMatches, getMockDivision, getMockEntries } from "@/lib/mock-data";
import { Calendar, Users, Trophy, ArrowRight } from "lucide-react";

export default async function MatchesPage() {
  const matches = getMockMatches();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "DISPUTED": return "bg-red-100 text-red-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  if (matches.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>No Matches Found</CardTitle>
              <CardDescription>
                There are no matches scheduled yet. Check back later or generate a schedule from the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Trophy className="w-4 h-4 mr-2" />
                  Go to Admin Panel
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matches</h1>
          <p className="text-gray-600">
            View all scheduled matches and their current status
          </p>
        </div>

        <div className="grid gap-6">
          {matches.map((match) => {
            const division = getMockDivision(match.divisionId);
            const entries = getMockEntries(match.divisionId);
            const homeEntry = entries.find(e => e.id === match.homeEntryId);
            const awayEntry = entries.find(e => e.id === match.awayEntryId);

            return (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {division?.league.title} - {division?.name}
                      </CardTitle>
                      <CardDescription>
                        Round {match.roundNumber} • {division?.platform}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(match.status)} px-3 py-1`}>
                      {match.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Home Team */}
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">
                        {homeEntry?.user.gamerTag || "Unknown"}
                      </p>
                      {match.homeScore !== null && (
                        <p className="text-2xl font-bold text-green-600">{match.homeScore}</p>
                      )}
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <div className="text-gray-400 font-bold">VS</div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(match.scheduledAt)}</span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="text-center">
                      <p className="font-semibold text-red-600">
                        {awayEntry?.user.gamerTag || "Unknown"}
                      </p>
                      {match.awayScore !== null && (
                        <p className="text-2xl font-bold text-green-600">{match.awayScore}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link href={`/matches/${match.id}`}>
                      <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        View Match Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
