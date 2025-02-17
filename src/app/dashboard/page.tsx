"use client";
// import {toast, Toaster} from 'sonner';
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
import ContactsDashboard from "@/components/contacts/ContactsDashboard";
import SettingsSidebar from "@/components/setting_tab/SettingsSidebar";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  Contact,
  Contact2Icon,
  ContactRoundIcon,
  // Wand2,
  // Users,
} from "lucide-react";
import { EmojiProvider } from '@/components/EmojiProvider';




// const Home = ({
//   selectedChannels = ["all"],
//   selectedConversationId = "",
//   isTranslationEnabled = false,
// }: HomeProps) => {
  
// import { Phone, Video, MessageSquare, Globe, Smile, Paperclip, Send } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    "inbox" | "analytics" | "billing" | "settings"
  >("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

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
          <div className="w-16 hover:w-48 transition-all duration-300 ease-in-out fixed left-0 h-full z-20">
            <TabsList className="h-full flex-col items-start justify-start gap-4 pt-6 bg-white/90 backdrop-blur-sm border-r">
              <TabsTrigger
                value="inbox"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Inbox
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger>

              {/* <TabsTrigger
                value="analytics"
                className="group w-full justify-center px-4 py-3 hover:bg-gray-100 rounded-r-lg relative"
              >
                <BarChart2 className="h-5 w-5" />
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Analytics
                  <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
                </span>
              </TabsTrigger> */}

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
            </TabsList>{" "}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col ml-16 overflow-hidden">
          <TabsContent value="inbox" className="flex-1 flex overflow-hidden h-full m-0">
            <TabsContent value="inbox" className="flex-1 flex overflow-hidden h-full m-0">
            <div className="flex w-full">
              {/* Conversation List - Fixed width */}
              <div className="w-[320px] min-w-[280px] border-r border-gray-200">
                <ConversationList
                  selectedConversationId={selectedConversationId}
                  onConversationSelect={setSelectedConversationId}
                />
              </div>

              {/* Chat View - Flexible width */}
              <div className="flex-1 flex flex-col h-full min-w-[400px]">
                <ChatView selectedConversationId={selectedConversationId} />
              </div>

              {/* Right Sidebar - Fixed width */}
              <div className="w-[360px] min-w-[280px] border-l border-gray-200">
                {selectedConversationId && (
                  <Sidebar 
                    selectedConversationId={selectedConversationId}
                    onConversationSelect={setSelectedConversationId} 
                  />
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
              className="m-0 flex-1 h-full overflow-hidden"
            >
              <ContactsDashboard />
            </TabsContent>

            {/* <TabsContent
              value="analytics"
              className="m-0 flex-1 p-6 overflow-auto"
            >
              <AnalyticsDashboard />
            </TabsContent> */}

            <TabsContent
              value="billing"
              className="m-0 flex-1 p-6 overflow-auto"
            >
              <BillingPlans />
            </TabsContent>

            <TabsContent
              value="settings"
              className="m-0 flex-1 p-6 overflow-auto"
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
