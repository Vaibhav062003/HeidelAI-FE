/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/components/firebase";
import React, { useState, useRef } from "react";
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
  const [selectedConversationId, setSelectedConversationId] =useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [isConversationListVisible, setIsConversationListVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const { isSignedIn, isLoaded, user } = useUser();
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(user);
    if (isLoaded && !isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  return (
    <>
      {/* Mobile Header - Shows only on mobile screens */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40 h-16">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsConversationListVisible(!isConversationListVisible)}
          className="p-2"
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
        </Link>
        
        {isSignedIn && <UserButton />}
      </div>

      <div className="min-h-screen bg-gray-100 flex">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as typeof activeView)}
          className="flex-1 flex overflow-hidden pt-16 lg:pt-0"
        >
          {/* Left Sidebar - Remove gap by ensuring proper alignment */}
          <div className={`
            ${isConversationListVisible && activeView === "inbox" ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            w-64 
            md:w-20 
            lg:w-32 
            xl:w-36 
            2xl:w-64
            fixed lg:static left-0 top-16 lg:top-0 h-full z-20
            transform transition-transform duration-300 ease-in-out
            bg-black bg-opacity-50 lg:bg-transparent
          `}>
            <TabsList className="h-full flex flex-col items-start justify-between pt-6 bg-white/90 backdrop-blur-sm border-r w-64 lg:w-full">
              {/* Top section: Logo and Profile */}
              <div className="w-full">
                <div className="w-full flex justify-center items-center mb-6 hidden lg:flex">
                  <Link href="/">
                    <Image src="/logo.png" alt="logo" width={30} height={30} />
                  </Link>
                </div>
                {/* Navigation Tabs - Optimized for laptop screens */}
                <div className="w-full space-y-1 px-4 lg:px-1 xl:px-2 2xl:px-4">
                  <TabsTrigger
                    onClick={() => {
                      setSelectedConversationId("");
                    }}
                    value="inbox"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <MessageSquare className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Inbox</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="Contacts"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <ContactRoundIcon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Contacts</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="talktodata"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <BotMessageSquare className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Talk to Data</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="analyticsbot"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <BarChart2 className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Analytics</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="influencerbot"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <InstagramLogoIcon className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">InfluIndex</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="billing"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <CreditCard className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Billing</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="settings"
                    className="group w-full flex items-center px-2 lg:px-1 xl:px-2 2xl:px-4 py-3 hover:bg-gray-100 rounded-r-lg justify-start md:justify-center lg:justify-center xl:justify-start 2xl:justify-start"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto md:mx-0 lg:mx-0 xl:mx-auto 2xl:mx-auto">
                      <div className="w-6 flex justify-center">
                        <Settings className="h-4 w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
                      </div>
                      <span className="ml-2 md:hidden lg:hidden xl:inline 2xl:inline text-xs lg:text-xs xl:text-sm">Settings</span>
                    </div>
                  </TabsTrigger>
                </div>
              </div>
              {/* Bottom section: User controls */}
              <div className="w-full pb-4 hidden lg:block">
                {isSignedIn && (
                  <>
                    <div className="w-full flex justify-center items-center mb-4">
                      <div>
                        <UserButton 
                          appearance={{
                            elements: {
                              userButtonAvatarBox: "w-8 h-8 lg:w-8 lg:h-8 xl:w-10 xl:h-10",
                              userButtonAvatar: "rounded-full",
                              userButtonAction: "hidden",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </>   
                )}
              </div>
            </TabsList>
          </div>

          {/* Main Content Area - REMOVE margin-left to eliminate gap */}
          <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-0">
            <TabsContent
              value="inbox"
              className="flex-1 h-full w-full overflow-hidden m-0"
            >
              <div className="flex w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-0px)]">
                {/* Conversation List - Full alignment with sidebar */}
                {isConversationListVisible && (
                  <div className="transition-all duration-300 ease-in-out bg-white flex flex-col w-full md:w-[260px] lg:w-[280px] xl:w-[320px] 2xl:w-[420px] max-h-screen border-r border-gray-200 relative">
                    <div className="h-full">
                      <ConversationList
                        selectedConversationId={selectedConversationId}
                        onConversationSelect={setSelectedConversationId}
                      />
                    </div>
                  </div>
                )}

                {/* Collapse Button - Adjusted positioning */}
                <div
                  className={`relative transition-all duration-300 ease-in-out ${
                    isConversationListVisible ? "w-[2px] hidden lg:block" : "w-0 min-w-0 hidden lg:block"
                  }`}
                >
                  <div
                    className={`fixed top-4 h-screen ${
                      isConversationListVisible
                        ? "left-[300px] md:left-[280px] lg:left-[312px] xl:left-[356px] 2xl:left-[484px]"
                        : "left-[20px] md:left-[20px] lg:left-[32px] xl:left-[36px] 2xl:left-[64px]"
                    } z-20 transition-all duration-300 ease-in-out hidden lg:block`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="!h-8 !w-8 rounded bg-white-100 hover:bg-gray-300"
                      onClick={() =>
                        setIsConversationListVisible(
                          !isConversationListVisible
                        )
                      }
                    >
                      {isConversationListVisible ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Menu className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Chat View - Seamless alignment */}
                <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen w-full">
                  <div className="h-[calc(100vh-64px)] lg:h-[calc(100vh-0px)]">
                    <ChatView
                      selectedConversationId={selectedConversationId}
                      sharedProduct={sharedProduct}
                      onClearSharedProduct={() => setSharedProduct(null)}
                      isRightSidebarVisible={isRightSidebarVisible}
                      onOpenRightSidebar={() => setIsRightSidebarVisible(true)}
                    />
                  </div>
                </div>

                {/* Right Sidebar - Proper positioning */}
                <div
                  className={`relative transition-all duration-300 ease-in-out ${
                    isRightSidebarVisible ? "w-[280px] lg:w-[300px] xl:w-[340px] 2xl:w-[360px] hidden xl:block" : "w-0 min-w-0 hidden xl:block"
                  }`}
                >
                  {/* Collapse Button - Adjusted positioning */}
                  <div
                    className={`fixed top-[1] h-screen ${
                      isRightSidebarVisible ? "right-[240px] lg:right-[260px] xl:right-[300px] 2xl:right-[310px] top-[11]" : "right-[10px] top-[20]"
                    } z-20 transition-all duration-300 ease-in-out hidden xl:block`}
                  >
                    <Button
                      onClick={() =>
                        setIsRightSidebarVisible(!isRightSidebarVisible)
                      }
                      variant="ghost"
                      size="icon"
                      className="!h-10 !w-10 rounded bg-white-100"
                      aria-label={
                        isRightSidebarVisible
                          ? "Collapse sidebar"
                          : "Expand sidebar"
                      }
                    >
                      {isRightSidebarVisible ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Menu className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Sidebar Content */}
                  <div
                    className={`border-l border-gray-200 h-full ${
                      isRightSidebarVisible ? "block" : "hidden"
                    }`}
                  >
                    {selectedConversationId ? (
                    <Sidebar
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={setSelectedConversationId}
                      onShareProduct={(product) =>
                        setSharedProduct(product)
                      }
                    />
                  ) : (
                      <RemainderSideBar />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Tab Contents - No margin issues */}
            <TabsContent
              value="Contacts"
              className="m-0 flex-1 h-full w-full overflow-hidden"
            >
              <ContactsDashboard />
            </TabsContent>

            <TabsContent
              value="talktodata"
              className="m-0 flex-1 h-full w-full overflow-hidden"
            >
              <TalkToDataTab />
            </TabsContent>

            <TabsContent
              value="analyticsbot"
              className="m-0 flex-1 h-full w-full overflow-hidden"
            >
              <AnalyticsBot />
            </TabsContent>

            <TabsContent
              value="influencerbot"
              className="m-0 flex-1 h-full w-full overflow-hidden"
            >
              <InfluencerBot />
            </TabsContent>

            <TabsContent
              value="billing"
              className="m-0 flex-1 p-3 lg:p-4 xl:p-6 overflow-auto h-full"
            >
              <BillingPlans />
            </TabsContent>

            <TabsContent
              value="settings"
              className="m-0 flex-1 p-3 lg:p-4 xl:p-6 overflow-auto h-full"
            >
              <SettingsSidebar />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
