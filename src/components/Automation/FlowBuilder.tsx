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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PostReelComments from "./PostReelComments";

interface App {
  name: string;
  category?: string;
  icon: React.ReactNode;
}

interface FlowBuilderProps {
  onClose: () => void;
}

interface InstagramTrigger {
  title: string;
  description: string;
  icon: React.ReactNode;
  isPro?: boolean;
}

const allApps: App[] = [
  { name: "WhatsApp", icon: <FaWhatsapp className="w-6 h-6 text-white" /> },
  { name: "Instagram", icon: <FaInstagram className="w-6 h-6 text-white" /> },
];

const instagramTriggers: InstagramTrigger[] = [
  {
    title: "Post or Reel Comments",
    description: "User comments on your Post or Reel",
    icon: <FaInstagram className="w-6 h-6 text-white" />,
  },
  {
    title: "Instagram Message",
    description: "User sends a message",
    icon: <FaInstagram className="w-6 h-6 text-white" />,
  },
  {
    title: "Instagram Ref URL",
    description: "User clicks a referral link",
    icon: <FaInstagram className="w-6 h-6 text-white" />,
  },
];

const getIconBgColor = (appName: string): string => {
  const colorMap: Record<string, string> = {
    WhatsApp: "bg-green-500",
    Instagram: "bg-[#E1306C]",
  };
  return colorMap[appName] || "bg-gray-500";
};

const FlowBuilder: React.FC<FlowBuilderProps> = ({ onClose }) => {
  const [showAppPanel, setShowAppPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInstagramTriggers, setShowInstagramTriggers] = useState(false);
  const [expandedSection, setExpandedSection] = useState("top");
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [showPostReelComments, setShowPostReelComments] = useState(false);

  const appPanelRef = useRef<HTMLDivElement | null>(null);
  const triggerPanelRef = useRef<HTMLDivElement | null>(null);

  const [dmAutomationData, setDmAutomationData] = useState<{
    postId?: string;
    keywords?: string[];
    reply?: string;
    automation_name?: string
  }>({});
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panels = [appPanelRef.current, triggerPanelRef.current];
      if (!panels.some((panel) => panel?.contains(event.target as Node))) {
        setShowAppPanel(false);
        setShowInstagramTriggers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppClick = (appName: string) => {
    if (appName === "Instagram") setShowInstagramTriggers(true);
  };

  const handleSectionToggle = (section: string) => {
    setExpandedSection((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      {/* Navigation buttons */}
      <div className="fixed top-8 left-8 z-10">
        <button
          onClick={onClose}
          className="bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="bg-gray p-2 rounded-full shadow hover:bg-gray-50"
        >
          <X className="w-7 h-7 text-gray-900" />
        </button>
      </div>

      <div className="relative flex items-center">
        {/* Main plus button */}
        <button
          onClick={() => setShowAppPanel(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white w-32 h-32 rounded-full shadow-lg"
        >
          <Plus className="w-16 h-16 mx-auto" />
        </button>

        {/* App selection panel */}
        {showAppPanel && (
          <div
            ref={appPanelRef}
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

            <div className="px-4 pb-4">
              {filteredApps.map((app, idx) => (
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
              ))}
            </div>
          </div>
        )}

        {/* Instagram triggers panel */}
        {showInstagramTriggers && (
          <div
            ref={triggerPanelRef}
            className="absolute left-full ml-4 w-[450px] h-[600px] bg-white rounded-lg shadow-2xl border border-gray-100 z-50"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="font-medium text-gray-800">
                Start automation when...
              </span>
              <button
                onClick={() => setShowInstagramTriggers(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search in Instagram"
                  className="w-full px-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex mb-4">
                <div className="w-1/3 pr-2">
                  <div className="bg-gray-100 rounded-lg p-3 mb-2">
                    <div className="flex items-center">
                      <div className="bg-pink-500 rounded-lg p-1 mr-2">
                        <FaInstagram className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Instagram</span>
                    </div>
                  </div>
                </div>

                <div className="w-2/3 pl-2">
                  <div className="mb-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 text-gray-500 rounded-t-lg">
                      <span className="text-sm font-medium">Triggers</span>
                      <button
                        onClick={() => handleSectionToggle("triggers")}
                        className="text-gray-400"
                      >
                        {expandedSection === "triggers" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="p-2 text-sm text-gray-600 border-b border-gray-100">
                      Specific Instagram event that starts your automation.
                    </div>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-96">
                    {instagramTriggers.map((trigger, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (trigger.title === "Post or Reel Comments") {
                            setSelectedTrigger(trigger.title);
                            setShowInstagramTriggers(false);
                            setShowPostReelComments(true);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="bg-pink-500 rounded-full p-1 mr-3">
                            <FaInstagram className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">
                                {trigger.title}
                              </span>
                              {trigger.isPro && (
                                <span className="ml-2 bg-blue-500 text-white text-xs px-1 rounded">
                                  PRO
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {trigger.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post/Reel comments sidebar */}
        {showPostReelComments && (
          <PostReelComments
            onClose={() => setShowPostReelComments(false)}
            onComplete={(data) => {
              setDmAutomationData(data);
              setShowPostReelComments(false);
              // Additional logic to save to Supabase or process data
            }}
          />
        )}
      </div>

      {/* Bottom toolbar
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-3 py-2 flex items-center space-x-3">
        <button className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full">
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
      </div> */}
    </div>
  );
};

export default FlowBuilder;
