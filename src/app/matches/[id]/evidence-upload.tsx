"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react";
import { uploadEvidence } from "./upload-evidence-action";

interface EvidenceUploadProps {
  matchId: string;
}

export function EvidenceUpload({ matchId }: EvidenceUploadProps) {
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!evidenceUrl.trim()) {
      setResult({ type: "error", message: "Please provide an evidence URL" });
      return;
    }

    if (!submittedBy.trim()) {
      setResult({ type: "error", message: "Please provide your name/gamertag" });
      return;
    }

    // Basic URL validation
    try {
      new URL(evidenceUrl);
    } catch {
      setResult({ type: "error", message: "Please provide a valid URL" });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await uploadEvidence(matchId, evidenceUrl, submittedBy, description);
      
      if (response.success) {
        setResult({ type: "success", message: response.message || "Evidence uploaded successfully!" });
        setEvidenceUrl("");
        setDescription("");
        setSubmittedBy("");
      } else {
        setResult({ type: "error", message: response.error || "Failed to upload evidence" });
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
        <div>
          <Label htmlFor="submittedBy">Your Name/Gamertag</Label>
          <Input
            id="submittedBy"
            type="text"
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            placeholder="Enter your name or gamertag"
            disabled={isSubmitting}
            required
          />
        </div>

        <div>
          <Label htmlFor="evidenceUrl">Evidence URL</Label>
          <Input
            id="evidenceUrl"
            type="url"
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            placeholder="https://example.com/screenshot.jpg"
            disabled={isSubmitting}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload your evidence to a service like Imgur, Google Drive, or YouTube and paste the link here
          </p>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this evidence shows..."
            disabled={isSubmitting}
            rows={3}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || !evidenceUrl.trim() || !submittedBy.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading Evidence...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Evidence
            </>
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
        <p className="font-medium mb-2">Evidence Guidelines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Screenshots of final scores or match results</li>
          <li>Video recordings of the match</li>
          <li>Chat logs or communication with opponents</li>
          <li>Any other relevant proof of match outcome</li>
        </ul>
        <p className="mt-2 text-xs">
          <strong>Note:</strong> This is a stub implementation. In production, you would implement proper file upload handling.
        </p>
      </div>
    </div>
  );
}
