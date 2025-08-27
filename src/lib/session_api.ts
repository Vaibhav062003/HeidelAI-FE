import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL
  baseURL: "https://egenie-whatsapp.koyeb.app"
})

api.interceptors.request.use(async (config) =>{
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) throw new Error("Session ID not found in localStorage");

  const res = await fetch("api/session-token",{
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({sessionId})
  })
  const { token: sessionToken } = await res.json();

  config.headers.Authorization = `Bearer ${sessionToken}`;
  return config;
})

export default api;

