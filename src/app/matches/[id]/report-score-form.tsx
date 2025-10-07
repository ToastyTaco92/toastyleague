"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { reportScore } from "./report-score-action";

interface ReportScoreFormProps {
  matchId: string;
}

export function ReportScoreForm({ matchId }: ReportScoreFormProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homeScore || !awayScore) {
      setResult({ type: "error", message: "Please enter both scores" });
      return;
    }

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      setResult({ type: "error", message: "Please enter valid numbers" });
      return;
    }

    if (homeScoreNum < 0 || awayScoreNum < 0) {
      setResult({ type: "error", message: "Scores cannot be negative" });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await reportScore(matchId, homeScoreNum, awayScoreNum);
      
      if (response.success) {
        setResult({ type: "success", message: response.message || "Score reported successfully!" });
        setHomeScore("");
        setAwayScore("");
      } else {
        setResult({ type: "error", message: response.error || "Failed to report score" });
      }
    } catch (error) {
      setResult({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="homeScore">Home Team Score</Label>
            <Input
              id="homeScore"
              type="number"
              min="0"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="awayScore">Away Team Score</Label>
            <Input
              id="awayScore"
              type="number"
              min="0"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !homeScore || !awayScore}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Reporting Score...
            </>
          ) : (
            "Report Score"
          )}
        </Button>
      </form>

      {result && (
        <Alert className={result.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {result.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={result.type === "error" ? "text-red-800" : "text-green-800"}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Important:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Both teams should report the same score for the match to be completed</li>
          <li>If scores don't match, the match will be marked as disputed</li>
          <li>Upload evidence to support your score report</li>
        </ul>
      </div>
    </div>
  );
}
