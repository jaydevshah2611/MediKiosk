"use client";

import { useState, useEffect, useRef } from "react";

class SpeechAudioService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        if (this.synth) {
          this.voices = this.synth.getVoices();
        }
      };
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public speak(
    text: string,
    langCode: string = "en",
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      if (onError) onError(new Error("Speech synthesis not supported in this browser"));
      return;
    }

    // Cancel any ongoing speech and ensure synthesis engine is active
    this.synth.cancel();
    if (this.synth.paused) {
      this.synth.resume();
    }

    const cleanText = text.replace(/[*_#`]/g, " ").trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Map portal language to BCP 47 locale codes
    const langMap: Record<string, string[]> = {
      en: ["en-IN", "en-GB", "en-US", "en"],
      hi: ["hi-IN", "hi"],
      gu: ["gu-IN", "gu", "hi-IN"],
      mr: ["mr-IN", "mr", "hi-IN"],
      bn: ["bn-IN", "bn", "hi-IN"],
      ta: ["ta-IN", "ta"],
      te: ["te-IN", "te"],
      kn: ["kn-IN", "kn"],
      ml: ["ml-IN", "ml"]
    };

    const targetLocales = langMap[langCode] || ["en-IN", "en"];
    const availableVoices = this.getVoices();

    let matchedVoice: SpeechSynthesisVoice | undefined;
    for (const locale of targetLocales) {
      matchedVoice = availableVoices.find(v =>
        v.lang.toLowerCase().replace("_", "-").startsWith(locale.toLowerCase())
      );
      if (matchedVoice) break;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = targetLocales[0];
    }

    utterance.rate = 0.95; // Clear and comfortable cadence for healthcare instructions
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      if (onEnd) onEnd();
      if (onError) onError(e);
    };

    // Handle Chrome/Chromium bug where long speech freezes
    const resumeTimer = setInterval(() => {
      if (this.synth?.speaking) {
        this.synth.pause();
        this.synth.resume();
      } else {
        clearInterval(resumeTimer);
      }
    }, 10000);

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.error("Failed to speak utterance:", err);
      if (onError) onError(err);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechAudioService = new SpeechAudioService();
