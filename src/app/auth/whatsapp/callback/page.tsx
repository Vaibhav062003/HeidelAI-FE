'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WhatsAppCallback() {
  const router = useRouter();
  
  useEffect(() => {
    // Extract code and state from URL
    const { code, state } = router.query;
    
    // Post message back to opener if it exists
    if (window.opener && code && state) {
      window.opener.postMessage({
        type: 'WHATSAPP_AUTH_CALLBACK',
        code,
        state
      }, window.location.origin);
      
      // Close this popup window
      window.close();
    } else if (code && state) {
      // If no opener (direct navigation), redirect to main app with params
      window.location.href = `/?code=${code}&state=${state}`;
    } else {
      // Error case - redirect to main app
      window.location.href = '/';
    }
  }, [router.query]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-xl font-bold mb-4">Connecting WhatsApp...</h1>
        <p>Please wait while we complete your authentication.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}