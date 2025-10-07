"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { resolveDisputeAction } from "./resolve-dispute-action";

interface ResolveDisputeFormProps {
  matchId: string;
}

export function ResolveDisputeForm({ matchId }: ResolveDisputeFormProps) {
  const [homeScore, setHomeScore] = useState<number | ''>('');
  const [awayScore, setAwayScore] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (homeScore === '' || awayScore === '') {
      setMessage({ type: 'error', text: 'Please enter final scores for both teams.' });
      return;
    }

    if (homeScore < 0 || awayScore < 0) {
      setMessage({ type: 'error', text: 'Scores cannot be negative.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await resolveDisputeAction(matchId, Number(homeScore), Number(awayScore));

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Dispute resolved successfully! The match has been finalized.' });
      setHomeScore('');
      setAwayScore('');
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to resolve dispute.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="homeScore">Final Home Team Score</Label>
            <Input
              id="homeScore"
              type="number"
              min="0"
              placeholder="0"
              value={homeScore}
              onChange={(e) => setHomeScore(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="awayScore">Final Away Team Score</Label>
            <Input
              id="awayScore"
              type="number"
              min="0"
              placeholder="0"
              value={awayScore}
              onChange={(e) => setAwayScore(Number(e.target.value))}
              required
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || homeScore === '' || awayScore === ''}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <CheckCircle className="w-4 h-4 mr-2" />
          Resolve Dispute & Finalize Match
        </Button>
      </form>

      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="font-medium mb-2 text-yellow-800">⚠️ Important Admin Notice:</p>
        <ul className="list-disc list-inside space-y-1 text-yellow-700">
          <li>This action will permanently finalize the match with the scores you set</li>
          <li>The match status will change from DISPUTED to COMPLETED</li>
          <li>Standings will be updated based on the final scores</li>
          <li>This action cannot be undone - please verify scores carefully</li>
          <li>Consider all submitted evidence before making your decision</li>
        </ul>
      </div>
    </div>
  );
}
