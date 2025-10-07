import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Users, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDisputedMatches, getMockDivision, getMockEntries, MockMatch } from "@/lib/mock-data";
import { format } from "date-fns";

async function getDisputesData() {
  const disputedMatches = getDisputedMatches();
  const divisions = disputedMatches.map(match => getMockDivision(match.divisionId)).filter(Boolean);
  const allEntries = divisions.flatMap(div => div ? getMockEntries(div.id) : []);

  const disputesWithDetails = disputedMatches.map(match => {
    const division = getMockDivision(match.divisionId);
    const homeEntry = allEntries.find(e => e.id === match.homeEntryId);
    const awayEntry = allEntries.find(e => e.id === match.awayEntryId);

    return {
      ...match,
      divisionName: division?.name || "Unknown Division",
      leagueTitle: division?.league.title || "Unknown League",
      platform: division?.platform || "Unknown Platform",
      homeGamerTag: homeEntry?.user.gamerTag || "Unknown Player",
      awayGamerTag: awayEntry?.user.gamerTag || "Unknown Player",
      homeName: homeEntry?.user.name || "Unknown Player",
      awayName: awayEntry?.user.name || "Unknown Player",
    };
  });

  return disputesWithDetails;
}

export default async function DisputesPage() {
  const disputes = await getDisputesData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Management</h1>
            <p className="text-gray-600">Review and resolve disputed matches</p>
          </div>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            {disputes.length} Open Disputes
          </Badge>
        </div>

        {disputes.length === 0 ? (
          <Card className="py-12">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">No Open Disputes</CardTitle>
              <CardDescription className="text-lg">
                All matches are currently resolved. Great job!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin">
                <Button>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Back to Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="border-red-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        {dispute.leagueTitle} - {dispute.divisionName}
                      </CardTitle>
                      <CardDescription>
                        Round {dispute.roundNumber} • {dispute.platform} • 
                        Disputed on {format(dispute.updatedAt, 'MMM dd, yyyy \'at\' h:mm a')}
                      </CardDescription>
                    </div>
                    <Badge variant="destructive" className="text-sm">
                      DISPUTED
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Home Team */}
                    <div className="text-center p-4 border rounded-lg bg-blue-50">
                      <h3 className="text-lg font-semibold mb-2 text-blue-800">Home Team</h3>
                      <div>
                        <p className="text-xl font-bold text-blue-600">{dispute.homeGamerTag}</p>
                        <p className="text-sm text-gray-600">{dispute.homeName}</p>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">Reported Score</p>
                        <p className="text-2xl font-bold text-red-600">{dispute.homeScore}</p>
                      </div>
                    </div>

                    {/* VS Section */}
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                        <div className="text-sm text-gray-500 mb-2">Score Mismatch</div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{format(dispute.scheduledAt, 'MMM dd, h:mm a')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="text-center p-4 border rounded-lg bg-red-50">
                      <h3 className="text-lg font-semibold mb-2 text-red-800">Away Team</h3>
                      <div>
                        <p className="text-xl font-bold text-red-600">{dispute.awayGamerTag}</p>
                        <p className="text-sm text-gray-600">{dispute.awayName}</p>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">Reported Score</p>
                        <p className="text-2xl font-bold text-red-600">{dispute.awayScore}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-6 border-t">
                    <Link href={`/admin/disputes/${dispute.id}`}>
                      <Button className="w-full" variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Review & Resolve Dispute
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Dispute Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{disputes.length}</p>
                <p className="text-sm text-gray-600">Open Disputes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.length > 0 ? Math.round((disputes.length / (disputes.length + 1)) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600">Dispute Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.length > 0 ? Math.round(disputes.reduce((sum, d) => sum + (Date.now() - d.updatedAt.getTime()) / (1000 * 60 * 60 * 24), 0) / disputes.length) : 0}
                </p>
                <p className="text-sm text-gray-600">Avg. Days Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
