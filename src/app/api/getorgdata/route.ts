import { NextResponse } from "next/server";

const token = process.env.CLERK_TOKEN_KEY;

export async function GET() {
  try{
    const response = await fetch(`https://api.clerk.com/v1/organization_memberships`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    });
  }
  catch (error) {
    console.error('Organization data fetch error:', error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
    });
  }
}