import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Calendar, Users, Trophy, AlertCircle } from "lucide-react";
import { ScheduleGenerator } from "./schedule-generator";
import { getDisputedMatches } from "@/lib/mock-data";
import Link from "next/link";

export default async function AdminPage() {
  const disputedMatches = getDisputedMatches();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage divisions, generate schedules, and oversee tournament operations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Schedule Generation Card */}
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

          {/* Dispute Management Card */}
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                <p className="text-sm text-gray-600">Registered players</p>
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
        </div>
      </div>
    </div>
  );
}
