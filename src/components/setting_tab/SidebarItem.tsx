import React, { useEffect, useState } from 'react';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import AgentsSettings from './Agent_management';
import TeamsConfiguration from './Team_configuration';
import CannedResponses from './CannedResponsesContext';
import { Construction } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Shopify } from '@shopify/shopify-api';

const loginWithFacebook = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      queryParams: {
        config_id: '1078509157648485'
      }
    }
  });

  if (error) console.error("Login error:", error.message);
};

const WooCommerceDialog = () => {
  const [credentials, setCredentials] = useState({
    siteUrl: '',
    consumerKey: '',
    consumerSecret: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const resetForm = () => {
      setCredentials({
        siteUrl: '',
        consumerKey: '',
        consumerSecret: ''
      });
      setError(null);
      setSuccess(false);
    };

    try {
      const api = new WooCommerceRestApi({
        url: credentials.siteUrl,
        consumerKey: credentials.consumerKey,
        consumerSecret: credentials.consumerSecret,
        version: "wc/v3"
      });
      
      // Test the connection by fetching products
      const response = await api.get("products", { per_page: 3 });
      console.log("Connection successful:", response.data);
      setSuccess(true);
      
      // Store the credentials securely (you can implement your storage method here)
      localStorage.setItem('woocommerce_credentials', JSON.stringify({
        url: credentials.siteUrl,
        key: credentials.consumerKey,
      }));

      setTimeout(() => {
        resetForm();
      }, 2000);
      
    } catch (error) {
      console.error("WooCommerce connection error:", error);
      setError(error instanceof Error ? error.message : 'Failed to connect to WooCommerce');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#96588A] hover:bg-[#804674] text-white">
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect WooCommerce Store</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="siteUrl">Site URL</label>
            <Input
              id="siteUrl"
              placeholder="https://your-store.com"
              value={credentials.siteUrl}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                siteUrl: e.target.value
              }))}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="consumerKey">Consumer Key</label>
            <Input
              id="consumerKey"
              type="password"
              placeholder="ck_xxxxxx"
              value={credentials.consumerKey}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                consumerKey: e.target.value
              }))}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="consumerSecret">Consumer Secret</label>
            <Input
              id="consumerSecret"
              type="password"
              placeholder="cs_xxxxxx"
              value={credentials.consumerSecret}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                consumerSecret: e.target.value
              }))}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-500 bg-green-50 p-2 rounded">
              Successfully connected to WooCommerce store!
            </div>
          )}
          <Button 
            onClick={handleConnect} 
            className="bg-[#96588A] hover:bg-[#804674] text-white"
            disabled={isLoading || !credentials.siteUrl || !credentials.consumerKey || !credentials.consumerSecret}
          >
            {isLoading ? "Connecting..." : "Authenticate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};



const ShopifyDialog = () => {
  const [credentials, setCredentials] = useState({
    shopName: '',
    accessToken: '',
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#96bf48] hover:bg-[#7da039] text-white">
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Shopify Store</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="shopName">Name</label>
            <Input
              id="shopName"
              placeholder="your-store.myshopify.com"
              value={credentials.shopName}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                shopName: e.target.value
              }))}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="accessToken">Access Token</label>
            <Input
              id="accessToken"
              type="password"
              placeholder="shpat_xxxxxx"
              value={credentials.accessToken}
              onChange={(e) => setCredentials(prev => ({
                ...prev,
                accessToken: e.target.value
              }))}
            />
          </div>
          <Button 
            className="bg-[#96bf48] hover:bg-[#7da039] text-white"
            onClick={() => console.log('Shopify connection clicked')}
          >
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InstagramDialog = () => {
  const [connected, setConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState<{
    username: string;
    profileImage: string;
  } | null>(null);
  
  // Instagram business login URL with heidelai.com domain
  const instagramLoginUrl = "https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1197084761515978&redirect_uri=https://www.heidelai.com/auth/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights";

  // Check if user has already connected Instagram
  useEffect(() => {
    const checkConnection = async () => {
      // Check local storage for existing connection
      const instagramConnection = localStorage.getItem('instagram_connection');
      if (instagramConnection) {
        const parsedData = JSON.parse(instagramConnection);
        setConnected(true);
        setAccountInfo(parsedData);
      }
      
      // Check for auth code in URL (after redirect back from Instagram)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('instagram_code');
      
      if (code) {
        try {
          // Call your FastAPI backend to exchange the code for a token
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
          
          // Store the connection info
          localStorage.setItem('instagram_connection', JSON.stringify({
            username: data.username,
            profileImage: data.profile_picture || '/default-avatar.png',
            token: data.access_token,
            userId: data.user_id
          }));
          
          setConnected(true);
          setAccountInfo({
            username: data.username,
            profileImage: data.profile_picture || '/default-avatar.png'
          });
          
          // Remove the code from URL to prevent reprocessing
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Error exchanging code for token:', error);
        }
      }
    };
    
    checkConnection();
  }, []);

  const handleInstagramLogin = () => {
    // Direct user to the Instagram authorization URL
    window.location.href = instagramLoginUrl;
  };

  const disconnectInstagram = async () => {
    try {
      // Call your FastAPI backend to revoke the token
      const instagramConnection = localStorage.getItem('instagram_connection');
      if (instagramConnection) {
        const parsedData = JSON.parse(instagramConnection);
        
        await fetch('https://api.heidelai.com/instagram/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            token: parsedData.token,
            user_id: parsedData.userId
          }),
        });
      }
      
      // Clear the connection from local storage
      localStorage.removeItem('instagram_connection');
      setConnected(false);
      setAccountInfo(null);
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white">
          {connected ? 'Manage' : 'Connect'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{connected ? 'Manage Instagram Connection' : 'Connect Instagram Account'}</DialogTitle>
        </DialogHeader>
        
        {connected && accountInfo ? (
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={accountInfo.profileImage} 
                alt={accountInfo.username}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{accountInfo.username}</p>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Permissions granted:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Access to messages</li>
                <li>✓ Send messages</li>
                <li>✓ Access basic profile data</li>
                <li>✓ Business account management</li>
              </ul>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full mt-4" 
              onClick={disconnectInstagram}
            >
              Disconnect Account
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">
              Connect your Instagram business account to manage messages directly from this dashboard.
            </p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">This will allow HeidelAI to:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Access your messages</li>
                <li>• Send messages on your behalf</li>
                <li>• Access your business account information</li>
                <li>• Manage your business messaging</li>
              </ul>
            </div>
            
            <Button 
              className="w-full mt-4 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white" 
              onClick={handleInstagramLogin}
            >
              Connect with Instagram
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default function DashboardPage() {
  const handleInsertResponse = (message: string) => {
    // Handle the canned response insertion
    console.log('Inserting canned response:', message);
    // Add your implementation here
  };
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Add component */}
      <AgentsSettings />
      <TeamsConfiguration />
      <CannedResponses onInsertResponse={handleInsertResponse} />
      {/* You can add other dashboard components here */}
    </div>
  );
}

export const InboxSettings = () => {
  const [inboxConfig, setInboxConfig] = useState({
    autoAssign: true,
    defaultTeam: 'Support Team',
    emailRouting: 'intelligent'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inbox Management</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-4 rounded-lg">
          <div>
            <h3 className="font-semibold">Auto Assignment</h3>
            <p className="text-sm text-muted-foreground">
              Automatically route incoming messages to agents
            </p>
          </div>
          <Switch 
            checked={inboxConfig.autoAssign}
            onCheckedChange={(checked) => setInboxConfig(prev => ({...prev, autoAssign: checked}))}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Email Routing</h3>
          <Select 
            value={inboxConfig.emailRouting}
            onValueChange={(value) => setInboxConfig(prev => ({...prev, emailRouting: value}))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select routing method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intelligent">Intelligent Routing</SelectItem>
              <SelectItem value="round-robin">Round Robin</SelectItem>
              <SelectItem value="manual">Manual Assignment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export const LabelsSettings = () => {
  const [labels, setLabels] = useState([
    { id: '1', name: 'Urgent', color: 'red' },
    { id: '2', name: 'Follow Up', color: 'blue' }
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Labels Management</h2>
      <div className="border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => (
            <div 
              key={label.id} 
              className={`px-3 py-1 rounded-full text-white bg-${label.color}-500`}
            >
              {label.name}
            </div>
          ))}
        </div>
        <Button className="mt-4">Create Label</Button>
      </div>
    </div>
  );
};

// Placeholder for the remaining components with similar structure
export const CustomAttributesSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Custom Attributes</h2>
    <p>Configure custom fields for contacts and conversations</p>
  </div>
);

export const AutomationSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Automation Rules</h2>
    <p>Create and manage automated workflows</p>
  </div>
);

export const MacrosSettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Macros functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);



export const IntegrationsSettings = () => (
  <div className="min-h-[300px] flex flex-col items-start p-8">
    <h2 className="text-2xl font-bold mb-6">Platform Integrations</h2>
    
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Facebook Integration Card */}
      <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#1877F2] rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Facebook</h3>
                <p className="text-sm text-gray-600">Connect your Facebook pages</p>
              </div>
            </div>
            <Button
              onClick={loginWithFacebook}
              className="bg-[#1877F2] hover:bg-[#0c5bdb] text-white"
            >
              Connect
            </Button>
          </div>
        </div>
      </div>

      
      {/* WooCommerce Integration Card */}
      <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#96588A] rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.2,6.2c-0.8-1.1-2.1-1.8-3.5-1.8c-0.8,0-1.6,0.2-2.2,0.6C12.9,4.4,12,4,11,4c-1.4,0-2.7,0.7-3.5,1.8C6.7,4.7,5.4,4,4,4C1.8,4,0,5.8,0,8c0,0.8,0.2,1.5,0.6,2.2C0.2,11.5,0,12.7,0,14c0,4.4,3.6,8,8,8h8c4.4,0,8-3.6,8-8c0-1.3-0.2-2.5-0.6-3.8C23.8,9.5,24,8.8,24,8C24,5.8,22.2,4,20,4C18.6,4,17.3,4.7,16.5,6.2z M11,15V9c0-0.6,0.4-1,1-1s1,0.4,1,1v6c0,0.6-0.4,1-1,1S11,15.6,11,15z M7,15V9c0-0.6,0.4-1,1-1s1,0.4,1,1v6c0,0.6-0.4,1-1,1S7,15.6,7,15z M15,15V9c0-0.6,0.4-1,1-1s1,0.4,1,1v6c0,0.6-0.4,1-1,1S15,15.6,15,15z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">WooCommerce</h3>
                <p className="text-sm text-gray-600">Connect your WooCommerce store</p>
              </div>
            </div>
            <WooCommerceDialog />
          </div>
        </div>
      </div>


      {/* Shopify Integration Card */}
      <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
  <div className="space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-[#96bf48] rounded-lg p-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zm-11.25-11.37l-.837 2.517s-1.346-.706-2.829-1.411c0 0 1.514-12.533 1.536-12.65.021-.116.097-.192.194-.192s2.201-.136 2.201-.136 .085-.079.15-.098l-.415 11.97zm1.787-12.124s1.929-.136 2.01-.136c.079 0 .132.039.158.097l.263 2.201-1.167.831s-1.138-1.083-1.203-1.167c-.063-.079-.08-.177-.044-.266.035-.089.247-1.329.247-1.329l-.264-.231zm1.293 4.324l1.495-1.079 1.371 4.152s-1.555 1.063-3.084 1.982l.218-5.055zm9.51 11.026c.069-.231-1.497-.673-1.497-.673l-.73-2.156-2.112 1.26s1.882.696 2.144.891c.231.15 2.126.909 2.195.678z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Shopify</h3>
          <p className="text-sm text-gray-600">Connect to your Shopify store</p>
        </div>
      </div>
      <ShopifyDialog />
    </div>
  </div>
</div>

{/* // Instagram Integration Card */}
<div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
  <div className="space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-lg p-2">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Instagram</h3>
          <p className="text-sm text-gray-600">Connect your Instagram business account</p>
        </div>
      </div>
      <InstagramDialog />
    </div>
  </div>
</div>

      {/* More Integrations Coming Soon Card */}
        {/* <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-orange-100 rounded-full p-4">
              <Construction className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">More Platforms Coming Soon</h3>
              <p className="text-sm text-gray-600 mt-1">
                We&apos;re working on adding more platform integrations
              </p>
            </div>
          </div>  
        </div> */}
    </div>
  </div>
);

export const AuditLogsSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Audit Logs</h2>
    <p>Track and review system activities</p>
  </div>
);

export const CustomRolesSettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
          Custom Role functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);

export const SLASettings = () => (
  <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8">
    <div className="max-w-md space-y-4">
      <div className="mx-auto bg-orange-100 rounded-full p-4 w-fit">
        <Construction className="h-8 w-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
        Coming Soon
      </h2>
      <p className="text-lg text-gray-600">
        Our team is working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="pt-4 border-t border-gray-200 mt-8">
        <p className="text-sm text-gray-500">
        Service Level Agreements functionality will be available in our next release.
          Check back soon or follow us for updates!
        </p>
      </div>
    </div>
  </div>
);