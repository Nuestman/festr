import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let env: ReturnType<typeof getEnv>;
  try {
    env = getEnv();
  } catch {
    return Response.json({ error: "server_misconfigured" }, { status: 503 });
  }

  const token = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    return Response.json({ error: "mapbox_not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return Response.json({ error: "query_required" }, { status: 400 });
  }

  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`,
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "5");

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  if (!res.ok) {
    return Response.json({ error: "geocode_upstream_failed" }, { status: 502 });
  }

  const data = (await res.json()) as {
    features?: Array<{
      center: [number, number];
      place_name: string;
    }>;
  };

  const features =
    data.features?.map((f) => ({
      lng: f.center[0],
      lat: f.center[1],
      label: f.place_name,
    })) ?? [];

  return Response.json({ features });
}
