"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { ConversationProvider } from "@/components/hooks/useGlobalConversations";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  Contact,
  ContactRoundIcon,
  BotMessageSquare,
  LogOut,
  ChevronLeft,
  Tag
} from "lucide-react";
import { EmojiProvider } from "@/components/EmojiProvider";
import TalkToDataTab from "@/components/TalkToData/TalkToDataTab";
import Image from "next/image";
import Link from "next/link";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import RemainderSideBar from "@/components/inbox/ReminderSideBar";
import AnalyticsBot from "@/components/AnalyticsBot/AnalyticsBot";
import InfluencerBot from "@/components/influencerBot/influencerbot";
import { UserButton, useUser } from '@clerk/nextjs';
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
    | "billing"
    | "settings"
    | "talktodata"
    | "analyticsbot"
    | "Contacts"
    | "influencerbot"
  >("inbox");
  
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [isConversationListVisible, setIsConversationListVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const [showMobileConversationList, setShowMobileConversationList] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleMobileConversationSelect = (id: string) => {
    setSelectedConversationId(id);
    setShowMobileConversationList(false);
  };

  const handleMobileBackToList = () => {
    setShowMobileConversationList(true);
  };

  const handleDesktopConversationSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
    if (window.innerWidth < 768) {
      setShowMobileConversationList(false);
    }
  };

  const getTabTitle = () => {
    const titles = {
      inbox: "Inbox",
      Contacts: "Contacts", 
      talktodata: "Talk to Data",
      analyticsbot: "Analytics Bot",
      influencerbot: "InfluIndex",
      billing: "Billing",
      settings: "Settings"
    };
    return titles[activeView] || "Inbox";
  };

  const handleNavigation = (value: string) => {
    if (value === "inbox") setSelectedConversationId("");
    setIsNavigationVisible(false);
  };

  const navigationItems = [
    { value: "inbox", icon: MessageSquare, label: "Inbox" },
    { value: "Contacts", icon: ContactRoundIcon, label: "Contacts" },
    { value: "talktodata", icon: BotMessageSquare, label: "Talk to Data" },
    { value: "analyticsbot", icon: BarChart2, label: "Analytics" },
    { value: "influencerbot", icon: InstagramLogoIcon, label: "InfluIndex" },
    { value: "billing", icon: CreditCard, label: "Billing" },
    { value: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <ConversationProvider>
      <TooltipProvider>
        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as typeof activeView)}
            className="flex-1 flex overflow-hidden h-full"
          >
            {/* Mobile Header - Only show on mobile */}
<header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-200/50 md:hidden">
  <div className="flex items-center gap-3">
    {/*  Main navigation button */}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsNavigationVisible(true)}
      className="h-10 w-10 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
      aria-label="Open navigation"
    >
      <Menu className="h-5 w-5" />
    </Button>
    
    {/* Settings menu button */}
    {activeView === "settings" && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          // Trigger settings sidebar to open
          const event = new CustomEvent('openSettingsSidebar');
          window.dispatchEvent(event);
        }}
        className="h-10 w-10 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
        aria-label="Open settings menu"
      >
        <Settings className="h-5 w-5" />
      </Button>
    )}

    {activeView === "Contacts" && (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const event = new CustomEvent('openContactsTags');
          window.dispatchEvent(event);
        }}
        className="h-10 w-10 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
        aria-label="Open tags menu"
      >
        <Tag className="h-5 w-5" />
      </Button>
    )}
                
                {activeView === "inbox" && !showMobileConversationList && selectedConversationId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMobileBackToList}
                    className="h-10 w-10 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeView === "inbox" && !showMobileConversationList && selectedConversationId 
                    ? "Chat" 
                    : getTabTitle()
                  }
                </h1>
              </div>
            </header>

            {/* Left Navigation Sidebar */}
            <aside className={`
              ${isNavigationVisible 
                ? 'fixed inset-y-0 left-0 z-40 transform translate-x-0' 
                : 'fixed inset-y-0 left-0 z-40 transform -translate-x-full md:translate-x-0'
              }
              md:static md:transform-none
              w-20 bg-white/95 backdrop-blur-md border-r border-gray-200/60 
              rounded-none md:rounded-r-xl shadow-lg z-50
              transition-transform duration-200
              flex-shrink-0
            `}>
              <TabsList className="h-full flex flex-col justify-between p-3 w-full bg-transparent">
                <div className="w-full space-y-4">
                  <div className="flex justify-center items-center relative">
                    <Link href="/" className="group">
                      <div className="w-8 h-8 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          width={28}
                          height={28}
                          className="transition-all duration-200"
                        />
                      </div>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsNavigationVisible(false)}
                      className="absolute -right-2 -top-2 h-8 w-8 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 md:hidden"
                      aria-label="Close navigation"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {!isConversationListVisible && activeView === "inbox" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsConversationListVisible(true)}
                            className="absolute left-16 top-0 h-8 w-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hidden md:flex"
                            aria-label="Show conversation list"
                          >
                            <Menu className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="z-[60]">
                          Show conversations
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  <nav className="relative top-5 space-y-3 ml-2">
                    {navigationItems.map(({ value, icon: Icon, label }) => (
                      <Tooltip key={value} delayDuration={300}>
                        <TooltipTrigger asChild>
                          <TabsTrigger
                            value={value}
                            onClick={() => handleNavigation(value)}
                            className={`
                              group w-10 h-10 flex items-center justify-center
                              rounded-2xl transition-all duration-200
                              hover:scale-110 hover:shadow-lg
                              focus:outline-none
                              ${activeView === value 
                                ? 'bg-gray-200 text-black shadow-lg' 
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80'
                              }
                            `}
                          >
                            <Icon className="h-6 w-6" />
                          </TabsTrigger>
                        </TooltipTrigger>
                        
                        <TooltipContent 
                          side="right" 
                          className="bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg border-0 z-[60]"
                          sideOffset={8}
                        >
                          <span className="text-sm font-medium">{label}</span>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </nav>
                </div>

                <div className="flex justify-center">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                          <UserButton
                            appearance={{
                              elements: {
                                userButtonAvatarBox: "w-10 h-10 rounded-2xl",
                                userButtonAvatar: "rounded-2xl",
                                userButtonAction: "hidden",
                              },
                            }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg border-0 z-[60]"
                      sideOffset={8}
                    >
                      <span className="text-sm font-medium">Profile</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TabsList>
            </aside>

            {/* Mobile Overlay */}
            <div className={`
              fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden
              ${isNavigationVisible ? 'block' : 'hidden'}
            `}
              onClick={() => setIsNavigationVisible(false)}
              aria-hidden="true"
            />

            {/* Main Content Container */}
            <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden pt-16 md:pt-0">
              <div className="flex-1 h-full overflow-hidden">
                {/* Inbox Tab Content */}
                <TabsContent value="inbox" className="flex-1 h-full w-full overflow-hidden m-0">
                  <div className={`h-full block md:hidden ${showMobileConversationList ? '' : 'hidden'}`}>
                    <ConversationList
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={handleConversationSelect}
                      isVisible={true}
                    />
                  </div>

                  <div className={`h-full block md:hidden ${showMobileConversationList ? 'hidden' : ''}`}>
                    <ChatView
                      selectedConversationId={selectedConversationId}
                      sharedProduct={sharedProduct}
                      onClearSharedProduct={() => setSharedProduct(null)}
                      isRightSidebarVisible={false}
                      onOpenRightSidebar={() => {}}
                      onBackToList={handleMobileBackToList}
                    />
                  </div>

                  <div className="hidden md:flex h-full">
                    {isConversationListVisible && (
                      <section className="w-72 lg:w-80 xl:w-96 flex-shrink-0 bg-white/95 backdrop-blur-md border-r border-gray-200/60 overflow-hidden z-10">
                        <ConversationList
                          selectedConversationId={selectedConversationId}
                          onConversationSelect={handleConversationSelect}
                          isVisible={isConversationListVisible}
                          onToggleVisibility={() => setIsConversationListVisible(false)}
                        />
                      </section>
                    )}

                    <section className="flex-1 min-w-0 h-full border-r border-gray-200/60 z-10">
                      <ChatView
                        selectedConversationId={selectedConversationId}
                        sharedProduct={sharedProduct}
                        onClearSharedProduct={() => setSharedProduct(null)}
                        isRightSidebarVisible={isRightSidebarVisible}
                        onOpenRightSidebar={() => setIsRightSidebarVisible(true)}
                        onBackToList={() => {}}
                      />
                    </section>

                    {isRightSidebarVisible && (
                      <aside className="relative w-[280px] xl:w-[320px] flex-shrink-0 hidden xl:block z-10">
                        {selectedConversationId ? (
                          <Sidebar
                            selectedConversationId={selectedConversationId}
                            onConversationSelect={handleConversationSelect}
                            onShareProduct={setSharedProduct}
                            onToggleVisibility={() => setIsRightSidebarVisible(false)}
                          />
                        ) : (
                          <RemainderSideBar 
                            onToggleVisibility={() => setIsRightSidebarVisible(false)}
                          />
                        )}
                      </aside>
                    )}
                  </div>
                </TabsContent>

                {/* Other Tab Contents */}
                {["Contacts", "talktodata", "analyticsbot", "influencerbot"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="flex-1 h-full overflow-hidden m-0">
                    <div className="h-full w-full bg-gray-50/50 overflow-hidden">
                      {tab === "Contacts" && <ContactsDashboard />}
                      {tab === "talktodata" && <TalkToDataTab />}
                      {tab === "analyticsbot" && <AnalyticsBot />}
                      {tab === "influencerbot" && <InfluencerBot />}
                    </div>
                  </TabsContent>
                ))}

                {/* Settings & Billing Tabs */}
                <TabsContent value="settings" className="flex-1 h-full overflow-hidden m-0">
                  <SettingsSidebar />
                </TabsContent>

                <TabsContent value="billing" className="flex-1 h-full overflow-hidden m-0">
                  <div className="h-full w-full overflow-y-auto bg-white">
                    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                      <BillingPlans />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </main>
          </Tabs>
        </div>
      </TooltipProvider>
    </ConversationProvider>
  );
}
