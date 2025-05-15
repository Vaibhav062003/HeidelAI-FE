import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function InstagramCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState("Processing Instagram authorization...");

  useEffect(() => {
    // Process the Instagram callback as soon as the component mounts and URL params are available
    const { code, state } = router.query;
    
    if (!code || !state) {
      // Wait for query parameters to be available
      if (Object.keys(router.query).length > 0) {
        setStatus('error');
        setMessage("Missing required parameters from Instagram.");
        toast.error("Instagram connection failed: Missing parameters");
      }
      return;
    }

    // Validate state parameter to prevent CSRF
    const storedState = localStorage.getItem('instagram_auth_state');
    if (state !== storedState) {
      setStatus('error');
      setMessage("Invalid state parameter. Authentication attempt may have been compromised.");
      toast.error("Instagram connection failed: Security validation failed");
      return;
    }

    // Exchange the code for an access token
    const exchangeCodeForToken = async () => {
      try {
        // Call your backend endpoint to exchange the code
        const response = await fetch('https://egenie-whatsapp.koyeb.app/instagram/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/instagram/callback`,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          
          // Parse error message if possible
          let errorMessage = 'Failed to connect Instagram account';
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.detail) {
              errorMessage = errorJson.detail;
            }
          } catch {
            if (errorText && errorText.length < 100) {
              errorMessage = errorText;
            }
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Store connection data in localStorage
        localStorage.setItem('instagram_connection', JSON.stringify({
          username: data.username,
          profileImage: data.profile_picture || '/default-avatar.png',
          token: data.access_token,
          userId: data.user_id,
          businessInfo: data.business_info || {},
          connected: true
        }));
        
        // Store Instagram ID separately for future quick lookups
        localStorage.setItem('instagram_user_id', data.user_id);
        
        setStatus('success');
        setMessage("Instagram connected successfully!");
        toast.success("Instagram account connected successfully");
        
        // Redirect back to the settings page after a short delay
        setTimeout(() => {
          router.push('/settings#integrations');
        }, 2000);
        
      } catch (error) {
        console.error('Error exchanging Instagram code:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        toast.error(`Instagram connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Redirect to the settings page after a longer delay
        setTimeout(() => {
          router.push('/settings#integrations');
        }, 3000);
      }
    };

    exchangeCodeForToken();
    
    // Clean up state parameter after use
    localStorage.removeItem('instagram_auth_state');
    
  }, [router.query, router]);

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