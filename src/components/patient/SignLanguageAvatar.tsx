"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Eye,
  Volume2,
  VolumeX,
  HandMetal,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  CheckCircle2,
  ShieldAlert,
  Stethoscope
} from "lucide-react";
import { type LanguageCode } from "@/lib/languages";

interface SignLanguageAvatarProps {
  currentText?: string;
  stepName?: string;
  language?: LanguageCode;
  className?: string;
}

interface GestureDefinition {
  id: string;
  title: string;
  hindiTitle: string;
  desc: string;
  icon: string;
  handEmoji: string;
  badgeColor: string;
  motionPhase: number;
}

// Indian Sign Language (ISL) Lexicon with specialized clinical gestures
const ISL_GESTURES: Record<string, GestureDefinition> = {
  welcome: {
    id: "welcome",
    title: "Namaste / Welcome",
    hindiTitle: "नमस्ते / स्वागत",
    desc: "Both palms joined vertically at the heart center (Anjali Mudra), followed by open welcoming outward sweeps.",
    icon: "🙏",
    handEmoji: "🤲",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    motionPhase: 1
  },
  body_select: {
    id: "body_select",
    title: "Select Body Area",
    hindiTitle: "शरीर का भाग चुनें",
    desc: "Index and thumb form an open scanning circle outlining head, chest, abdomen or limb regions.",
    icon: "👤",
    handEmoji: "🫲",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    motionPhase: 2
  },
  symptom: {
    id: "symptom",
    title: "Pain & Discomfort",
    hindiTitle: "दर्द एवं लक्षण",
    desc: "Index finger points directly to the organ area, oscillating palm mimics radiating pain or throbbing sensation.",
    icon: "👉",
    handEmoji: "⚡",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    motionPhase: 3
  },
  severity: {
    id: "severity",
    title: "Intensity Rating (1-10)",
    hindiTitle: "तीव्रता पैमाना",
    desc: "Hand ascends from waist level (mild) upward to eye level (severe) while expanding all 5 fingers.",
    icon: "🖐️",
    handEmoji: "📊",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    motionPhase: 4
  },
  doctor: {
    id: "doctor",
    title: "Doctor & Pulse Diagnosis",
    hindiTitle: "चिकित्सक परामर्श",
    desc: "Three fingers lightly press opposite radial wrist (Nadi Pariksha) signaling physician diagnostic review.",
    icon: "🩺",
    handEmoji: "👨‍⚕️",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    motionPhase: 5
  },
  confirm: {
    id: "confirm",
    title: "Consent & Verification",
    hindiTitle: "सहमति एवं टोकन",
    desc: "Firm upward thumb press followed by dual flat palm stamp confirming consent and token issuance.",
    icon: "👍",
    handEmoji: "✅",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    motionPhase: 6
  },
  urgent: {
    id: "urgent",
    title: "Emergency / Red Flag",
    hindiTitle: "आपातकालीन स्थिति",
    desc: "Rapid open palm pulsing over sternum with alert facial expression indicating immediate triage urgency.",
    icon: "🚨",
    handEmoji: "⚠️",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
    motionPhase: 7
  }
};

export function SignLanguageAvatar({
  currentText = "Please select your symptoms or affected area.",
  stepName = "body_system",
  language = "en",
  className = ""
}: SignLanguageAvatarProps) {
  const [activeGestureKey, setActiveGestureKey] = useState<string>("welcome");
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);
  const [motionFrame, setMotionFrame] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic context evaluator mapping text + stepName to precise ISL gestures
  useEffect(() => {
    const textLower = currentText.toLowerCase();

    if (textLower.includes("urgent") || textLower.includes("emergency") || textLower.includes("severe") || textLower.includes("priority")) {
      setActiveGestureKey("urgent");
    } else if (textLower.includes("severity") || textLower.includes("scale") || textLower.includes("rate") || textLower.includes("1 to 10") || textLower.includes("1-10")) {
      setActiveGestureKey("severity");
    } else if (textLower.includes("doctor") || textLower.includes("consult") || textLower.includes("physician") || textLower.includes("ayush") || textLower.includes("hospital")) {
      setActiveGestureKey("doctor");
    } else if (textLower.includes("confirm") || textLower.includes("review") || textLower.includes("token") || textLower.includes("summary")) {
      setActiveGestureKey("confirm");
    } else if (textLower.includes("symptom") || textLower.includes("pain") || textLower.includes("fever") || textLower.includes("cough") || textLower.includes("headache") || stepName === "symptom_selection") {
      setActiveGestureKey("symptom");
    } else if (stepName === "body_system" || textLower.includes("body") || textLower.includes("area")) {
      setActiveGestureKey("body_select");
    } else {
      setActiveGestureKey("welcome");
    }
  }, [currentText, stepName]);

  // Smooth animation frame ticker for fluid joint kinematics
  useEffect(() => {
    if (!isPlayingMotion) return;
    const interval = setInterval(() => {
      setMotionFrame((prev) => (prev + 1) % 120);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlayingMotion]);

  const activeGesture = ISL_GESTURES[activeGestureKey] || ISL_GESTURES.welcome;

  // Joint kinematics calculation based on motionFrame
  const sinFactor = Math.sin((motionFrame * Math.PI) / 30);
  const cosFactor = Math.cos((motionFrame * Math.PI) / 30);

  // Audio speech narration of the ISL gesture description
  const speakISLDescription = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${activeGesture.title}. ${activeGesture.desc}`);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-500/40 shadow-2xl overflow-hidden relative ${className}`}>
      {/* Dynamic Background Ambient Light Orbs */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-indigo-800/60 mb-4 gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
            <HandMetal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-indigo-100 flex items-center gap-2">
              <span>ISL Digital Sign Avatar</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AI Real-Time
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">Indian Sign Language (ISL) Interactive Clinical Assistant</div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio TTS Button */}
          <button
            onClick={speakISLDescription}
            title={isSpeaking ? "Stop Voice Explanation" : "Audio Explanation"}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isSpeaking
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border-indigo-700/50"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-indigo-300" />}
            <span className="hidden sm:inline">{isSpeaking ? "Mute" : "Speak"}</span>
          </button>

          {/* Pause / Play Motion */}
          <button
            onClick={() => setIsPlayingMotion(!isPlayingMotion)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {isPlayingMotion ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Animate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Avatar Stage & Gesture Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">

        {/* Left Column: 2D Animated Rig Graphic */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl p-4 border border-indigo-800/80 shadow-inner relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Animated Halo Wave */}
            <div
              className={`absolute inset-0 rounded-full border border-indigo-500/30 ${
                isPlayingMotion ? "animate-ping" : ""
              }`}
              style={{ animationDuration: "2.8s" }}
            />
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-indigo-600/10 to-teal-600/10 blur-md" />

            {/* High-Fidelity SVG Humanoid Rig */}
            <svg viewBox="0 0 160 160" className="w-32 h-32 relative z-10 drop-shadow-md">
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <filter id="glowHand">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Head & Neck */}
              <rect x="74" y="66" width="12" height="14" rx="3" fill="url(#skinGrad)" />
              {/* Head tilting with gentle nod */}
              <g transform={`translate(0, ${isPlayingMotion ? sinFactor * 2 : 0})`}>
                <circle cx="80" cy="46" r="24" fill="url(#skinGrad)" stroke="#312E81" strokeWidth="2" />
                {/* Hair */}
                <path d="M56 44 Q80 20 104 44 Q80 28 56 44" fill="#0F172A" />
                {/* Expressive Eyes */}
                <ellipse cx="71" cy="45" rx="3" ry={isPlayingMotion && motionFrame % 40 < 4 ? 0.5 : 3.5} fill="#1E1B4B" />
                <ellipse cx="89" cy="45" rx="3" ry={isPlayingMotion && motionFrame % 40 < 4 ? 0.5 : 3.5} fill="#1E1B4B" />
                <circle cx="72" cy="44" r="1" fill="#FFFFFF" />
                <circle cx="90" cy="44" r="1" fill="#FFFFFF" />
                {/* Smile / Mouth */}
                <path
                  d={activeGestureKey === "urgent" ? "M73 57 Q80 52 87 57" : "M72 54 Q80 61 88 54"}
                  stroke="#991B1B"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>

              {/* Torso & Shoulders */}
              <path d="M42 80 Q80 72 118 80 L112 145 L48 145 Z" fill="url(#bodyGrad)" stroke="#312E81" strokeWidth="1.5" />
              {/* Medical Stethoscope icon badge on chest */}
              <path d="M68 84 Q80 100 92 84" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="80" cy="98" r="4" fill="#10B981" />

              {/* GESTURE 1: NAMASTE / WELCOME */}
              {activeGestureKey === "welcome" && (
                <g filter="url(#glowHand)" transform={`translate(0, ${isPlayingMotion ? sinFactor * 3 : 0})`}>
                  {/* Both palms pressed together */}
                  <rect x="73" y="90" width="14" height="26" rx="6" fill="url(#skinGrad)" stroke="#312E81" strokeWidth="1.5" />
                  <line x1="80" y1="92" x2="80" y2="114" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="80" cy="88" r="3" fill="#10B981" />
                </g>
              )}

              {/* GESTURE 2: BODY AREA SCAN */}
              {activeGestureKey === "body_select" && (
                <g filter="url(#glowHand)">
                  {/* Left Arm pointing outward */}
                  <path d="M48 88 L30 105 L26 120" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
                  {/* Right Arm forming framing circle */}
                  <path d="M112 88 L130 96 L118 116" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
                  <circle
                    cx="80"
                    cy={105 + (isPlayingMotion ? sinFactor * 14 : 0)}
                    r="12"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                  />
                </g>
              )}

              {/* GESTURE 3: SYMPTOM & PAIN POINTING */}
              {activeGestureKey === "symptom" && (
                <g filter="url(#glowHand)">
                  {/* Pointing Index Finger directly at chest */}
                  <path
                    d={`M115 90 L${86 + (isPlayingMotion ? sinFactor * 4 : 0)} ${102 + (isPlayingMotion ? cosFactor * 3 : 0)}`}
                    stroke="url(#skinGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  {/* Pain radiating pulse ripple */}
                  <circle cx="80" cy="102" r={8 + (isPlayingMotion ? Math.abs(sinFactor) * 8 : 4)} fill="none" stroke="#F43F5E" strokeWidth="2" opacity="0.8" />
                  <circle cx="80" cy="102" r="3" fill="#F43F5E" />
                </g>
              )}

              {/* GESTURE 4: SEVERITY SCALE (1 to 10) */}
              {activeGestureKey === "severity" && (
                <g filter="url(#glowHand)">
                  {/* Elevating Hand with 5 spread fingers */}
                  <g transform={`translate(0, ${isPlayingMotion ? -sinFactor * 10 : 0})`}>
                    <path d="M110 95 L118 70" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
                    {/* Spread Fingers */}
                    <circle cx="118" cy="65" r="7" fill="url(#skinGrad)" />
                    <line x1="112" y1="65" x2="106" y2="55" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="116" y1="62" x2="114" y2="48" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="120" y1="62" x2="122" y2="48" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="124" y1="65" x2="130" y2="54" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" />
                  </g>
                  {/* Level numbers */}
                  <text x="50" y="105" fill="#FBBF24" fontSize="10" fontWeight="bold">1 ➜ 10</text>
                </g>
              )}

              {/* GESTURE 5: DOCTOR & NADI PULSE CHECK */}
              {activeGestureKey === "doctor" && (
                <g filter="url(#glowHand)">
                  {/* Left Wrist outstretched */}
                  <path d="M48 90 L70 115 L88 115" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" />
                  {/* Right Hand index & middle fingers touching left radial wrist */}
                  <path d="M115 90 L92 110" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="84" cy="115" r="4" fill="#10B981" className={isPlayingMotion ? "animate-ping" : ""} />
                </g>
              )}

              {/* GESTURE 6: CONFIRM & VERIFY */}
              {activeGestureKey === "confirm" && (
                <g filter="url(#glowHand)" transform={`translate(0, ${isPlayingMotion ? sinFactor * 2 : 0})`}>
                  {/* Double thumbs up affirmation */}
                  <path d="M45 92 L62 108" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="62" cy="104" r="6" fill="url(#skinGrad)" />
                  <line x1="62" y1="104" x2="62" y2="92" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />

                  <path d="M115 92 L98 108" stroke="url(#skinGrad)" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="98" cy="104" r="6" fill="url(#skinGrad)" />
                  <line x1="98" y1="104" x2="98" y2="92" stroke="url(#skinGrad)" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}

              {/* GESTURE 7: URGENT / EMERGENCY */}
              {activeGestureKey === "urgent" && (
                <g filter="url(#glowHand)">
                  <circle cx="80" cy="98" r={16 + (isPlayingMotion ? sinFactor * 6 : 0)} fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 3" />
                  <path d="M48 88 L72 96" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
                  <path d="M112 88 L88 96" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
                </g>
              )}
            </svg>
          </div>

          {/* Current Gesture Chip */}
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 shadow-xs ${activeGesture.badgeColor}`}>
            <span>{activeGesture.icon}</span>
            <span>{activeGesture.title}</span>
          </div>
        </div>

        {/* Right Column: Lexicon Explanation, Translation & Fast Gesture Selector */}
        <div className="md:col-span-7 space-y-3">

          {/* Active Clinical Meaning Card */}
          <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
            <div className="text-[11px] uppercase font-extrabold text-indigo-300 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> ISL Gesture Action:
              </span>
              <span className="text-slate-400 font-normal">{activeGesture.hindiTitle}</span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed font-medium">
              {activeGesture.desc}
            </p>
          </div>

          {/* Accessibility Benefit Callout */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <Zap className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-teal-300">Assistive Sign Guidance:</strong> Automatically mirrors your current intake step so deaf patients experience seamless zero-barrier clinical communication.
            </div>
          </div>

          {/* Gesture Library Selector Pills */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3" /> Quick ISL Lexicon Dictionary:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(ISL_GESTURES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActiveGestureKey(key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                    activeGestureKey === key
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-xs scale-102"
                      : "bg-slate-900/80 hover:bg-indigo-950 text-slate-300 border-slate-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title.split("/")[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
