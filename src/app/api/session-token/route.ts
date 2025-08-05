import { NextResponse } from "next/server";
import { getSessionToken } from "@/components/utils/clerkSession";

export async function GET() {
  try {
    const token = await getSessionToken();
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get session token" }, { status: 500 });
  }
}