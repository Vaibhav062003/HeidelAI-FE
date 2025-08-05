import { auth } from "@clerk/nextjs/server"

export const getSessionToken = async ()=>{
   const { sessionId } = await auth()

  const response = await fetch(`https://api.clerk.com/v1/sessions/${sessionId}/tokens`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLERK_API_KEY}`
    },
    body: JSON.stringify({
      expires_in_seconds: 60
    })
  })

  if (!response.ok){
    throw new Error(`Failed to fetch session token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}