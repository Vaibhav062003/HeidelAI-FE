import { WhatsAppTemplate } from "@/components/types/template";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://egenie-whatsapp.koyeb.app/api/fetch_templates", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`External api error: ${response.status}`);
    }

    const data: any = await response.json(); 
   

    const templates: WhatsAppTemplate[] = data.data || [];

    return NextResponse.json(templates, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
    });
  }
}