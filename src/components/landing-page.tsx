import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, Users, Eye } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to Toast League
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate gaming league experience. Compete, climb, and conquer in our competitive gaming tournaments.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Season 1 (Pilot)
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join our inaugural season and be part of gaming history. Experience competitive play like never before with our innovative league system.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">Divisions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">64</div>
                  <div className="text-sm text-gray-600">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$5K</div>
                  <div className="text-sm text-gray-600">Prize Pool</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link href="/divisions">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    View Divisions
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Registration opens soon • Season starts in 2 weeks
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">Competitive Play</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Experience fair, balanced competition with our skill-based matchmaking system.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">Live Streaming</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Watch your favorite players compete in high-quality live streams.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-xl">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Join a vibrant community of gamers and make lasting connections.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Twitch Channel Preview */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Follow the Action Live
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Watch live streams, highlights, and behind-the-scenes content from the Toast League community.
              </p>
            </div>

            <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                  <div className="text-left">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      ToastyTaco
                    </CardTitle>
                    <p className="text-sm text-gray-600">Official Toast League Channel</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Gaming Community
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Live Streaming
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white/80 rounded-lg p-6 mb-6">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-xl">▶</span>
                      </div>
                      <p className="text-gray-600 font-medium">Live Stream Preview</p>
                      <p className="text-sm text-gray-500">Watch Toast League matches live</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Latest Stream</div>
                      <div className="text-gray-600">Toast League Season 1</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">Next Stream</div>
                      <div className="text-gray-600">Wednesday 8 PM EST</div>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="https://www.twitch.tv/toastytaco" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Watch on Twitch
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
