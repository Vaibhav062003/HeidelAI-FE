import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; 
import { WhatsAppLogo } from '@/components/icons/WhatsappLogo';
import WhatsAppProfileView from '@/components/setting_tab/WhatAppProfileView'; // Add this import


// WhatsApp app configuration
const WHATSAPP_CLIENT_ID = '509681741462833';
const WHATSAPP_CONFIG_ID = '1209365947547146';
const WHATSAPP_REDIRECT_URI = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/whatsapp/callback`;

// Add this utility function near the top of your file
export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  
  // Remove any non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // US format: +1 (XXX) XXX-XXXX
  if (digitsOnly.startsWith('1') && digitsOnly.length === 11) {
    return `+1 (${digitsOnly.substring(1, 4)}) ${digitsOnly.substring(4, 7)}-${digitsOnly.substring(7)}`;
  }
  
  // India format: +91 XXXXX XXXXX
  if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
    return `+91 ${digitsOnly.substring(2, 7)} ${digitsOnly.substring(7)}`;
  }
  
  // Default international format with country code
  if (digitsOnly.length > 7) {
    // Try to extract country code (1-3 digits)
    const countryCodeLength = digitsOnly.length > 10 ? (digitsOnly.length - 10) : 2;
    return `+${digitsOnly.substring(0, countryCodeLength)} ${digitsOnly.substring(countryCodeLength)}`;
  }
  
  // If all else fails, just return with + prefix
  return `+${digitsOnly}`;
};

const WhatsAppLoginDialog = () => {
  const [connected, setConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{
    name: string;
    phone: string;
    businessInfo?: {
      account_type?: string;
      status?: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileView, setShowProfileView] = useState(false);
  
  // Check if user has already connected WhatsApp
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      
      try {
        // Check localStorage for quick loading
        const whatsappConnection = localStorage.getItem('whatsapp_connection');
        if (whatsappConnection) {
          const parsed = JSON.parse(whatsappConnection);
          if (parsed.connected) {
            setConnected(true);
            setAccountInfo({
              name: parsed.name,
              phone: parsed.phone,
              businessInfo: parsed.businessInfo
            });
            setIsLoading(false);
            return;
          }
        }
        
        // Check for callback in URL (for popup return cases handled via event listener)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (code && state && state === localStorage.getItem('whatsapp_auth_state')) {
          await handleWhatsAppCallback(code);
          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          setIsLoading(false);
          return;
        }
        
        // Check for connections linked to this user
        const storedWhatsAppId = localStorage.getItem('whatsapp_user_id');
        
        if (storedWhatsAppId) {
          // Fetch account info from backend
          const response = await fetch(`https://egenie-whatsapp.koyeb.app/api/whatsapp/status?user_id=${storedWhatsAppId}`);
          
          if (response.ok) {
            const data = await response.json();
            setConnected(true);
            setAccountInfo({
              name: data.name,
              phone: data.phone,
              businessInfo: data.business_info || {}
            });
            
            // Update localStorage with latest info
            localStorage.setItem('whatsapp_connection', JSON.stringify({
              connected: true,
              name: data.name,
              phone: data.phone,
              businessInfo: data.business_info
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching WhatsApp status from backend:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();

    // Listen for messages from popup window
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== window.location.origin) return;
      // Handle auth data from popup
      if (event.data && event.data.type === 'WHATSAPP_AUTH_CALLBACK') {
        const { code, state } = event.data;
        if (code && state === localStorage.getItem('whatsapp_auth_state')) {
          handleWhatsAppCallback(code);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Process the auth callback code
  const handleWhatsAppCallback = async (code: string) => {
    try {
      setIsLoading(true);
      
      // Exchange authorization code for access token via backend
      const response = await fetch('https://egenie-whatsapp.koyeb.app/api/whatsapp/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          redirect_uri: WHATSAPP_REDIRECT_URI
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange code for access token');
      }
      
      const data = await response.json();
      
      // Store data in localStorage
      localStorage.setItem('whatsapp_connection', JSON.stringify({
        name: data.name,
        phone: data.phone,
        userId: data.user_id,
        businessInfo: data.business_info || {},
        connected: true
      }));
      
      // Store WhatsApp ID separately for quick lookups
      localStorage.setItem('whatsapp_user_id', data.user_id);
      
      setConnected(true);
      setAccountInfo({
        name: data.name,
        phone: data.phone,
        businessInfo: data.business_info || {}
      });
      
      // Replace the ui/toast with sonner toast
      toast.success("WhatsApp connected successfully!", {
        description: "You can now receive and manage WhatsApp messages in HeidelAI"
      });
    } catch (error) {
      console.error('Error processing WhatsApp auth callback:', error);
      toast.error("Connection Failed", {
        description: "Could not connect WhatsApp account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to initiate WhatsApp login in a popup window
  const handleWhatsAppLogin = () => {
    try {
      // Generate a random state to prevent CSRF attacks
      const state = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('whatsapp_auth_state', state);
      
      // Build WhatsApp authorization URL
      const authUrl = new URL('https://www.facebook.com/v23.0/dialog/oauth');
      authUrl.searchParams.append('display', 'popup');
      authUrl.searchParams.append('client_id', WHATSAPP_CLIENT_ID);
      authUrl.searchParams.append('redirect_uri', WHATSAPP_REDIRECT_URI);
      authUrl.searchParams.append('config_id', WHATSAPP_CONFIG_ID);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('auth_type', '');
      authUrl.searchParams.append('override_default_response_type', 'true');
      authUrl.searchParams.append('extras', JSON.stringify({
        "featureType": "whatsapp_business_app_onboarding",
        "sessionInfoVersion": "3",
        "version": "v3"
      }));
      
      // Open popup window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const popup = window.open(
        authUrl.toString(),
        'whatsapp_auth_popup',
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      
      // Create a checker that will periodically check if the popup is closed or redirected
      const popupChecker = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(popupChecker);
          setIsLoading(false);
          
          // If popup was closed without successful auth
          if (!localStorage.getItem('whatsapp_user_id')) {
            // In the popup checker:
            toast.info("Authentication Canceled", {
              description: "WhatsApp connection was canceled."
            });
          }
        } else {
          // Try to detect the redirect to callback URL within the popup
          try {
            // This will throw if popup is on a different origin due to same-origin policy
            const currentUrl = popup.location.href;
            
            // If we can access the URL and it contains our callback
            if (currentUrl.includes('auth/whatsapp/callback')) {
              const urlObj = new URL(currentUrl);
              const code = urlObj.searchParams.get('code');
              const state = urlObj.searchParams.get('state');
              
              if (code && state === localStorage.getItem('whatsapp_auth_state')) {
                // Process the code
                handleWhatsAppCallback(code);
                // Close the popup
                popup.close();
                clearInterval(popupChecker);
              }
            }
          } catch (e) {
            // Cannot access popup location due to same-origin policy
            // This is normal when the popup is on the OAuth provider domain
          }
        }
      }, 500);
      
      setIsLoading(true);
    } catch (error) {
      console.error('Error initiating WhatsApp login:', error);
      setIsLoading(false);
      toast.error("Connection Failed", {
        description: "Could not initiate WhatsApp login. Please try again later."
      });
    }
  };

  // Function to disconnect WhatsApp account
  const disconnectWhatsApp = async () => {
    try {
      setIsLoading(true);
      
      // Revoke the token
      const user_id = localStorage.getItem('whatsapp_user_id');
      if (user_id) {
        // Disconnect using the dedicated WhatsApp API
        await fetch('https://egenie-whatsapp.koyeb.app/api/whatsapp/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            user_id: user_id,
          }),
        });
        
        // Clear the connection from local storage
        localStorage.removeItem('whatsapp_connection');
        localStorage.removeItem('whatsapp_user_id');
        localStorage.removeItem('whatsapp_auth_state');
        setConnected(false);
        setAccountInfo(null);
        
        // Success case:
        toast.success("Account Disconnected", {
          description: "WhatsApp account disconnected successfully"
        });
      }
      else {
        // Error cases:
        toast.error("Disconnect Failed", {
          description: "No WhatsApp account found to disconnect"
        });
      }
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast.error("Disconnect Failed", {
        description: "Failed to disconnect WhatsApp account"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#25D366] hover:bg-green-600 text-white">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Checking...
            </span>
          ) : connected ? (
            'Manage'
          ) : (
            'Connect'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-black">{connected ? 'Manage WhatsApp Connection' : 'Connect WhatsApp Business'}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          </div>
        ) : connected && accountInfo ? (
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center">
                  <WhatsAppLogo className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-black text-lg">{accountInfo.name}</p>
                  <p className="text-sm text-gray-600">{formatPhoneNumber(accountInfo.phone)}</p>
                  <p className="text-xs text-green-600 mt-1">Connected</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowProfileView(true)}
              >
                View Details
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm text-black font-medium">Permissions granted:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 flex-shrink-0"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#10B981" strokeOpacity="0.2"/>
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Access to business profile information
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 flex-shrink-0"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#10B981" strokeOpacity="0.2"/>
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Send and receive messages
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 flex-shrink-0"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#10B981" strokeOpacity="0.2"/>
                    <path
                      d="M5 8L7 10L11 6"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Manage WhatsApp Business settings
                </li>
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full mt-4" 
              onClick={disconnectWhatsApp}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Disconnecting...
                </span>
              ) : (
                'Disconnect Account'
              )}
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">
              Connect your WhatsApp Business account to manage messages and customer interactions directly from this dashboard.
            </p>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded">
              <p>
                Your WhatsApp credentials are never stored on our servers. We use secure, industry-standard authentication directly with WhatsApp. You are always in control and can disconnect at any time.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-black">This will allow HeidelAI to:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                  Access your business profile information
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                  Send and receive messages on your behalf
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-600"></span>
                  Manage your WhatsApp Business settings
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full mt-4 bg-[#25D366] hover:bg-green-600  text-white" 
              onClick={handleWhatsAppLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Connecting...
                </span>
              ) : (
                'Connect with WhatsApp'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
      
      {/* WhatsAppProfileView component would go here similar to Instagram */}
      {connected && localStorage.getItem('whatsapp_user_id') && (
        <WhatsAppProfileView
          whatsappId={localStorage.getItem('whatsapp_user_id') || ''}
          isOpen={showProfileView}
          onClose={() => setShowProfileView(false)}
        />
      )}
    </Dialog>
  );
};

export default WhatsAppLoginDialog;