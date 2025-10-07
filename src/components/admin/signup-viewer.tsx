"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

interface Signup {
  id: string;
  userId: string;
  gamertag: string;
  email: string;
  divisionId: string;
  divisionName: string;
  tournamentId?: string;
  tournamentName?: string;
  status: "PENDING" | "CONFIRMED" | "PAID" | "REJECTED";
  entryFee: number;
  registeredAt: string;
  paidAt?: string;
  notes?: string;
}

const mockSignups: Signup[] = [
  {
    id: "1",
    userId: "user1",
    gamertag: "ProGamer123",
    email: "pro@example.com",
    divisionId: "1",
    divisionName: "Rocket League - Bronze/Silver",
    status: "PAID",
    entryFee: 10,
    registeredAt: "2024-01-10T10:00:00Z",
    paidAt: "2024-01-10T10:30:00Z",
    notes: "Previous tournament winner"
  },
  {
    id: "2",
    userId: "user2",
    gamertag: "SpeedRunner99",
    email: "speed@example.com",
    divisionId: "1",
    divisionName: "Rocket League - Bronze/Silver",
    status: "CONFIRMED",
    entryFee: 10,
    registeredAt: "2024-01-11T14:00:00Z",
    notes: "New player, needs verification"
  },
  {
    id: "3",
    userId: "user3",
    gamertag: "ElitePlayer",
    email: "elite@example.com",
    divisionId: "2",
    divisionName: "Valorant - Gold/Platinum",
    status: "PENDING",
    entryFee: 15,
    registeredAt: "2024-01-12T09:00:00Z"
  },
  {
    id: "4",
    userId: "user4",
    gamertag: "Champion2024",
    email: "champ@example.com",
    divisionId: "1",
    divisionName: "Rocket League - Bronze/Silver",
    tournamentId: "1",
    tournamentName: "Toast League Season 1 Championship",
    status: "PAID",
    entryFee: 25,
    registeredAt: "2024-01-08T16:00:00Z",
    paidAt: "2024-01-08T16:15:00Z"
  }
];

export function SignupViewer() {
  const [signups, setSignups] = useState<Signup[]>(mockSignups);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");

  const filteredSignups = signups.filter(signup => {
    const matchesSearch = signup.gamertag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signup.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || signup.status === statusFilter;
    const matchesDivision = divisionFilter === "ALL" || signup.divisionId === divisionFilter;
    
    return matchesSearch && matchesStatus && matchesDivision;
  });

  const handleStatusChange = (signupId: string, newStatus: Signup["status"]) => {
    setSignups(prev => prev.map(signup => 
      signup.id === signupId 
        ? { 
            ...signup, 
            status: newStatus,
            paidAt: newStatus === "PAID" ? new Date().toISOString() : signup.paidAt
          }
        : signup
    ));
  };

  const getStatusColor = (status: Signup["status"]) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "PAID": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Signup["status"]) => {
    switch (status) {
      case "PENDING": return <Clock className="w-4 h-4" />;
      case "CONFIRMED": return <CheckCircle className="w-4 h-4" />;
      case "PAID": return <CheckCircle className="w-4 h-4" />;
      case "REJECTED": return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const divisions = Array.from(new Set(signups.map(s => ({ id: s.divisionId, name: s.divisionName }))));
  const tournaments = Array.from(new Set(signups.filter(s => s.tournamentId).map(s => ({ id: s.tournamentId!, name: s.tournamentName! }))));

  const totalRevenue = signups.filter(s => s.status === "PAID").reduce((sum, s) => sum + s.entryFee, 0);
  const pendingRevenue = signups.filter(s => s.status === "CONFIRMED").reduce((sum, s) => sum + s.entryFee, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tournament Signups</h2>
          <p className="text-gray-600">View and manage player registrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Signups</p>
                <p className="text-2xl font-bold text-gray-900">{signups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Paid Entries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {signups.filter(s => s.status === "PAID").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {signups.filter(s => s.status === "PENDING" || s.status === "CONFIRMED").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
                {pendingRevenue > 0 && (
                  <p className="text-xs text-gray-500">+${pendingRevenue} pending</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Players</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Gamertag or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Status</Label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PAID">Paid</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="divisionFilter">Division</Label>
              <select
                id="divisionFilter"
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Divisions</option>
                {divisions.map(div => (
                  <option key={div.id} value={div.id}>{div.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setDivisionFilter("ALL");
                }}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Player Registrations ({filteredSignups.length})</CardTitle>
          <CardDescription>
            Manage player signups and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Player</th>
                  <th className="text-left py-3 px-2">Division</th>
                  <th className="text-left py-3 px-2">Tournament</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Entry Fee</th>
                  <th className="text-left py-3 px-2">Registered</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignups.map((signup) => (
                  <tr key={signup.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{signup.gamertag}</p>
                        <p className="text-sm text-gray-600">{signup.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-sm">{signup.divisionName}</p>
                    </td>
                    <td className="py-3 px-2">
                      {signup.tournamentName ? (
                        <p className="text-sm text-purple-600">{signup.tournamentName}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Division Only</p>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(signup.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(signup.status)}
                          <span className="ml-1">{signup.status}</span>
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-medium">${signup.entryFee}</p>
                    </td>
                    <td className="py-3 px-2">
                      <p className="text-sm">
                        {new Date(signup.registeredAt).toLocaleDateString()}
                      </p>
                      {signup.paidAt && (
                        <p className="text-xs text-green-600">
                          Paid: {new Date(signup.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(signup.id, "CONFIRMED")}
                          disabled={signup.status === "CONFIRMED" || signup.status === "PAID"}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(signup.id, "PAID")}
                          disabled={signup.status === "PAID"}
                        >
                          💰
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(signup.id, "REJECTED")}
                          disabled={signup.status === "REJECTED"}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSignups.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No signups found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
