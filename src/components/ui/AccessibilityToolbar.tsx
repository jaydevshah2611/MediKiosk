"use client";

import React, { useState, useEffect } from "react";
import {
  Accessibility,
  Eye,
  Type,
  Volume2,
  VolumeX,
  Contrast,
  Sliders,
  Check,
  X,
  Sparkles,
  Layers,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AccessibilityToolbar() {
  const { language, setLanguage, languages: langList, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [screenReaderHints, setScreenReaderHints] = useState(true);
  const [soundAssistance, setSoundAssistance] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
      const storedHC = localStorage.getItem("a11y_highContrast") === "true";
      const storedLT = localStorage.getItem("a11y_largeText") === "true";
      const storedDF = localStorage.getItem("a11y_dyslexicFont") === "true";

      if (storedTheme === "dark") {
        setThemeMode("dark");
        document.documentElement.classList.add("dark");
      } else {
        setThemeMode("light");
        document.documentElement.classList.remove("dark");
      }

      if (storedHC) {
        setHighContrast(true);
        document.documentElement.classList.add("high-contrast");
      }
      if (storedLT) {
        setLargeText(true);
        document.documentElement.classList.add("large-text");
      }
      if (storedDF) {
        setDyslexicFont(true);
        document.documentElement.classList.add("dyslexic-friendly");
      }
    }
  }, []);

  const toggleTheme = (mode: "light" | "dark") => {
    setThemeMode(mode);
    localStorage.setItem("app_theme", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem("a11y_highContrast", String(next));
    if (next) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem("a11y_largeText", String(next));
    if (next) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  };

  const toggleDyslexicFont = () => {
    const next = !dyslexicFont;
    setDyslexicFont(next);
    localStorage.setItem("a11y_dyslexicFont", String(next));
    if (next) {
      document.documentElement.classList.add("dyslexic-friendly");
    } else {
      document.documentElement.classList.remove("dyslexic-friendly");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Accessibility & Theme Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-primary/40 hover:scale-105 transition-all border border-white/20 cursor-pointer text-xs sm:text-sm font-semibold group"
          aria-label="Open Theme & Accessibility Options"
          title="Theme Toggle & Universal Accessibility"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {themeMode === "dark" ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-200" />}
          </div>
          <span>Theme & A11y</span>
        </button>
      )}

      {/* Expanded Accessibility Modal / Drawer */}
      {isOpen && (
        <div className="bg-surface border-2 border-primary/40 rounded-2xl p-5 shadow-2xl w-[320px] sm:w-[360px] text-foreground animate-scale-in">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Theme & Accessibility</h3>
                <p className="text-[11px] text-muted">Dark / Light mode & Inclusive Care</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-muted/30 text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-background border border-border space-y-2">
              <div className="font-bold text-foreground">{t("select_language")}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {langList.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`py-1.5 px-1 rounded-lg border text-[10px] font-semibold cursor-pointer ${
                      language === lang.code
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode vs White/Light Mode Toggle */}
            <div className="p-3 rounded-xl bg-background border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Display Theme Mode</span>
                <span className="text-[11px] font-semibold text-primary capitalize">{themeMode} Mode</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleTheme("light")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                    themeMode === "light"
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light / White</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme("dark")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border font-semibold transition-all cursor-pointer ${
                    themeMode === "dark"
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Contrast className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-semibold text-foreground">High Contrast</div>
                  <div className="text-[10px] text-muted">Enhanced visual edge clarity</div>
                </div>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                  highContrast ? "bg-primary justify-end" : "bg-muted/40 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-semibold text-foreground">Large Text / Senior Mode</div>
                  <div className="text-[10px] text-muted">120% font scaling for legibility</div>
                </div>
              </div>
              <button
                onClick={toggleLargeText}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                  largeText ? "bg-primary justify-end" : "bg-muted/40 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Dyslexia / Easy Read Font */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-sky-500" />
                <div>
                  <div className="font-semibold text-foreground">Dyslexia-Friendly Layout</div>
                  <div className="text-[10px] text-muted">High-legibility letter spacing</div>
                </div>
              </div>
              <button
                onClick={toggleDyslexicFont}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                  dyslexicFont ? "bg-primary justify-end" : "bg-muted/40 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Audio Speech Prompts */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-semibold text-foreground">Spoken Voice Prompts</div>
                  <div className="text-[10px] text-muted">Read questions aloud in local language</div>
                </div>
              </div>
              <button
                onClick={() => setSoundAssistance(!soundAssistance)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 cursor-pointer ${
                  soundAssistance ? "bg-primary justify-end" : "bg-muted/40 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> MoA SIH26047 Ready
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
