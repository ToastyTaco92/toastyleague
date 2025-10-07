"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, Users, Trophy, AlertCircle, Plus, Eye, BarChart3 } from "lucide-react";
import { ScheduleGenerator } from "../../app/admin/schedule-generator";
import { DivisionManager } from "./division-manager";
import { TournamentCreator } from "./tournament-creator";
import { SignupViewer } from "./signup-viewer";
import { getDisputedMatches } from "@/lib/mock-data";
import Link from "next/link";

type TabType = "overview" | "divisions" | "tournaments" | "signups" | "schedule" | "disputes";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const disputedMatches = getDisputedMatches();

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "divisions", label: "Divisions", icon: Users },
    { id: "tournaments", label: "Tournaments", icon: Trophy },
    { id: "signups", label: "Signups", icon: Eye },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "disputes", label: "Disputes", icon: AlertCircle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Active Divisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                  <p className="text-sm text-gray-600">Divisions with entries</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Trophy className="w-5 h-5 mr-2 text-purple-600" />
                    Total Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
                  <p className="text-sm text-gray-600">Registered players</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Upcoming Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
                  <p className="text-sm text-gray-600">This week</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-600" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="default" className="mb-2">Operational</Badge>
                  <p className="text-sm text-gray-600">All systems running</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("divisions")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create New Division
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("tournaments")}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("schedule")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Schedule
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setActiveTab("signups")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Signups
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                      Dispute Management
                    </div>
                    {disputedMatches.length > 0 && (
                      <Badge variant="destructive" className="text-sm">
                        {disputedMatches.length} Open
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Review and resolve disputed matches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {disputedMatches.length === 0 
                          ? "No open disputes. All matches are resolved." 
                          : `${disputedMatches.length} dispute${disputedMatches.length === 1 ? '' : 's'} require${disputedMatches.length === 1 ? 's' : ''} attention.`
                        }
                      </p>
                    </div>
                    <Button 
                      variant={disputedMatches.length > 0 ? "destructive" : "outline"}
                      onClick={() => setActiveTab("disputes")}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Manage Disputes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "divisions":
        return <DivisionManager />;
      case "tournaments":
        return <TournamentCreator />;
      case "signups":
        return <SignupViewer />;
      case "schedule":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Generate Tournament Schedule
              </CardTitle>
              <CardDescription>
                Create a round-robin schedule for any division. Matches will be scheduled weekly on Wednesdays at 8:00 PM.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScheduleGenerator />
            </CardContent>
          </Card>
        );
      case "disputes":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  Dispute Management
                </div>
                {disputedMatches.length > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    {disputedMatches.length} Open
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Review and resolve disputed matches. Set final scores and mark disputes as resolved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {disputedMatches.length === 0 
                      ? "No open disputes. All matches are resolved." 
                      : `${disputedMatches.length} dispute${disputedMatches.length === 1 ? '' : 's'} require${disputedMatches.length === 1 ? 's' : ''} attention.`
                    }
                  </p>
                </div>
                <Link href="/admin/disputes">
                  <Button variant={disputedMatches.length > 0 ? "destructive" : "outline"}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Manage Disputes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage divisions, tournaments, schedules, and oversee all tournament operations.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✨ New: Division & Tournament Management
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
