'use client';
// import {toast, Toaster} from 'sonner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/firebase';
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
  
// import { Phone, Video, MessageSquare, Globe, Smile, Paperclip, Send } from 'lucide-react'

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
          onConversationSelect={setSelectedConversationId}
        />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="flex-1 flex flex-col h-full">
          <ChatView selectedConversationId={selectedConversationId}  />
          
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


    // <div className="flex h-screen bg-white">
    //   {/* Left Sidebar - Inbox */}
    //   <div className="w-80 border-r">
    //     <div className="p-4 border-b">
    //       <h2 className="text-xl font-semibold">Inbox</h2>
    //     </div>
    //     <div className="overflow-y-auto">
    //       <div className="p-4 hover:bg-gray-50 cursor-pointer border-b">
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-center space-x-3">
    //             <div className="w-10 h-10 bg-blue-100 rounded-full"></div>
    //             <div>
    //               <div className="font-medium">Alice Johnson</div>
    //               <div className="text-sm text-gray-500">Thank you for...</div>
    //               <div className="text-xs text-gray-400">2m ago</div>
    //             </div>
    //           </div>
    //           <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">High</span>
    //         </div>
    //       </div>
    //       <div className="p-4 hover:bg-gray-50 cursor-pointer border-b">
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-center space-x-3">
    //             <div className="w-10 h-10 bg-green-100 rounded-full"></div>
    //             <div>
    //               <div className="font-medium">Bob Smith</div>
    //               <div className="text-sm text-gray-500">When will...</div>
    //               <div className="text-xs text-gray-400">15m ago</div>
    //             </div>
    //           </div>
    //           <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">Medium</span>
    //         </div>
    //       </div>
    //       <div className="p-4 hover:bg-gray-50 cursor-pointer border-b">
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-center space-x-3">
    //             <div className="w-10 h-10 bg-pink-100 rounded-full"></div>
    //             <div>
    //               <div className="font-medium">Carol White</div>
    //               <div className="text-sm text-gray-500">I'm still waiting...</div>
    //               <div className="text-xs text-gray-400">1h ago</div>
    //             </div>
    //           </div>
    //           <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">Low</span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Chat Area */}
    //   <div className="flex-1 flex flex-col">
    //     {/* Chat Header */}
    //     <div className="p-4 border-b flex items-center justify-between">
    //       <div>
    //         <h2 className="text-lg font-semibold">John Doe</h2>
    //         <div className="text-sm text-gray-500">Active | Last seen 2m ago</div>
    //       </div>
    //       <div className="flex items-center space-x-4">
    //         <Phone className="w-5 h-5 text-gray-500 cursor-pointer" />
    //         <Video className="w-5 h-5 text-gray-500 cursor-pointer" />
    //         <MessageSquare className="w-5 h-5 text-gray-500 cursor-pointer" />
    //         <Globe className="w-5 h-5 text-gray-500 cursor-pointer" />
    //       </div>
    //     </div>

    //     {/* Chat Messages */}
    //     <div className="flex-1 overflow-y-auto p-4 space-y-4">
    //       <div className="bg-gray-100 p-3 rounded-lg max-w-md">
    //         Hello! How can I help you today?
    //       </div>
    //       <div className="flex justify-end">
    //         <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
    //           I need help with my recent order.
    //         </div>
    //       </div>
    //     </div>

    //     {/* Message Input */}
    //     <div className="p-4 border-t">
    //       <div className="flex items-center space-x-2">
    //         <Smile className="w-6 h-6 text-gray-400 cursor-pointer" />
    //         <Paperclip className="w-6 h-6 text-gray-400 cursor-pointer" />
    //         <input
    //           type="text"
    //           placeholder="Type your message..."
    //           className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //         <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
    //           <Send className="w-5 h-5" />
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Right Sidebar - Templates */}
    //   <div className="w-80 border-l">
    //     <div className="p-4 border-b">
    //       <h2 className="text-xl font-semibold">Templates</h2>
    //     </div>
    //     <div className="p-4 space-y-2">
    //       <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
    //         Order Status Update
    //       </div>
    //       <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
    //         Product Information
    //       </div>
    //       <div className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
    //         Welcome Message
    //       </div>
    //     </div>
    //   </div>
    // </div>
