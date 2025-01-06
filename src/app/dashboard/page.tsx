'use client';
// import {toast, Toaster} from 'sonner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/firebase';
import React, { useState } from "react";
// import TopNavigation from "@/components/inbox/TopNavigation";
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
// import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  // Wand2,
  // Users,
} from "lucide-react";




// const Home = ({
//   selectedChannels = ["all"],
//   selectedConversationId = "",
//   isTranslationEnabled = false,
// }: HomeProps) => {
  export default function DashboardPage(){
    const router = useRouter()
    const [activeView, setActiveView] = useState<"inbox" | "analytics" | "billing" | "settings">("inbox")
    const [showTeamPanel, setShowTeamPanel] = useState(true)
    const [selectedConversationId, setSelectedConversationId] = useState<string>("");
    const [isAIEnabled, setIsAIEnabled] = useState(false);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/login')
        }
      })
      return () => unsubscribe()
    }, [router])

    const handleConversationSelect = (id: string) => {
      setSelectedConversationId(id);
    };

  return (
    <>
    <div className="bg-black text-white h-screen flex justify-center items-center text-center font-semibold px-4 md:flex lg:hidden">Dashboard is currently supported only on desktop screens.</div>
    <div className="hidden lg:flex min-h-screen bg-gray-100  flex-col">

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as typeof activeView)}
        className="flex-1 flex flex-col"
      >
        <div className="border-b py-2 sticky top-0 z-[10] bg-white px-4">
          <TabsList>
            <TabsTrigger value="inbox" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing & Usage
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inbox" className="flex-1 flex overflow-hidden m-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15}>
              <ConversationList
                selectedConversationId={selectedConversationId}
                onConversationSelect={handleConversationSelect}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex-1 flex flex-col h-full">
                <ChatView isAIEnabled={isAIEnabled} />
                <div className="h-[200px] border-t">
                  <ConversationSummary />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full flex flex-col">
                <Sidebar />
                {showTeamPanel && (
                  <div className="mt-4">
                    <TeamCollaboration />
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        <TabsContent value="analytics" className="m-0 flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <AnalyticsDashboard />
            <div className="grid grid-cols-2 gap-6">
              <AutomationRules />
              <TeamCollaboration />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="m-0 flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <UsageMetrics />
            <BillingPlans />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="m-0 flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <AutomationRules />
          </div>
        </TabsContent>
      </Tabs>

      <StatusBar />
    </div>
    </>
  );
};


