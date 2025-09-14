import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '@/components/types/conversation';
import { FilterMenu, FilterOptions } from './FilterMenu';
import { format, isToday, isYesterday, subDays, startOfDay, subMonths } from 'date-fns';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/inbox_button";

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect?: (id: string) => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

type TabValue = 'all' | 'live_agent' | 'AI';

interface SearchResult {
  conversation: Conversation;
  matchedOn: 'name' | 'message';
  matchedText?: string;
}

const ConversationItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-[85vh] overflow-y-hidden p-4 text-center text-gray-500">
    <p className="text-sm">{message}</p>
  </div>
);

const ConversationList = ({
  selectedConversationId,
  onConversationSelect,
  isVisible = true,
  onToggleVisibility
}: ConversationListProps) => {
  // Client-side only state to prevent hydration issues
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { conversations, loading, error } = useConversations();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    priority: [],
    sentiment: [],
    unreadOnly: false,
    hasQuery: false,
  });
  const [initialGroupsSet, setInitialGroupsSet] = useState(false);

  const searchResults: SearchResult[] = conversations
    .filter(conversation => {
      // Apply filters
      if (filters.platform.length && !filters.platform.includes(conversation.platform)) {
        return false;
      }
      if (filters.priority.length && !filters.priority.includes(conversation.priority)) {
        return false;
      }
      if (filters.sentiment.length && !filters.sentiment.includes(conversation.sentiment)) {
        return false;
      }
      if (filters.unreadOnly && conversation.unread_count === 0) {
        return false;
      }
      if (filters.hasQuery && !conversation.query) {
        return false;
      }

      // Apply search
      const nameMatch = conversation.customer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const messageMatch = conversation.last_message
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return nameMatch || messageMatch;
    })
  .map(conversation => {
    const isNameMatch = conversation.customer_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return {
      conversation,
      matchedOn: isNameMatch ? 'name' as const : 'message' as const,
      matchedText: searchQuery ? conversation.last_message : undefined
    };
  })
    .filter(result => {
      switch (activeTab) {
        case 'AI':
          return result.conversation.is_ai_enabled;
        case 'live_agent':
          return !result.conversation.is_ai_enabled;
        default:
          return true;
      }
    });

  // Group conversations by date with simplified categories
  const groupedConversations = searchResults.reduce((groups, { conversation, matchedOn, matchedText }) => {
    const date = new Date(conversation.timestamp);
    const now = new Date();
    let groupLabel: string;

    if (isToday(date)) {
      groupLabel = "Today";
    } else if (isYesterday(date)) {
      groupLabel = "Yesterday";
    } else if (date >= subDays(startOfDay(now), 7)) {
      groupLabel = "This Week";
    } else if (date >= subMonths(startOfDay(now), 1)) {
      // Format as "January" without year for this month and previous month
      groupLabel = format(date, "MMMM");
    } else {
      // For older dates, just show month name
      groupLabel = format(date, "MMMM");
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = [];
    }
    
    groups[groupLabel].push({ conversation, matchedOn, matchedText });
    return groups;
  }, {} as Record<string, SearchResult[]>);

  // Order groups: Today -> Yesterday -> This Week -> Month names (most recent first)
  const fixedGroups = ["Today", "Yesterday", "This Week"];
  const monthGroups = Object.keys(groupedConversations)
    .filter(label => !fixedGroups.includes(label))
    .sort((a, b) => {
      // Sort month names by their most recent conversation date
      const aLatest = Math.max(...groupedConversations[a].map(item => new Date(item.conversation.timestamp).getTime()));
      const bLatest = Math.max(...groupedConversations[b].map(item => new Date(item.conversation.timestamp).getTime()));
      return bLatest - aLatest;
    });
  
  const orderedGroupLabels = [
    ...fixedGroups.filter(label => groupedConversations[label]),
    ...monthGroups
  ];

  // Set all groups open by default on initial load
  useEffect(() => {
    if (!initialGroupsSet && Object.keys(groupedConversations).length > 0) {
      setOpenGroups(orderedGroupLabels);
      setInitialGroupsSet(true);
    }
  }, [groupedConversations]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Early skeleton render after all hooks are declared to preserve hook order
  if (!isClient) {
    return (
      <div className="flex flex-col h-full w-full">
        <div className="p-4 border-b">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <style>
          {`
            .custom-scrollb::-webkit-scrollbar {
              width: 4px;
              opacity: 0;
              transition: opacity 0.2s;
            }

            .custom-scrollb:hover::-webkit-scrollbar {
              opacity: 1;
            }

            .custom-scrollb::-webkit-scrollbar-thumb {
              background-color: #efefef;
              border-radius: 20px;
            }

            .custom-scrollb::-webkit-scrollbar-track {
              background: transparent;
            }

            .custom-scrollb:not(:hover)::-webkit-scrollbar-thumb {
              opacity: 0;
            }
          `}
        </style>
        <div className="w-full max-h-screen bg-white border-r border-gray-200 flex flex-col">
          <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 pr-10 text-xs lg:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1.5 h-6 w-6 p-0 hover:bg-gray-200"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Left Sidebar Toggle Button - Only for hiding */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleVisibility}
                className="h-8 w-8 hover:bg-gray-200 hidden lg:flex flex-shrink-0"
                title="Hide conversation list"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 gap-1 sm:gap-2">
              <Tabs defaultValue="all" className="flex-1 min-w-0">
                <TabsList className="flex gap-0.5 sm:gap-1 lg:gap-2 h-8 lg:h-10 w-full">
                  <TabsTrigger value="all" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Me</TabsTrigger>
                  <TabsTrigger value="live_agent" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Agent</TabsTrigger>
                  <TabsTrigger value="AI" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">AI</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex-shrink-0">
  <div className="border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
    <FilterMenu 
      filters={filters} 
      onFilterChange={setFilters}
    />
  </div>
</div>

            </div>
          </div>
          {/* Loading Skeletons */}
          <div className="flex-1 custom-scrollb px-1 overflow-y-scroll">
            {[...Array(12)].map((_, i) => (
              <ConversationItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 pr-10 text-xs lg:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1.5 h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Left Sidebar Toggle Button - Only for hiding */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="h-8 w-8 hover:bg-gray-200 hidden lg:flex flex-shrink-0"
              title="Hide conversation list"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 gap-1 sm:gap-2">
            <Tabs defaultValue="all" className="flex-1 min-w-0">
              <TabsList className="flex gap-0.5 sm:gap-1 lg:gap-2 h-8 lg:h-10 w-full">
                <TabsTrigger value="all" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Me</TabsTrigger>
                <TabsTrigger value="live_agent" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Agent</TabsTrigger>
                <TabsTrigger value="AI" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">AI</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-shrink-0">
  <div className="border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
    <FilterMenu 
      filters={filters} 
      onFilterChange={setFilters}
    />
  </div>
</div>

          </div>
        </div>
        <div className="p-4 text-neutral-700 text-xs lg:text-sm">
          Error loading conversations: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .custom-scrollb::-webkit-scrollbar {
            width: 4px;
            opacity: 0;
            transition: opacity 0.2s;
          }

          .custom-scrollb:hover::-webkit-scrollbar {
            opacity: 1;
          }

          .custom-scrollb::-webkit-scrollbar-thumb {
            background-color: #efefef;
            border-radius: 20px;
          }

          .custom-scrollb::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollb:not(:hover)::-webkit-scrollbar-thumb {
            opacity: 0;
          }
        `}
      </style>

      <div className="w-full max-h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 pr-10 text-xs lg:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1.5 h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Left Sidebar Toggle Button - Only for hiding conversation list */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="h-8 w-8 hover:bg-gray-200 hidden lg:flex flex-shrink-0"
              title="Hide conversation list"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 gap-1 sm:gap-2">
            <Tabs defaultValue="all" className="flex-1 min-w-0">
              <TabsList className="flex gap-0.5 sm:gap-1 lg:gap-2 h-8 lg:h-10 w-full">
                <TabsTrigger value="all" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Me</TabsTrigger>
                <TabsTrigger value="live_agent" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">Agent</TabsTrigger>
                <TabsTrigger value="AI" className="text-xs lg:text-sm px-1 sm:px-2 lg:px-3 flex-1">AI</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-shrink-0">
  <div className="border border-gray-300 rounded-md hover:border-gray-400 transition-colors">
    <FilterMenu 
      filters={filters} 
      onFilterChange={setFilters}
    />
  </div>
</div>

          </div>
        </div>

        <div className="flex-1 custom-scrollb overflow-y-scroll">
          {searchResults.length === 0 ? (
            <EmptyState
              message={
                activeTab === "live_agent"
                  ? "No conversations have Live Agent enabled"
                  : activeTab === "AI"
                  ? "No conversations have AI enabled"
                  : "No conversations found"
              }
            />
          ) : (
            <Accordion 
              type="multiple" 
              value={openGroups} 
              onValueChange={setOpenGroups}
              className="w-full"
            >
              {orderedGroupLabels.map((label) => (
                <AccordionItem 
                  key={label} 
                  value={label} 
                  className="border-none"
                >
                  <AccordionTrigger className="py-2 px-2 lg:px-3 bg-gray-50 hover:bg-gray-100 rounded-md hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-medium text-gray-700 text-xs lg:text-sm">{label}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full min-w-[24px] text-center">
                        {groupedConversations[label].length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-0">
                    <div className="space-y-1">
                      {groupedConversations[label]
                        .sort(
                          (a, b) =>
                            new Date(b.conversation.timestamp).getTime() -
                            new Date(a.conversation.timestamp).getTime()
                        )
                        .map(({ conversation, matchedOn, matchedText }) => {
                          // Format timestamp without year
                          const formatTimestampWithoutYear = (timestamp: string) => {
                            const date = new Date(timestamp);
                            
                            if (isToday(date)) {
                              // Show exact time for today: "2:30 PM"
                              return format(date, "h:mm a");
                            } else if (isYesterday(date)) {
                              // Show time for yesterday: "Yesterday 2:30 PM"
                              return `Yesterday ${format(date, "h:mm a")}`;
                            } else if (date >= subDays(startOfDay(new Date()), 7)) {
                              // Show day and time for this week: "Mon 2:30 PM"
                              return format(date, "EEE h:mm a");
                            } else {
                              // Show month and day for older: "Jan 15"
                              return format(date, "MMM d");
                            }
                          };

                          return (
                            <div key={conversation.id} className="flex w-full flex-col">
                              <ConversationPreview
                                id={conversation.id}
                                channelType={
                                  conversation.platform as
                                    | "telegram"
                                    | "whatsapp"
                                    | "instagram"
                                    | "web"
                                }
                                customerName={conversation.customer_name}
                                lastMessage={formatLastMessage(conversation.last_message)}
                                timestamp={formatTimestampWithoutYear(conversation.timestamp)}
                                unreadCount={conversation.unread_count}
                                avatarUrl={conversation.avatar_url}
                                isAiEnabled={conversation.is_ai_enabled}
                                assignedAgentId={conversation.assigned_agent_id}
                                isSelected={selectedConversationId === conversation.id}
                                onClick={() => onConversationSelect?.(conversation.id)}
                                priority={conversation.priority}
                                sentiment={conversation.sentiment}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </>
  );
};

const formatLastMessage = (message: string) => {
  return message.includes("know_more_request_from_sender") ? "Know more." : message;
};

export default ConversationList;
