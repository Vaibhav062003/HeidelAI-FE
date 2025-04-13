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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for Instagram code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          setSuccessMessage("Instagram authorization code received. Processing...");
          
          try {
            // Call backend to exchange code for token
            const response = await fetch('https://egenie-whatsapp.koyeb.app/instagram/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to authenticate with Instagram');
            }
            
            const data = await response.json();
            
            // Store the connection info with additional business data
            localStorage.setItem('instagram_connection', JSON.stringify({
              username: data.username,
              profileImage: data.profile_picture || '/default-avatar.png',
              token: data.access_token,
              userId: data.user_id,
              businessInfo: data.business_info || {}
            }));
            
            setSuccessMessage("Instagram account connected successfully!");
            
            // Redirect to dashboard page after successful connection
            setTimeout(() => router.push('/dashboard'), 1500);
            return;
          } catch (err) {
            console.error('Error processing Instagram code:', err);
            setError('Failed to connect Instagram account');
            setTimeout(() => router.push('/settings?error=instagram'), 2000);
            return;
          }
        }
        
        // If no Instagram code, check Supabase auth
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError('Authentication failed');
          setTimeout(() => router.push('/settings?error=auth'), 2000);
          return;
        }
        
        if (data?.session) {
          // Extract provider token if present
          const { provider_token } = data.session;
          
          if (provider_token) {
            setSuccessMessage("Authentication successful!");
            setTimeout(() => router.push('/dashboard'), 1500);
          } else {
            router.push('/dashboard');
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
            {successMessage ? (
              <p className="text-green-600 font-medium">{successMessage}</p>
            ) : (
              <p className="text-gray-600">
                Please wait while we finish connecting your account...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}