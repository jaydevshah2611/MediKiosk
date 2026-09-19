"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressStepper } from "@/components/kiosk/ProgressStepper";
import { ArrowRight, Globe, Smartphone, Mic } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LanguageCode } from "@/lib/languages";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
];

export default function KioskWelcome() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [entryMethod, setEntryMethod] = useState<"kiosk" | "mobile">("kiosk");

  const steps = [
    { id: "welcome", label: "Welcome", completed: false, current: true },
    { id: "consent", label: "Consent", completed: false, current: false },
    { id: "interview", label: "Interview", completed: false, current: false },
    { id: "scan", label: "Scan", completed: false, current: false },
    { id: "review", label: "Review", completed: false, current: false },
    { id: "confirm", label: "Confirm", completed: false, current: false },
  ];

  const handleContinue = () => {
    setLanguage(selectedLanguage as LanguageCode);
    if (typeof window !== "undefined") {
      localStorage.setItem("kiosk_entry_method", entryMethod);
    }
    router.push("/kiosk/consent");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Stepper */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ProgressStepper steps={steps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Welcome to MediKiosk
              </h1>
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
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-ecg-line"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xl text-muted">
              Please select your preferred language to begin
            </p>
          </div>

          {/* Language Selection */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Select Language / भाषा चुनें
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code as LanguageCode);
                      setLanguage(lang.code as LanguageCode);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedLanguage === lang.code
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-surface"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-foreground mb-1">
                        {lang.native}
                      </div>
                      <div className="text-sm text-muted">{lang.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Entry Method Selection */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                How would you like to begin?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setEntryMethod("kiosk")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    entryMethod === "kiosk"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground mb-1">
                        Kiosk Mode
                      </div>
                      <div className="text-sm text-muted">
                        Use the touchscreen kiosk
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setEntryMethod("mobile")}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    entryMethod === "mobile"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground mb-1">
                        Mobile Mode
                      </div>
                      <div className="text-sm text-muted">
                        Use your phone or tablet
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Audio Navigation Hint */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Audio Navigation Available
                  </h3>
                  <p className="text-sm text-muted">
                    You can use voice commands to navigate through the process. Just say "Next" to proceed or "Back" to go to the previous step.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              className="bg-primary text-lg h-14 px-8"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}