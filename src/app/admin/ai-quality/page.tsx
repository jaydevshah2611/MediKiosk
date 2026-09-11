"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mic, Scan, Brain, AlertCircle } from "lucide-react";

export default function AIQualityMonitor() {
  // Mock data for charts
  const transcriptionAccuracyData = [
    { name: "Week 1", value: 92 },
    { name: "Week 2", value: 94 },
    { name: "Week 3", value: 95 },
    { name: "Week 4", value: 96 },
  ];

  const ocrConfidenceData = [
    { name: "Week 1", value: 88 },
    { name: "Week 2", value: 90 },
    { name: "Week 3", value: 91 },
    { name: "Week 4", value: 93 },
  ];

  const summaryQualityData = [
    { name: "Week 1", value: 85 },
    { name: "Week 2", value: 87 },
    { name: "Week 3", value: 89 },
    { name: "Week 4", value: 91 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Quality Monitor</h1>
              <p className="text-sm text-muted">Performance metrics for AI services</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">Last updated: 5 min ago</Badge>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Transcription Accuracy</p>
                  <p className="text-3xl font-bold text-foreground">96%</p>
                  <p className="text-xs text-success mt-1">+2% from last week</p>
                </div>
                <Mic className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">OCR Confidence</p>
                  <p className="text-3xl font-bold text-foreground">93%</p>
                  <p className="text-xs text-success mt-1">+3% from last week</p>
                </div>
                <Scan className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Summary Quality</p>
                  <p className="text-3xl font-bold text-foreground">91%</p>
                  <p className="text-xs text-success mt-1">+2% from last week</p>
                </div>
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Avg Processing Time</p>
                  <p className="text-3xl font-bold text-foreground">1.2s</p>
                  <p className="text-xs text-success mt-1">-15% from last week</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsChart
            data={transcriptionAccuracyData}
            type="line"
            title="Transcription Accuracy Trend"
            xAxisKey="name"
            dataKey="value"
          />
          <AnalyticsChart
            data={ocrConfidenceData}
            type="line"
            title="OCR Confidence Trend"
            xAxisKey="name"
            dataKey="value"
          />
          <AnalyticsChart
            data={summaryQualityData}
            type="line"
            title="Summary Quality Trend"
            xAxisKey="name"
            dataKey="value"
          />
        </div>

        {/* Quality Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Quality Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground">Low OCR Confidence</div>
                    <Badge variant="outline">2 min ago</Badge>
                  </div>
                  <p className="text-sm text-muted">
                    Document ID: DOC-4523 - Handwritten prescription with 67% confidence score
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground">Transcription Error</div>
                    <Badge variant="outline">15 min ago</Badge>
                  </div>
                  <p className="text-sm text-muted">
                    Session ID: SESSION-789 - Hindi transcription had 3 misidentified terms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border">
                <AlertCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-foreground">Resolved</div>
                    <Badge variant="outline">1 hour ago</Badge>
                  </div>
                  <p className="text-sm text-muted">
                    Previous OCR issue with document DOC-4512 has been resolved after manual review
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}