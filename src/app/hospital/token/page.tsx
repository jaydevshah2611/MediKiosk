"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Clock, CheckCircle, AlertCircle, Users, Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { tokenManager, departments } from "@/lib/tokenManager";
import { type Department, type Token } from "@/types/token";

export default function TokenManagement() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("general_medicine");
  const [queue, setQueue] = useState<any>(null);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newTokenData, setNewTokenData] = useState({
    patientName: "",
    patientId: "",
    priority: false,
    symptoms: "",
  });

  useEffect(() => {
    loadQueue();
  }, [selectedDepartment]);

  const loadQueue = () => {
    const deptQueue = tokenManager.getDepartmentQueue(selectedDepartment);
    setQueue(deptQueue);
  };

  const handleIssueToken = () => {
    if (!newTokenData.patientName || !newTokenData.patientId) {
      alert("Please fill in patient name and ID");
      return;
    }

    const symptoms = newTokenData.symptoms ? newTokenData.symptoms.split(",").map(s => s.trim()) : undefined;
    
    const token = tokenManager.issueToken(
      newTokenData.patientId,
      newTokenData.patientName,
      selectedDepartment,
      newTokenData.priority,
      symptoms
    );

    alert(`Token ${token.tokenNumber} issued successfully`);
    setNewTokenData({ patientName: "", patientId: "", priority: false, symptoms: "" });
    setShowIssueForm(false);
    loadQueue();
  };

  const handleUpdateStatus = (tokenId: string, status: "in_consultation" | "completed" | "skipped") => {
    const updated = tokenManager.updateTokenStatus(tokenId, status);
    if (updated) {
      loadQueue();
    }
  };

  const handleAssignDoctor = (tokenId: string) => {
    const doctorName = prompt("Enter doctor name:");
    if (doctorName) {
      const doctorId = `doctor-${Date.now()}`;
      tokenManager.assignDoctorToToken(tokenId, doctorId, doctorName);
      loadQueue();
    }
  };

  const handleDeleteToken = (tokenId: string, tokenNumber?: string) => {
    if (confirm(`Are you sure you want to remove token ${tokenNumber || tokenId} from the queue?`)) {
      const success = tokenManager.deleteToken(tokenId);
      if (success) {
        loadQueue();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "priority":
        return "border-red-200 bg-red-50";
      case "in_consultation":
        return "border-blue-200 bg-blue-50";
      case "completed":
        return "border-green-200 bg-green-50";
      case "skipped":
        return "border-gray-200 bg-gray-50";
      default:
        return "border-border bg-surface";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "priority":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "in_consultation":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "skipped":
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const currentDept = departments.find(d => d.id === selectedDepartment);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/hospital/dashboard")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <div className="font-bold text-lg text-foreground">
            Token Management
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Department Selection */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Select Department</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDepartment === dept.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="text-center space-y-1">
                    <div className="text-2xl">{dept.icon}</div>
                    <div className="text-xs font-medium text-foreground">
                      {dept.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Queue Stats */}
          {queue && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {queue.tokens.filter((t: Token) => t.status === "waiting" || t.status === "priority").length}
                      </div>
                      <div className="text-sm text-muted">Waiting</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {queue.tokens.filter((t: Token) => t.status === "in_consultation").length}
                      </div>
                      <div className="text-sm text-muted">In Consultation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {queue.tokens.filter((t: Token) => t.status === "completed").length}
                      </div>
                      <div className="text-sm text-muted">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {queue.tokens.filter((t: Token) => t.priority).length}
                      </div>
                      <div className="text-sm text-muted">Priority</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentDept?.icon}</span>
              <span className="text-xl font-semibold text-foreground">{currentDept?.name}</span>
            </div>
            <Button
              className="bg-primary"
              onClick={() => setShowIssueForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Issue New Token
            </Button>
          </div>

          {/* Issue Token Form */}
          {showIssueForm && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Issue New Token</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={newTokenData.patientName}
                    onChange={(e) => setNewTokenData({ ...newTokenData, patientName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={newTokenData.patientId}
                    onChange={(e) => setNewTokenData({ ...newTokenData, patientId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                    placeholder="Enter patient ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Symptoms (optional, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTokenData.symptoms}
                    onChange={(e) => setNewTokenData({ ...newTokenData, symptoms: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none bg-surface text-foreground"
                    placeholder="e.g., headache, fever"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="priority"
                    checked={newTokenData.priority}
                    onChange={(e) => setNewTokenData({ ...newTokenData, priority: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="priority" className="text-sm text-foreground">
                    Mark as Priority
                  </label>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowIssueForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary"
                    onClick={handleIssueToken}
                  >
                    Issue Token
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Token Queue */}
          {queue && queue.tokens.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Token Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queue.tokens.map((token: Token) => (
                    <div
                      key={token.id}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(token.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(token.status)}
                            <span className="font-bold text-foreground text-lg">
                              {token.tokenNumber}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{token.patientName}</div>
                            <div className="text-sm text-muted">
                              {token.priority && "Priority • "}
                              {token.estimatedWaitTime && `Est. wait: ${token.estimatedWaitTime} min`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {token.doctorName && (
                            <div className="text-sm text-muted">
                              Dr. {token.doctorName}
                            </div>
                          )}
                          <div className="flex gap-2">
                            {token.status === "waiting" || token.status === "priority" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAssignDoctor(token.id)}
                                >
                                  Assign Doctor
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                  onClick={() => handleUpdateStatus(token.id, "in_consultation")}
                                >
                                  Start
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                                  onClick={() => handleDeleteToken(token.id, token.tokenNumber)}
                                  title="Delete token"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            ) : token.status === "in_consultation" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(token.id, "skipped")}
                                >
                                  Skip
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                  onClick={() => handleUpdateStatus(token.id, "completed")}
                                >
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                                  onClick={() => handleDeleteToken(token.id, token.tokenNumber)}
                                  title="Delete token"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted">
                                  {token.actualWaitTime && `Wait: ${token.actualWaitTime} min`}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:bg-destructive/10 p-1.5 h-8 w-8 cursor-pointer"
                                  onClick={() => handleDeleteToken(token.id, token.tokenNumber)}
                                  title="Delete token"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted">No tokens in this department</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}