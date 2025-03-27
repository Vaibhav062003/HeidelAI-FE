/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);



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

interface UserProfile {
  email?: string;
  avatar_url?: string;
  full_name?: string;
}

// const Home = ({
//   selectedChannels = ["all"],
//   selectedConversationId = "",
//   isTranslationEnabled = false,
// }: HomeProps) => {
  
// import { Phone, Video, MessageSquare, Globe, Smile, Paperclip, Send } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<
    "inbox" | "analytics" | "billing" | "settings" | "talktodata"
  >("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);



  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
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
          <div className="max-w-10 fixed left-0 h-full z-20">
          <TabsList className="h-full flex-col items-start justify-start gap-4 pt-6 bg-white/90 backdrop-blur-sm border-r">
          <div className="w-full flex justify-center items-center mb-6">
                <Link href="/">
              <Image src='/logo.png' alt="logo" width={30} height={30}/>
              </Link>
              </div>

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
<div className="mt-auto mb-6 w-full">
  {user && (
    <div className="relative ">
      {/* Always visible logout button */}
      <button
  onClick={handleLogout}
  disabled={isLoggingOut}
  className={`w-full mb-2 p-2 py-3 
    flex items-center justify-center gap-2
    text-red-600 hover:bg-red-50
    rounded-lg transition-colors duration-200
    ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  {isLoggingOut ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
  ) : (
    <LogOut className="h-5 w-5" />
  )}
</button>



      {/* Profile Section */}
      <div className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 relative group">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {user.email?.[0].toUpperCase()}
            </span>
          </div>
        )}
        {/* Email tooltip on hover */}
        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-gray-800 text-white px-2 py-1 rounded-md text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {user.email}
          <div className="absolute right-full top-1/2 w-1.5 h-1.5 -mt-0.5 -mr-0.5 bg-gray-800 rotate-45" />
        </span>
      </div>
    </div>
  )}
</div>
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
                {selectedConversationId && (
                  <Sidebar 
                  selectedConversationId={selectedConversationId}
                  onConversationSelect={setSelectedConversationId}
                  onShareProduct={(product) => setSharedProduct(product)}
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
              className="m-0 flex-1 fixed top-0  w-[96vw] h-full overflow-hidden"
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
              value="talktodata"
              className="m-0 flex-1 fixed top-0 w-[96vw] h-full overflow-hidden"
            >
              <TalkToDataTab />
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
