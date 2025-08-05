export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const invitation_id = searchParams.get('invitation_id');
  if (invitation_id) {
    // Revoke invite
    return await RevokeInvite(request);
  } else {
    // Invite agent
    return await handleInviteAgent(request);
  }
}

export async function GET(request: Request) {
  // Fetch both members and invited agents in parallel
  const [membersRes, invitedRes] = await Promise.all([
    handleFetchMembers(request),
    handleInvitedAgents(request),
  ]);

  const membersData = await membersRes.json();
  const invitedData = await invitedRes.json();
  

  // If either failed, return the error (prefer members error if both failed)
  if (!membersRes.ok) {
    return new Response(JSON.stringify({ error: membersData?.error || 'Failed to fetch members', details: membersData }), { status: membersRes.status });
  }
  if (!invitedRes.ok) {
    return new Response(JSON.stringify({ error: invitedData?.error || 'Failed to fetch invited agents', details: invitedData }), { status: invitedRes.status });
  }

  // Return both in a single response
  return new Response(
    JSON.stringify({
      members: membersData.data || [],
      invited: invitedData.data || [],
    }),
    { status: 200 }
  );
}

async function handleInviteAgent(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('org_id');
    const body = await request.json();
    const email_address = body.email_address;
    const role = body.role;
    if (!organization_id || !email_address || !role) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const clerkUrl = `https://api.clerk.com/v1/organizations/${organization_id}/invitations`;
    const response = await fetch(clerkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.errors?.[0]?.long_message || 'External API error',
        details: data
      }), { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : error }), { status: 500 });
  }
}

async function handleFetchMembers(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('org_id');
    if (!organization_id) {
      return new Response(JSON.stringify({ error: "Missing organization_id" }), { status: 400 });
    }

    const clerkUrl = `https://api.clerk.com/v1/organizations/${organization_id}/memberships`;
    const response = await fetch(clerkUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.errors?.[0]?.long_message || 'External API error',
        details: data
      }), { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : error }), { status: 500 });
  }
}


export async function DELETE (request: Request){
  return handleDeleteMember(request); 
}

async function handleDeleteMember(request: Request): Promise<Response> {
  try{
    const {searchParams} = new URL(request.url)
    const organizationId = searchParams.get('org_id');
    const userId = searchParams.get('user_id');

    if (!organizationId || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const clerkUrl = `https://api.clerk.com/v1/organizations/${organizationId}/memberships/${userId}`;

    const response = await fetch(clerkUrl,{
      method : 'DELETE',
      headers:{
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
      }
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.errors?.[0]?.long_message || 'External API error',
        details: data
      }), { status: response.status });
    } 

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : error }), { status: 500 });
  } 
}


export const handleInvitedAgents = async (request: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('org_id');
    if (!organization_id) {
      return new Response(JSON.stringify({ error: "Missing organization_id" }), { status: 400 });
    }

    const clerkUrl = `https://api.clerk.com/v1/organizations/${organization_id}/invitations`;
    const response = await fetch(clerkUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.errors?.[0]?.long_message || 'External API error',
        details: data
      }), { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : error }), { status: 500 });
  }
}


export const RevokeInvite = async (request: Request): Promise<Response> => {
  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get('org_id');
    const invitation_id = searchParams.get('invitation_id');
    const body = await request.json();
    if (!organization_id || !invitation_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const clerkUrl = `https://api.clerk.com/v1/organizations/${organization_id}/invitations/${invitation_id}/revoke`;
    const response = await fetch(clerkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_TOKEN_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requesting_user_id: body.requesting_user_id || null
      })

    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.errors?.[0]?.long_message || 'External API error',
        details: data
      }), { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : error }), { status: 500 });
  }
}