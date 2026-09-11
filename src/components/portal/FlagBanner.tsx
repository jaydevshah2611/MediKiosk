"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Flag {
  type: "danger" | "warning" | "info";
  message: string;
  details?: string;
}

interface FlagBannerProps {
  flags: Flag[];
  onDismiss?: (index: number) => void;
  className?: string;
}

export function FlagBanner({ flags, onDismiss, className }: FlagBannerProps) {
  if (flags.length === 0) return null;

  const flagStyles = {
    danger: "bg-danger/10 border-danger text-danger",
    warning: "bg-warning/10 border-warning text-warning",
    info: "bg-primary/10 border-primary text-primary",
  };

  const flagIcons = {
    danger: AlertTriangle,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <div className={cn("space-y-3", className)}>
      {flags.map((flag, index) => {
        const Icon = flagIcons[flag.type];
        return (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border-2",
              flagStyles[flag.type]
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{flag.message}</p>
              {flag.details && (
                <p className="text-sm mt-1 opacity-90">{flag.details}</p>
              )}
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(index)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}