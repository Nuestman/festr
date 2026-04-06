"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CreateResourceBody,
  createResourceBodySchema,
  resourceKinds,
} from "@/lib/validators/resource";

const KIND_LABEL: Record<(typeof resourceKinds)[number], string> = {
  aed: "AED / defibrillator",
  hospital: "Hospital / clinic",
  first_aid: "First aid point",
  other: "Other",
};

export function AddResourceForm() {
  const [kind, setKind] = useState<CreateResourceBody["kind"]>("aed");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [search, setSearch] = useState("");
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "error"; message: string }
    | { kind: "success"; id: string }
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
        setGeoStatus("Using your current location.");
      },
      (err) => {
        setGeoStatus(`Could not get location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 20_000, maximumAge: 0 },
    );
  }, []);

  async function geocode() {
    const q = search.trim();
    if (q.length < 2) {
      setGeoStatus("Enter a place name or address.");
      return;
    }
    setGeoStatus("Searching…");
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        setGeoStatus("Geocoding unavailable (configure Mapbox token).");
        return;
      }
      const data = (await res.json()) as {
        features?: Array<{ lng: number; lat: number; label: string }>;
      };
      const first = data.features?.[0];
      if (!first) {
        setGeoStatus("No results — try a different query.");
        return;
      }
      setLat(String(first.lat));
      setLng(String(first.lng));
      setGeoStatus(first.label);
    } catch {
      setGeoStatus("Network error.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "loading" });

    const latNum = Number.parseFloat(lat);
    const lngNum = Number.parseFloat(lng);
    const body = {
      kind,
      name: name.trim(),
      lat: latNum,
      lng: lngNum,
      source: source.trim() || undefined,
    };

    const parsed = createResourceBodySchema.safeParse(body);
    if (!parsed.success) {
      setStatus({
        kind: "error",
        message: "Check required fields and coordinates.",
      });
      return;
    }

    let resourceId: string;
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus({
          kind: "error",
          message: typeof err.error === "string" ? err.error : "Could not save.",
        });
        return;
      }
      const data = (await res.json()) as { id: string };
      resourceId = data.id;
    } catch {
      setStatus({ kind: "error", message: "Network error while saving." });
      return;
    }

    if (file) {
      const fd = new FormData();
      fd.set("file", file);
      try {
        const up = await fetch(`/api/resources/${resourceId}/photo`, {
          method: "POST",
          body: fd,
        });
        if (!up.ok) {
          const errBody = (await up.json().catch(() => ({}))) as {
            error?: string;
            message?: string;
            hint?: string;
            allowed?: string[];
          };
          const detail = [
            errBody.error,
            errBody.message,
            errBody.hint,
            errBody.allowed?.length ? `Allowed: ${errBody.allowed.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join(" — ");
          setStatus({
            kind: "error",
            message: detail
              ? `Resource saved; photo upload failed: ${detail}`
              : "Resource saved; photo upload failed.",
          });
          return;
        }
      } catch {
        setStatus({
          kind: "error",
          message: "Resource saved; photo upload failed (network).",
        });
        return;
      }
    }

    setStatus({ kind: "success", id: resourceId });
  }

  return (
    <form className="max-w-xl space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="res-kind">Kind</Label>
        <select
          id="res-kind"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 font-sans text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          value={kind}
          onChange={(e) => setKind(e.target.value as CreateResourceBody["kind"])}
        >
          {resourceKinds.map((k) => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="res-name">Name</Label>
        <Input
          id="res-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Kotoka International — Terminal 2 AED"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="res-source">Source / note (optional)</Label>
        <Input
          id="res-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Who verified, or how you know this exists"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="geo-search">Find on map (geocode)</Label>
        <div className="flex flex-wrap gap-2">
          <Input
            id="geo-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Address or place name"
            className="min-w-[12rem] flex-1"
          />
          <Button type="button" variant="outline" onClick={() => void geocode()}>
            Look up
          </Button>
          <Button type="button" variant="secondary" onClick={useMyLocation}>
            Use my location
          </Button>
        </div>
        {geoStatus && <p className="text-xs text-muted-foreground">{geoStatus}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="res-lat">Latitude</Label>
          <Input
            id="res-lat"
            inputMode="decimal"
            required
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="res-lng">Longitude</Label>
          <Input
            id="res-lng"
            inputMode="decimal"
            required
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="res-photo">Photo (optional)</Label>
        <Input
          id="res-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-muted-foreground">
          JPEG / PNG / WebP, max 8 MB. Requires Blob token on the server.
        </p>
      </div>

      {status.kind === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {status.message}
        </p>
      )}

      {status.kind === "success" && (
        <p className="text-sm text-muted-foreground" role="status">
          Saved. It will appear on the{" "}
          <a className="text-primary underline" href="/map">
            map
          </a>
          .
        </p>
      )}

      <Button type="submit" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? "Saving…" : "Save resource"}
      </Button>
    </form>
  );
}
