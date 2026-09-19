"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LanguageCode } from "@/lib/languages";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1 ${
        compact ? "" : "shadow-xs"
      }`}
      title={t("select_language")}
    >
      <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer max-w-[9.5rem]"
        aria-label={t("select_language")}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native} ({l.name})
          </option>
        ))}
      </select>
    </div>
  );
}
