import { NextResponse } from 'next/server';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

export async function POST(request: Request) {
  try {
    const { shopName, accessToken } = await request.json();

    const shopify = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY || '',
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      scopes: [],
      hostName: shopName,
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
    });
    
    const client = new shopify.clients.Rest({domain: shopName, accessToken});

    // Test the connection by fetching products
    const response = await client.get({
      path: 'products',
      query: { limit: 3 }
    });

    return NextResponse.json({ 
      success: true, 
      data: response.body.products 
    });

  } catch (error) {
    console.error('Shopify API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to connect to Shopify' 
    }, { status: 500 });
  }
}