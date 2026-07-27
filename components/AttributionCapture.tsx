"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Unsichtbare Komponente im Layout: merkt sich gclid/utm_* aus der URL
 * fuer die Tab-Sitzung (siehe lib/attribution.ts). Kein Cookie, kein
 * Drittanbieter-Script, kein Render-Output.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
