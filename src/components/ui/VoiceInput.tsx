"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle } from "lucide-react";
import { type LanguageCode } from "@/lib/languages";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: LanguageCode;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoSpeakPrompt?: string;
}

const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN"
};

export function VoiceInput({
  onTranscript,
  language = "en",
  placeholder = "Click mic to speak...",
  className = "",
  size = "md",
  autoSpeakPrompt
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const activeTranscriptRef = useRef<string>("");

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startListening = async () => {
    setErrorMessage(null);
    activeTranscriptRef.current = "";

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognition) {
      const msg = "Speech recognition is not supported in this browser. Please use Chrome, Edge, Safari, or Brave.";
      setErrorMessage(msg);
      alert(msg);
      return;
    }

    // Explicitly request microphone permissions first if available
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release tracks immediately so SpeechRecognition can access hardware exclusive lock
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (permErr: any) {
      console.warn("Microphone permission check note:", permErr);
      if (permErr.name === "NotAllowedError" || permErr.name === "PermissionDeniedError") {
        const msg = "Microphone access blocked. Please click the lock/camera icon in your browser URL bar and allow Microphone.";
        setErrorMessage(msg);
        alert(msg);
        return;
      }
    }

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      const targetLang = LANGUAGE_CODE_MAP[language] || "en-IN";
      recognition.lang = targetLang;
      recognition.continuous = true; // Stay open while user speaks
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText("");
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let currentInterim = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + " ";
          } else {
            currentInterim += res[0].transcript;
          }
        }

        if (finalChunk) {
          activeTranscriptRef.current = (activeTranscriptRef.current + " " + finalChunk).trim();
          onTranscript(activeTranscriptRef.current);
          setInterimText(activeTranscriptRef.current);
        } else if (currentInterim) {
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition event error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setErrorMessage("Microphone permission was denied. Enable mic in browser settings.");
          setIsListening(false);
        } else if (event.error === "no-speech") {
          // If no speech detected in silent pause, don't crash
          setInterimText("Listening... (Speak now)");
        } else if (event.error === "network") {
          setErrorMessage("Network issue connecting to speech service. Check internet connection.");
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (activeTranscriptRef.current) {
          onTranscript(activeTranscriptRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Speech initialization error:", e);
      setIsListening(false);
      setErrorMessage("Could not start microphone: " + (e?.message || "Unknown error"));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    if (activeTranscriptRef.current) {
      onTranscript(activeTranscriptRef.current);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_CODE_MAP[language] || "en-IN";
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base"
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 relative ${className}`}>
      {/* Speech-to-Text Mic Button */}
      <button
        type="button"
        onClick={toggleListening}
        aria-label={isListening ? "Stop listening" : "Start speaking voice input"}
        title={isListening ? "Listening... Click to stop" : `Speak in ${language.toUpperCase()} (Voice Input)`}
        className={`${sizeClasses} rounded-full flex items-center justify-center transition-all cursor-pointer relative shadow-sm shrink-0 ${
          isListening
            ? "bg-rose-600 text-white animate-pulse shadow-rose-500/50 shadow-lg ring-4 ring-rose-400/40"
            : "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
        }`}
      >
        {isListening ? (
          <MicOff className={iconSizes} />
        ) : (
          <Mic className={iconSizes} />
        )}
      </button>

      {/* Optional Text-to-Speech Speaker Button */}
      {autoSpeakPrompt && (
        <button
          type="button"
          onClick={() => handleSpeakText(autoSpeakPrompt)}
          title={isSpeaking ? "Stop Voice Prompt" : "Listen to Audio Prompt"}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/20 hover:bg-muted/30 text-foreground transition-colors cursor-pointer border border-border shrink-0"
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4 text-primary animate-pulse" />
          ) : (
            <Volume2 className="w-4 h-4 text-muted hover:text-foreground" />
          )}
        </button>
      )}

      {/* Active interim voice speech indicator */}
      {isListening && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs animate-fade-in-up whitespace-nowrap">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500 shrink-0" />
          <span className="font-medium max-w-[200px] truncate">
            {interimText ? `"${interimText}"` : "Listening... speak now"}
          </span>
        </div>
      )}

      {/* Error / Permission Tooltip Notification */}
      {errorMessage && !isListening && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-[11px] animate-fade-in-up">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
