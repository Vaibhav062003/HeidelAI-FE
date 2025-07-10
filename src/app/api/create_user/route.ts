export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`https://api.clerk.com/v1/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data.errors?.[0]?.message || "Failed to create user",
        details: data,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('User creation error:', error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}