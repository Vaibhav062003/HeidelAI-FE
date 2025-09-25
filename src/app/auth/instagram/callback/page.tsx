"use client"

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from "@/lib/session_api";

function InstagramCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Processing Instagram authorization...");

  useEffect(() => {
    if (!searchParams) return; // early return if searchParams is null
  
    const code = searchParams.get('code');
  
    if (!code) {
      setStatus('error');
      setMessage("Missing required parameters from Instagram.");
      toast.error("Instagram connection failed: Missing parameters");
      return;
    }
  
    const exchangeCodeForToken = async () => {
      try {
        const response = await api.post('/api/instagram/auth', {
            code,
            // redirect_uri: `${window.location.origin}/auth/instagram/callback`,
            redirect_uri: `https://development.heidelai.com/auth/instagram/callback`,
          });

          console.log('Instagram auth response:', response);
  
          if (response.status !== 200) {
            let errorMessage = 'Failed to connect Instagram account';
            const errorData = response.data;

            if (errorData && typeof errorData === 'object' && errorData.detail) {
              errorMessage = errorData.detail;
            } else if (typeof errorData === 'string' && errorData.length < 100) {
              errorMessage = errorData;
            }

            throw new Error(errorMessage);
          }
  
        const data = response.data

        localStorage.setItem('instagram_connection', JSON.stringify({
          username: data.username,
          profileImage: data.profile_picture,
          userId: data.user_id,
          connected: true,
        }));
  
        localStorage.setItem('instagram_user_id', data.user_id);
  
        setStatus('success');
        setMessage("Instagram connected successfully!");
        toast.success("Instagram account connected successfully");
  
        setTimeout(() => {
          router.push('/dashboard#integrations');
        }, 2000);
      } catch (error) {
        console.error('Error exchanging Instagram code:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        toast.error(`Instagram connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  
        setTimeout(() => {
          router.push('/dashboard#integrations');
        }, 3000);
      }
    };
  
    exchangeCodeForToken();
    localStorage.removeItem('instagram_auth_state');
  }, [searchParams, router]);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
            </div>
            <h1 className="text-xl font-semibold mb-2">Connecting Instagram</h1>
            <p className="text-gray-600">Please wait while we complete the connection process...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Connection Successful!</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting you back to settings...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Connection Failed</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting you back to settings...</p>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function CallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        </div>
        <h1 className="text-xl font-semibold mb-2">Loading</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}

export default function InstagramCallback() {
  return (
    <Suspense fallback={<CallbackLoading />}>
      <InstagramCallbackContent />
    </Suspense>
  );
}