'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
          setTimeout(() => router.push('/settings'), 2000);
          return;
        }
        
        // Add the code to the URL as a special parameter and redirect to settings
        // This way the InstagramDialog component will pick it up
        router.push(`/settings?instagram_code=${code}`);
        
      } catch (error) {
        console.error('Error in Instagram callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        setTimeout(() => router.push('/settings'), 2000);
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
            <h1 className="text-xl font-bold">Processing Your Authorization</h1>
            <p className="text-gray-600">
              Please wait while we finish connecting your Instagram account...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-500">
            <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
            <p>{message}</p>
            <p className="mt-4 text-sm text-gray-500">Redirecting you back...</p>
          </div>
        )}
      </div>
    </div>
  );
}