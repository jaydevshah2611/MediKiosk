"use client";

import { User, LogOut, ShieldCheck, HeartPulse, Stethoscope, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { type LanguageCode } from "@/lib/languages";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientHeaderProps {
  user: any;
  selectedLanguage?: LanguageCode;
}

export function PatientHeader({ user, selectedLanguage }: PatientHeaderProps) {
  const router = useRouter();
  const { language, setLanguage, t, languages } = useLanguage();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
    router.push("/");
  };

  return (
    <div className="bg-surface border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <HeartPulse className="w-5 h-5 text-primary animate-heartbeat-pulse" />
            </div>
            <div>
              <div className="font-bold text-foreground text-sm sm:text-base flex items-center gap-1.5">
                <span>{user?.name || t("patient")}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {t("abha_linked")}
                </span>
              </div>
              <div className="text-xs text-muted flex items-center gap-1.5">
                <span>{t("health_portal")}</span>
                <div className="hidden sm:flex items-center w-16 h-3 overflow-hidden relative">
                  <svg
                    className="w-full h-full text-primary"
                    viewBox="0 0 120 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 0 15 L 20 15 L 25 15 L 30 5 L 35 25 L 40 10 L 45 20 L 50 15 L 70 15 L 75 15 L 80 5 L 85 25 L 90 10 L 95 20 L 100 15 L 120 15"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-ecg-line"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Multilingual Switcher in Header */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-lg px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
              title={t("change_language")}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => router.push("/patient/profile")}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/30"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">{t("nav_profile")}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">{t("logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
