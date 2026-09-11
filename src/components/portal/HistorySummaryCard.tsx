"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Edit2, AlertCircle } from "lucide-react";
import { HistoryRecord } from "@/types";

interface HistorySection {
  title: string;
  content: string;
  isAbnormal?: boolean;
}

interface HistorySummaryCardProps {
  history: HistoryRecord;
  onSectionEdit?: (section: string) => void;
  onSectionAccept?: (section: string) => void;
  className?: string;
}

export function HistorySummaryCard({
  history,
  onSectionEdit,
  onSectionAccept,
  className,
}: HistorySummaryCardProps) {
  const sections: HistorySection[] = [
    { title: "Chief Complaint", content: history.chiefComplaint },
    { title: "History of Present Illness", content: history.hpi },
    { title: "Past Medical History", content: history.pastHistory },
    { title: "Drug & Allergy History", content: history.drugAllergyHistory, isAbnormal: true },
    { title: "Family History", content: history.familyHistory },
    { title: "Personal History", content: history.personalHistory },
    { title: "Review of Systems", content: history.reviewOfSystems },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Red Flags Alert */}
      {history.redFlags.length > 0 && (
        <Card className="border-danger bg-danger/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-danger mb-2">Red Flags Detected</h4>
                <ul className="space-y-1">
                  {history.redFlags.map((flag, index) => (
                    <li key={index} className="text-sm text-foreground">
                      {flag.symptom}
                      {flag.acknowledgedBy && (
                        <span className="text-muted ml-2">
                          (Acknowledged by {flag.acknowledgedBy})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Sections */}
      {sections.map((section) => (
        <Card key={section.title} className={section.isAbnormal ? "border-accent" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.isAbnormal && (
                <div className="flex items-center gap-2 text-accent">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Abnormal</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">{section.content}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSectionEdit?.(section.title)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onSectionAccept?.(section.title)}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* AYUSH Parameters */}
      {history.ayushParameters && (
        <Card className="border-accent bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">AYUSH Assessment (Dashavidha Pariksha)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted">Prakriti:</span>
                <p className="text-foreground">{history.ayushParameters.prakriti}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted">Vikriti:</span>
                <p className="text-foreground">{history.ayushParameters.vikriti}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted">Agni:</span>
                <p className="text-foreground">{history.ayushParameters.agni}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted">Koshtha:</span>
                <p className="text-foreground">{history.ayushParameters.koshtha}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-muted">Ahara Vihara:</span>
                <p className="text-foreground">{history.ayushParameters.aharaVihara}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}