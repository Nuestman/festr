import { authApiHandler } from "@neondatabase/auth/next/server";
import { NextResponse } from "next/server";

type AuthParams = { path: string[] };

const handlers = process.env.NEON_AUTH_BASE_URL ? authApiHandler() : null;

function authNotConfigured() {
  return NextResponse.json(
    {
      error: "auth_not_configured",
      message:
        "Set NEON_AUTH_BASE_URL (and related Neon Auth env vars) to enable /api/auth.",
    },
    { status: 503 },
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<AuthParams> },
) {
  if (!handlers) return authNotConfigured();
  return handlers.GET(request, context);
}

export async function POST(
  request: Request,
  context: { params: Promise<AuthParams> },
) {
  if (!handlers) return authNotConfigured();
  return handlers.POST(request, context);
}

export async function PUT(
  request: Request,
  context: { params: Promise<AuthParams> },
) {
  if (!handlers) return authNotConfigured();
  return handlers.PUT(request, context);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<AuthParams> },
) {
  if (!handlers) return authNotConfigured();
  return handlers.DELETE(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<AuthParams> },
) {
  if (!handlers) return authNotConfigured();
  return handlers.PATCH(request, context);
}
