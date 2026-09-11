"use client";

import React from "react";
import { Stethoscope } from "lucide-react";

interface MediKioskLogoProps {
  showSubtitle?: boolean;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MediKioskLogo({
  showSubtitle = false,
  subtitle = "AI Triage & OPD",
  size = "md",
  className = "",
}: MediKioskLogoProps) {
  const iconSizeClass =
    size === "sm"
      ? "w-8 h-8 rounded-lg"
      : size === "lg"
      ? "w-12 h-12 rounded-2xl"
      : "w-10 h-10 rounded-xl";

  const stethSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const titleSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";
  const ecgWidth = size === "sm" ? "w-16 h-4" : size === "lg" ? "w-28 h-7" : "w-22 h-5";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Animated Stethoscope Icon Container */}
      <div
        className={`${iconSizeClass} bg-primary/15 flex items-center justify-center text-primary font-bold shadow-xs shrink-0`}
      >
        <Stethoscope className={`${stethSize} animate-heartbeat-pulse`} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${titleSize} text-foreground tracking-tight leading-none`}>
            MediKiosk
          </span>

          {/* Moving Heartbeat / ECG Line */}
          <div className={`flex items-center ${ecgWidth} overflow-hidden relative`}>
            <svg
              className="w-full h-full text-primary"
              viewBox="0 0 120 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 0 15 L 20 15 L 25 15 L 30 5 L 35 25 L 40 10 L 45 20 L 50 15 L 70 15 L 75 15 L 80 5 L 85 25 L 90 10 L 95 20 L 100 15 L 120 15"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-ecg-line"
              />
            </svg>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping absolute right-0 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {showSubtitle && (
          <span className="text-[10px] text-muted font-medium mt-0.5">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
