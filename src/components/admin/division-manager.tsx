"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Settings } from "lucide-react";
import { createDivision, updateDivision, deleteDivision, getDivisions } from "../../app/admin/division-actions";

interface Division {
  id: string;
  name: string;
  description: string;
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  prizePool: number;
  status: "OPEN" | "FULL" | "CLOSED" | "COMPLETED";
  startDate: string;
  endDate: string;
  game: string;
  platform: string;
  rules: string;
  entries?: any[];
}

export function DivisionManager() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxPlayers: 8,
    entryFee: 10,
    startDate: "",
    endDate: "",
    game: "",
    platform: "",
    rules: ""
  });

  // Load divisions from database
  useEffect(() => {
    const loadDivisions = async () => {
      try {
        console.log("Admin: Loading divisions...");
        const result = await getDivisions();
        console.log("Admin: Divisions result:", result);
        
        if (result.success) {
          const formattedDivisions = result.divisions.map((div: any) => ({
            id: div.id,
            name: div.name,
            description: div.description,
            maxPlayers: div.maxPlayers,
            currentPlayers: div.entries?.length || 0,
            entryFee: div.entryFee,
            prizePool: div.maxPlayers * div.entryFee,
            status: div.status,
            startDate: div.startDate,
            endDate: div.endDate,
            game: div.game,
            platform: div.platform,
            rules: div.rules,
            entries: div.entries
          }));
          console.log("Admin: Formatted divisions:", formattedDivisions);
          setDivisions(formattedDivisions);
        } else {
          setResult({ type: "error", message: "Failed to load divisions" });
        }
      } catch (error) {
        console.error("Admin: Error loading divisions:", error);
        setResult({ type: "error", message: "Failed to load divisions" });
      } finally {
        setLoading(false);
      }
    };

    loadDivisions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("maxPlayers", formData.maxPlayers.toString());
      formDataObj.append("entryFee", formData.entryFee.toString());
      formDataObj.append("startDate", formData.startDate);
      formDataObj.append("endDate", formData.endDate);
      formDataObj.append("game", formData.game);
      formDataObj.append("platform", formData.platform);
      formDataObj.append("rules", formData.rules);

      let result;
      if (editingId) {
        result = await updateDivision(editingId, formDataObj);
      } else {
        result = await createDivision(formDataObj);
      }

      if (result.success) {
        setResult({ type: "success", message: editingId ? "Division updated successfully!" : "Division created successfully!" });
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
          maxPlayers: 8,
          entryFee: 10,
          startDate: "",
          endDate: "",
          game: "",
          platform: "",
          rules: ""
        });
        setIsCreating(false);
        
        // Reload divisions
        const divisionsResult = await getDivisions();
        if (divisionsResult.success) {
          const formattedDivisions = divisionsResult.divisions.map((div: any) => ({
            id: div.id,
            name: div.name,
            description: div.description,
            maxPlayers: div.maxPlayers,
            currentPlayers: div.entries?.length || 0,
            entryFee: div.entryFee,
            prizePool: div.maxPlayers * div.entryFee,
            status: div.status,
            startDate: div.startDate,
            endDate: div.endDate,
            game: div.game,
            platform: div.platform,
            rules: div.rules,
            entries: div.entries
          }));
          setDivisions(formattedDivisions);
        }
      } else {
        setResult({ type: "error", message: result.error || "Failed to save division. Please try again." });
      }
    } catch (error) {
      setResult({ type: "error", message: "Failed to save division. Please try again." });
    }
  };

  const handleEdit = (division: Division) => {
    setFormData({
      name: division.name,
      description: division.description,
      maxPlayers: division.maxPlayers,
      entryFee: division.entryFee,
      startDate: division.startDate,
      endDate: division.endDate,
      game: division.game,
      platform: division.platform,
      rules: division.rules
    });
    setEditingId(division.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this division?")) {
      try {
        const result = await deleteDivision(id);
        if (result.success) {
          setResult({ type: "success", message: "Division deleted successfully!" });
          // Reload divisions
          const divisionsResult = await getDivisions();
          if (divisionsResult.success) {
            const formattedDivisions = divisionsResult.divisions.map((div: any) => ({
              id: div.id,
              name: div.name,
              description: div.description,
              maxPlayers: div.maxPlayers,
              currentPlayers: div.entries?.length || 0,
              entryFee: div.entryFee,
              prizePool: div.maxPlayers * div.entryFee,
              status: div.status,
              startDate: div.startDate,
              endDate: div.endDate,
              game: div.game,
              platform: div.platform,
              rules: div.rules,
              entries: div.entries
            }));
            setDivisions(formattedDivisions);
          }
        } else {
          setResult({ type: "error", message: result.error || "Failed to delete division" });
        }
      } catch (error) {
        setResult({ type: "error", message: "Failed to delete division" });
      }
    }
  };

  const getStatusColor = (status: Division["status"]) => {
    switch (status) {
      case "OPEN": return "bg-green-100 text-green-800";
      case "FULL": return "bg-yellow-100 text-yellow-800";
      case "CLOSED": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Division Management</h2>
          <p className="text-gray-600">Create and manage tournament divisions</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Division
        </Button>
      </div>

      {result && (
        <Alert className={result.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={result.type === "success" ? "text-green-800" : "text-red-800"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Division" : "Create New Division"}</CardTitle>
            <CardDescription>
              {editingId ? "Update division details" : "Set up a new tournament division"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Division Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Rocket League - Bronze/Silver"
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
                    placeholder="e.g., PC, Console, Cross-Platform"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxPlayers">Max Players</Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="2"
                    max="32"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
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
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the division, skill level, and requirements..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rules">Rules & Format</Label>
                <Textarea
                  id="rules"
                  value={formData.rules}
                  onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                  placeholder="e.g., Standard 3v3 matches, best of 5 games, no smurfing allowed..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingId ? "Update Division" : "Create Division"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                      maxPlayers: 8,
                      entryFee: 10,
                      startDate: "",
                      endDate: "",
                      game: "",
                      platform: "",
                      rules: ""
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

      {/* Divisions List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading divisions...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {divisions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No divisions yet</h3>
                  <p className="text-gray-600">Create your first division to get started with tournament management.</p>
                </div>
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Division
                </Button>
              </CardContent>
            </Card>
          ) : (
            divisions.map((division) => (
          <Card key={division.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{division.name}</CardTitle>
                  <CardDescription className="mt-1">{division.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(division.status)}>
                    {division.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(division)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(division.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{division.currentPlayers}/{division.maxPlayers} players</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>${division.entryFee} entry</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  <span>{new Date(division.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2 text-purple-600" />
                  <span>{division.game}</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Prize Pool: ${division.prizePool}</p>
                <p className="text-sm text-gray-600">Rules: {division.rules}</p>
              </div>
            </CardContent>
          </Card>
        )))}
        </div>
      )}
    </div>
  );
}
