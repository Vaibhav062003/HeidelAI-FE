import { NextResponse } from "next/server";
import { getSessionToken } from "@/components/utils/clerkSession";

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = await getSessionToken(sessionId);
    // Return as { token: ... } for frontend compatibility
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get session token" }, { status: 500 });
  }
}