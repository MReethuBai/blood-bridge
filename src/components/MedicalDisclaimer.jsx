import React from "react";
import { AlertTriangle } from "lucide-react";

export default function MedicalDisclaimer() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-center gap-2 font-medium">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      <span>
        <strong>Medical Disclaimer:</strong> BloodBridge AI provides donor matching & proximity ranking assistance. Final medical compatibility, blood cross-matching, and donor screening must be confirmed by qualified healthcare professionals.
      </span>
    </div>
  );
}
