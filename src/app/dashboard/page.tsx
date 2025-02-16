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

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    "inbox" | "analytics" | "billing" | "settings"
  >("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(true);
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
            <TabsContent value="inbox" className="m-0 flex-1 overflow-hidden">
              <div className="flex h-full bg-white">
                {/* Left Sidebar with Tabs */}
                <div className="w-80 border-r flex flex-col">
                  <div className="p-4 border-b">
                    <Tabs defaultValue="conversations" className="space-y-4">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="conversations">Chats</TabsTrigger>
                        <TabsTrigger value="unattended">Unattended</TabsTrigger>
                        <TabsTrigger value="mentions">Mentions</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto">
                    <TabsContent
                      value="conversations"
                      className="m-0 p-2 h-full"
                    >
                      <ConversationList
                        selectedConversationId={selectedConversationId}
                        onConversationSelect={setSelectedConversationId}
                      />
                    </TabsContent>

                    {/* <TabsContent value="unattended" className="m-0 p-2 h-full">
            <UnattendedList
              onConversationSelect={setSelectedConversationId}
            />
          </TabsContent>
          
          <TabsContent value="mentions" className="m-0 p-2 h-full">
            <MentionsList
              onConversationSelect={setSelectedConversationId}
            />
          </TabsContent> */}
                  </div>
                </div>

                {/* Chat View */}
                <div className="flex-1 flex flex-col border-r">
                  {selectedConversationId ? (
                    <>
                      <div className="p-4 border-b flex items-center justify-between"></div>
                      <ChatView
                        selectedConversationId={selectedConversationId}
                        className="flex-1 overflow-y-auto bg-gray-50"
                      />
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-500 text-lg">
                        Uh oh! Looks like there are no messages from customers
                        in your inbox.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="w-96 bg-white flex flex-col">
                  <Sidebar />
                </div>
              </div>
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

            <StatusBar />
          </div>
        </Tabs>
      </div>
    </>
  );
}
