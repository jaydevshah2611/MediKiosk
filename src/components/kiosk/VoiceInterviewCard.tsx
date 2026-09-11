"use client";

import { cn } from "@/lib/utils";
import { Mic, MicOff, Play, Pause, Volume2 } from "lucide-react";
import { useState } from "react";

interface VoiceInterviewCardProps {
  question: string;
  transcript?: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  onToggleRecording?: () => void;
  onTogglePlayback?: () => void;
  onTextResponse?: (text: string) => void;
  className?: string;
}

export function VoiceInterviewCard({
  question,
  transcript = "",
  isRecording = false,
  isPlaying = false,
  onToggleRecording,
  onTogglePlayback,
  onTextResponse,
  className,
}: VoiceInterviewCardProps) {
  const [textResponse, setTextResponse] = useState("");

  const handleSubmit = () => {
    if (textResponse.trim() && onTextResponse) {
      onTextResponse(textResponse);
      setTextResponse("");
    }
  };

  return (
    <div
      className={cn(
        "bg-surface rounded-2xl p-6 shadow-lg border border-border transition-all duration-300",
        className
      )}
    >
      {/* Question Display */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {question}
            </h3>
            {transcript && (
              <div className="bg-muted/30 rounded-lg p-3 text-sm text-foreground">
                <p className="text-muted mb-1">Transcript:</p>
                <p>{transcript}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Recording Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onToggleRecording}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            isRecording
              ? "bg-danger text-white shadow-lg shadow-danger/30"
              : "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark"
          )}
        >
          {isRecording ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </button>
        
        {transcript && (
          <button
            onClick={onTogglePlayback}
            className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-muted transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-foreground" />
            ) : (
              <Play className="w-5 h-5 text-foreground" />
            )}
          </button>
        )}
        
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-danger animate-pulse-soft" />
            <span className="text-sm text-danger font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Text Input Alternative */}
      {onTextResponse && (
        <div className="space-y-3">
          <textarea
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Or type your response here..."
            className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!textResponse.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Response
          </button>
        </div>
      )}
    </div>
  );
}