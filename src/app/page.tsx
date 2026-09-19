"use client";

import { Stethoscope, User, Building2, Lock, Heart, Activity, Sparkles, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export default function Home() {
  const router = useRouter();
  const { language, setLanguage, t, languages } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("app_theme");
      if (savedTheme === "dark" || document.documentElement.classList.contains("dark")) {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }
    }
    setIsVisible(true);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof window !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("app_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("app_theme", "light");
      }
    }
  };

  const handleRoleSelect = (role: "patient" | "doctor" | "hospital") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedRole", role);
    }

    switch (role) {
      case "patient":
        router.push("/auth/patient/login");
        break;
      case "doctor":
        router.push("/auth/doctor/login");
        break;
      case "hospital":
        router.push("/auth/hospital/login");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold shadow-xs">
              <Stethoscope className="w-5 h-5 animate-heartbeat-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-foreground tracking-tight">
                MediKiosk
              </span>

              {/* Moving Heartbeat / ECG Waveform Animation */}
              <div className="hidden sm:flex items-center w-24 h-6 overflow-hidden relative">
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
                {/* Subtle Pulse Glow Dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping absolute right-0 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher compact />
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold hover:border-primary transition-all cursor-pointer shadow-xs"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-600" />
                  <span className="hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push("/patient/consent")}
              className="flex items-center gap-1.5 text-muted hover:text-foreground transition-colors text-xs font-medium px-2.5 py-1.5 rounded-md hover:bg-muted/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Privacy</span>
            </button>

            <button
              onClick={() => router.push("/kiosk/welcome")}
              className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              <span>Kiosk Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center min-h-screen pt-20 relative">
        <div className="max-w-7xl w-full px-4 sm:px-6 py-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-center">

            {/* Left Column: Heading & Description */}
            <div className={`space-y-6 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-primary bg-primary/10 border border-primary/20 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{t("ai_powered_healthcare")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
                <span>{t("better_information")}</span>
                <br />
                <span className="text-primary">
                  {t("better_care")}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
                {t("hero_description")}
              </p>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface border border-border text-center shadow-xs">
                  <div className="text-3xl font-extrabold text-primary">3</div>
                  <div className="text-xs font-semibold text-muted mt-0.5">{t("roles")}</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border text-center shadow-xs">
                  <div className="text-3xl font-extrabold text-primary">9</div>
                  <div className="text-xs font-semibold text-muted mt-0.5">{t("languages")}</div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-border text-center shadow-xs">
                  <div className="text-3xl font-extrabold text-primary">ABDM</div>
                  <div className="text-xs font-semibold text-muted mt-0.5">{t("secure")}</div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-5 text-xs text-muted font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Consent-Driven Care</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>9 Regional Languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>AYUSH & Allopathic Triage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Portal Access & Language Selection */}
            <div className={`space-y-6 ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {t("who_are_you")}
                </h2>
                <p className="text-xs text-muted">Select your portal to continue</p>
              </div>

              <div className="space-y-3.5">
                {/* Patient Portal Card */}
                <button
                  onClick={() => handleRoleSelect("patient")}
                  className="w-full text-left rounded-2xl p-[2px] portal-glow-card cursor-pointer group"
                >
                  <div className="portal-glow-inner p-5 flex items-center gap-4 relative overflow-hidden">
                    <div className="glow-blob bg-primary" />
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="flex-1 z-10">
                      <div className="font-bold text-foreground text-base group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{t("patient")} Portal</span>
                        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-bold">Enter →</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {t("patient_description")}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Doctor Portal Card */}
                <button
                  onClick={() => handleRoleSelect("doctor")}
                  className="w-full text-left rounded-2xl p-[2px] portal-glow-card cursor-pointer group"
                >
                  <div className="portal-glow-inner p-5 flex items-center gap-4 relative overflow-hidden">
                    <div className="glow-blob bg-sky-500" />
                    <div className="w-14 h-14 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <div className="flex-1 z-10">
                      <div className="font-bold text-foreground text-base group-hover:text-sky-600 transition-colors flex items-center justify-between">
                        <span>{t("doctor")} Portal</span>
                        <span className="text-xs text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">Enter →</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {t("doctor_description")}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Hospital Admin Portal Card */}
                <button
                  onClick={() => handleRoleSelect("hospital")}
                  className="w-full text-left rounded-2xl p-[2px] portal-glow-card cursor-pointer group"
                >
                  <div className="portal-glow-inner p-5 flex items-center gap-4 relative overflow-hidden">
                    <div className="glow-blob bg-emerald-500" />
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div className="flex-1 z-10">
                      <div className="font-bold text-foreground text-base group-hover:text-emerald-600 transition-colors flex items-center justify-between">
                        <span>{t("hospital")} Operations</span>
                        <span className="text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">Enter →</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {t("hospital_description")}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Language Selection Grid */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {t("select_language")}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        language === lang.code
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-[1.02]"
                          : "border-border hover:border-primary/40 bg-surface text-foreground"
                      }`}
                    >
                      <div className="text-xs font-semibold">{lang.native}</div>
                      <div className="text-[10px] text-muted font-normal">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
