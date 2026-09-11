"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { languages, translations, getTranslation, type LanguageCode } from "@/lib/languages";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  languages,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Check user object or stored preference
      const storedPref = localStorage.getItem("patient_preferred_language") as LanguageCode | null;
      const currentUser = localStorage.getItem("currentUser");
      let initialLang: LanguageCode = "en";

      if (storedPref && languages.some(l => l.code === storedPref)) {
        initialLang = storedPref;
      } else if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          if (parsed.preferredLanguage && languages.some(l => l.code === parsed.preferredLanguage)) {
            initialLang = parsed.preferredLanguage;
          }
        } catch {
          // ignore
        }
      }

      setLanguageState(initialLang);

      // Listen to cross-window or custom language events
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "patient_preferred_language" && e.newValue) {
          if (languages.some(l => l.code === e.newValue)) {
            setLanguageState(e.newValue as LanguageCode);
          }
        }
      };

      const handleCustomLang = (e: any) => {
        if (e.detail?.language && languages.some(l => l.code === e.detail.language)) {
          setLanguageState(e.detail.language);
        }
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener("medikiosk:languageChange", handleCustomLang);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("medikiosk:languageChange", handleCustomLang);
      };
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("patient_preferred_language", lang);

      // Sync with currentUser if present
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          const updated = { ...parsed, preferredLanguage: lang };
          localStorage.setItem("currentUser", JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      // Dispatch global event for instant re-renders across all active components
      window.dispatchEvent(
        new CustomEvent("medikiosk:languageChange", {
          detail: { language: lang },
        })
      );
    }
  };

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
