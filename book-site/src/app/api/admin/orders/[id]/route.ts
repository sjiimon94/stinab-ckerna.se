import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const auth = req.headers.get("authorization");
  if (!auth) return false;
  const [scheme, token] = auth.split(" ");
  return scheme === "Bearer" && token === password;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { sent?: boolean; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.sent !== undefined && typeof body.sent !== "boolean") {
    return NextResponse.json(
      { error: "sent field must be a boolean" },
      { status: 400 }
    );
  }

  const updates: { sent?: boolean; sent_at?: string | null; notes?: string } =
    {};

  if (typeof body.sent === "boolean") {
    updates.sent = body.sent;
    // Automatically set/clear sent_at timestamp
    updates.sent_at = body.sent ? new Date().toISOString() : null;
  }

  if (typeof body.notes === "string") {
    updates.notes = body.notes;
  }

  try {
    const order = await updateOrder(id, updates);
    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
