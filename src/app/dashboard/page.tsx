/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useRouter } from "next/navigation";
import { auth } from "@/components/firebase";
import React, { useRef, useEffect, useState } from "react";
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
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import AnalyticsBot from "@/components/AnalyticsBot/AnalyticsBot";
import RemainderSideBar from "@/components/inbox/ReminderSideBar";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import InfluencerBot from "@/components/influencerBot/influencerbot";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

interface UserProfile {
  email?: string;
  avatar_url?: string;
  full_name?: string;
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
  >("inbox");
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =useState<string>("");
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isConversationListVisible, setIsConversationListVisible] =
    useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const userToggledRef = useRef(false);
  const lastAutoChangeRef = useRef(0);
  const lastCollapsedRef = useRef<"left" | "right" | null>(null);
  const lastCollapsedAtRef = useRef(0);

  const setUserToggled = () => {
    userToggledRef.current = true;
    setTimeout(() => (userToggledRef.current = false), 1000);
  };

  const handleToggleLeft = (visible: boolean) => {
    setUserToggled();
    setIsConversationListVisible(visible);
  };

  const handleToggleRight = (visible: boolean) => {
    setUserToggled();
    setIsRightSidebarVisible(visible);
  };

  // Auto-manage sidebars to prevent overlap at extreme zoom levels
  useEffect(() => {
    const el = mainContentRef.current;
    if (!el) return;

    const MIN_CENTER = 560; // min chat width
    const MIN_LEFT = 240;   // min left width when visible
    const MIN_RIGHT = 260;  // min right width when visible
    const MARGINS = 40;     // safety spacing
    const COOLDOWN_MS = 300;

    const handle = () => {
      if (!el) return;
      const width = el.clientWidth;
      if (width <= 0) return;

      const now = Date.now();
      if (userToggledRef.current || now - lastAutoChangeRef.current < COOLDOWN_MS) return;

      // Hysteresis thresholds
      const collapseRightThreshold = MIN_CENTER + (isConversationListVisible ? MIN_LEFT : 0) + MIN_RIGHT + MARGINS + 20;
      const expandRightThreshold = MIN_CENTER + (isConversationListVisible ? MIN_LEFT : 0) + MIN_RIGHT + MARGINS + 160;

      const collapseLeftThreshold = MIN_CENTER + MIN_LEFT + MARGINS + 20;
      const expandLeftThreshold = MIN_CENTER + MIN_LEFT + MARGINS + 160;

      // Collapse order: right then left
      if (isRightSidebarVisible && width < collapseRightThreshold) {
        setIsRightSidebarVisible(false);
        lastAutoChangeRef.current = now;
        lastCollapsedRef.current = "right";
        lastCollapsedAtRef.current = now;
        return;
      }
      if (isConversationListVisible) {
        const needWithLeft = MIN_CENTER + MARGINS + (isRightSidebarVisible ? MIN_RIGHT : 0) + MIN_LEFT;
        if (width < needWithLeft) {
          setIsConversationListVisible(false);
          lastAutoChangeRef.current = now;
          lastCollapsedRef.current = "left";
          lastCollapsedAtRef.current = now;
          return;
        }
      }

      // Expand order: left then right
      if (
        !isConversationListVisible &&
        width > expandLeftThreshold &&
        !(lastCollapsedRef.current === "left" && now - lastCollapsedAtRef.current < 1200)
      ) {
        setIsConversationListVisible(true);
        lastAutoChangeRef.current = now;
        lastCollapsedRef.current = null;
        return;
      }
      if (
        !isRightSidebarVisible &&
        width > expandRightThreshold &&
        !(lastCollapsedRef.current === "right" && now - lastCollapsedAtRef.current < 1200)
      ) {
        setIsRightSidebarVisible(true);
        lastAutoChangeRef.current = now;
        lastCollapsedRef.current = null;
      }
    };

    const ro = new ResizeObserver(() => handle());
    ro.observe(el);
    window.addEventListener("resize", handle);
    handle();
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handle);
    };
  }, [isConversationListVisible, isRightSidebarVisible]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/login");
        return;
      }
      setUser(user);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
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
          <div className="w-36 fixed left-0 h-full z-20">
            <TabsList className="h-full flex flex-col items-start justify-between pt-6 bg-white/90 backdrop-blur-sm border-r">
              {/* Top section: Logo and Profile */}
              <div className="w-full">
                <div className="w-full flex items-center justify-center gap-2 mb-6">
                  <Link href="/">
                    <Image src="/logo.png" alt="logo" width={30} height={30} />
                  </Link>
                  {/* Show menu button when conversation list is hidden */}
                  {!isConversationListVisible && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="!h-8 !w-8 rounded bg-white hover:bg-gray-100 shadow"
                      onClick={() => setIsConversationListVisible(true)}
                      aria-label="Open conversation list"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
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

              {/* Bottom section: Logout button and Profile */}
              <div className="w-full px-4 pb-13 flex flex-col items-center">
                {/* Logout button above avatar */}
                <div className="w-full mb-4">
                  {user && (
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`w-full p-1 py-15
          flex items-center justify-center gap-2
          text-red-600 hover:bg-red-50
          rounded-lg transition-colors duration-200
          ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isLoggingOut ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <>
                          <LogOut className="h-5 w-5" />
                          {/* <span>Logout</span> */}
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Profile Section below logout button */}
                {user && (
                  <div className="flex flex-col items-center w-full">
                    <div className="cursor-pointer rounded-lg p-2 flex flex-col items-center w-full">
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

                      {/* Email displayed below avatar - fully visible */}
                      <div className="mt-1 text-xs text-gray-600 break-words text-center w-full max-w-[130px]">
                        {user.email}
                      </div>
                    </div>
                  </div>
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
              <TabsContent
                value="inbox"
                className="flex-1 h-full w-full overflow-hidden m-0"
              >
                <div className="flex w-full h-[calc(100vh-0px)]">
                  {/* Conversation List - Fixed width */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isConversationListVisible
                        ? "bg-white flex flex-col w-[min(22vw,340px)] min-w-[240px] max-w-[420px] max-h-screen pr-2"
                        : "w-0 min-w-0"
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
                    {/* Left collapse (X) only when list is visible */}
                    {isConversationListVisible && (
                      <div className="absolute top-5 -right-3 z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="!h-8 !w-8 rounded bg-white hover:bg-gray-100 shadow"
                          onClick={() => handleToggleLeft(false)}
                          aria-label="Collapse conversation list"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>


                  {/* Chat View - Flexible width */}
                  <div ref={mainContentRef} className="flex-1 flex flex-col min-w-[min(50vw,560px)] h-full">
                    <div className="h-[calc(100vh-0px)]">
                      <ChatView
                        selectedConversationId={selectedConversationId}
                        sharedProduct={sharedProduct}
                        onClearSharedProduct={() => setSharedProduct(null)}
                        isRightSidebarVisible={isRightSidebarVisible}
                        onOpenRightSidebar={() => setIsRightSidebarVisible(true)}
                      />
                    </div>
                  </div>

                  {/* Right Sidebar - Collapsible */
                  }
                  <div
                    className={`relative transition-all duration-300 ease-in-out ${
                      isRightSidebarVisible
                        ? "w-[min(24vw,360px)] min-w-[260px] max-w-[420px]"
                        : "w-0 min-w-0"
                    }`}
                  >
                    {/* Right collapse (X) only when sidebar is visible */}
                    {isRightSidebarVisible && (
                      <div className="absolute top-5 -left-3 z-20">
                        <Button
                          onClick={() => handleToggleRight(false)}
                          variant="ghost"
                          size="icon"
                          className="!h-8 !w-8 rounded bg-white hover:bg-gray-100 shadow"
                          aria-label="Collapse sidebar"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

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
                      {/* {showTeamPanel && (
                        <div className="mt-4">
                          <TeamCollaboration />
                        </div>
                      )} */}
                    </div>
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
