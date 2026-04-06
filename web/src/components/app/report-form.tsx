"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type CreateIncidentBody,
  createIncidentBodySchema,
  incidentTypes,
} from "@/lib/validators/incident";

const TYPE_OPTIONS = incidentTypes.map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export function ReportForm() {
  const [type, setType] = useState<CreateIncidentBody["type"]>("other");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [accuracyM, setAccuracyM] = useState("");
  const [isSilentSecurity, setIsSilentSecurity] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "success"; incidentId: string }
  >({ kind: "idle" });

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is not available in this browser.");
      return;
    }
    setGeoStatus("Locating…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
        if (pos.coords.accuracy != null) {
          setAccuracyM(String(Math.round(pos.coords.accuracy)));
        }
        setGeoStatus("Location captured.");
      },
      (err) => {
        setGeoStatus(`Could not get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 },
    );
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitStatus({ kind: "loading" });

    const latNum = Number.parseFloat(lat);
    const lngNum = Number.parseFloat(lng);

    const body: Record<string, unknown> = {
      type,
      description: description.trim() || undefined,
      lat: latNum,
      lng: lngNum,
      isSilentSecurity,
    };
    if (accuracyM.trim() !== "") {
      const a = Number.parseFloat(accuracyM);
      if (!Number.isNaN(a)) body.accuracyM = a;
    }

    const parsed = createIncidentBodySchema.safeParse(body);
    if (!parsed.success) {
      setSubmitStatus({
        kind: "error",
        message: "Check the form — location must be valid numbers in range.",
      });
      return;
    }

    let incidentId: string;
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSubmitStatus({
          kind: "error",
          message: typeof err.error === "string" ? err.error : "Could not save report.",
        });
        return;
      }
      const data = (await res.json()) as { id: string };
      incidentId = data.id;
    } catch {
      setSubmitStatus({ kind: "error", message: "Network error while saving report." });
      return;
    }

    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (!file) continue;
        const fd = new FormData();
        fd.set("file", file);
        try {
          const up = await fetch(`/api/incidents/${incidentId}/media`, {
            method: "POST",
            body: fd,
          });
          if (!up.ok) {
            const err = await up.json().catch(() => ({}));
            setSubmitStatus({
              kind: "error",
              message:
                typeof err.error === "string"
                  ? `Report saved; upload failed: ${err.error}`
                  : "Report saved; one or more uploads failed.",
            });
            return;
          }
        } catch {
          setSubmitStatus({
            kind: "error",
            message: "Report saved; upload failed (network).",
          });
          return;
        }
      }
    }

    setSubmitStatus({ kind: "success", incidentId });
  }

  return (
    <form className="max-w-xl space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="incident-type">Type</Label>
        <select
          id="incident-type"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 font-sans text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          value={type}
          onChange={(e) => setType(e.target.value as CreateIncidentBody["type"])}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What happened, approximate severity, access notes…"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={useMyLocation}>
          Use my location
        </Button>
        {geoStatus && (
          <span className="text-sm text-muted-foreground" role="status">
            {geoStatus}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            inputMode="decimal"
            required
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 5.6037"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            inputMode="decimal"
            required
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="e.g. -0.187"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accuracy">GPS accuracy (meters, optional)</Label>
        <Input
          id="accuracy"
          inputMode="numeric"
          value={accuracyM}
          onChange={(e) => setAccuracyM(e.target.value)}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded border-input"
          checked={isSilentSecurity}
          onChange={(e) => setIsSilentSecurity(e.target.checked)}
        />
        <span>
          Silent / discreet report (reduces sensitive detail in listings where supported).
        </span>
      </label>

      <div className="space-y-2">
        <Label htmlFor="media">Photos / video (optional)</Label>
        <Input
          id="media"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, or MP4 — max 10 MB per file. Requires{" "}
          <code className="rounded bg-muted px-1">BLOB_READ_WRITE_TOKEN</code> on the server.
        </p>
      </div>

      {submitStatus.kind === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {submitStatus.message}
        </p>
      )}

      {submitStatus.kind === "success" && (
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm" role="status">
          <p className="font-medium text-foreground">Report submitted.</p>
          <p className="mt-2 text-muted-foreground">
            <Link
              href={`/incidents/${submitStatus.incidentId}`}
              className="font-medium text-primary underline underline-offset-4"
            >
              View incident
            </Link>{" "}
            or return to the dashboard.
          </p>
        </div>
      )}

      <Button type="submit" disabled={submitStatus.kind === "loading"}>
        {submitStatus.kind === "loading" ? "Submitting…" : "Submit report"}
      </Button>
    </form>
  );
}
