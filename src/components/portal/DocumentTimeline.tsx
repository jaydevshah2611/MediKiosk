"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { ScannedDocument } from "@/types";
import { useState } from "react";

interface DocumentTimelineProps {
  documents: ScannedDocument[];
  onDocumentClick?: (document: ScannedDocument) => void;
  className?: string;
}

export function DocumentTimeline({
  documents,
  onDocumentClick,
  className,
}: DocumentTimelineProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("document-timeline");
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === "left" 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  const documentTypeColors: Record<string, "default" | "secondary" | "outline"> = {
    prescription: "default",
    labReport: "secondary",
    dischargeSummary: "outline",
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Document Timeline</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={scrollPosition === 0}
            className="p-2 rounded-lg bg-surface border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={scrollPosition >= (documents.length * 300 - 300)}
            className="p-2 rounded-lg bg-surface border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        id="document-timeline"
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {documents.map((document) => (
          <Card
            key={document.id}
            className="min-w-[280px] max-w-[280px] cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onDocumentClick?.(document)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={documentTypeColors[document.type] || "default"}>
                  {document.type.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(document.timelinePosition).toLocaleDateString()}</span>
                </div>

                <div className="text-sm text-foreground line-clamp-2">
                  {document.extractedText}
                </div>

                {document.extractedEntities.diagnoses.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted">Diagnoses:</span>
                    <div className="flex flex-wrap gap-1">
                      {document.extractedEntities.diagnoses.slice(0, 2).map((diagnosis: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {diagnosis}
                        </Badge>
                      ))}
                      {document.extractedEntities.diagnoses.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.extractedEntities.diagnoses.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {document.extractedEntities.investigations.some((inv: { abnormal?: boolean }) => inv.abnormal) && (
                  <div className="flex items-center gap-2 text-sm text-danger">
                    <span className="font-medium">Abnormal values detected</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}