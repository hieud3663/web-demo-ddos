import { NextResponse } from "next/server";

export async function GET() {
  // Simple endpoint to test server responsiveness
  return NextResponse.json({ status: "ok", timestamp: Date.now() });
}
