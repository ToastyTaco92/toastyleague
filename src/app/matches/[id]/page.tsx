import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Users, Trophy, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getMockMatch, getMockDivision, getMockEntries, getMockEvidence } from "@/lib/mock-data";
import { ReportScoreForm } from "./report-score-form";
import { EvidenceUpload } from "./evidence-upload";

interface MatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getMatchData(matchId: string) {
  const match = getMockMatch(matchId);
  if (!match) return null;

  const division = getMockDivision(match.divisionId);
  if (!division) return null;

  const entries = getMockEntries(match.divisionId);
  const homeEntry = entries.find(e => e.id === match.homeEntryId);
  const awayEntry = entries.find(e => e.id === match.awayEntryId);
  const evidence = getMockEvidence(matchId);

  return {
    match,
    division,
    homeEntry,
    awayEntry,
    evidence
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  const matchData = await getMatchData(id);

  if (!matchData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Not Found</h2>
                <p className="text-gray-600 mb-4">The match you're looking for doesn't exist.</p>
                <Link href="/divisions">
                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Divisions
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { match, division, homeEntry, awayEntry, evidence } = matchData;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/divisions">
            <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Divisions
            </button>
          </Link>
          <Badge className={`${getStatusColor(match.status)} px-3 py-1`}>
            {match.status}
          </Badge>
        </div>

        {/* Match Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {division.league.title} - {division.name}
            </CardTitle>
            <CardDescription>
              Round {match.roundNumber} • {division.platform}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Match Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team */}
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Home Team</h3>
                {homeEntry ? (
                  <div>
                    <p className="text-xl font-bold text-blue-600">{homeEntry.user.gamerTag}</p>
                    <p className="text-sm text-gray-600">{homeEntry.user.name}</p>
                    {match.homeScore !== null && (
                      <div className="mt-4">
                        <p className="text-3xl font-bold text-green-600">{match.homeScore}</p>
                        <p className="text-sm text-gray-500">Score</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Team not found</p>
                )}
              </div>

              {/* VS */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-2">VS</div>
                  {match.status === "COMPLETED" && match.homeScore !== null && match.awayScore !== null && (
                    <div className="text-sm text-gray-600">
                      {match.homeScore} - {match.awayScore}
                    </div>
                  )}
                </div>
              </div>

              {/* Away Team */}
              <div className="text-center p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Away Team</h3>
                {awayEntry ? (
                  <div>
                    <p className="text-xl font-bold text-red-600">{awayEntry.user.gamerTag}</p>
                    <p className="text-sm text-gray-600">{awayEntry.user.name}</p>
                    {match.awayScore !== null && (
                      <div className="mt-4">
                        <p className="text-3xl font-bold text-green-600">{match.awayScore}</p>
                        <p className="text-sm text-gray-500">Score</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Team not found</p>
                )}
              </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(match.scheduledAt)}</span>
              </div>
            </div>

            {/* Dispute Warning */}
            {match.status === "DISPUTED" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Match Disputed</span>
                </div>
                <p className="text-red-700 mt-1">
                  The scores reported by both teams don't match. Please review the evidence and contact an admin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Score Reporting */}
        {match.status === "SCHEDULED" && (
          <Card>
            <CardHeader>
              <CardTitle>Report Match Score</CardTitle>
              <CardDescription>
                Report your team's score for this match. Both teams must report the same score for the match to be completed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportScoreForm matchId={match.id} />
            </CardContent>
          </Card>
        )}

        {/* Evidence Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Upload</CardTitle>
            <CardDescription>
              Upload evidence (screenshots, recordings, etc.) for this match. This is especially important for disputed matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EvidenceUpload matchId={match.id} />
          </CardContent>
        </Card>

        {/* Existing Evidence */}
        {evidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submitted Evidence</CardTitle>
              <CardDescription>
                Evidence submitted for this match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {evidence.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Evidence #{item.id.slice(-6)}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Submitted by: {item.submittedBy}</p>
                    {item.description && (
                      <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                    )}
                    <a 
                      href={item.evidenceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      View Evidence
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
