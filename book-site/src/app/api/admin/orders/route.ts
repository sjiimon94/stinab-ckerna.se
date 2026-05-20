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
  // Expect "Bearer <password>"
  const [scheme, token] = auth.split(" ");
  return scheme === "Bearer" && token === password;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return NextResponse.json([]);
    }
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    const orders = JSON.parse(content);
    // Sort newest first
    orders.sort(
      (a: { createdAt: string }, b: { createdAt: string }) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to read orders" },
      { status: 500 }
    );
  }
}
