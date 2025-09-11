/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/components/firebase";
import React, { useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Inbox } from "lucide-react";
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
import { UserButton, UserProfile, useUser, SignedIn, OrganizationSwitcher, SignOutButton, useClerk } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

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
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [isConversationListVisible, setIsConversationListVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();



  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; 
    // your custom logic here
    toast.success("Signed out successfully!");
    localStorage.clear();
    // redirect manually
  };

  useEffect(() => {
    // console.log(user);
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router, user]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);
  };

  return (
    <>
      <div className="bg-black text-white h-screen flex justify-center items-center text-center font-semibold px-4 md:flex lg:hidden">
        Dashboard is currently supported only on desktop screens.
      </div>
      <div className="hidden lg:flex min-h-screen bg-gray-100">
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as typeof activeView)}
          className="flex-1 flex overflow-hidden"
        >
          {/* Left Sidebar */}
          <div className="w-36 fixed left-0 h-full z-20">
            <TabsList className="h-full flex flex-col items-start justify-between pt-6 bg-white/90 backdrop-blur-sm border-r">
              {/* Top section: Logo and Profile */}
              <div className="w-full">
                <div className="w-full flex justify-center items-center mb-6">
                  <Link href="/">
                    <Image src="/logo.png" alt="logo" width={30} height={30} />
                  </Link>
                </div>

                {/* Navigation Tabs */}
                <div className="w-full space-y-1">
                  <TabsTrigger
                    onClick={() => {
                      setSelectedConversationId("");
                    }}
                    value="inbox"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Inbox</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="Contacts"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <ContactRoundIcon className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Contacts</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="talktodata"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <BotMessageSquare className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Talk to Data</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="analyticsbot"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <BarChart2 className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Analytics</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="influencerbot"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <InstagramLogoIcon className="h-5 w-5" />
                      </div>
                      <span className="ml-2">InfluIndex</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="billing"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Billing</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="settings"
                    className="group w-full flex items-center px-4 py-3 hover:bg-gray-100 rounded-r-lg"
                  >
                    <div className="flex items-center w-full max-w-[140px] mx-auto">
                      <div className="w-6 flex justify-center">
                        <Settings className="h-5 w-5" />
                      </div>
                      <span className="ml-2">Settings</span>
                    </div>
                  </TabsTrigger>
                </div>
              </div>

              {/* Bottom section: User controls */}
              <div className="w-full pb-4">
                {isSignedIn && (
                  <>
                    <div className="w-full flex justify-center items-center mb-4">
                      <div className="w-full flex justify-center items-center mb-4">
                          <button
                            onClick={handleSignOut}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 hover:bg-red-700 transition shadow-lg"
                            title="Logout"
                          >
                            <LogOut className="h-5 w-5 text-white" />
                          </button>
                        </div>
                    </div>
                    {/* <div className="w-full flex justify-center items-center">
                      <div className="relative flex items-center">
                        <button
                          onClick={() => setShowOrgSwitcher((v) => !v)}
                          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                          title="Switch Organization"
                        >
                          <span className="text-gray-700 font-bold">Org</span>
                        </button>
                        {showOrgSwitcher && (
                          <div className="absolute left-full top-0 z-30 ml-2">
                            <OrganizationSwitcher
                              afterCreateOrganizationUrl="/org/:slug"
                              afterSelectOrganizationUrl="/org/:slug"
                              afterSelectPersonalUrl="/dashboard"
                              appearance={{
                                elements: {
                                  organizationSwitcherButton:
                                    "w-10 h-10 rounded-full bg-transparent p-0 flex items-center justify-center",
                                  organizationPreviewAvatarBox: "w-10 h-10",
                                  organizationPreviewAvatar: "hidden",
                                },
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div> */}
                  </>   
                )}
              </div>
            </TabsList>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col ml-36 overflow-hidden">
            <TabsContent
              value="inbox"
              className="flex-1 h-full w-full overflow-hidden m-0"
            >
              <div className="flex w-full h-full">
                {/* Conversation List - Fixed width */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isConversationListVisible ? "w-[290px]" : "w-0 min-w-0"
                  } border-r border-gray-200 relative`}
                >
                  <div
                    className={`${
                      isConversationListVisible ? "block" : "hidden"
                    }`}
                  >
                    <ConversationList
                      selectedConversationId={selectedConversationId}
                      onConversationSelect={setSelectedConversationId}
                    />
                  </div>
                </div>

                {/* Collapse Button - Positioned to always be visible */}
                <div
                  className={`relative transition-all duration-300 ease-in-out ${
                    isConversationListVisible ? "w-[2px]" : "w-0 min-w-0"
                  }`}
                >
                  <button
                    onClick={() =>
                      setIsConversationListVisible(!isConversationListVisible)
                    }
                    className="h-full w-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    {isConversationListVisible ? (
                      <ChevronLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Chat View - Flexible width */}
                <div className="flex-1 flex flex-col h-full min-w-[400px]">
                  <div className="h-full">
                    <ChatView
                      selectedConversationId={selectedConversationId}
                      sharedProduct={sharedProduct}
                      onClearSharedProduct={() => setSharedProduct(null)}
                    />
                  </div>
                </div>

                {/* Right Sidebar - Collapsible */}
                <div
                  className={`relative transition-all duration-300 ease-in-out ${
                    isRightSidebarVisible ? "w-[360px]" : "w-0 min-w-0"
                  }`}
                >
                  {/* Collapse Button */}
                  <div
                    className={`fixed top-0 h-screen ${
                      isRightSidebarVisible ? "right-[360px]" : "right-[2px]"
                    } z-20 transition-all duration-300 ease-in-out`}
                  >
                    <button
                      onClick={() =>
                        setIsRightSidebarVisible(!isRightSidebarVisible)
                      }
                      className="h-full w-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      {isRightSidebarVisible ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </button>
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
                    {showTeamPanel && (
                      <div className="mt-4">
                        <TeamCollaboration />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="Contacts"
              className="m-0 flex-1 fixed top-0 w-[96vw] h-full overflow-hidden"
            >
              <ContactsDashboard />
            </TabsContent>

            <TabsContent
              value="talktodata"
              className="m-0 flex-1 fixed top-0 w-[96vw] h-full overflow-hidden"
            >
              <TalkToDataTab />
            </TabsContent>

            <TabsContent
              value="analyticsbot"
              className="m-0 flex-1 fixed top-0 w-[96vw] h-full overflow-hidden"
            >
              <AnalyticsBot />
            </TabsContent>

            <TabsContent
              value="influencerbot"
              className="m-0 flex-1 fixed top-0 w-[96vw] h-full overflow-hidden"
            >
              <InfluencerBot />
            </TabsContent>

            <TabsContent
              value="billing"
              className="m-0 fixed top-0 w-[96vw] flex-1 p-6 overflow-auto"
            >
              <BillingPlans />
            </TabsContent>

            <TabsContent
              value="settings"
              className="m-0 fixed top-0 w-[96vw] flex-1 p-6 overflow-auto"
            >
              <SettingsSidebar />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}