"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Calendar, Trophy, Users, Settings, Clock } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description: string;
  game: string;
  platform: string;
  format: "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION" | "ROUND_ROBIN" | "SWISS";
  maxTeams: number;
  currentTeams: number;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: "UPCOMING" | "REGISTRATION_OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  rules: string;
  streamUrl?: string;
  discordUrl?: string;
}

const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Toast League Season 1 Championship",
    description: "The ultimate championship tournament for Season 1 winners",
    game: "Rocket League",
    platform: "Cross-Platform",
    format: "DOUBLE_ELIMINATION",
    maxTeams: 16,
    currentTeams: 8,
    entryFee: 25,
    prizePool: 400,
    startDate: "2024-02-01",
    endDate: "2024-02-03",
    registrationDeadline: "2024-01-25",
    status: "REGISTRATION_OPEN",
    rules: "Double elimination bracket, best of 5 matches, no smurfing",
    streamUrl: "https://www.twitch.tv/toastytaco",
    discordUrl: "https://discord.gg/toastyleague"
  }
];

export function TournamentCreator() {
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    game: "",
    platform: "",
    format: "SINGLE_ELIMINATION" as Tournament["format"],
    maxTeams: 16,
    entryFee: 25,
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    rules: "",
    streamUrl: "",
    discordUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTournament: Tournament = {
        id: Date.now().toString(),
        ...formData,
        currentTeams: 0,
        prizePool: formData.maxTeams * formData.entryFee,
        status: "UPCOMING" as const
      };
      
      setTournaments(prev => [...prev, newTournament]);
      setResult({ type: "success", message: "Tournament created successfully!" });
      
      setFormData({
        name: "",
        description: "",
        game: "",
        platform: "",
        format: "SINGLE_ELIMINATION",
        maxTeams: 16,
        entryFee: 25,
        startDate: "",
        endDate: "",
        registrationDeadline: "",
        rules: "",
        streamUrl: "",
        discordUrl: ""
      });
      setIsCreating(false);
    } catch (error) {
      setResult({ type: "error", message: "Failed to create tournament. Please try again." });
    }
  };

  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "UPCOMING": return "bg-blue-100 text-blue-800";
      case "REGISTRATION_OPEN": return "bg-green-100 text-green-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-gray-100 text-gray-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatLabel = (format: Tournament["format"]) => {
    switch (format) {
      case "SINGLE_ELIMINATION": return "Single Elimination";
      case "DOUBLE_ELIMINATION": return "Double Elimination";
      case "ROUND_ROBIN": return "Round Robin";
      case "SWISS": return "Swiss System";
      default: return format;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tournament Management</h2>
          <p className="text-gray-600">Create and manage major tournaments</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {result && (
        <Alert className={result.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={result.type === "success" ? "text-green-800" : "text-red-800"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Tournament</CardTitle>
            <CardDescription>Set up a major tournament with full configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Toast League Championship"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="game">Game</Label>
                  <Input
                    id="game"
                    value={formData.game}
                    onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                    placeholder="e.g., Rocket League"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    placeholder="e.g., Cross-Platform"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="format">Tournament Format</Label>
                  <select
                    id="format"
                    value={formData.format}
                    onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as Tournament["format"] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="SINGLE_ELIMINATION">Single Elimination</option>
                    <option value="DOUBLE_ELIMINATION">Double Elimination</option>
                    <option value="ROUND_ROBIN">Round Robin</option>
                    <option value="SWISS">Swiss System</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maxTeams">Max Teams</Label>
                  <Input
                    id="maxTeams"
                    type="number"
                    min="2"
                    max="64"
                    value={formData.maxTeams}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.entryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                  <Input
                    id="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="streamUrl">Stream URL (Optional)</Label>
                  <Input
                    id="streamUrl"
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, streamUrl: e.target.value }))}
                    placeholder="https://www.twitch.tv/toastytaco"
                  />
                </div>
                <div>
                  <Label htmlFor="discordUrl">Discord URL (Optional)</Label>
                  <Input
                    id="discordUrl"
                    type="url"
                    value={formData.discordUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, discordUrl: e.target.value }))}
                    placeholder="https://discord.gg/toastyleague"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the tournament, prizes, and special features..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rules">Rules & Format Details</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                  placeholder="Detailed rules, match format, tiebreakers, etc..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Create Tournament
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setFormData({
                      name: "",
                      description: "",
                      game: "",
                      platform: "",
                      format: "SINGLE_ELIMINATION",
                      maxTeams: 16,
                      entryFee: 25,
                      startDate: "",
                      endDate: "",
                      registrationDeadline: "",
                      rules: "",
                      streamUrl: "",
                      discordUrl: ""
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tournaments List */}
      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <CardDescription className="mt-1">{tournament.description}</CardDescription>
                </div>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{tournament.currentTeams}/{tournament.maxTeams} teams</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>${tournament.entryFee} entry</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{getFormatLabel(tournament.format)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" />
                  <span>Reg. Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>Prize Pool: ${tournament.prizePool}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Rules: {tournament.rules}</p>
                {tournament.streamUrl && (
                  <p className="text-sm text-blue-600 mb-1">
                    Stream: <a href={tournament.streamUrl} target="_blank" rel="noopener noreferrer" className="underline">Watch Live</a>
                  </p>
                )}
                {tournament.discordUrl && (
                  <p className="text-sm text-indigo-600">
                    Discord: <a href={tournament.discordUrl} target="_blank" rel="noopener noreferrer" className="underline">Join Server</a>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
