import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

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

  let body: { sent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.sent !== "boolean") {
    return NextResponse.json(
      { error: "sent field must be a boolean" },
      { status: 400 }
    );
  }

  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    const orders = JSON.parse(content) as Array<{ id: string; sent: boolean }>;
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    orders[index].sent = body.sent;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return NextResponse.json(orders[index]);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
