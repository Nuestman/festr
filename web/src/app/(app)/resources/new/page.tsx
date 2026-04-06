import type { Metadata } from "next";
import Link from "next/link";

import { AddResourceForm } from "@/components/app/add-resource-form";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Add resource — FESTR",
};

export default function NewResourcePage() {
  return (
    <div className="space-y-8">
      <p>
        <Link
          href="/map"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Map
        </Link>
      </p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Add a resource</h1>
        <p className="text-muted-foreground leading-relaxed">
          Crowdsourced points (e.g. AEDs). Geocoding uses Mapbox when{" "}
          <code className="rounded bg-muted px-1">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> is set.
          Photos use Vercel Blob when{" "}
          <code className="rounded bg-muted px-1">BLOB_READ_WRITE_TOKEN</code> is set.
        </p>
      </div>
      <AddResourceForm />
    </div>
  );
}
