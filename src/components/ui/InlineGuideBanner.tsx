"use client";

import React, { useState } from "react";
import { Lightbulb, ChevronRight, X, Sparkles, Compass, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { speechAudioService } from "@/lib/speechAudioService";

export interface InlineStep {
  stepNumber: number;
  title: string;
  description: string;
  badge?: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

interface InlineGuideBannerProps {
  title?: string;
  subtitle?: string;
  steps: InlineStep[];
  defaultOpen?: boolean;
}

export function InlineGuideBanner({
  title = "How this works — Step-by-Step Guide",
  subtitle = "Follow these simple steps to complete your action",
  steps,
  defaultOpen = true
}: InlineGuideBannerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);
  const router = useRouter();
  const { language } = useLanguage();

  const handleSpeak = (step: InlineStep) => {
    if (speakingStep === step.stepNumber) {
      speechAudioService.stop();
      setSpeakingStep(null);
      return;
    }

    const textToSpeak = `Step ${step.stepNumber}. ${step.title}. ${step.description}`;
    setSpeakingStep(step.stepNumber);
    speechAudioService.speak(
      textToSpeak,
      language,
      () => setSpeakingStep(step.stepNumber),
      () => setSpeakingStep(null),
      () => setSpeakingStep(null)
    );
  };

  const handleSpeakAll = () => {
    if (speakingStep !== null) {
      speechAudioService.stop();
      setSpeakingStep(null);
      return;
    }

    const fullSummary = `${title}. ${subtitle}. ` + steps.map(s => `Step ${s.stepNumber}: ${s.title}. ${s.description}`).join(". ");
    setSpeakingStep(999);
    speechAudioService.speak(
      fullSummary,
      language,
      () => setSpeakingStep(999),
      () => setSpeakingStep(null),
      () => setSpeakingStep(null)
    );
  };

  if (!isOpen) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Need help? Show Step-by-Step Guide</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-background p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-1.5">
              <span>{title}</span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                Step-by-Step
              </span>
            </h4>
            <p className="text-xs text-muted">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSpeakAll}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              speakingStep === 999
                ? "bg-primary text-primary-foreground border-primary animate-pulse"
                : "bg-surface text-foreground border-border hover:border-primary/50"
            }`}
            title={speakingStep === 999 ? "Stop audio voice guidance" : "Listen to audio guide"}
          >
            {speakingStep === 999 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-primary" />}
            <span className="hidden sm:inline">{speakingStep === 999 ? "Stop Audio" : "Voice Guide"}</span>
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-muted/20 transition-colors cursor-pointer text-xs"
            title="Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-surface/90 border border-border/80 hover:border-primary/50 transition-all flex flex-col justify-between space-y-2 shadow-xs group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                  {s.stepNumber || idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(s)}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      speakingStep === s.stepNumber ? "text-primary bg-primary/10" : "text-muted hover:text-foreground"
                    }`}
                    title={speakingStep === s.stepNumber ? "Stop voice" : "Speak step audio"}
                  >
                    {speakingStep === s.stepNumber ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  {s.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                      {s.badge}
                    </span>
                  )}
                </div>
              </div>
              <h5 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {s.title}
              </h5>
              <p className="text-[11px] text-muted leading-relaxed">
                {s.description}
              </p>
            </div>

            {s.actionText && s.actionHref && (
              <button
                onClick={() => router.push(s.actionHref!)}
                className="mt-1 flex items-center justify-between w-full text-[11px] font-bold text-primary hover:underline pt-1 border-t border-border/50 cursor-pointer"
              >
                <span>{s.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
