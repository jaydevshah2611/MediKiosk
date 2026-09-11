"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HelpCircle,
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Volume2,
  VolumeX,
  Compass
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { speechAudioService } from "@/lib/speechAudioService";
import { getLocalizedGuideTips } from "@/lib/guideTipsDatabase";

interface GuideTip {
  id: string;
  target?: string;
  badge: string;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: string;
}

// Comprehensive contextual guide tips for every major portal page
const PAGE_TIPS: Record<string, GuideTip[]> = {
  "/": [
    {
      id: "landing_1",
      badge: "Step 1: Role Selection",
      title: "Choose Your Portal Role",
      description: "Select 'Patient' for OPD registration, 'Doctor' for clinical queue management, or 'Hospital' for bed and department administration.",
      icon: "👤"
    },
    {
      id: "landing_2",
      badge: "Step 2: Accessibility & Language",
      title: "Regional Language & Voice Options",
      description: "Use the floating Accessibility widget on the bottom right to enable Voice, High-Contrast, or switch between 9 Indian languages.",
      icon: "🌐"
    }
  ],
  "/patient/dashboard": [
    {
      id: "pd_1",
      badge: "Step 1: Fast-Track OPD",
      title: "Need immediate hospital care?",
      description: "Click 'New Allopathic Visit' for Western medicine or 'AYUSH Consultation' for Ayurveda, Yoga, Unani, Siddha, Homoeopathy triage.",
      actionText: "Start Visit",
      actionHref: "/patient/new-visit",
      icon: "🏥"
    },
    {
      id: "pd_2",
      badge: "Step 2: Connected Hospitals",
      title: "Find Hospitals Across India",
      description: "Browse live OPD wait times, available beds, on-duty doctors, and ICU capacities across national ABDM hospitals.",
      actionText: "View Hospitals",
      actionHref: "/patient/hospitals",
      icon: "📍"
    },
    {
      id: "pd_3",
      badge: "Step 3: Medical Records & OCR",
      title: "Upload Past Reports & Prescriptions",
      description: "Upload phone photos or PDFs of medical reports. Our AI reads the document, extracts lab values, and highlights normal vs deficient parameters.",
      actionText: "Upload Records",
      actionHref: "/patient/documents",
      icon: "📑"
    },
    {
      id: "pd_4",
      badge: "Step 4: Health Timeline",
      title: "Track Your Longitudinal Journey",
      description: "See your whole health history consolidated chronologically across all clinical visits, tests, and prescriptions.",
      actionText: "Open Timeline",
      actionHref: "/patient/timeline",
      icon: "⏳"
    }
  ],
  "/patient/new-visit": [
    {
      id: "nv_1",
      badge: "Step 1: Anatomical Region",
      title: "Select Where You Feel Symptoms",
      description: "Click on the affected body region (e.g., Head & Neurological, Chest & Respiratory, Abdomen) or type in the search bar.",
      icon: "🫀"
    },
    {
      id: "nv_2",
      badge: "Step 2: Symptom Selection",
      title: "Choose Specific Complaints",
      description: "Pick all symptoms you are experiencing. You can also use the Voice Microphone to speak in your preferred regional language.",
      icon: "🎙️"
    },
    {
      id: "nv_3",
      badge: "Step 3: Clinical Follow-ups",
      title: "Answer Severity & Duration",
      description: "Answer the quick 1-10 severity scale and duration questions so the AI can triage urgent conditions and pre-fill doctor notes.",
      icon: "⏱️"
    },
    {
      id: "nv_4",
      badge: "Step 4: Get OPD Token",
      title: "Confirm & Generate Token",
      description: "Review your answers and click 'Confirm & Issue Token'. Your queue position is instantly sent to the hospital and doctor dashboards.",
      icon: "🎟️"
    }
  ],
  "/patient/ayush": [
    {
      id: "ay_1",
      badge: "Step 1: Choose AYUSH Discipline",
      title: "Select Medicine Tradition",
      description: "Choose from Ayurveda, Yoga & Naturopathy, Unani, Siddha, Homoeopathy, or Sowa-Rigpa.",
      icon: "🌿"
    },
    {
      id: "ay_2",
      badge: "Step 2: Traditional Assessment",
      title: "Constitutional Questioning",
      description: "Answer tailored questions regarding your Prakriti (Dosha balance), Agni (digestive fire), and lifestyle patterns.",
      icon: "🧘"
    },
    {
      id: "ay_3",
      badge: "Step 3: AYUSH Prescription & Token",
      title: "Personalized Regimen",
      description: "Receive dietary (Ahara), lifestyle (Vihara), and therapeutic recommendations and generate an AYUSH department queue token.",
      icon: "✨"
    }
  ],
  "/patient/documents": [
    {
      id: "doc_1",
      badge: "Step 1: Choose File Type",
      title: "Select Document Category",
      description: "Select whether you are uploading a Prescription, Blood/Lab Test, Imaging Scan, or Discharge Summary.",
      icon: "📋"
    },
    {
      id: "doc_2",
      badge: "Step 2: Upload Image / PDF",
      title: "Upload Clear Document Copy",
      description: "Click to upload an image or scan from your device. Tesseract OCR will automatically extract all handwritten and printed text.",
      icon: "📸"
    },
    {
      id: "doc_3",
      badge: "Step 3: AI Clinical Insights",
      title: "Review Deficiencies & Normal Ranges",
      description: "Click 'View OCR & Analysis' on any document to see identified medicines, deficient vitamins/hemoglobin, and dietary advice.",
      icon: "🔍"
    }
  ],
  "/patient/hospitals": [
    {
      id: "hosp_1",
      badge: "Step 1: Search & Filter",
      title: "Find Nearby Health Facilities",
      description: "Filter hospitals by State, Category (Apex, District, AYUSH), or type a specialty (e.g. Cardiology, Orthopedics).",
      icon: "🏥"
    },
    {
      id: "hosp_2",
      badge: "Step 2: Live Metrics",
      title: "Check Wait Times & Free Beds",
      description: "Each card displays real-time estimated OPD waiting times, available doctor count, and vacant ICU beds.",
      icon: "📊"
    },
    {
      id: "hosp_3",
      badge: "Step 3: Direct Registration",
      title: "Click 'Select & Triage'",
      description: "Clicking 'Select & Triage' directly routes your case to that specific hospital's digital OPD queue.",
      icon: "🚀"
    }
  ],
  "/patient/visits": [
    {
      id: "vis_1",
      badge: "Step 1: Consultation Records",
      title: "Review Past Consultations",
      description: "Filter your past visits by Allopathic or AYUSH consultations and review doctor remarks and vital signs.",
      icon: "📂"
    },
    {
      id: "vis_2",
      badge: "Step 2: View Summary Modal",
      title: "Click 'View Summary'",
      description: "Open the case modal to see recorded blood pressure, pulse, symptoms, and doctor digital prescriptions.",
      icon: "🩺"
    }
  ],
  "/patient/timeline": [
    {
      id: "time_1",
      badge: "Step 1: Unified Longitudinal Record",
      title: "Chronological Health Stream",
      description: "All your OPD visits, AYUSH consultations, lab tests, and prescriptions are synchronized in one continuous timeline.",
      icon: "⏳"
    },
    {
      id: "time_2",
      badge: "Step 2: Filter by Milestone",
      title: "Review Details by Event",
      description: "Click any timeline card to view specific doctor diagnosis remarks, prescribed doses, and extracted lab tags.",
      icon: "🔍"
    }
  ],
  "/patient/profile": [
    {
      id: "prof_1",
      badge: "Step 1: Personal & Emergency Data",
      title: "Keep Health Info Updated",
      description: "Click 'Edit Profile' to update your Blood Group, emergency contact phone, and known allergies.",
      icon: "✏️"
    },
    {
      id: "prof_2",
      badge: "Step 2: Language Preference",
      title: "Select Portal Language",
      description: "Click any regional language card (Hindi, Gujarati, Marathi, Tamil, etc.) to immediately translate all portal views.",
      icon: "🗣️"
    }
  ],
  "/patient/settings": [
    {
      id: "set_1",
      badge: "Step 1: Interface & Preferences",
      title: "Configure Language & Alerts",
      description: "Choose your primary regional language and toggle SMS/WhatsApp live OPD queue notifications.",
      icon: "⚙️"
    },
    {
      id: "set_2",
      badge: "Step 2: ABDM Health Data Export",
      title: "Download Complete Records",
      description: "Export all your local medical consultations, tokens, and OCR extracted records as an ABDM-compliant JSON backup.",
      icon: "📦"
    }
  ],
  "/patient/consent": [
    {
      id: "con_1",
      badge: "Step 1: Pending Sharing Requests",
      title: "Review Hospital Access Asks",
      description: "Approve or reject data-sharing requests sent by hospitals and medical practitioners.",
      icon: "🛡️"
    },
    {
      id: "con_2",
      badge: "Step 2: Active Grants & Revocation",
      title: "Revoke Access Anytime",
      description: "View all active providers who can access your records and instantly revoke permissions with one click.",
      icon: "🔒"
    }
  ],
  "/doctor/dashboard": [
    {
      id: "doc_dash_1",
      badge: "Step 1: Live OPD Queue",
      title: "Select Patients in Waiting Queue",
      description: "Click on any patient in the waiting queue to review their AI pre-intake symptoms, vitals, and emergency flags.",
      icon: "👨‍⚕️"
    },
    {
      id: "doc_dash_2",
      badge: "Step 2: Digital Prescription",
      title: "Issue Diagnosis & Medications",
      description: "Type clinical diagnosis notes, add medications with dosage frequencies, and click 'Complete Consultation'.",
      icon: "💊"
    },
    {
      id: "doc_dash_3",
      badge: "Step 3: Navigation Tabs",
      title: "Patients, Schedule & Profile",
      description: "Use the top navigation tabs to view the complete Patient Directory, duty roster Schedule, and consultation preferences.",
      icon: "🗓️"
    }
  ],
  "/hospital/dashboard": [
    {
      id: "hosp_dash_1",
      badge: "Step 1: Clickable KPI Blocks",
      title: "Real-time Patient Queue Filters",
      description: "Click on 'Waiting in OPD Queue', 'In Consultation', or 'Completed' cards to filter live hospital queue records.",
      icon: "📈"
    },
    {
      id: "hosp_dash_2",
      badge: "Step 2: Manage Staff & Doctors",
      title: "Onboard Doctors by Specialty",
      description: "Switch to the 'Doctors & Staff' tab to register on-duty physicians, manage active status, and assign OPD rooms.",
      icon: "🧑‍⚕️"
    }
  ]
};

export function StepGuideTips() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  // Match tips for the current path or fallback to empty
  const currentTips = getLocalizedGuideTips(pathname, language) || PAGE_TIPS[pathname] || PAGE_TIPS["/patient/dashboard"] || [];

  // Reset index on page change
  useEffect(() => {
    setCurrentTipIndex(0);
    setIsVisible(true);
  }, [pathname]);

  if (!isVisible || currentTips.length === 0) return null;

  const activeTip = currentTips[currentTipIndex];

  const handleNext = () => {
    if (currentTipIndex < currentTips.length - 1) {
      setCurrentTipIndex(prev => prev + 1);
    } else {
      setCurrentTipIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(prev => prev - 1);
    } else {
      setCurrentTipIndex(currentTips.length - 1);
    }
  };

  const handleSpeakTip = () => {
    if (speaking) {
      speechAudioService.stop();
      setSpeaking(false);
      return;
    }

    const textToSpeak = `${activeTip.badge}. ${activeTip.title}. ${activeTip.description}`;
    setSpeaking(true);
    speechAudioService.speak(
      textToSpeak,
      language,
      () => setSpeaking(true),
      () => setSpeaking(false),
      () => setSpeaking(false)
    );
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 left-4 z-40 animate-fade-in-up">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-lg hover:bg-primary/90 transition-all border border-primary-light/40 cursor-pointer"
          title="Open Step-by-Step Guide Tips"
        >
          <Lightbulb className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Step-by-Step Guide Tips ({currentTipIndex + 1}/{currentTips.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 animate-fade-in-up">
      <div className="bg-surface/95 backdrop-blur-md border-2 border-primary/30 rounded-2xl shadow-2xl overflow-hidden text-foreground">
        {/* Top Tip Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-surface border-b border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/20 text-primary">
              <Compass className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                MediKiosk Interactive Guide
              </span>
              <span className="text-xs font-semibold text-foreground">
                Step {currentTipIndex + 1} of {currentTips.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeakTip}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                speaking ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground hover:bg-muted/20"
              }`}
              title={speaking ? "Stop voice guidance" : "Listen to tip"}
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-muted/20 transition-colors cursor-pointer"
              title="Minimize tip drawer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-lg text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Close guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tip Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="text-2xl p-2 rounded-xl bg-background border border-border shrink-0">
              {activeTip.icon || "💡"}
            </div>
            <div className="space-y-1 flex-1">
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {activeTip.badge}
              </div>
              <h4 className="text-sm font-bold text-foreground leading-snug">
                {activeTip.title}
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {activeTip.description}
              </p>
            </div>
          </div>

          {/* Action CTA if present */}
          {activeTip.actionText && activeTip.actionHref && (
            <button
              onClick={() => router.push(activeTip.actionHref!)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors border border-primary/20 cursor-pointer"
            >
              <span>{activeTip.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Step Progress Indicators & Controls */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div className="flex gap-1">
              {currentTips.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTipIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentTipIndex ? "w-6 bg-primary" : "w-2 bg-muted/40 hover:bg-muted"
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="p-1 rounded-md text-muted hover:text-foreground hover:bg-muted/20 text-xs flex items-center gap-0.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={handleNext}
                className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-0.5 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
