'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/components/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InstagramCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your Instagram connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setStatus('error');
          setMessage('Authentication failed: No valid session found');
          setTimeout(() => {
            router.push('/dashboard');
            toast.error('Instagram connection failed: Authentication error');
          }, 1500);
          return;
        }
        
        // Get access token from the session
        const accessToken = session.provider_token;
        const userId = session.user.id;
        
        if (!accessToken) {
          setStatus('error');
          setMessage('No access token received from Facebook/Instagram');
          setTimeout(() => {
            router.push('/dashboard');
            toast.error('Instagram connection failed: No access token received');
          }, 1500);
          return;
        }
        
        // Call your backend to save the token and get account info
        const response = await fetch('https://egenie-whatsapp.koyeb.app/instagram/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            access_token: accessToken,
            user_id: userId,
            redirect_uri: 'https://heidelai.com/auth/instagram/callback'
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Authentication failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
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
        
        // Redirect back to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
          toast.success('Instagram account connected successfully!');
        }, 1500);
      } catch (error) {
        console.error('Error in Instagram callback:', error);
        setStatus('error');
        setMessage('Failed to complete Instagram connection');
        
        setTimeout(() => {
          router.push('/dashboard');
          toast.error('Instagram connection failed. Please try again.');
        }, 1500);
      }
    };

    // Only proceed if we have a code in the URL
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
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
        </div>
      </div>
    </div>
  );
}