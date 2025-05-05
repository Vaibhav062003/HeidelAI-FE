'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InstagramCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your Instagram authorization...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('error');
          setMessage('No authorization code received from Instagram');
          setTimeout(() => {
            router.push('/dashboard');
            toast.error('Instagram connection failed: No authorization code received');
          }, 1500);
          return;
        }
        
        // Process the code here with our dedicated Instagram API
        setStatus('processing');
        setMessage('Connecting your Instagram account...');
        
        try {
          // Call your backend to exchange the code for token and account info
          const response = await fetch('https://egenie-whatsapp.koyeb.app/instagram/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              code,
              redirect_uri: 'https://www.heidelai.com/auth/instagram/callback'
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Authentication failed: ${response.statusText}`);
          }
          
          const data = await response.json();
          
          // Store the Instagram connection data in localStorage
          localStorage.setItem('instagram_connection', JSON.stringify({
            username: data.username,
            profileImage: data.profile_picture || '/default-avatar.png',
            token: data.access_token,
            userId: data.user_id,
            businessInfo: data.business_info || {},
            connected: true
          }));
          
          // Also store Instagram ID separately for quick lookups later
          localStorage.setItem('instagram_user_id', data.user_id);
          
          // Link this Instagram account to the current app user if a user ID exists
          const appUserId = localStorage.getItem('user_id');
          if (appUserId) {
            try {
              await fetch('https://egenie-whatsapp.koyeb.app/instagram/link-user', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  instagram_id: data.user_id,
                  app_user_id: appUserId
                }),
              });
            } catch (linkError) {
              // If linking fails, we can still continue - the connection exists in the Instagram collection
              console.error('Error linking Instagram to user:', linkError);
            }
          }
          
          setStatus('success');
          setMessage('Instagram account connected successfully!');
          
          // Redirect to dashboard with success message after showing success UI
          setTimeout(() => {
            router.push('/dashboard');
            toast.success('Instagram account connected successfully!');
          }, 1500);
          
        } catch (error) {
          console.error('Error processing Instagram code:', error);
          setStatus('error');
          setMessage('Failed to connect Instagram account: ' + (error instanceof Error ? error.message : 'Unknown error'));
          setTimeout(() => {
            router.push('/dashboard');
            toast.error('Failed to connect Instagram account. Please try again.');
          }, 1500);
        }
        
      } catch (error) {
        console.error('Error in Instagram callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => {
          router.push('/dashboard');
          toast.error('An unexpected error occurred while connecting Instagram.');
        }, 1500);
      }
    };
    
    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
            <h1 className="text-xl font-bold">Processing Your Instagram Authorization</h1>
            <p className="text-gray-600">{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold">Connection Successful!</h1>
            <p className="text-green-600 font-medium">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500">
            <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
            <p>{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}