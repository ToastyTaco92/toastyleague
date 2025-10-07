"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { registerForDivision } from "./register-action";
import { Loader2 } from "lucide-react";

interface RegisterButtonProps {
  divisionId: string;
}

export function RegisterButton({ divisionId }: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await registerForDivision(divisionId);
      
      if (result.success) {
        setMessage("Successfully registered! Welcome to the division.");
        // The page will automatically refresh due to revalidatePath
      } else {
        setMessage(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleRegister}
        disabled={isLoading}
        size="lg"
        className="w-full md:w-auto px-8 py-3 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Registering...
          </>
        ) : (
          "Register"
        )}
      </Button>
      
      {message && (
        <div className={`text-center p-3 rounded-lg ${
          message.includes("Successfully") 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
