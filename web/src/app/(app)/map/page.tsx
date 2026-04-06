import type { Metadata } from "next";

import { MapPageShell } from "@/components/app/map-page-shell";

export const metadata: Metadata = {
  title: "Map — FESTR",
};

export default function MapPage() {
  return <MapPageShell />;
}
