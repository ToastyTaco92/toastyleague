"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Calendar, Users, Trophy, AlertCircle, CheckCircle } from "lucide-react";
import { generateSchedule } from "./generate-schedule-action";
import { getMockDivisions, MockDivision } from "@/lib/mock-data";

export function ScheduleGenerator() {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    matches?: number;
    weeks?: number;
    matchesGenerated?: number;
  } | null>(null);

  const divisions = getMockDivisions();
  const selectedDivision = divisions.find(d => d.id === selectedDivisionId);

  const handleGenerateSchedule = async () => {
    if (!selectedDivisionId) {
      setResult({
        success: false,
        message: "Please select a division first."
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await generateSchedule(selectedDivisionId);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateRoundRobinInfo = (entryCount: number) => {
    if (entryCount < 2) return { totalMatches: 0, totalRounds: 0, weeksNeeded: 0 };
    
    // Round-robin: each team plays every other team once
    const totalMatches = (entryCount * (entryCount - 1)) / 2;
    const totalRounds = entryCount % 2 === 0 ? entryCount - 1 : entryCount;
    const weeksNeeded = Math.ceil(totalRounds / 2); // Assuming 2 matches per week max
    
    return { totalMatches, totalRounds, weeksNeeded };
  };

  const scheduleInfo = selectedDivision ? calculateRoundRobinInfo(selectedDivision.entries.length) : null;

  return (
    <div className="space-y-6">
      {/* Division Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Division
          </label>
          <select
            value={selectedDivisionId}
            onChange={(e) => setSelectedDivisionId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a division...</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name} - {division.league.game} ({division.entries.length} entries)
              </option>
            ))}
          </select>
        </div>

        {/* Division Preview */}
        {selectedDivision && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-blue-600" />
                {selectedDivision.name}
              </CardTitle>
              <CardDescription>
                {selectedDivision.league.title} • {selectedDivision.league.season.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Platform:</span>
                  <p className="font-medium">{selectedDivision.platform}</p>
                </div>
                <div>
                  <span className="text-gray-600">Game:</span>
                  <p className="font-medium">{selectedDivision.league.game}</p>
                </div>
                <div>
                  <span className="text-gray-600">Entries:</span>
                  <p className="font-medium">{selectedDivision.entries.length}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Slots:</span>
                  <p className="font-medium">{selectedDivision.slots}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Preview */}
        {scheduleInfo && selectedDivision && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                Schedule Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Matches:</span>
                  <p className="font-medium text-lg">{scheduleInfo.totalMatches}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Rounds:</span>
                  <p className="font-medium text-lg">{scheduleInfo.totalRounds}</p>
                </div>
                <div>
                  <span className="text-gray-600">Weeks Needed:</span>
                  <p className="font-medium text-lg">{scheduleInfo.weeksNeeded}</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">
                  <strong>Schedule Details:</strong> Matches will be scheduled weekly on Wednesdays at 8:00 PM local time, 
                  starting from next Wednesday. Each team will play every other team once in a round-robin format.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entry List */}
        {selectedDivision && selectedDivision.entries.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Registered Players ({selectedDivision.entries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDivision.entries.map((entry) => (
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateSchedule}
          disabled={!selectedDivisionId || isGenerating || (selectedDivision?.entries.length || 0) < 2}
          size="lg"
          className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Schedule...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              Generate Schedule
            </>
          )}
        </Button>
      </div>

      {/* Validation Messages */}
      {selectedDivisionId && (selectedDivision?.entries.length || 0) < 2 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            A division needs at least 2 registered players to generate a schedule.
          </AlertDescription>
        </Alert>
      )}

      {/* Result Messages */}
      {result && (
        <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
            {result.message || result.error}
            {result.success && result.matches && (
              <span className="block mt-1 font-medium">
                Generated {result.matches} matches across {result.weeks} weeks successfully!
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
