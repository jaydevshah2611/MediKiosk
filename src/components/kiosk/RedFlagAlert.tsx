"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface RedFlagAlertProps {
  symptoms: string[];
  onDismiss?: () => void;
  onContinue?: () => void;
  className?: string;
}

export function RedFlagAlert({
  symptoms,
  onDismiss,
  onContinue,
  className,
}: RedFlagAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "bg-danger/10 border-2 border-danger rounded-2xl p-6 shadow-lg",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-danger flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-danger mb-2">
            Emergency Symptoms Detected
          </h3>
          
          <p className="text-foreground mb-4">
            Based on your responses, we've detected symptoms that may require immediate medical attention.
          </p>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-danger font-medium hover:underline mb-4"
          >
            {isExpanded ? "Hide symptoms" : "View detected symptoms"}
          </button>
          
          {isExpanded && (
            <ul className="space-y-2 mb-4">
              {symptoms.map((symptom, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                  {symptom}
                </li>
              ))}
            </ul>
          )}
          
          <div className="flex items-center gap-3">
            <button
              onClick={onContinue}
              className="px-6 py-2 bg-danger text-white rounded-lg font-medium hover:bg-danger/90 transition-colors"
            >
              Continue to Emergency
            </button>
            <button
              onClick={onDismiss}
              className="px-6 py-2 bg-surface border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
            >
              I understand, continue
            </button>
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}