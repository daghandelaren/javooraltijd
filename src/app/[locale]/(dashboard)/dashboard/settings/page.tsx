"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2, LogOut, AlertTriangle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/data");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `javooraltijd-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess("Je gegevens zijn gedownload");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Er ging iets mis bij het exporteren");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "VERWIJDER MIJN ACCOUNT") {
      setError("Typ de bevestigingstekst correct");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/user/data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE_ALL_MY_DATA" }),
      });

      if (!response.ok) throw new Error("Delete failed");

      // Sign out and redirect
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Er ging iets mis bij het verwijderen");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-3xl font-semibold text-stone-900">
            Instellingen
          </h1>
          <p className="text-stone-600 mt-1">
            Beheer je account en privacy instellingen
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Beheer je accountinstellingen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Gegevens</CardTitle>
          <CardDescription>
            Exporteer of verwijder je gegevens (GDPR)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Data */}
          <div className="flex items-start justify-between p-4 bg-stone-50 rounded-lg">
            <div>
              <h3 className="font-medium text-stone-900">Exporteer je gegevens</h3>
              <p className="text-sm text-stone-600 mt-1">
                Download een kopie van al je gegevens in JSON formaat
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporteer
            </Button>
          </div>

          {/* Delete Account */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900">Verwijder je account</h3>
                <p className="text-sm text-red-700 mt-1">
                  Dit verwijdert permanent al je gegevens inclusief alle uitnodigingen en RSVP reacties.
                  Deze actie kan niet ongedaan worden gemaakt.
                </p>

                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Account verwijderen
                  </Button>
                ) : (
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-red-800 font-medium">
                      Typ "VERWIJDER MIJN ACCOUNT" om te bevestigen:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-md text-sm"
                      placeholder="VERWIJDER MIJN ACCOUNT"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                      >
                        Annuleren
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || deleteConfirmText !== "VERWIJDER MIJN ACCOUNT"}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Definitief verwijderen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
