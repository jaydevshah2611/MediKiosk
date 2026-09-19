"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import {
  Eye,
  Volume2,
  VolumeX,
  HandMetal,
  Play,
  Pause,
  Zap,
  Info,
  RotateCcw
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
  keywords: string[];
  badgeColor: string;
}

const ISL_GESTURES: Record<string, GestureDefinition> = {
  welcome: {
    id: "welcome",
    title: "Namaste / Hello",
    hindiTitle: "नमस्ते",
    desc: "Palms join at the chest (Namaste), then open outward to welcome you.",
    icon: "🙏",
    keywords: ["welcome", "hello", "namaste", "hi", "start"],
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  body_select: {
    id: "body_select",
    title: "Body / Area",
    hindiTitle: "शरीर का भाग",
    desc: "Hands outline the body from head to abdomen so you can choose the affected area.",
    icon: "👤",
    keywords: ["body", "area", "region", "head", "chest", "abdomen", "system"],
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  },
  symptom: {
    id: "symptom",
    title: "Symptom / Pain",
    hindiTitle: "लक्षण / दर्द",
    desc: "Index finger points to the painful spot while the other hand shows throbbing discomfort.",
    icon: "👉",
    keywords: ["symptom", "pain", "fever", "cough", "headache", "ache", "complaint", "sick"],
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
  },
  severity: {
    id: "severity",
    title: "Severity 1–10",
    hindiTitle: "तीव्रता",
    desc: "Hand rises from low (mild) to high (severe) while fingers spread to rate intensity.",
    icon: "🖐️",
    keywords: ["severity", "rate", "scale", "intensity", "1-10", "mild", "severe"],
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  doctor: {
    id: "doctor",
    title: "Doctor",
    hindiTitle: "चिकित्सक",
    desc: "Fingers check the wrist pulse, the ISL sign used for doctor and clinical review.",
    icon: "🩺",
    keywords: ["doctor", "physician", "consult", "hospital", "clinic", "ayush"],
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
  },
  confirm: {
    id: "confirm",
    title: "Yes / Confirm",
    hindiTitle: "हाँ / सहमति",
    desc: "Thumbs up, then a stamp of both palms to confirm consent or token issue.",
    icon: "👍",
    keywords: ["confirm", "yes", "ok", "token", "review", "summary", "agree", "consent"],
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40"
  },
  urgent: {
    id: "urgent",
    title: "Emergency",
    hindiTitle: "आपात",
    desc: "Both hands pulse over the chest with an alert face — go to triage now.",
    icon: "🚨",
    keywords: ["urgent", "emergency", "priority", "red", "help", "danger"],
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40"
  },
  wait: {
    id: "wait",
    title: "Wait / Queue",
    hindiTitle: "प्रतीक्षा",
    desc: "Open palm held forward, then a small circular motion meaning please wait in queue.",
    icon: "✋",
    keywords: ["wait", "queue", "later", "hold", "next"],
    badgeColor: "bg-slate-500/20 text-slate-200 border-slate-400/40"
  },
  medicine: {
    id: "medicine",
    title: "Medicine",
    hindiTitle: "दवा",
    desc: "Thumb and fingers mimic taking a tablet, then a swallow motion.",
    icon: "💊",
    keywords: ["medicine", "tablet", "dose", "prescription", "drug"],
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/40"
  },
  no: {
    id: "no",
    title: "No / Stop",
    hindiTitle: "नहीं",
    desc: "Index finger waves side to side, the ISL negation sign.",
    icon: "🚫",
    keywords: ["no", "stop", "cancel", "not"],
    badgeColor: "bg-rose-800/30 text-rose-200 border-rose-500/40"
  }
};

const STEP_DEFAULT: Record<string, string> = {
  body_system: "body_select",
  symptom_selection: "symptom",
  follow_up: "severity",
  review: "confirm",
  complete: "confirm"
};

function gestureForPhrase(raw: string): string | null {
  const text = raw.toLowerCase();
  const ranked = Object.values(ISL_GESTURES)
    .map((g) => ({
      id: g.id,
      score: g.keywords.reduce((n, k) => n + (text.includes(k) ? k.length : 0), 0)
    }))
    .filter((g) => g.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.id || null;
}

function messageToSignQueue(text: string, stepName: string): { key: string; label: string }[] {
  const cleaned = (text || "").trim();
  if (!cleaned) {
    return [{ key: STEP_DEFAULT[stepName] || "welcome", label: "Welcome" }];
  }

  const clauses = cleaned
    .split(/[,.!?;:/]+/)
    .map((c) => c.trim())
    .filter(Boolean);

  const queue: { key: string; label: string }[] = [];
  for (const clause of clauses) {
    const key = gestureForPhrase(clause);
    if (key) {
      queue.push({ key, label: clause });
    } else {
      const words = clause.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        queue.push({
          key: gestureForPhrase(word) || STEP_DEFAULT[stepName] || "welcome",
          label: word
        });
      }
    }
  }

  if (!queue.length) {
    queue.push({
      key: STEP_DEFAULT[stepName] || "welcome",
      label: cleaned
    });
  }
  return queue;
}

export function SignLanguageAvatar({
  currentText = "Please select your symptoms or affected area.",
  stepName = "body_system",
  language = "en",
  className = ""
}: SignLanguageAvatarProps) {
  const uid = useId().replace(/:/g, "");
  const signQueue = useMemo(
    () => messageToSignQueue(currentText, stepName),
    [currentText, stepName]
  );

  const [queueIndex, setQueueIndex] = useState(0);
  const [lockedKey, setLockedKey] = useState<string | null>(null);
  const [isPlayingMotion, setIsPlayingMotion] = useState(true);
  const [motionFrame, setMotionFrame] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setLockedKey(null);
    setQueueIndex(0);
  }, [currentText, stepName]);

  useEffect(() => {
    if (!isPlayingMotion || lockedKey || signQueue.length <= 1) return;
    const timer = setInterval(() => {
      setQueueIndex((prev) => (prev + 1) % signQueue.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isPlayingMotion, lockedKey, signQueue.length]);

  useEffect(() => {
    if (!isPlayingMotion) return;
    const interval = setInterval(() => {
      setMotionFrame((prev) => (prev + 1) % 120);
    }, 40);
    return () => clearInterval(interval);
  }, [isPlayingMotion]);

  const activeGestureKey = lockedKey || signQueue[queueIndex]?.key || "welcome";
  const activeGesture = ISL_GESTURES[activeGestureKey] || ISL_GESTURES.welcome;
  const signedPhrase = lockedKey
    ? activeGesture.title
    : signQueue[queueIndex]?.label || currentText;

  const sinFactor = Math.sin((motionFrame * Math.PI) / 30);
  const cosFactor = Math.cos((motionFrame * Math.PI) / 30);

  const speakCurrent = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const line =
      language === "hi"
        ? `${activeGesture.hindiTitle}. ${signedPhrase}`
        : `${activeGesture.title}. ${signedPhrase}`;
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.rate = 0.95;
    utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-500/40 shadow-2xl overflow-hidden relative ${className}`}>
      <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-indigo-800/60 mb-4 gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
            <HandMetal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-indigo-100">ISL Digital Sign Avatar</div>
            <div className="text-xs text-indigo-300/80">Signs the selected message, word by word</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={speakCurrent}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border cursor-pointer ${
              isSpeaking
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-indigo-900/60 text-indigo-200 border-indigo-700/50"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? "Mute" : "Speak"}</span>
          </button>
          <button
            onClick={() => setIsPlayingMotion(!isPlayingMotion)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/80 text-white border border-indigo-400/30 flex items-center gap-1.5 cursor-pointer"
          >
            {isPlayingMotion ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingMotion ? "Pause" : "Play"}</span>
          </button>
          {lockedKey && (
            <button
              onClick={() => {
                setLockedKey(null);
                setQueueIndex(0);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-indigo-100 border border-indigo-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Follow message
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 px-3 py-2 rounded-xl bg-slate-950/70 border border-indigo-700/50 relative z-10">
        <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Now signing</div>
        <div className="text-sm font-semibold text-white leading-snug">{signedPhrase}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10">
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl p-4 border border-indigo-800/80">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border border-indigo-500/30 ${isPlayingMotion ? "animate-ping" : ""}`} style={{ animationDuration: "2.8s" }} />
            <svg viewBox="0 0 160 160" className="w-32 h-32 relative z-10" suppressHydrationWarning>
              <defs>
                <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#1E1B4B" />
                </linearGradient>
                <linearGradient id={`${uid}-skin`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
              <rect x="74" y="66" width="12" height="14" rx="3" fill={`url(#${uid}-skin)`} />
              <g transform={`translate(0, ${isPlayingMotion ? sinFactor * 2 : 0})`}>
                <circle cx="80" cy="46" r="24" fill={`url(#${uid}-skin)`} stroke="#312E81" strokeWidth="2" />
                <path d="M56 44 Q80 20 104 44 Q80 28 56 44" fill="#0F172A" />
                <ellipse cx="71" cy="45" rx="3" ry={isPlayingMotion && motionFrame % 40 < 4 ? 0.5 : 3.5} fill="#1E1B4B" />
                <ellipse cx="89" cy="45" rx="3" ry={isPlayingMotion && motionFrame % 40 < 4 ? 0.5 : 3.5} fill="#1E1B4B" />
                <path
                  d={activeGestureKey === "urgent" || activeGestureKey === "no" ? "M73 57 Q80 52 87 57" : "M72 54 Q80 61 88 54"}
                  stroke="#991B1B"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              <path d="M42 80 Q80 72 118 80 L112 145 L48 145 Z" fill={`url(#${uid}-body)`} stroke="#312E81" strokeWidth="1.5" />
              <path d="M68 84 Q80 100 92 84" stroke="#10B981" strokeWidth="2.5" fill="none" />
              <circle cx="80" cy="98" r="4" fill="#10B981" />

              {activeGestureKey === "welcome" && (
                <g transform={`translate(0, ${isPlayingMotion ? sinFactor * 3 : 0})`}>
                  <rect x="73" y="90" width="14" height="26" rx="6" fill={`url(#${uid}-skin)`} stroke="#312E81" strokeWidth="1.5" />
                </g>
              )}
              {activeGestureKey === "body_select" && (
                <g>
                  <path d="M48 88 L30 105 L26 120" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <path d="M112 88 L130 96 L118 116" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <circle cx="80" cy={105 + (isPlayingMotion ? sinFactor * 14 : 0)} r="12" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="4 3" />
                </g>
              )}
              {activeGestureKey === "symptom" && (
                <g>
                  <path d={`M115 90 L${86 + (isPlayingMotion ? sinFactor * 4 : 0)} ${102 + (isPlayingMotion ? cosFactor * 3 : 0)}`} stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <circle cx="80" cy="102" r={8 + (isPlayingMotion ? Math.abs(sinFactor) * 8 : 4)} fill="none" stroke="#F43F5E" strokeWidth="2" />
                </g>
              )}
              {activeGestureKey === "severity" && (
                <g transform={`translate(0, ${isPlayingMotion ? -sinFactor * 10 : 0})`}>
                  <path d="M110 95 L118 70" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <circle cx="118" cy="65" r="7" fill={`url(#${uid}-skin)`} />
                  <text x="48" y="108" fill="#FBBF24" fontSize="10" fontWeight="bold">1 → 10</text>
                </g>
              )}
              {activeGestureKey === "doctor" && (
                <g>
                  <path d="M48 90 L70 115 L88 115" stroke={`url(#${uid}-skin)`} strokeWidth="8" strokeLinecap="round" />
                  <path d="M115 90 L92 110" stroke={`url(#${uid}-skin)`} strokeWidth="8" strokeLinecap="round" />
                  <circle cx="84" cy="115" r="4" fill="#10B981" />
                </g>
              )}
              {activeGestureKey === "confirm" && (
                <g transform={`translate(0, ${isPlayingMotion ? sinFactor * 2 : 0})`}>
                  <path d="M45 92 L62 108" stroke={`url(#${uid}-skin)`} strokeWidth="8" strokeLinecap="round" />
                  <line x1="62" y1="104" x2="62" y2="92" stroke={`url(#${uid}-skin)`} strokeWidth="4" strokeLinecap="round" />
                  <path d="M115 92 L98 108" stroke={`url(#${uid}-skin)`} strokeWidth="8" strokeLinecap="round" />
                  <line x1="98" y1="104" x2="98" y2="92" stroke={`url(#${uid}-skin)`} strokeWidth="4" strokeLinecap="round" />
                </g>
              )}
              {activeGestureKey === "urgent" && (
                <g>
                  <circle cx="80" cy="98" r={16 + (isPlayingMotion ? sinFactor * 6 : 0)} fill="none" stroke="#EF4444" strokeWidth="3" />
                  <path d="M48 88 L72 96" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <path d="M112 88 L88 96" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                </g>
              )}
              {activeGestureKey === "wait" && (
                <g>
                  <path d="M112 88 L128 70" stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <circle cx="130" cy={66 + (isPlayingMotion ? sinFactor * 4 : 0)} r="8" fill={`url(#${uid}-skin)`} />
                </g>
              )}
              {activeGestureKey === "medicine" && (
                <g transform={`translate(0, ${isPlayingMotion ? sinFactor * 3 : 0})`}>
                  <path d="M50 100 L72 88" stroke={`url(#${uid}-skin)`} strokeWidth="8" strokeLinecap="round" />
                  <ellipse cx="80" cy="82" rx="8" ry="5" fill="#A78BFA" />
                </g>
              )}
              {activeGestureKey === "no" && (
                <g>
                  <path d={`M110 90 L${124 + (isPlayingMotion ? sinFactor * 10 : 0)} 70`} stroke={`url(#${uid}-skin)`} strokeWidth="9" strokeLinecap="round" />
                  <line x1="118" y1="62" x2="132" y2="62" stroke="#F87171" strokeWidth="3" />
                </g>
              )}
            </svg>
          </div>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${activeGesture.badgeColor}`}>
            <span>{activeGesture.icon}</span>
            <span>{activeGesture.title}</span>
          </div>
        </div>

        <div className="md:col-span-7 space-y-3">
          <div className="bg-indigo-900/40 p-3.5 rounded-xl border border-indigo-700/50 space-y-1.5">
            <div className="text-[11px] uppercase font-extrabold text-indigo-300 tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {language === "hi" ? activeGesture.hindiTitle : activeGesture.title}
              </span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed">{activeGesture.desc}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <Zap className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
            <div>
              Tap a sign below to lock it. Use Follow message to sign the intake text in order.
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3" /> Select an ISL message
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.values(ISL_GESTURES).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setLockedKey(item.id);
                    setIsPlayingMotion(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer flex items-center gap-1 ${
                    activeGestureKey === item.id && lockedKey === item.id
                      ? "bg-indigo-600 text-white border-indigo-400"
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
