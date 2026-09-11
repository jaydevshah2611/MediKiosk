"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Pill,
  Activity,
  Calendar,
  User,
  X,
  Sparkles,
  Download,
  ExternalLink,
  ZoomIn,
  Image as ImageIcon,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  HeartPulse,
  Utensils,
  Stethoscope
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { documentProcessor, documentTypes } from "@/lib/documentProcessor";
import { type UploadedDocument, type DocumentType } from "@/types/document";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientNav } from "@/components/patient/PatientNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { InlineGuideBanner } from "@/components/ui/InlineGuideBanner";

export default function PatientDocuments() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>("prescription");
  const [processing, setProcessing] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<UploadedDocument | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "entities" | "original" | "ocr">("analysis");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Load documents
        const docs = documentProcessor.getPatientDocuments(parsedUser.id);
        setDocuments(docs);
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [router]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setProcessing(file.name);

    try {
      const document = await documentProcessor.processDocument(file, selectedType, user.id);
      setDocuments(prev => [document, ...prev.filter(d => d.id !== document.id)]);
      // Auto open modal with clinical analysis
      setViewingDocument(document);
      setActiveTab("analysis");
    } catch (error) {
      console.error("Error processing document:", error);
      alert("Error processing document. Please try again.");
    } finally {
      setUploading(false);
      setProcessing(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm("Are you sure you want to delete this document from your records?")) {
      documentProcessor.deleteDocument(documentId);
      setDocuments(prev => prev.filter(d => d.id !== documentId));
      if (viewingDocument?.id === documentId) {
        setViewingDocument(null);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <FileText className="w-4 h-4 text-muted" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Analyzed & Verified";
      case "failed":
        return "OCR Failed";
      case "processing":
        return "Analyzing with Tesseract AI...";
      default:
        return "Uploading";
    }
  };

  const getDocumentTypeIcon = (type: DocumentType) => {
    const docType = documentTypes.find(t => t.type === type);
    return docType?.icon || "📄";
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PatientHeader user={user} />

      <div className="max-w-7xl w-full mx-auto px-4 pt-2">
        <PatientNav />
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <HeartPulse className="w-7 h-7 text-primary" /> {t("medical_documents_title")}
              </h1>
              <p className="text-sm text-muted">
                {t("upload_desc")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/patient/timeline")}
            >
              View in Timeline →
            </Button>
          </div>

          {/* Inline Step Guide */}
          <InlineGuideBanner
            title="How Medical Document OCR & AI Analysis Works"
            subtitle="Follow these 3 steps to extract laboratory insights and dietary recommendations"
            steps={[
              {
                stepNumber: 1,
                badge: "Category",
                title: "1. Choose Document Type",
                description: "Select whether it is a Prescription, Blood Test, MRI/X-Ray, or Discharge Summary."
              },
              {
                stepNumber: 2,
                badge: "Upload",
                title: "2. Select Image or PDF",
                description: "Upload a camera photo or scanned file. Tesseract AI engine extracts handwritten and printed text."
              },
              {
                stepNumber: 3,
                badge: "AI Insights",
                title: "3. Review Deficiencies",
                description: "Click 'View OCR & Analysis' to see detected high/low biomarkers, vitamins, and diet advice."
              }
            ]}
          />

          {/* Upload Card */}
          <Card className="border-2 border-primary/20 shadow-sm bg-surface">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" /> {t("upload_document")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  1. Select Record Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {documentTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setSelectedType(type.type)}
                      className={`p-2.5 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center ${
                        selectedType === type.type
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                          : "border-border hover:border-primary/40 bg-background text-foreground"
                      }`}
                    >
                      <div className="text-xl mb-1">{type.icon}</div>
                      <div className="text-[11px] font-medium leading-tight">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-dashed border-primary/30 hover:border-primary transition-colors rounded-xl p-6 sm:p-8 text-center bg-background/50">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                    {uploading ? (
                      <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm sm:text-base">
                      {uploading ? `Processing OCR & Health Analysis for: ${processing}` : "Click to browse or drop document image"}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      Supports JPG, PNG, PDF up to 10MB (Prescriptions, Lab Slips, Diagnostics)
                    </div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">
                Your Uploaded Records ({documents.length})
              </h2>
            </div>

            {documents.length === 0 ? (
              <Card className="border border-dashed border-border p-8 text-center">
                <FileText className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
                <p className="text-xs text-muted">
                  No documents uploaded yet. Upload a prescription or lab test report to test automated OCR extraction and AI health analysis.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <Card key={document.id} className="border border-border hover:border-primary/40 transition-all bg-surface">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          {/* Thumbnail */}
                          {document.thumbnailUrl && (document.thumbnailUrl.startsWith("data:image") || document.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(document.fileName)) ? (
                            <div
                              onClick={() => {
                                setViewingDocument(document);
                                setActiveTab("original");
                              }}
                              className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-background cursor-pointer shrink-0 relative group hover:border-primary transition-all shadow-xs"
                            >
                              <img
                                src={document.thumbnailUrl || document.downloadUrl}
                                alt={document.fileName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ZoomIn className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-2xl shrink-0">
                              {getDocumentTypeIcon(document.type)}
                            </div>
                          )}

                          <div>
                            <div className="font-bold text-foreground text-sm flex items-center gap-2">
                              <span>{document.fileName}</span>
                              {document.analysis && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                  document.analysis.overallHealthScore >= 80
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                                }`}>
                                  Score: {document.analysis.overallHealthScore}/100
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted mt-0.5">
                              <span>{documentProcessor.formatFileSize(document.fileSize)}</span>
                              <span>•</span>
                              <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(document.status)}
                                <span className="font-medium">{getStatusText(document.status)}</span>
                              </div>
                            </div>

                            {/* Analysis Summary Highlights */}
                            {document.analysis && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {document.analysis.goodFindings.slice(0, 1).map((g, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] rounded-full font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {g.split("-")[0]}
                                  </span>
                                ))}
                                {document.analysis.deficientFindings.map((d, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] rounded-full font-semibold flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3 text-amber-600" /> Deficient: {d}
                                  </span>
                                ))}
                                {document.analysis.elevatedFindings.map((e, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] rounded-full font-semibold flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-rose-600" /> High: {e}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <Button
                            size="sm"
                            onClick={() => {
                              setViewingDocument(document);
                              setActiveTab("analysis");
                            }}
                            className="bg-primary text-primary-foreground text-xs font-semibold"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1" /> View AI Health Analysis
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-muted hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Document Details & Analysis Modal */}
          {viewingDocument && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
              <div className="bg-surface border border-border rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-border p-4 bg-background/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDocumentTypeIcon(viewingDocument.type)}</span>
                    <div>
                      <h3 className="text-base font-bold text-foreground line-clamp-1">{viewingDocument.fileName}</h3>
                      <div className="text-xs text-muted">
                        Uploaded {new Date(viewingDocument.uploadedAt).toLocaleString()} • {documentProcessor.formatFileSize(viewingDocument.fileSize)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingDocument(null)}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 px-4 pt-3 border-b border-border bg-background/20 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === "analysis"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> AI Health Analysis & Deficiencies
                  </button>
                  <button
                    onClick={() => setActiveTab("entities")}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === "entities"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5" /> Extracted Entities (Rx & Labs)
                  </button>
                  <button
                    onClick={() => setActiveTab("original")}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === "original"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Original Copy
                  </button>
                  <button
                    onClick={() => setActiveTab("ocr")}
                    className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                      activeTab === "ocr"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Raw OCR Text
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Tab 1: AI Health Analysis */}
                  {activeTab === "analysis" && (
                    <div className="space-y-4">
                      {/* Health Score Card */}
                      {viewingDocument.analysis && (
                        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-background to-secondary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                              <HeartPulse className="w-4 h-4" /> AI Health Wellness Index
                            </div>
                            <div className="text-sm font-semibold text-foreground mt-1">
                              {viewingDocument.analysis.clinicalSummary}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl border border-border shadow-xs shrink-0">
                            <span className="text-3xl font-black text-primary">
                              {viewingDocument.analysis.overallHealthScore}
                            </span>
                            <span className="text-xs text-muted font-bold leading-tight">
                              / 100<br /><span className="text-[10px] text-emerald-600">Health Score</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 1. Good / Normal Findings */}
                      {viewingDocument.analysis?.goodFindings && viewingDocument.analysis.goodFindings.length > 0 && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What Is Good & Healthy in this Report
                          </div>
                          <ul className="space-y-1.5">
                            {viewingDocument.analysis.goodFindings.map((finding, idx) => (
                              <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 2. Deficient / Low Values */}
                      {viewingDocument.analysis?.deficientFindings && viewingDocument.analysis.deficientFindings.length > 0 && (
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                          <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <TrendingDown className="w-4 h-4 text-amber-600" /> Deficiencies & Low Biomarkers Detected
                          </div>
                          <ul className="space-y-1.5">
                            {viewingDocument.analysis.deficientFindings.map((def, idx) => (
                              <li key={idx} className="text-xs text-foreground flex items-start gap-2 font-medium">
                                <span className="text-amber-600 font-bold">⚠</span>
                                <span>{def}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 3. Elevated Values */}
                      {viewingDocument.analysis?.elevatedFindings && viewingDocument.analysis.elevatedFindings.length > 0 && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                          <div className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <TrendingUp className="w-4 h-4 text-rose-600" /> Elevated / High Metrics Requiring Attention
                          </div>
                          <ul className="space-y-1.5">
                            {viewingDocument.analysis.elevatedFindings.map((elev, idx) => (
                              <li key={idx} className="text-xs text-foreground flex items-start gap-2 font-medium">
                                <span className="text-rose-600 font-bold">▲</span>
                                <span>{elev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 4. Actionable Dietary & Lifestyle Advice */}
                      {viewingDocument.analysis?.actionableDietAdvice && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                          <div className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                            <Utensils className="w-4 h-4 text-blue-600" /> Actionable Dietary & Lifestyle Advice
                          </div>
                          <ul className="space-y-1 text-xs text-foreground">
                            {viewingDocument.analysis.actionableDietAdvice.map((advice, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 5. Follow-Up Advice */}
                      {viewingDocument.analysis?.followUpRecommendations && (
                        <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5 text-xs text-muted">
                          <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-foreground">Doctor Follow-Up Guidance: </span>
                            {viewingDocument.analysis.followUpRecommendations.join(" ")}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Extracted Entities */}
                  {activeTab === "entities" && (
                    <div className="space-y-4">
                      {/* Prescribing Doctor */}
                      {viewingDocument.extractedEntities?.doctors && viewingDocument.extractedEntities.doctors.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">Attending Clinician / Specialist</div>
                            <div className="font-bold text-foreground text-sm">{viewingDocument.extractedEntities.doctors.join(", ")}</div>
                          </div>
                        </div>
                      )}

                      {/* Medications */}
                      {viewingDocument.extractedEntities?.medications && viewingDocument.extractedEntities.medications.length > 0 && (
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2.5">
                          <div className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                            <Pill className="w-4 h-4" /> Prescribed Medications ({viewingDocument.extractedEntities.medications.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {viewingDocument.extractedEntities.medications.map((m, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex flex-col justify-between text-xs">
                                <span className="font-bold text-foreground text-sm">{m.name}</span>
                                <span className="text-muted text-[11px] mt-0.5">Dosage / Regimen: <strong>{m.dosage}</strong></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lab investigations */}
                      {viewingDocument.extractedEntities?.investigations && viewingDocument.extractedEntities.investigations.length > 0 && (
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                            <Activity className="w-4 h-4" /> Lab Biomarkers & Test Values ({viewingDocument.extractedEntities.investigations.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {viewingDocument.extractedEntities.investigations.map((inv, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-background border border-border flex justify-between items-center">
                                <div>
                                  <span className="font-semibold text-foreground">{inv.name}</span>
                                  {inv.range && <div className="text-[10px] text-muted">Ref: {inv.range}</div>}
                                </div>
                                <span className="font-black text-foreground text-sm">{inv.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Original Document Visual Copy */}
                  {activeTab === "original" && (
                    <div className="space-y-3 text-center">
                      {(viewingDocument.thumbnailUrl || viewingDocument.downloadUrl) ? (
                        <div className="p-2 rounded-xl bg-background border border-border flex flex-col items-center">
                          {(viewingDocument.thumbnailUrl?.startsWith("data:image") ||
                            viewingDocument.downloadUrl?.startsWith("data:image") ||
                            viewingDocument.mimeType?.startsWith("image/") ||
                            /\.(jpg|jpeg|png|webp|gif)$/i.test(viewingDocument.fileName)) ? (
                            <img
                              src={viewingDocument.thumbnailUrl || viewingDocument.downloadUrl}
                              alt={viewingDocument.fileName}
                              className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-sm border border-border"
                            />
                          ) : (
                            <div className="p-12 flex flex-col items-center justify-center space-y-3">
                              <FileText className="w-16 h-16 text-primary" />
                              <div className="font-bold text-foreground text-sm">{viewingDocument.fileName}</div>
                              <p className="text-xs text-muted max-w-sm">
                                Document file uploaded. You can download or open the original document copy directly.
                              </p>
                            </div>
                          )}
                          <div className="pt-3 flex items-center gap-3">
                            <a
                              href={viewingDocument.thumbnailUrl || viewingDocument.downloadUrl}
                              download={viewingDocument.fileName}
                              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                            >
                              <Download className="w-3.5 h-3.5" /> Download Uploaded Copy
                            </a>
                            <a
                              href={viewingDocument.thumbnailUrl || viewingDocument.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-muted text-foreground text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-border"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 border border-dashed border-border rounded-xl text-xs text-muted">
                          Original visual preview not available for this record.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 4: Full OCR Transcription */}
                  {activeTab === "ocr" && (
                    <div className="space-y-2">
                      <div className="p-4 rounded-xl bg-background border border-border text-xs font-mono text-foreground whitespace-pre-wrap max-h-[60vh] overflow-y-auto leading-relaxed shadow-inner">
                        {viewingDocument.ocrText || (
                          <span className="italic text-muted">No text transcribed in this document.</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-border flex items-center justify-between bg-background/50">
                  <span className="text-xs text-muted">
                    Record ID: <span className="font-mono">{viewingDocument.id}</span>
                  </span>
                  <Button onClick={() => setViewingDocument(null)} className="bg-primary">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
