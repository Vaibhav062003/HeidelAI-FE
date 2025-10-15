"use client";
import { useEffect, useState, useRef, memo, useCallback, useMemo, useTransition, Suspense } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";
import TopNavigation from "@/components/inbox/TopNavigation";
import ConversationList from "@/components/inbox/ConversationList";
import SettingsSidebar from "@/components/setting_tab/SettingsSidebar";
import { Menu, ChevronDown, ChevronRight,  } from "lucide-react";
import { Button } from "@/components/ui/inbox_button";
import { X } from "lucide-react";
import { Conversation } from "@/components/types/conversation";
import { ConversationProvider } from "@/components/hooks/useConversations";
import {
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  ContactRoundIcon,
  BotMessageSquare,
  ChevronLeft,
  Tag,
  Headphones,
  Home,
  PanelLeftClose,
  PanelLeft
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 md:hidden">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenNavigation}
          className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all duration-200"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {activeView === "settings" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all duration-200"
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
            className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all duration-200"
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
            className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all duration-200"
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
  onClick,
  badge
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: string | number;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gray-100 text-gray-900' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}
        `}>
          {badge}
        </span>
      )}
    </button>
  );
});
NavigationItem.displayName = "NavigationItem";

const SidebarNavigation = memo(({ 
  activeView, 
  isNavigationVisible,
  isConversationListVisible,
  isExpanded,
  onCloseNavigation,
  onShowConversationList,
  onNavigate,
  onToggleExpanded,
  isPending
}: {
  activeView: string;
  isNavigationVisible: boolean;
  isConversationListVisible: boolean;
  isExpanded: boolean;
  onCloseNavigation: () => void;
  onShowConversationList: () => void;
  onNavigate: (value: string) => void;
  onToggleExpanded: () => void;
  isPending: boolean;
}) => {
  const { user } = useUser();

  const mainNavigationItems = useMemo(() => [
    { value: "inbox", icon: Home, label: "Inbox" },
    { value: "analyticsbot", icon: BarChart2, label: "Analytics" },
    { value: "Contacts", icon: ContactRoundIcon, label: "Customers"},
  ], []);

  const additionalItems = useMemo(() => [
    { value: "billing", icon: CreditCard, label: "Billing" },
    { value: "talktodata", icon: BotMessageSquare, label: "Talk to Data" },
    { value: "influencerbot", icon: InstagramLogoIcon, label: "InfluIndex" },
  ], []);

  return (
    <aside className={`
      ${isNavigationVisible 
        ? 'fixed inset-y-0 left-0 z-40' 
        : 'fixed inset-y-0 left-0 z-40 -translate-x-full md:translate-x-0'
      }
      md:static
      ${isExpanded ? 'w-56' : 'w-16'}
      bg-white
      border-r border-gray-200
      flex-shrink-0
      transition-all duration-300
      ${isPending ? 'pointer-events-none opacity-70' : ''}
    `}>
      <div className="h-full flex flex-col p-4">
        {/* Header Section with UserButton */}
        {isExpanded && (
  <div className="space-y-4 mb-6">
    <div className="flex items-center gap-2 w-full px-2">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 relative">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={24}
            height={24}
            className="rounded absolute inset-0 m-auto"
          />
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-full h-full opacity-0",
                userButtonPopoverCard: "!opacity-100",
              },
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.fullName || "Profile"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.primaryEmailAddress?.emailAddress || "email@example.com"}
          </p>
        </div>
      </div>
      
      {/* Show Conversation List Button */}
      {!isConversationListVisible && activeView === "inbox" && (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowConversationList}
              className="h-8 w-8 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Show conversation list"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="bg-gray-800 text-white px-3 py-2 rounded-xl z-[60]"
            sideOffset={8}
          >
            <span className="text-sm font-medium">Show conversations</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="border-t border-gray-200" />
  </div>
)}

{!isExpanded && (
  <div className="mb-6 flex flex-col items-center gap-2">
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center relative">
      <Image
        src="/logo.png"
        alt="Company Logo"
        width={24}
        height={24}
        className="rounded absolute inset-0 m-auto"
      />
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "w-full h-full opacity-0",
            userButtonPopoverCard: "!opacity-100",
          },
        }}
      />
    </div>
    
    {/* Show Conversation List Button when collapsed */}
    {!isConversationListVisible && activeView === "inbox" && (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShowConversationList}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
            aria-label="Show conversation list"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="bg-gray-800 text-white px-3 py-2 rounded-xl z-[60]"
          sideOffset={8}
        >
          <span className="text-sm font-medium">Show conversations</span>
        </TooltipContent>
      </Tooltip>
    )}
  </div>
)}


        {/* Main Navigation */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          {isExpanded ? (
            <>
              {mainNavigationItems.map(({ value, icon, label }) => (
                <NavigationItem
                  key={value}
                  value={value}
                  icon={icon}
                  label={label}
                  isActive={activeView === value}
                  onClick={() => onNavigate(value)}
                />
              ))}

              <div className="my-4 border-t border-gray-200" />

              <div className="space-y-1">
                {additionalItems.map(({ value, icon, label }) => (
                  <NavigationItem
                    key={value}
                    value={value}
                    icon={icon}
                    label={label}
                    isActive={activeView === value}
                    onClick={() => onNavigate(value)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {mainNavigationItems.map(({ value, icon: Icon }) => (
                <Tooltip key={value} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate(value)}
                      className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        activeView === value
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white">
                    {value === 'inbox' ? 'Inbox' : value === 'Contacts' ? 'Customers' : 'Analytics'}
                  </TooltipContent>
                </Tooltip>
              ))}

              <div className="my-4 border-t border-gray-200" />

              {additionalItems.map(({ value, icon: Icon }) => (
                <Tooltip key={value} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate(value)}
                      className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        activeView === value
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white">
                    {value === 'billing' ? 'Billing' : value === 'talktodata' ? 'Talk to Data' : 'InfluIndex'}
                  </TooltipContent>
                </Tooltip>
              ))}
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 mt-auto pt-4 border-t border-gray-200">
          {/* Collapse/Expand Button */}
          <div className="hidden md:block">
            {isExpanded ? (
              <button
                onClick={onToggleExpanded}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
              >
                <PanelLeftClose className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </button>
            ) : (
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleExpanded}
                    className="w-full h-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    <PanelLeft className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white">
                  Expand
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Settings Button */}
          {isExpanded ? (
            <button
              onClick={() => onNavigate("settings")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                activeView === "settings"
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          ) : (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onNavigate("settings")}
                  className={`w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                    activeView === "settings"
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white">
                Settings
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

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
  
    const handleToggleNavExpanded = useCallback(() => {
    setIsNavExpanded(prev => !prev);
  }, []);

  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [sharedProduct, setSharedProduct] = useState<Product | null>(null);
  const [isConversationListVisible, setIsConversationListVisible] = useState(true);
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true);
  const [isNavigationVisible, setIsNavigationVisible] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const [showMobileConversationList, setShowMobileConversationList] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isNavExpanded, setIsNavExpanded] = useState(true);

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
      Contacts: "Customers", 
      talktodata: "Talk to Data",
      analyticsbot: "Analytics",
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

        <div className="h-screen bg-white flex overflow-hidden">
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
  isExpanded={isNavExpanded}
  onCloseNavigation={handleCloseNavigation}
  onShowConversationList={handleShowConversationList}
  onNavigate={handleNavigation}
  onToggleExpanded={handleToggleNavExpanded}
  isPending={isPending}
/>

          {/* Mobile Overlay */}
          <div className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden
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
<div className="hidden md:flex h-full bg-white">
  <section 
    className={`
      ${isConversationListVisible ? 'w-64 lg:w-72 xl:w-80' : 'w-0'} 
      flex-shrink-0 overflow-hidden border-r border-gray-200
      transition-all duration-200 ease-in-out
    `}
    style={{ 
      visibility: isConversationListVisible ? 'visible' : 'hidden',
      opacity: isConversationListVisible ? 1 : 0,
      pointerEvents: isConversationListVisible ? 'auto' : 'none'
    }}
  >
    <ConversationList
      selectedConversationId={selectedConversationId}
      onConversationSelect={handleConversationSelect}
      isVisible={isConversationListVisible}
      onToggleVisibility={handleToggleConversationList}
    />
  </section>

  <section className="flex-1 min-w-0 h-full border-r border-gray-200">
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
    <aside className="relative w-[280px] xl:w-[320px] flex-shrink-0 hidden xl:block">
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