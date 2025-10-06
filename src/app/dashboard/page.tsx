"use client";
import { useEffect, useState, useRef, memo, useCallback, useMemo, useTransition, Suspense } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import TopNavigation from "@/components/inbox/TopNavigation";
import ConversationList from "@/components/inbox/ConversationList";
import SettingsSidebar from "@/components/setting_tab/SettingsSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/inbox_button";
import { X } from "lucide-react";
import { Conversation } from "@/components/types/conversation";
import { ConversationProvider } from "@/components/hooks/useGlobalConversations";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  ContactRoundIcon,
  BotMessageSquare,
  ChevronLeft,
  Tag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import RemainderSideBar from "@/components/inbox/ReminderSideBar";
import { UserButton, useUser } from '@clerk/nextjs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const ChatView = dynamic(() => import("@/components/inbox/ChatView"), {
  ssr: false,
  loading: () => <ChatViewSkeleton />
});

const Sidebar = dynamic(() => import("@/components/inbox/Sidebar"), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full"></div>
});

const ContactsDashboard = dynamic(() => import("@/components/Contacts/ContactsDashboard"), {
  ssr: false,
  loading: () => <TabLoadingSkeleton />
});

const TalkToDataTab = dynamic(() => import("@/components/TalkToData/TalkToDataTab"), {
  ssr: false,
  loading: () => <TabLoadingSkeleton />
});

const AnalyticsBot = dynamic(() => import("@/components/AnalyticsBot/AnalyticsBot"), {
  ssr: false,
  loading: () => <TabLoadingSkeleton />
});

const InfluencerBot = dynamic(() => import("@/components/influencerBot/influencerbot"), {
  ssr: false,
  loading: () => <TabLoadingSkeleton />
});

const BillingPlans = dynamic(() => import("@/components/inbox/BillingPlans"), {
  ssr: false,
  loading: () => <TabLoadingSkeleton />
});

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

const ChatViewSkeleton = memo(() => (
  <div className="h-full flex flex-col bg-white">
    <div className="p-4 border-b flex items-center gap-3">
      <div className="w-10 h-10 skeleton rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-32 skeleton rounded" />
        <div className="h-3 w-24 skeleton rounded" />
      </div>
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[70%] p-4 skeleton rounded-2xl h-16 ${i % 2 === 0 ? 'w-48' : 'w-56'}`}></div>
        </div>
      ))}
    </div>
    <div className="p-4 border-t">
      <div className="skeleton h-10 rounded-lg" />
    </div>
  </div>
));
ChatViewSkeleton.displayName = "ChatViewSkeleton";

const TabLoadingSkeleton = memo(() => (
  <div className="h-full w-full flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 skeleton rounded-full mx-auto" />
      <div className="h-4 w-32 skeleton rounded mx-auto" />
    </div>
  </div>
));
TabLoadingSkeleton.displayName = "TabLoadingSkeleton";

const MobileHeader = memo(({ 
  activeView, 
  showMobileConversationList,
  selectedConversationId,
  onOpenNavigation,
  onBackToList,
  getTabTitle 
}: {
  activeView: string;
  showMobileConversationList: boolean;
  selectedConversationId: string;
  onOpenNavigation: () => void;
  onBackToList: () => void;
  getTabTitle: () => string;
}) => {
  const handleSettingsClick = useCallback(() => {
    const event = new CustomEvent('openSettingsSidebar');
    window.dispatchEvent(event);
  }, []);

  const handleContactsTagsClick = useCallback(() => {
    const event = new CustomEvent('openContactsTags');
    window.dispatchEvent(event);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-200/50 md:hidden">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNavigation}
          className="h-10 w-10 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {activeView === "settings" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
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
            onClick={handleContactsTagsClick}
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
            onClick={onBackToList}
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
  );
});
MobileHeader.displayName = "MobileHeader";

const NavigationItem = memo(({ 
  value, 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        className={`
          group w-10 h-10 flex items-center justify-center
          rounded-2xl transition-all duration-200
          hover:scale-80 hover:shadow-lg
          focus:outline-none
          ${isActive 
            ? 'bg-gray-200 text-black shadow-lg' 
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/80'
          }
        `}
      >
        <Icon className="h-4 w-4" />
      </button>
    </TooltipTrigger>
    
    <TooltipContent 
      side="right" 
      className="bg-gray-700/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg border-0 z-[60]"
      sideOffset={8}
    >
      <span className="text-sm font-medium">{label}</span>
    </TooltipContent>
  </Tooltip>
));
NavigationItem.displayName = "NavigationItem";

const SidebarNavigation = memo(({ 
  activeView, 
  isNavigationVisible,
  isConversationListVisible,
  onCloseNavigation,
  onShowConversationList,
  onNavigate,
  isPending
}: {
  activeView: string;
  isNavigationVisible: boolean;
  isConversationListVisible: boolean;
  onCloseNavigation: () => void;
  onShowConversationList: () => void;
  onNavigate: (value: string) => void;
  isPending: boolean;
}) => {
  const navigationItems = useMemo(() => [
    { value: "inbox", icon: MessageSquare, label: "Inbox" },
    { value: "Contacts", icon: ContactRoundIcon, label: "Contacts" },
    { value: "talktodata", icon: BotMessageSquare, label: "Talk to Data" },
    { value: "analyticsbot", icon: BarChart2, label: "Analytics" },
    { value: "influencerbot", icon: InstagramLogoIcon, label: "InfluIndex" },
    { value: "billing", icon: CreditCard, label: "Billing" },
    { value: "settings", icon: Settings, label: "Settings" }
  ], []);

  return (
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
      ${isPending ? 'pointer-events-none opacity-70' : ''}
    `}>
      <div className="h-full flex flex-col justify-between p-3 w-full bg-transparent">
        <div className="w-full space-y-4">
          <div className="flex justify-center items-center relative">
            <Link href="/dashboard" className="group">
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
              onClick={onCloseNavigation}
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
                    onClick={onShowConversationList}
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
            {navigationItems.map(({ value, icon, label }) => (
              <NavigationItem
                key={value}
                value={value}
                icon={icon}
                label={label}
                isActive={activeView === value}
                onClick={() => onNavigate(value)}
              />
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
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 animate-pulse"></div>
      )}
    </aside>
  );
});
SidebarNavigation.displayName = "SidebarNavigation";

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

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleMobileConversationSelect = useCallback((id: string) => {
    startTransition(() => {
      setSelectedConversationId(id);
      setShowMobileConversationList(false);
    });
  }, []);

  const handleMobileBackToList = useCallback(() => {
    setShowMobileConversationList(true);
  }, []);

  const handleConversationSelect = useCallback((id: string) => {
    startTransition(() => {
      setSelectedConversationId(id);
      if (window.innerWidth < 768) {
        setShowMobileConversationList(false);
      }
    });
  }, []);

  const handleNavigation = useCallback((value: string) => {
    startTransition(() => {
      if (value === "inbox") setSelectedConversationId("");
      setActiveView(value as typeof activeView);
      setIsNavigationVisible(false);
    });
  }, []);

  const handleClearSharedProduct = useCallback(() => {
    setSharedProduct(null);
  }, []);

  const handleShareProduct = useCallback((product: Product | null) => {
    setSharedProduct(product);
  }, []);

  const handleToggleRightSidebar = useCallback(() => {
    setIsRightSidebarVisible(prev => !prev);
  }, []);

  const handleToggleConversationList = useCallback(() => {
    setIsConversationListVisible(prev => !prev);
  }, []);

  const handleOpenNavigation = useCallback(() => {
    setIsNavigationVisible(true);
  }, []);

  const handleCloseNavigation = useCallback(() => {
    setIsNavigationVisible(false);
  }, []);

  const handleShowConversationList = useCallback(() => {
    setIsConversationListVisible(true);
  }, []);

  const getTabTitle = useCallback(() => {
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
  }, [activeView]);

  return (
    <ConversationProvider>
      <TooltipProvider>
        <style jsx global>{`
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

        <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader
            activeView={activeView}
            showMobileConversationList={showMobileConversationList}
            selectedConversationId={selectedConversationId}
            onOpenNavigation={handleOpenNavigation}
            onBackToList={handleMobileBackToList}
            getTabTitle={getTabTitle}
          />

          {/* Left Navigation Sidebar */}
          <SidebarNavigation
            activeView={activeView}
            isNavigationVisible={isNavigationVisible}
            isConversationListVisible={isConversationListVisible}
            onCloseNavigation={handleCloseNavigation}
            onShowConversationList={handleShowConversationList}
            onNavigate={handleNavigation}
            isPending={isPending}
          />

            {/* Mobile Overlay */}
          <div className={`
            fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden
            ${isNavigationVisible ? 'block' : 'hidden'}
          `}
            onClick={handleCloseNavigation}
            aria-hidden="true"
          />

          {/* Main Content Container */}
          <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden pt-16 md:pt-0">
            <div className="flex-1 h-full overflow-hidden relative">
              
              <div 
                className={`absolute inset-0 ${activeView === 'inbox' ? 'block' : 'hidden'}`}
                style={{ 
                  visibility: activeView === 'inbox' ? 'visible' : 'hidden',
                  pointerEvents: activeView === 'inbox' ? 'auto' : 'none'
                }}
              >
                {/* Mobile View */}
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
                    onClearSharedProduct={handleClearSharedProduct}
                    isRightSidebarVisible={false}
                    onOpenRightSidebar={() => {}}
                    onBackToList={handleMobileBackToList}
                  />
                </div>

                {/* Desktop View */}
                <div className="hidden md:flex h-full">
                  {isConversationListVisible && (
                    <section className="w-72 lg:w-80 xl:w-96 flex-shrink-0 bg-white/95 backdrop-blur-md border-r border-gray-200/60 overflow-hidden z-10">
                      <ConversationList
                        selectedConversationId={selectedConversationId}
                        onConversationSelect={handleConversationSelect}
                        isVisible={isConversationListVisible}
                        onToggleVisibility={handleToggleConversationList}
                      />
                    </section>
                  )}

                  <section className="flex-1 min-w-0 h-full border-r border-gray-200/60 z-10">
                    <ChatView
                      selectedConversationId={selectedConversationId}
                      sharedProduct={sharedProduct}
                      onClearSharedProduct={handleClearSharedProduct}
                      isRightSidebarVisible={isRightSidebarVisible}
                      onOpenRightSidebar={handleToggleRightSidebar}
                      onBackToList={() => {}}
                    />
                  </section>

                  {isRightSidebarVisible && (
                    <aside className="relative w-[280px] xl:w-[320px] flex-shrink-0 hidden xl:block z-10">
                      {selectedConversationId ? (
                        <Sidebar
                          selectedConversationId={selectedConversationId}
                          onConversationSelect={handleConversationSelect}
                          onShareProduct={handleShareProduct}
                          onToggleVisibility={handleToggleRightSidebar}
                        />
                      ) : (
                        <RemainderSideBar 
                          onToggleVisibility={handleToggleRightSidebar}
                        />
                      )}
                    </aside>
                  )}
                </div>
              </div>

              {activeView === "Contacts" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <div className="h-full w-full bg-gray-50/50 overflow-hidden">
                    <ContactsDashboard />
                  </div>
                </Suspense>
              )}

              {activeView === "talktodata" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <div className="h-full w-full bg-gray-50/50 overflow-hidden">
                    <TalkToDataTab />
                  </div>
                </Suspense>
              )}

              {activeView === "analyticsbot" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <div className="h-full w-full bg-gray-50/50 overflow-hidden">
                    <AnalyticsBot />
                  </div>
                </Suspense>
              )}

              {activeView === "influencerbot" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <div className="h-full w-full bg-gray-50/50 overflow-hidden">
                    <InfluencerBot />
                  </div>
                </Suspense>
              )}

              {activeView === "settings" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <SettingsSidebar />
                </Suspense>
              )}

              {activeView === "billing" && (
                <Suspense fallback={<TabLoadingSkeleton />}>
                  <div className="h-full w-full overflow-y-auto bg-white">
                    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                      <BillingPlans />
                    </div>
                  </div>
                </Suspense>
              )}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </ConversationProvider>
  );
}