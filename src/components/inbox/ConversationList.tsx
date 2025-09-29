"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useGlobalConversations } from '../hooks/useGlobalConversations';
import { Conversation } from '@/components/types/conversation';
import { FilterMenu, FilterOptions } from './FilterMenu';
import { format, isToday, isYesterday, subDays, startOfDay, subMonths } from 'date-fns';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SlidersHorizontal, MessagesSquare, AlertCircle } from "lucide-react";
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

const SkeletonConversationItem = React.memo(() => (
  <div className="conversation-item rounded-2xl overflow-hidden border border-gray-100/60 bg-white/80">
    <div className="flex items-start space-x-3 p-4">
      <div className="w-12 h-12 bg-gradient-to-br from-gray-200/80 to-gray-300/60 rounded-2xl animate-pulse flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gradient-to-r from-gray-200/80 to-gray-300/60 rounded-lg w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-gradient-to-r from-gray-100/80 to-gray-200/60 rounded-lg w-full mb-1 animate-pulse" />
        <div className="h-3 bg-gradient-to-r from-gray-100/80 to-gray-200/60 rounded-lg w-2/3 animate-pulse" />
      </div>
      <div className="text-right flex-shrink-0">
        <div className="h-3 bg-gradient-to-r from-gray-100/80 to-gray-200/60 rounded-lg w-12 mb-2 animate-pulse" />
        <div className="w-5 h-5 bg-gradient-to-br from-blue-200/80 to-blue-300/60 rounded-full animate-pulse ml-auto" />
      </div>
    </div>
  </div>
));

const SkeletonGroup = React.memo(({ itemCount = 3 }: { itemCount?: number }) => (
  <div className="border-none bg-white/60 ios-backdrop rounded-2xl overflow-hidden mb-2">
    <div className="py-3 px-4 bg-gray-50/80">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gradient-to-r from-gray-200/80 to-gray-300/60 rounded-lg w-20 animate-pulse" />
        <div className="w-7 h-5 bg-gradient-to-br from-blue-200/80 to-blue-300/60 rounded-full animate-pulse" />
      </div>
    </div>
    <div className="px-1 pb-2">
      <div className="space-y-0.5">
        {Array.from({ length: itemCount }, (_, i) => (
          <SkeletonConversationItem key={i} />
        ))}
      </div>
    </div>
  </div>
));

const OptimisticSkeletonLayout = React.memo(() => (
  <div className="p-2 space-y-2">
    <SkeletonGroup itemCount={4} />
    <SkeletonGroup itemCount={2} />
    <SkeletonGroup itemCount={3} />
    <SkeletonGroup itemCount={2} />
  </div>
));

const ConversationList = ({
  selectedConversationId,
  onConversationSelect,
  isVisible = true,
  onToggleVisibility,
}: ConversationListProps) => {
  const { conversations, loading, error, retry } = useGlobalConversations();
  
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    priority: [],
    sentiment: [],
    unreadOnly: false,
    hasQuery: false,
  });

  const showSkeleton = loading && conversations.length === 0;

  const filteredAndSearchedResults = useMemo<SearchResult[]>(() => {
    if (!conversations.length) return [];

    return conversations
      .filter(conversation => {
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

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const nameMatch = conversation.customer_name.toLowerCase().includes(query);
          const messageMatch = conversation.last_message.toLowerCase().includes(query);
          return nameMatch || messageMatch;
        }

        return true;
      })
      .filter(conversation => {
        switch (activeTab) {
          case 'AI':
            return conversation.is_ai_enabled;
          case 'live_agent':
            return !conversation.is_ai_enabled;
          default:
            return true;
        }
      })
      .map(conversation => {
        const isNameMatch = searchQuery && conversation.customer_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return {
          conversation,
          matchedOn: isNameMatch ? 'name' as const : 'message' as const,
          matchedText: searchQuery ? conversation.last_message : undefined
        };
      });
  }, [conversations, filters, searchQuery, activeTab]);

  const groupedConversations = useMemo(() => {
    const groups = filteredAndSearchedResults.reduce((acc, result) => {
      const { conversation } = result;
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
        groupLabel = format(date, "MMMM");
      } else {
        groupLabel = format(date, "MMMM");
      }

      if (!acc[groupLabel]) {
        acc[groupLabel] = [];
      }
      
      acc[groupLabel].push(result);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    Object.keys(groups).forEach(groupLabel => {
      groups[groupLabel].sort(
        (a, b) => new Date(b.conversation.timestamp).getTime() - new Date(a.conversation.timestamp).getTime()
      );
    });

    return groups;
  }, [filteredAndSearchedResults]);

  const orderedGroupLabels = useMemo(() => {
    const fixedGroups = ["Today", "Yesterday", "This Week"];
    const monthGroups = Object.keys(groupedConversations)
      .filter(label => !fixedGroups.includes(label))
      .sort((a, b) => {
        const aLatest = Math.max(...groupedConversations[a].map(item => new Date(item.conversation.timestamp).getTime()));
        const bLatest = Math.max(...groupedConversations[b].map(item => new Date(item.conversation.timestamp).getTime()));
        return bLatest - aLatest;
      });
    
    return [
      ...fixedGroups.filter(label => groupedConversations[label]),
      ...monthGroups
    ];
  }, [groupedConversations]);

  useEffect(() => {
    if (orderedGroupLabels.length > 0 && openGroups.length === 0) {
      setOpenGroups(orderedGroupLabels);
    }
  }, [orderedGroupLabels.length]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabValue);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleConversationClick = useCallback((id: string) => {
    onConversationSelect?.(id);
  }, [onConversationSelect]);

  const formatTimestampWithoutYear = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "h:mm a")}`;
    } else if (date >= subDays(startOfDay(new Date()), 7)) {
      return format(date, "EEE h:mm a");
    } else {
      return format(date, "MMM d");
    }
  }, []);

  return (
    <div className="w-full h-full max-h-screen bg-white/95 ios-backdrop flex flex-col overflow-hidden rounded-none md:rounded-r-3xl border-r border-gray-200/60 shadow-none md:shadow-lg">
      <style jsx>{`
        .ios-scrollbar::-webkit-scrollbar { width: 3px; }
        .ios-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ios-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(0,0,0,0.1); 
          border-radius: 8px; 
          transition: all 0.3s ease; 
        }
        .ios-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
        .ios-backdrop {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        .conversation-item {
          transform: translateZ(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .conversation-item:hover {
          transform: translateY(-1px) scale(1.01);
        }
        .conversation-item:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>

      {/* Header */}
      <div className="px-3 py-3 md:px-4 md:py-4 bg-white/40 ios-backdrop border-b border-gray-100/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
            <Input
              placeholder="Search conversations..."
              className="h-11 md:h-12 pl-12 pr-12 bg-gray-100/80 border-0 rounded-2xl text-sm md:text-base placeholder-gray-500 focus:bg-white/80 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200/80 rounded-xl transition-colors duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          {/* Close button */}
          {onToggleVisibility && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              className="h-10 w-10 rounded-2xl hover:bg-gray-100/60 transition-all duration-300 hidden lg:flex flex-shrink-0 bg-white/40 ios-backdrop"
              title="Hide conversation list"
            >
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 gap-3">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-shrink-0">
            <TabsList className="bg-gray-100/80 rounded-2xl p-0.5 h-auto w-full">
              <TabsTrigger 
                value="all" 
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-10 md:py-3"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="live_agent" 
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-10 md:py-3"
              >
                Agent
              </TabsTrigger>
              <TabsTrigger 
                value="AI" 
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-10 md:py-3"
              >
                AI
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-shrink-0 -translate-x-1">
            <div className="border border-gray-200/60 rounded-2xl bg-white/40 ios-backdrop hover:border-gray-300/60 transition-all duration-300 hover:shadow-sm">
              <FilterMenu filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ios-scrollbar overflow-y-auto">
        {showSkeleton ? (
          <OptimisticSkeletonLayout />
        ) : (
          <>
            {error ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100/80 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Error loading conversations: {error.message}</p>
                </div>
              </div>
            ) : filteredAndSearchedResults.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100/80 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <MessagesSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                    {activeTab === "live_agent"
                      ? "No conversations have Live Agent enabled"
                      : activeTab === "AI"
                      ? "No conversations have AI enabled"
                      : "No conversations found"}
                  </p>
                </div>
              </div>
            ) : (
              // Conversation list 
              <div className="p-1 md:p-2">
                <Accordion 
                  type="multiple" 
                  value={openGroups} 
                  onValueChange={setOpenGroups}
                  className="w-full space-y-0.25"
                >
                  {orderedGroupLabels.map((label) => (
                    <AccordionItem 
                      key={label} 
                      value={label} 
                      className="border-none bg-white/60 ios-backdrop rounded-2xl overflow-hidden"
                    >
                      <AccordionTrigger className="hover:bg-gray-50/80 rounded-t-2xl hover:no-underline transition-all duration-300 py-2 px-3 md:py-3 md:px-4">
                        <div className="flex items-center justify-between w-full pr-2">
                          <span className="font-semibold text-gray-900 text-sm md:text-base">
                            {label}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium min-w-[24px] text-center shadow-sm">
                              {groupedConversations[label].length}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-0">
                        <div className="px-0">
                          {groupedConversations[label].map(({ conversation }) => (
                            <div 
                              key={conversation.id} 
                              className={`
                                conversation-item overflow-hidden border-b border-gray-100/60 
                                ${selectedConversationId === conversation.id 
                                  ? 'bg-blue-50/80 border-blue-200/60 shadow-sm' 
                                  : 'bg-white/80 hover:bg-gray-50/80 hover:border-gray-200/80'
                                }
                                active:bg-blue-100/80 md:active:bg-transparent
                              `}
                            >
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
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const formatLastMessage = (message: string) => {
  return message.includes("know_more_request_from_sender") ? "Know more." : message;
};

export default React.memo(ConversationList);
