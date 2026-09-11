import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AccessibilityToolbar } from "@/components/ui/AccessibilityToolbar";
import { CursorBackgroundEffect } from "@/components/ui/CursorBackgroundEffect";
import { StepGuideTips } from "@/components/ui/StepGuideTips";
import { LanguageProvider } from "@/contexts/LanguageContext";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AYUSHCARE - AI Patient Case-Taking & Care Routing",
  description: "AI-Powered Multilingual Patient Case-Taking, Clinical OCR & OPD Triage Platform for Ministry of Ayush SIH26047.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <LanguageProvider>
          {/* Dynamic Cursor Interactive Background Glow Aura */}
          <CursorBackgroundEffect />

          <div id="main-content" role="main" tabIndex={-1} className="flex-1 flex flex-col relative z-10">
            {children}
          </div>
          {/* Global Step-by-Step Interactive Guide Tips */}
          <StepGuideTips />
          {/* Global Universal Accessibility Toolbar accessible on every page */}
          <AccessibilityToolbar />
        </LanguageProvider>
      </body>
    </html>
  );
}
