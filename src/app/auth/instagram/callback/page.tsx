'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Create a separate component that uses useSearchParams
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your Instagram connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for access token in URL fragment or search params
        // Facebook/Instagram often return tokens in URL fragments (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token') || 
                           searchParams.get('access_token') || 
                           searchParams.get('code');
        
        console.log("URL hash:", window.location.hash);
        console.log("Access token in URL:", accessToken ? "Found" : "Not found");
        
        if (!accessToken) {
          setStatus('error');
          setMessage('No access token received from Instagram. Please try again.');
          setTimeout(() => {
            router.push('/dashboard');
            toast.error('Instagram connection failed: No access token received');
          }, 2500);
          return;
        }
        
        // Process the long-lived token if it exists
        const longLivedToken = hashParams.get('long_lived_token') || accessToken;
        const userId = hashParams.get('user_id') || searchParams.get('user_id') || 'unknown';
        
        console.log("Found token type:", longLivedToken === accessToken ? "Standard token" : "Long-lived token");
        
        // Call your backend to save the token and get account info
        const response = await fetch('https://egenie-whatsapp.koyeb.app/instagram/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            access_token: longLivedToken,
            user_id: userId,
            redirect_uri: 'https://heidelai.com/auth/instagram/callback'
          }),
        });
        
        if (!response.ok) {
          console.error("API response status:", response.status);
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`Authentication failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("API success response:", data);
        
        // Store connection data in localStorage
        localStorage.setItem('instagram_connection', JSON.stringify({
          username: data.username,
          profileImage: data.profile_picture,
          token: data.access_token,
          userId: data.user_id,
          businessInfo: data.business_info || {},
          connected: true
        }));
        
        // Also store the Instagram ID separately for future quick lookups
        localStorage.setItem('instagram_user_id', data.user_id);
        
        setStatus('success');
        setMessage('Instagram connected successfully!');
        
        // Redirect back to dashboard after a delay
        setTimeout(() => {
          router.push('/dashboard');
          toast.success('Instagram account connected successfully!');
        }, 2000);
      } catch (error) {
        console.error('Error in Instagram callback:', error);
        setStatus('error');
        setMessage(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        setTimeout(() => {
          router.push('/dashboard');
          toast.error('Instagram connection failed. Please try again.');
        }, 2500);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      {status === 'loading' && (
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      )}
      
      {status === 'success' && (
        <div className="rounded-full bg-green-100 p-3">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      {status === 'error' && (
        <div className="rounded-full bg-red-100 p-3">
          <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-gray-900">
        {status === 'loading' ? 'Connecting Your Instagram Account' :
         status === 'success' ? 'Connected Successfully!' :
         'Connection Failed'}
      </h2>
      
      <p className="text-gray-600">{message}</p>
      
      {status === 'error' && (
        <div className="mt-4 space-y-4">
          <details className="text-left text-xs">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">Debug Information</summary>
            <div className="mt-2 rounded bg-gray-100 p-2">
              <p>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p>Hash: {typeof window !== 'undefined' ? window.location.hash : 'N/A'}</p>
              <p>Search: {typeof window !== 'undefined' ? window.location.search : 'N/A'}</p>
            </div>
          </details>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      <h2 className="text-2xl font-bold text-gray-900">Loading Instagram Callback...</h2>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function InstagramCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <Suspense fallback={<LoadingFallback />}>
          <CallbackContent />
        </Suspense>
      </div>
    </div>
  );
}

// Prevent static generation of this page
export const dynamic = 'force-dynamic';