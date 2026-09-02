"use client";

import { useState } from "react";
import type { AdmissionModalData } from "@/types/admission-modal";
import AdmissionModalManager from "./admission-modal-manager";

export default function AdmissionModalClient({ initialData }: { initialData: AdmissionModalData }) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async (settings: typeof initialData.settings) => {
    try {
      setError("");
      setSuccess("");
      
      const res = await fetch("/api/admin/admission-modal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const updated = await res.json();
      setData(updated);
      setSuccess("✓ Changes saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      throw err;
    }
  };

  return (
    <>
      {/* Fixed position messages at bottom */}
      {error && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-lg max-w-md animate-in slide-in-from-bottom-5">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium shadow-lg max-w-md animate-in slide-in-from-bottom-5">
          {success}
        </div>
      )}
      <AdmissionModalManager settings={data.settings} onSave={handleSave} />
    </>
  );
}
