/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/components/firebase";
import React from "react";
import TopNavigation from "@/components/inbox/TopNavigation";
import ConversationList from "@/components/inbox/ConversationList";
import ChatView from "@/components/inbox/ChatView";
import Sidebar from "@/components/inbox/Sidebar";
import StatusBar from "@/components/inbox/StatusBar";
import ConversationSummary from "@/components/inbox/ConversationSummary";
import AnalyticsDashboard from "@/components/inbox/AnalyticsDashboard";
import UsageMetrics from "@/components/inbox/UsageMetrics";
import BillingPlans from "@/components/inbox/BillingPlans";
import TeamCollaboration from "@/components/inbox/TeamCollaboration";
import AutomationRules from "@/components/inbox/AutomationRules";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ContactsDashboard from "@/components/Contacts/ContactsDashboard";
import SettingsSidebar from "@/components/setting_tab/SettingsSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/inbox_button";
import { Inbox, X } from "lucide-react";
import { Conversation } from "@/components/types/conversation";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  Contact,
  Contact2Icon,
  ContactRoundIcon,
  BotMessageSquare,
  LogOut,
} from "lucide-react";
import { EmojiProvider } from "@/components/EmojiProvider";
import TalkToDataTab from "@/components/TalkToData/TalkToDataTab";
import Image from "next/image";
import Link from "next/link";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import RemainderSideBar from "@/components/inbox/ReminderSideBar";
import AnalyticsBot from "@/components/AnalyticsBot/AnalyticsBot";
import InfluencerBot from "@/components/influencerBot/influencerbot";
import { UserButton, UserProfile, useUser, SignedIn, OrganizationSwitcher } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Product {
  id: string;
  category: string;
  description: string;
  images: string;
  name: string;
  on_sale: string;
  permalink: string;
  price: number;
  product_id: number;
  purchasable: string;
  regular_price: string;
  sale_price: string;
  slug: string;
  stock_quantity: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    | "inbox"
    | "analytics"
    | "billing"
    | "settings"
    | "talktodata"
    | "analyticsbot"
    | "Contacts"
    | "influencerbot"
  >("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [isConversationListVisible, setIsConversationListVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const { isSignedIn, isLoaded, user } = useUser();
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Detect zoom level and screen size
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      const zoom = Math.round(window.devicePixelRatio * 100);
      setZoomLevel(zoom);
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log(user);
    if (isLoaded && !isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  const toggleConversationList = () => {
    setIsConversationListVisible(!isConversationListVisible);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarVisible(!isRightSidebarVisible);
  };

  // Determine sidebar widths based on screen size - Further reduced
  const getLeftSidebarWidth = () => {
    if (screenWidth < 768) return "w-8"; // Mobile: smaller icon only
    if (screenWidth < 1024) return "w-10"; // Tablet: smaller icon only
    if (screenWidth < 1280) return "w-12"; // Small desktop: icon only
    if (screenWidth < 1536) return "w-34"; // Medium desktop: significantly reduced
    return "w-38"; // Large desktop: significantly reduced
  };

  // Get conversation list width based on screen size - Further reduced
  const getConversationListWidth = () => {
    if (screenWidth < 1280) return "w-[280px]"; // Small screens: reduced
    if (screenWidth < 1536) return "w-[320px]"; // Medium screens: significantly reduced
    if (screenWidth < 1920) return "w-[340px]"; // Large screens: significantly reduced
    return "w-[360px]"; // Extra large screens: reduced even for wide screens
  };

  // Get right sidebar width based on screen size - Further reduced
  const getRightSidebarWidth = () => {
    if (screenWidth < 1536) return "w-[320px]"; // Medium screens: significantly reduced
    if (screenWidth < 1920) return "w-[340px]"; // Large screens: significantly reduced
    return "w-[360px]"; // Extra large screens: much smaller
  };

  const showIconsOnly = screenWidth < 1280; // Show icons only below 1280px

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as typeof activeView)}
          className="flex-1 flex overflow-hidden"
        >
          {/* Left Sidebar - Much smaller widths */}
          <div className={`
            ${isConversationListVisible && activeView === "inbox" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${getLeftSidebarWidth()}
            fixed lg:static left-0 top-0 h-full z-20
            transform transition-all duration-300 ease-in-out
            bg-black bg-opacity-50 lg:bg-transparent
            flex-shrink-0
          `}>
            <TabsList className="h-full flex flex-col items-start justify-between py-4 bg-white/95 backdrop-blur-sm border-r w-full">
              {/* Top section: Logo */}
              <div className="w-full">
                <div className="w-full flex justify-center items-center mb-6 relative">
                  <Link href="/">
                    <Image 
                      src="/logo.png" 
                      alt="logo" 
                      width={showIconsOnly ? 20 : 22} 
                      height={showIconsOnly ? 20 : 22}
                      className="transition-all duration-200" 
                    />
                  </Link>
                  {/* Show conversation list button when collapsed */}
                  {!isConversationListVisible && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleConversationList}
                          className="absolute left-24 top-3.5 h-5.5 w-5.5 hover:bg-gray-200 bg-white border shadow-sm"
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Show conversation list
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                
                {/* Navigation Tabs - Moved downwards with increased spacing */}
                <div className="w-full space-y-2 px-1 mt-8">
                  {[
                    { value: "inbox", icon: MessageSquare, label: "Inbox" },
                    { value: "Contacts", icon: ContactRoundIcon, label: "Contacts" },
                    { value: "talktodata", icon: BotMessageSquare, label: "Talk to Data" },
                    { value: "analyticsbot", icon: BarChart2, label: "Analytics" },
                    { value: "influencerbot", icon: InstagramLogoIcon, label: "InfluIndex" },
                    { value: "billing", icon: CreditCard, label: "Billing" },
                    { value: "settings", icon: Settings, label: "Settings" }
                  ].map(({ value, icon: Icon, label }) => (
                    <Tooltip key={value}>
                      <TooltipTrigger asChild>
                        <TabsTrigger
                          onClick={() => {
                            if (value === "inbox") setSelectedConversationId("");
                          }}
                          value={value}
                          className="group w-full flex items-center px-1.5 py-3 hover:bg-gray-100 rounded-md justify-center lg:justify-start transition-all duration-200"
                        >
                          <div className="flex items-center w-full">
                            <div className={`flex justify-center items-center flex-shrink-0 ${showIconsOnly ? 'w-full' : 'w-5'}`}>
                              <Icon className={`${showIconsOnly ? 'h-4 w-4' : 'h-3.5 w-3.5'}`} />
                            </div>
                            {!showIconsOnly && (
                              <span className="ml-2.5 text-xs font-medium truncate flex-1 text-left">
                                {label}
                              </span>
                            )}
                          </div>
                        </TabsTrigger>
                      </TooltipTrigger>
                      {showIconsOnly && <TooltipContent side="right">{label}</TooltipContent>}
                    </Tooltip>
                  ))}
                </div>
              </div>
              
              {/* Bottom section: User controls */}
              <div className="w-full pb-4">
                {isSignedIn && (
                  <div className="w-full flex justify-center items-center">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: showIconsOnly ? "w-6 h-6" : "w-6 h-6",
                          userButtonAvatar: "rounded-full",
                          userButtonAction: "hidden",
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsList>
          </div>

          {/* Main Content Area - Maximum space for chat */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <TabsContent
              value="inbox"
              className="flex-1 h-full w-full overflow-hidden m-0"
            >
              <div className="flex w-full h-screen">
                {/* Conversation List - Much smaller widths */}
                {isConversationListVisible && (
                  <div className={`bg-white flex flex-col ${getConversationListWidth()} flex-shrink-0 max-h-screen border-r border-gray-200`}>
                    <ConversationList
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={setSelectedConversationId}
                      isVisible={isConversationListVisible}
                      onToggleVisibility={toggleConversationList}
                    />
                  </div>
                )}

                {/* Chat View - Takes maximum available space */}
                <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen">
                  <div className="h-full">
                    <ChatView
                      selectedConversationId={selectedConversationId}
                      sharedProduct={sharedProduct}
                      onClearSharedProduct={() => setSharedProduct(null)}
                      isRightSidebarVisible={isRightSidebarVisible}
                      onOpenRightSidebar={() => setIsRightSidebarVisible(true)}
                    />
                  </div>
                </div>

                {/* Right Sidebar - Much smaller widths */}
                {isRightSidebarVisible && (
                  <div className={`relative ${getRightSidebarWidth()} flex-shrink-0 hidden xl:block`}>
                    {/* Right Sidebar Toggle Button */}
                    <div className="absolute -left-[-290] top-3 z-20">
                      <Button
                        onClick={toggleRightSidebar}
                        variant="ghost"
                        size="icon"
                        className="!h-7 !w-7 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                        aria-label="Hide details sidebar"
                      >
                        <X className="h-3.5 w-3.5 text-gray-600" />
                      </Button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="border-l border-gray-200 h-full">
                      {selectedConversationId ? (
                        <Sidebar
                          selectedConversationId={selectedConversationId}
                          onConversationSelect={setSelectedConversationId}
                          onShareProduct={(product) => setSharedProduct(product)}
                        />
                      ) : (
                        <RemainderSideBar />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Other Tab Contents */}
            <TabsContent value="Contacts" className="m-0 flex-1 h-full w-full overflow-hidden">
              <ContactsDashboard />
            </TabsContent>

            <TabsContent value="talktodata" className="m-0 flex-1 h-full w-full overflow-hidden">
              <TalkToDataTab />
            </TabsContent>

            <TabsContent value="analyticsbot" className="m-0 flex-1 h-full w-full overflow-hidden">
              <AnalyticsBot />
            </TabsContent>

            <TabsContent value="influencerbot" className="m-0 flex-1 h-full w-full overflow-hidden">
              <InfluencerBot />
            </TabsContent>

            <TabsContent value="billing" className="m-0 flex-1 p-4 overflow-auto h-full">
              <BillingPlans />
            </TabsContent>

            <TabsContent value="settings" className="m-0 flex-1 p-4 overflow-auto h-full">
              <SettingsSidebar />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
