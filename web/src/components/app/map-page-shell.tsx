"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const MapView = dynamic(
  () => import("@/components/app/map-view").then((m) => ({ default: m.MapView })),
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading map…</p> },
);

export function MapPageShell() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Map</h1>
          <p className="text-muted-foreground leading-relaxed">
            Incidents and community resources. Pins are approximate; silent incidents show limited
            detail.
          </p>
        </div>
        <Link
          href="/resources/new"
          className={cn(buttonVariants({ variant: "default", size: "default" }), "shrink-0")}
        >
          Add resource
        </Link>
      </div>
      <MapView />
    </div>
  );
}
