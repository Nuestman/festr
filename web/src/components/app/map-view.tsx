"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox";

import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";

type MapIncident = {
  id: string;
  lat: number;
  lng: number;
  type: string;
  isSilentSecurity: boolean;
  createdAt: string;
};

type MapResource = {
  id: string;
  lat: number;
  lng: number;
  kind: string;
  name: string;
  photoUrl: string | null;
};

type PopupState =
  | {
      kind: "incident";
      lng: number;
      lat: number;
      id: string;
      title: string;
      silent: boolean;
    }
  | {
      kind: "resource";
      lng: number;
      lat: number;
      id: string;
      title: string;
      subtitle: string;
    };

const ACCRA = { longitude: -0.187, latitude: 5.6037 };

export function MapView() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [data, setData] = useState<{
    incidents: MapIncident[];
    resources: MapResource[];
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/map-data");
      if (!res.ok) throw new Error("map_data_failed");
      const json = (await res.json()) as {
        incidents: MapIncident[];
        resources: MapResource[];
      };
      setData(json);
    } catch {
      setLoadError("Could not load map data.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loadError) {
    return <p className="text-sm text-destructive">{loadError}</p>;
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">Loading map…</p>;
  }

  if (!token) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          Set <code className="rounded bg-muted px-1">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> in{" "}
          <code className="rounded bg-muted px-1">.env.local</code> to show the interactive map.
        </p>
        <SummaryLists incidents={data.incidents} resources={data.resources} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[min(70vh,560px)] w-full overflow-hidden rounded-xl border border-border">
        <Map
          mapboxAccessToken={token}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          initialViewState={{
            ...ACCRA,
            zoom: 11,
          }}
          style={{ width: "100%", height: "100%" }}
          onClick={() => setPopup(null)}
        >
          <NavigationControl position="top-right" />
          {data.incidents.map((i) => (
            <Marker
              key={`i-${i.id}`}
              longitude={i.lng}
              latitude={i.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent?.stopPropagation();
                setPopup({
                  kind: "incident",
                  lng: i.lng,
                  lat: i.lat,
                  id: i.id,
                  title: i.isSilentSecurity ? "Incident (silent)" : `Incident · ${i.type}`,
                  silent: i.isSilentSecurity,
                });
              }}
            >
              <span
                className={cn(
                  "block size-4 cursor-pointer rounded-full border-2 border-white shadow-md",
                  i.isSilentSecurity ? "bg-amber-600" : "bg-orange-500",
                )}
                title="Incident"
              />
            </Marker>
          ))}
          {data.resources.map((r) => (
            <Marker
              key={`r-${r.id}`}
              longitude={r.lng}
              latitude={r.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent?.stopPropagation();
                setPopup({
                  kind: "resource",
                  lng: r.lng,
                  lat: r.lat,
                  id: r.id,
                  title: r.name,
                  subtitle: r.kind,
                });
              }}
            >
              <span
                className="block size-4 cursor-pointer rounded-full border-2 border-white bg-emerald-600 shadow-md"
                title={r.name}
              />
            </Marker>
          ))}
          {popup && (
            <Popup
              longitude={popup.lng}
              latitude={popup.lat}
              anchor="top"
              onClose={() => setPopup(null)}
              closeButton
              closeOnClick={false}
            >
              <div className="max-w-xs p-1 text-sm">
                <p className="font-medium text-foreground">{popup.title}</p>
                {popup.kind === "resource" && (
                  <p className="text-muted-foreground capitalize">{popup.subtitle}</p>
                )}
                {popup.kind === "incident" && !popup.silent && (
                  <Link
                    href={`/incidents/${popup.id}`}
                    className="mt-2 inline-block text-primary underline underline-offset-4"
                  >
                    View details
                  </Link>
                )}
                {popup.kind === "incident" && popup.silent && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Location is approximate; details are limited for safety.
                  </p>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <SummaryLists incidents={data.incidents} resources={data.resources} />
    </div>
  );
}

function SummaryLists({
  incidents,
  resources,
}: {
  incidents: MapIncident[];
  resources: MapResource[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Recent incidents (pins)</h2>
        <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-xs text-muted-foreground">
          {incidents.length === 0 && <li>None yet.</li>}
          {incidents.slice(0, 12).map((i) => (
            <li key={i.id}>
              {!i.isSilentSecurity ? (
                <Link className="text-primary underline" href={`/incidents/${i.id}`}>
                  {i.type}
                </Link>
              ) : (
                <span>Silent incident</span>
              )}
              {" · "}
              {new Date(i.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-foreground">Resources</h2>
        <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-xs text-muted-foreground">
          {resources.length === 0 && <li>None yet — add an AED or other point.</li>}
          {resources.slice(0, 12).map((r) => (
            <li key={r.id}>
              <span className="font-medium text-foreground">{r.name}</span> ({r.kind})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
