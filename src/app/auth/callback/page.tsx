'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Authentication failed');
          setTimeout(() => router.push('/settings?error=auth'), 2000);
          return;
        }
        
        if (data?.session) {
          // Extract the user info and Instagram token
          const { provider_token, provider_refresh_token } = data.session;
          
          if (provider_token) {
            try {
              // Get Instagram user profile if needed
              const response = await fetch('https://graph.instagram.com/me?fields=id,username', {
                headers: {
                  Authorization: `Bearer ${provider_token}`
                }
              });
              
              const instagramData = await response.json();
              
              // Store connection info in localStorage or your backend
              localStorage.setItem('instagram_connection', JSON.stringify({
                username: instagramData.username,
                userId: instagramData.id,
                token: provider_token,
                refresh_token: provider_refresh_token
              }));
              
              // Redirect to settings with success message
              router.push('/settings?success=instagram');
            } catch (err) {
              console.error('Error fetching Instagram data:', err);
              setError('Failed to get Instagram profile');
              setTimeout(() => router.push('/settings?error=profile'), 2000);
            }
          } else {
            // No provider token found
            setError('No Instagram access token received');
            setTimeout(() => router.push('/settings?error=no-token'), 2000);
          }
        } else {
          setError('No session found');
          setTimeout(() => router.push('/settings?error=no-session'), 2000);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setTimeout(() => router.push('/settings?error=unknown'), 2000);
      }
    };
    
    // Process the callback
    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {error ? (
          <div className="text-red-500">
            <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
            <p>{error}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting you back...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
            <h1 className="text-xl font-bold">Processing Your Authorization</h1>
            <p className="text-gray-600">
              Please wait while we finish connecting your Instagram account...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}