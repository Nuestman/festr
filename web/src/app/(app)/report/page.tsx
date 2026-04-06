import type { Metadata } from "next";

import { ReportForm } from "@/components/app/report-form";

export const metadata: Metadata = {
  title: "Report — FESTR",
};

export default function ReportPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Report an incident</h1>
        <p className="text-muted-foreground leading-relaxed">
          Share structured information and optional media. For emergencies, use official emergency
          numbers first — FESTR does not replace dispatch.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
