
export async function POST(request: Request) {
  try{
    const body = await request.json();

    const response = await fetch('https://api.clerk.com/v1/organizations/{organization_id}/invitations', {
      method: 'POST',
      headers:{
        Authentication: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  catch (error) {
    console.error('Invite agent error:', error);    
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
