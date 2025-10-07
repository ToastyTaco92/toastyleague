import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Clock, Users, Trophy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getMockMatch, getMockDivision, getMockEntries, getMockEvidence, MockMatch, MockEvidence } from "@/lib/mock-data";
import { format } from "date-fns";
import { ResolveDisputeForm } from "./resolve-dispute-form";

async function getDisputeDetails(id: string) {
  const match = getMockMatch(id);
  if (!match || match.status !== 'DISPUTED') return null;

  const division = getMockDivision(match.divisionId);
  const entries = division ? getMockEntries(division.id) : [];
  const homeEntry = entries.find(e => e.id === match.homeEntryId);
  const awayEntry = entries.find(e => e.id === match.awayEntryId);
  const evidence = getMockEvidence(match.id);

  return {
    match,
    division,
    homeEntry,
    awayEntry,
    evidence,
  };
}

interface DisputeDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DisputeDetailPage({ params }: DisputeDetailPageProps) {
  const { id } = await params;
  const details = await getDisputeDetails(id);

  if (!details || !details.division || !details.homeEntry || !details.awayEntry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Dispute Not Found</CardTitle>
            <CardDescription>The requested dispute could not be found or is not in disputed status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/disputes">
              <Button>Back to Disputes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { match, division, homeEntry, awayEntry, evidence } = details;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/admin/disputes">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Disputes
            </Button>
          </Link>
          <Badge variant="destructive" className="text-lg px-4 py-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            DISPUTED
          </Badge>
        </div>

        {/* Match Details */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {division.league.title} - {division.name}
            </CardTitle>
            <CardDescription>Round {match.roundNumber} • {division.platform}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 border rounded-lg bg-blue-50">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Home Team</h3>
                <div>
                  <p className="text-xl font-bold text-blue-600">{homeEntry.user.gamerTag}</p>
                  <p className="text-sm text-gray-600">{homeEntry.user.name}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Reported Score</p>
                  <p className="text-3xl font-extrabold text-red-600">{match.homeScore}</p>
                </div>
              </div>
              <div className="text-center p-6 border rounded-lg bg-red-50">
                <h3 className="text-lg font-semibold mb-2 text-red-800">Away Team</h3>
                <div>
                  <p className="text-xl font-bold text-red-600">{awayEntry.user.gamerTag}</p>
                  <p className="text-sm text-gray-600">{awayEntry.user.name}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Reported Score</p>
                  <p className="text-3xl font-extrabold text-red-600">{match.awayScore}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Scheduled: {format(match.scheduledAt, 'EEEE, MMMM dd, yyyy \'at\' h:mm a zzz')}</span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-semibold">Score Mismatch Detected</h4>
              </div>
              <p className="text-red-700 text-sm">
                The reported scores do not match. Home team reported {match.homeScore} while away team reported {match.awayScore}. 
                Please review the evidence and determine the correct final score.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Submitted Evidence
            </CardTitle>
            <CardDescription>Review evidence submitted by players to help determine the correct score</CardDescription>
          </CardHeader>
          <CardContent>
            {evidence.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Evidence Submitted</h3>
                <p className="text-gray-600">
                  No evidence has been submitted for this dispute yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {evidence.map((item) => (
                  <div key={item.id} className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{item.submittedBy}</h4>
                      <span className="text-sm text-gray-500">
                        {format(item.createdAt, 'MMM dd, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>URL:</strong> <a href={item.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.evidenceUrl}</a>
                    </p>
                    {item.description && (
                      <p className="text-sm text-gray-600">
                        <strong>Description:</strong> {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resolution Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Resolve Dispute
            </CardTitle>
            <CardDescription>
              Set the final score and mark this dispute as resolved. This will finalize the match and update standings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResolveDisputeForm matchId={match.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
