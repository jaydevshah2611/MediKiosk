"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, Users, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation, type LanguageCode } from "@/lib/languages";
import { consentManager, consentTypes } from "@/lib/consentManager";
import { type ConsentType, type DataSharingRequest, type ConsentPermission } from "@/types/consent";
import { useState, useEffect } from "react";

export default function PatientConsent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const { t } = useTranslation(selectedLanguage);
  
  const [activeGrants, setActiveGrants] = useState<ConsentPermission[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DataSharingRequest[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<ConsentType>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setSelectedLanguage(parsedUser.preferredLanguage || "en");
        
        // Load consent data
        const consentRecord = consentManager.getPatientConsent(parsedUser.id);
        if (consentRecord) {
          setActiveGrants(consentRecord.activeGrants);
          setPendingRequests(consentRecord.sharingRequests.filter(r => r.status === "pending"));
        }
      } else {
        router.push("/patient/dashboard");
      }
    }
  }, [router]);

  const handlePermissionToggle = (permissionType: ConsentType) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionType)) {
        newSet.delete(permissionType);
      } else {
        newSet.add(permissionType);
      }
      return newSet;
    });
  };

  const handleApproveRequest = (requestId: string) => {
    if (selectedPermissions.size === 0) {
      alert("Please select at least one permission to grant");
      return;
    }

    consentManager.respondToSharingRequest(
      user.id,
      requestId,
      true,
      Array.from(selectedPermissions)
    );

    // Refresh data
    const consentRecord = consentManager.getPatientConsent(user.id);
    if (consentRecord) {
      setActiveGrants(consentRecord.activeGrants);
      setPendingRequests(consentRecord.sharingRequests.filter(r => r.status === "pending"));
    }

    setSelectedPermissions(new Set());
    alert("Permissions granted successfully");
  };

  const handleRejectRequest = (requestId: string) => {
    consentManager.respondToSharingRequest(user.id, requestId, false);

    // Refresh data
    const consentRecord = consentManager.getPatientConsent(user.id);
    if (consentRecord) {
      setActiveGrants(consentRecord.activeGrants);
      setPendingRequests(consentRecord.sharingRequests.filter(r => r.status === "pending"));
    }

    alert("Request rejected");
  };

  const handleRevokePermission = (grantId: string) => {
    if (confirm("Are you sure you want to revoke this permission?")) {
      consentManager.revokePermission(user.id, grantId);

      // Refresh data
      const consentRecord = consentManager.getPatientConsent(user.id);
      if (consentRecord) {
        setActiveGrants(consentRecord.activeGrants);
      }

      alert("Permission revoked successfully");
    }
  };

  const getConsentTypeLabel = (type: ConsentType): string => {
    const consentType = consentTypes.find(c => c.type === type);
    return consentType?.label || type;
  };

  const getConsentTypeDescription = (type: ConsentType): string => {
    const consentType = consentTypes.find(c => c.type === type);
    return consentType?.description || "";
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <div className="font-bold text-lg text-foreground">
            My Health Sharing
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pending Requests
              </h2>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="border-2 border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {request.requestingEntity.name}
                      </CardTitle>
                      <p className="text-sm text-muted">
                        {request.purpose}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          They are requesting access to:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {request.requestedPermissions.map((permission) => (
                            <button
                              key={permission}
                              onClick={() => handlePermissionToggle(permission)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedPermissions.has(permission)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 bg-surface"
                              }`}
                            >
                              <div className="text-sm font-medium text-foreground">
                                {getConsentTypeLabel(permission)}
                              </div>
                              <div className="text-xs text-muted mt-1">
                                {getConsentTypeDescription(permission)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          className="flex-1 bg-primary"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={selectedPermissions.size === 0}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Selected
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Grants */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Active Access
            </h2>
            
            {activeGrants.length === 0 ? (
              <Card className="border-2 border-border">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-muted">
                    No active data sharing grants. Your health information is private.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  activeGrants.reduce((groups: Record<string, ConsentPermission[]>, grant) => {
                    const key = grant.grantedTo || "unknown";
                    if (!groups[key]) {
                      groups[key] = [];
                    }
                    groups[key].push(grant);
                    return groups;
                  }, {})
                ).map(([entityId, grants]) => (
                  <Card key={entityId} className="border-2 border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {grants[0].visitId ? `Visit ${grants[0].visitId}` : "Ongoing Access"}
                      </CardTitle>
                      <p className="text-sm text-muted">
                        Entity ID: {entityId}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          Shared Information:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {grants.map((grant) => (
                            <div
                              key={`${grant.type}-${grant.grantedTo}-${grant.visitId}`}
                              className="px-3 py-1 bg-surface rounded-full text-sm text-foreground"
                            >
                              {getConsentTypeLabel(grant.type)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted">
                          Granted: {new Date(grants[0].grantedAt || "").toLocaleDateString()}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokePermission(`${grants[0].type}-${grants[0].grantedTo}-${grants[0].visitId}`)}
                        >
                          Revoke Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Information */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Your Data Privacy
                  </h3>
                  <p className="text-sm text-muted">
                    You have full control over your health information. You can grant or revoke access at any time. 
                    All data sharing is logged and tracked. Your information will only be shared according to your permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}