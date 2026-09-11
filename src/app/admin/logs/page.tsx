"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, Clock, User, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  type: "access" | "consent" | "system" | "security";
  user: string;
  action: string;
  details: string;
  severity: "info" | "warning" | "error";
}

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const logEntries: LogEntry[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      type: "consent",
      user: "Patient A-452",
      action: "Consent Granted",
      details: "Voice recording consent granted for session SESSION-123",
      severity: "info",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      type: "access",
      user: "Dr. Sharma",
      action: "Patient Record Accessed",
      details: "Accessed patient record for A-452",
      severity: "info",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      type: "security",
      user: "System",
      action: "Red Flag Triggered",
      details: "Red flag triggered for patient A-455 - Chest pain symptoms",
      severity: "warning",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      type: "system",
      user: "System",
      action: "OCR Processing Complete",
      details: "Document DOC-4523 processed successfully with 93% confidence",
      severity: "info",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      type: "access",
      user: "Admin Smith",
      action: "Settings Modified",
      details: "Updated notification preferences for Dr. Sharma",
      severity: "info",
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      type: "security",
      user: "System",
      action: "Failed Login Attempt",
      details: "Failed login attempt from IP 192.168.1.100",
      severity: "error",
    },
    {
      id: "7",
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      type: "consent",
      user: "Patient A-453",
      action: "Consent Withdrawn",
      details: "Document scanning consent withdrawn by patient",
      severity: "warning",
    },
  ];

  const filteredLogs = logEntries.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-danger";
      case "warning":
        return "bg-warning";
      default:
        return "bg-success";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "access":
        return <User className="w-4 h-4" />;
      case "consent":
        return <Shield className="w-4 h-4" />;
      case "security":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleExport = () => {
    console.log("Export logs");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
              <p className="text-sm text-muted">System activity and consent records</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "access" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("access")}
                >
                  Access
                </Button>
                <Button
                  variant={filterType === "consent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("consent")}
                >
                  Consent
                </Button>
                <Button
                  variant={filterType === "security" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("security")}
                >
                  Security
                </Button>
                <Button
                  variant={filterType === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("system")}
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-foreground">{log.action}</span>
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                      <Badge variant="outline">{log.type}</Badge>
                    </div>
                    <div className="text-sm text-muted mb-1">{log.details}</div>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}