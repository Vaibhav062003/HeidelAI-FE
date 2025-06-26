/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
// import {toast, Toaster} from 'sonner';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, app } from '@/components/firebase';
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
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  Contact,
  Contact2Icon,
  ContactRoundIcon,
  BotMessageSquare,
  LogOut
  // Wand2,
  // Users,
} from "lucide-react";
import { EmojiProvider } from '@/components/EmojiProvider';
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
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User2 } from "lucide-react"; // Profile icon

interface Product {
  id: string;
  category: string;
  description: string;
  images: string;
  name: string;
  on_sale: string; // Use boolean if the data contains `true/false` instead of `"True"/"False"`
  permalink: string;
  price: number;
  product_id: number;
  purchasable: string; // Use boolean if the data contains `true/false`
  regular_price: string; // Use `number` if parsed as numeric values
  sale_price: string; // Use `number` if parsed as numeric values
  slug: string;
  stock_quantity: number;
}

function AccountMenu() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition"
          aria-label="Account menu"
        >
          <User2 className="w-6 h-6 text-gray-700" />
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-white rounded-xl shadow-xl max-w-xs w-full">
<div className="flex flex-col items-center gap-4 py-6 px-4">
  {/* User Info Section */}
  <p className="text-xs text-gray-5">User Profile</p>
  <div className="flex flex-col items-center w-full border-b pb-4">
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "w-12 h-12",
          userButtonAvatar: "rounded-full",
          userButtonProfileIcon: "hidden", // Hide the default profile icon
        },
      }}
    />

  </div>

  {/* Organization Switcher Section */}
  <div className="w-full flex flex-col items-center gap-2">
    <span className="text-xs text-gray mb-2">Organization</span>
          <OrganizationSwitcher
            appearance={{
              elements: {
                organizationPreviewAvatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
  "inbox" | "analytics" | "billing" | "settings" | "talktodata" | "analyticsbot"
>("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

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
          <div className="max-w-10 fixed left-0 h-full z-20">
          <TabsList className="h-full flex-col items-start justify-start gap-4 pt-6 bg-white/90 backdrop-blur-sm border-r">
          <div className="w-full flex justify-center items-center mb-6">
                <Link href="/" >
                  <Image src='/logo.png' alt="logo" width={30} height={30}/>
              </Link>
              </div>

              <TabsTrigger
                onClick={() => { setSelectedConversationId(""); }}
                value="inbox"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Inbox
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="Contacts"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <ContactRoundIcon className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Contacts
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="talktodata"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <BotMessageSquare className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Talk to Data
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="analyticsbot"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <BarChart2 className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Analytics Bot
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
          value="influencerbot"
          className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
                >
                <InstagramLogoIcon className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Influencer Analysis
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <CreditCard className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Billing
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <Settings className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Settings
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              {isSignedIn && (
                <div className="w-full flex justify-center items-center mt-6">
                  <AccountMenu />
                </div>
              )}
            </TabsList>{" "}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col ml-16 overflow-hidden">
          <TabsContent value="inbox" className="flex-1 flex overflow-hidden h-full m-0">
            <TabsContent value="inbox" className="flex-1 flex overflow-hidden h-full m-0">
            <div className="flex w-full">
              {/* Conversation List - Fixed width */}
              <div className="w-[290px] min-w-[280px] border-r border-gray-200">
                <ConversationList
                  selectedConversationId={selectedConversationId}
                  onConversationSelect={setSelectedConversationId}
                />
              </div>

              {/* Chat View - Flexible width */}
              <div className="flex-1 flex flex-col h-full min-w-[400px]">
              <ChatView
                selectedConversationId={selectedConversationId}
                sharedProduct={sharedProduct}
                onClearSharedProduct={() => setSharedProduct(null)}
              />
              </div>

              {/* Right Sidebar - Fixed width */}
              <div className="w-[360px] min-w-[280px] border-l border-gray-200">
                {selectedConversationId ? (
                  <Sidebar
                  selectedConversationId={selectedConversationId}
                  onConversationSelect={setSelectedConversationId}
                  onShareProduct={(product) => setSharedProduct(product)}
                />
                ):(
                  <RemainderSideBar/>
                )}
                {showTeamPanel && (
                  <div className="mt-4">
                    <TeamCollaboration />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
            </TabsContent>

            <TabsContent
              value="Contacts"
              className="m-0 flex-1 fixed top-0  w-[96vw] h-full overflow-hidden"
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
              <AnalyticsBot/>
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

            {/* <StatusBar /> */}
          </div>
        </Tabs>
      </div>
    </>
);
}
