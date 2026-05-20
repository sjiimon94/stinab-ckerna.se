import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function proxy(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;

  // If no password is configured, deny access entirely
  if (!password) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  // The admin page handles auth via sessionStorage / API calls.
  // We allow the page through and let the client-side login form handle
  // credential validation against the API.
  // The /api/admin/* routes are protected independently in each route handler.
  return NextResponse.next();
}
