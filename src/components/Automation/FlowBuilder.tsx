import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import {
  Search,
  Settings,
  Share2,
  Database,
  Globe,
  FileText,
  Download,
  Upload,
  Archive,
  Plus,
  X,
  ArrowLeft,
  Image,
  Grid,
  Video,
  LogIn,
  User,
  Lock,
} from "lucide-react";

// Define types for our app objects
interface App {
  name: string;
  category?: string;
  icon: React.ReactNode;
}

// Define props for our component
interface FlowBuilderProps {
  onClose: () => void;
}

// Define Instagram media types
interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  username: string;
}

const allApps: App[] = [
  {
    name: "WhatsApp",
    icon: <FaWhatsapp className="w-6 h-6 text-white" />,
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="w-6 h-6 text-white" />,
  },
];

// Create color mapping for app icons
const getIconBgColor = (appName: string): string => {
  const colorMap: Record<string, string> = {
    WhatsApp: "bg-green-500",
    Instagram: "bg-[#E1306C]",
  };

  // Find matching color or return default
  for (const [key, value] of Object.entries(colorMap)) {
    if (appName.includes(key)) return value;
  }
  return "bg-gray-500";
};

const FlowBuilder: React.FC<FlowBuilderProps> = ({ onClose }) => {
  const [showAppPanel, setShowAppPanel] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showInstagramLogin, setShowInstagramLogin] = useState<boolean>(false);
  const [instagramUsername, setInstagramUsername] = useState<string>("");
  const [instagramPassword, setInstagramPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [instagramMedia, setInstagramMedia] = useState<InstagramMedia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const panelRef = useRef<HTMLDivElement | null>(null);
  const loginPanelRef = useRef<HTMLDivElement | null>(null);

  // Close the app panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        (!loginPanelRef.current || !loginPanelRef.current.contains(event.target as Node))
      ) {
        setShowAppPanel(false);
      }
    };

    if (showAppPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAppPanel]);

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock function to simulate Instagram authentication
  const handleInstagramLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      if (instagramUsername && instagramPassword) {
        setIsAuthenticated(true);
        fetchInstagramMedia();
      } else {
        setError("Please enter both username and password");
        setIsLoading(false);
      }
    }, 1000);
  };

  // Mock function to simulate fetching Instagram media
  const fetchInstagramMedia = () => {
    // This would be replaced with actual API calls using the Instagram API
    // Similar to the provided code's getUserMedia function
    
    // Mock data that mimics the Instagram API response
    const mockMediaData: InstagramMedia[] = [
      {
        id: "1",
        caption: "Beautiful sunset #nature",
        media_type: "IMAGE",
        media_url: "/api/placeholder/400/400",
        permalink: "https://instagram.com/p/123456",
        timestamp: "2023-04-01T12:00:00Z",
        username: instagramUsername,
      },
      {
        id: "2",
        caption: "My travel adventures",
        media_type: "CAROUSEL_ALBUM",
        media_url: "/api/placeholder/400/400",
        permalink: "https://instagram.com/p/234567",
        timestamp: "2023-03-25T15:30:00Z",
        username: instagramUsername,
      },
      {
        id: "3",
        caption: "Check out my new video!",
        media_type: "VIDEO",
        media_url: "/api/placeholder/400/400",
        thumbnail_url: "/api/placeholder/400/400",
        permalink: "https://instagram.com/p/345678",
        timestamp: "2023-03-20T09:15:00Z",
        username: instagramUsername,
      },
    ];

    setInstagramMedia(mockMediaData);
    setIsLoading(false);
    setShowInstagramLogin(false);
  };

  const handleAppClick = (appName: string) => {
    if (appName === "Instagram") {
      setShowInstagramLogin(true);
    }
    // Handle other apps as needed
  };

  // Get media type icon
  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case "IMAGE":
        return <Image className="w-4 h-4 text-gray-500" />;
      case "CAROUSEL_ALBUM":
        return <Grid className="w-4 h-4 text-gray-500" />;
      case "VIDEO":
        return <Video className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      {/* New scenario button */}
      <div className="fixed top-8 left-8 z-10">
        <button
          onClick={onClose}
          className="bg-gray-100 p-2 rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Close button */}
      <div className="fixed top-4 right-4 z-50">
      <button
          onClick={onClose}
          className="bg-gray p-2 rounded-full shadow flex items-center justify-center text-gray-900 hover:bg-gray-50"
        >
          <X className="w-7 h-7" />
        </button>
      </div>

      <div className="relative flex items-center">
        {/* Main + Button */}
        <button
          onClick={() => setShowAppPanel(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-lg"
        >
          <Plus className="w-16 h-16" />
        </button>

        {/* App List Panel */}
        {showAppPanel && (
          <div
            ref={panelRef}
            className="absolute left-full ml-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-100 z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-medium text-gray-500">ALL APPS</span>
              <button
                onClick={() => setShowAppPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-2 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search apps or modules"
                  className="w-full px-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Apps */}
            <div className="px-4 pb-4">
              {filteredApps.length > 0 ? (
                filteredApps.map((app, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 mb-2"
                    onClick={() => handleAppClick(app.name)}
                  >
                    <div
                      className={`w-10 h-10 ${getIconBgColor(
                        app.name
                      )} rounded-lg flex items-center justify-center mr-3`}
                    >
                      {app.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800">{app.name}</span>
                        {app.category && (
                          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-md ml-2">
                            {app.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400 text-center py-6">
                  No apps found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instagram Login Panel */}
        {showInstagramLogin && (
          <div
            ref={loginPanelRef}
            className="absolute left-full ml-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-100 z-20"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-lg p-2 mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800">Instagram Login</span>
              </div>
              <button
                onClick={() => setShowInstagramLogin(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleInstagramLogin}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        id="username"
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Instagram username"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        type="password"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Instagram password"
                        value={instagramPassword}
                        onChange={(e) => setInstagramPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Login
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                  Successfully connected to Instagram account: <strong>{instagramUsername}</strong>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-3">Your Instagram Media</h3>
                  
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {instagramMedia.map((media) => (
                        <div key={media.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
                          <div className="relative h-16 w-16 rounded overflow-hidden mr-3 bg-gray-100">
                            <img 
                              src={media.thumbnail_url || media.media_url} 
                              alt={media.caption || "Instagram media"} 
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-1 right-1 bg-white bg-opacity-80 rounded p-1">
                              {getMediaTypeIcon(media.media_type)}
                            </div>
                          </div>
                          <div className="flex-grow">
                            <div className="text-sm text-gray-800 line-clamp-2">
                              {media.caption || "No caption"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(media.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setInstagramUsername("");
                    setInstagramPassword("");
                    setInstagramMedia([]);
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Disconnect Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/4.5 bg-white rounded-full shadow-lg px-3 py-2 flex items-center space-x-3">
        <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full flex items-center space-x-2">
          <span>Run once</span>
        </button>

        <div className="flex items-center space-x-2 px-3 text-gray-500">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm">Every 15 minutes</span>
        </div>

        <div className="flex items-center space-x-4 px-2 text-gray-500">
          <button className="hover:bg-gray-100 p-2 rounded">
            <Settings className="w-5 h-5" />
          </button>
          <button className="hover:bg-gray-100 p-2 rounded">
            <FileText className="w-5 h-5" />
          </button>
          <button className="hover:bg-gray-100 p-2 rounded">
            <Archive className="w-5 h-5" />
          </button>
          <button className="hover:bg-gray-100 p-2 rounded">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="border-l border-gray-200 pl-3 flex items-center">
          <button className="bg-green-400 hover:bg-green-500 p-2 rounded-md">
            <Settings className="w-5 h-5 text-white" />
          </button>
          <button className="bg-purple-400 hover:bg-purple-500 p-2 rounded-md mx-2">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button className="bg-red-400 hover:bg-red-500 p-2 rounded-md">
            <Archive className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;