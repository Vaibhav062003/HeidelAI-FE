"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useConversations } from "../hooks/useConversations";
import { Conversation } from '@/components/types/conversation';
import { FilterMenu, FilterOptions } from './FilterMenu';
import { format, isToday, isYesterday, subDays, startOfDay, subMonths } from 'date-fns';
import { MessagesSquare, AlertCircle } from "lucide-react";
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
  <div className="conversation-item border-b border-gray-100/60 bg-white/80 p-4 hw-accel">
    <div className="flex items-start space-x-3">
      <div className="w-12 h-12 bg-gray-200/80 rounded-2xl flex-shrink-0 skeleton" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-4 bg-gray-200/80 rounded-lg w-3/4 skeleton" />
        <div className="h-3 bg-gray-100/80 rounded-lg w-full skeleton" />
      </div>
      <div className="text-right flex-shrink-0 space-y-2">
        <div className="h-3 bg-gray-100/80 rounded-lg w-12 skeleton" />
        <div className="w-5 h-5 bg-blue-200/80 rounded-full skeleton ml-auto" />
      </div>
    </div>
  </div>
));
SkeletonConversationItem.displayName = "SkeletonConversationItem";

const OptimisticSkeletonLayout = React.memo(() => (
  <div className="space-y-0">
    {Array.from({ length: 8 }, (_, i) => (
      <SkeletonConversationItem key={i} />
    ))}
  </div>
));
OptimisticSkeletonLayout.displayName = "OptimisticSkeletonLayout";

const GroupHeader = memo(({ 
  label, 
  count, 
  isCollapsed,
  onToggle 
}: { 
  label: string; 
  count: number;
  isCollapsed: boolean;
  onToggle: () => void;
}) => (
  <div 
    onClick={onToggle}
    className="sticky top-0 z-10 bg-gray-100/95 ios-backdrop border-b border-gray-200/60 px-1 py-1 cursor-pointer hover:bg-gray-100/80 transition-colors duration-200 flex items-center justify-between hw-accel"
  >
    <div className="flex items-center gap-2">
      <svg
        className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="font-semibold text-gray-900 text-sm">{label}</span>
    </div>
    <span className="text-xs text-black px-2 py-0.5 rounded-full font-medium min-w-[24px] text-center">
      {count}
    </span>
  </div>
));
GroupHeader.displayName = "GroupHeader";

const ConversationItem = memo(({ 
  conversation, 
  isSelected,
  onSelect,
  formatTimestamp
}: {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (id: string) => void;
  formatTimestamp: (timestamp: string) => string;
}) => {
  const handleClick = useCallback(() => {
    onSelect(conversation.id);
  }, [conversation.id, onSelect]);

  const lastMessage = useMemo(() => 
    conversation.last_message.includes("know_more_request_from_sender") 
      ? "Know more." 
      : conversation.last_message,
    [conversation.last_message]
  );

  return (
    <div 
      className={`
        conversation-item border-b border-gray-100/60 hw-accel
        ${isSelected 
          ? 'bg-blue-50/80 border-blue-200/60' 
          : 'bg-white/80 hover:bg-gray-50/80'
        }
        active:bg-blue-100/80 md:active:bg-transparent cursor-pointer
      `}
      onClick={handleClick}
    >
      <ConversationPreview
        id={conversation.id}
        channelType={conversation.platform as "telegram" | "whatsapp" | "instagram" | "web"}
        customerName={conversation.customer_name}
        lastMessage={lastMessage}
        timestamp={formatTimestamp(conversation.timestamp)}
        unreadCount={conversation.unread_count}
        avatarUrl={conversation.avatar_url}
        isAiEnabled={conversation.is_ai_enabled}
        assignedAgentId={conversation.assigned_agent_id}
        isSelected={isSelected}
        onClick={handleClick}
        priority={conversation.priority}
        sentiment={conversation.sentiment}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.conversation.id === nextProps.conversation.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.conversation.unread_count === nextProps.conversation.unread_count &&
    prevProps.conversation.last_message === nextProps.conversation.last_message &&
    prevProps.conversation.timestamp === nextProps.conversation.timestamp
  );
});
ConversationItem.displayName = "ConversationItem";

const ConversationList = ({
  selectedConversationId,
  onConversationSelect,
  isVisible = true,
  onToggleVisibility,
}: ConversationListProps) => {
  const { conversations, loading, error, retry } = useConversations();
  
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    priority: [],
    sentiment: [],
    unreadOnly: false,
    hasQuery: false,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const showSkeleton = loading && conversations.length === 0;

  const filteredAndSearchedResults = useMemo<SearchResult[]>(() => {
    if (!conversations.length) return [];

    let filtered = conversations;

    // Apply filters first 
    if (filters.unreadOnly) {
      filtered = filtered.filter(c => c.unread_count > 0);
    }

    if (filters.hasQuery) {
      filtered = filtered.filter(c => c.query);
    }

    if (filters.platform.length) {
      const platformSet = new Set(filters.platform);
      filtered = filtered.filter(c => platformSet.has(c.platform));
    }

    if (filters.priority.length) {
      const prioritySet = new Set(filters.priority);
      filtered = filtered.filter(c => prioritySet.has(c.priority));
    }

    if (filters.sentiment.length) {
      const sentimentSet = new Set(filters.sentiment);
      filtered = filtered.filter(c => sentimentSet.has(c.sentiment));
    }

    // Apply tab filter
    if (activeTab === 'AI') {
      filtered = filtered.filter(c => c.is_ai_enabled);
    } else if (activeTab === 'live_agent') {
      filtered = filtered.filter(c => !c.is_ai_enabled);
    }

    // Apply search last
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.customer_name.toLowerCase().includes(query) ||
        c.last_message.toLowerCase().includes(query)
      );
    }

    // Map to SearchResult format
    return filtered.map(conversation => ({
      conversation,
      matchedOn: (searchQuery && conversation.customer_name.toLowerCase().includes(searchQuery.toLowerCase()))
        ? 'name' as const 
        : 'message' as const,
      matchedText: searchQuery ? conversation.last_message : undefined
    }));
  }, [conversations, filters, searchQuery, activeTab]);

  const { groupedConversations, orderedGroupLabels } = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    const now = new Date();

    filteredAndSearchedResults.forEach(result => {
      const date = new Date(result.conversation.timestamp);
      let groupLabel: string;

      if (isToday(date)) {
        groupLabel = "Today";
      } else if (isYesterday(date)) {
        groupLabel = "Yesterday";
      } else if (date >= subDays(startOfDay(now), 7)) {
        groupLabel = "This Week";
      } else {
        groupLabel = format(date, "MMMM");
      }

      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }
      groups[groupLabel].push(result);
    });

    // Sort within groups
    Object.values(groups).forEach(group => {
      group.sort((a, b) => 
        new Date(b.conversation.timestamp).getTime() - 
        new Date(a.conversation.timestamp).getTime()
      );
    });

    // Order group labels
    const fixedGroups = ["Today", "Yesterday", "This Week"];
    const monthGroups = Object.keys(groups)
      .filter(label => !fixedGroups.includes(label))
      .sort((a, b) => {
        const aLatest = Math.max(...groups[a].map(item => 
          new Date(item.conversation.timestamp).getTime()
        ));
        const bLatest = Math.max(...groups[b].map(item => 
          new Date(item.conversation.timestamp).getTime()
        ));
        return bLatest - aLatest;
      });

    const orderedLabels = [
      ...fixedGroups.filter(label => groups[label]),
      ...monthGroups
    ];

    return { 
      groupedConversations: groups, 
      orderedGroupLabels: orderedLabels 
    };
  }, [filteredAndSearchedResults]);

  const flatConversations = useMemo(() => {
    const result: Array<{ type: 'header' | 'item'; label?: string; conversation?: Conversation; count?: number }> = [];
    
    orderedGroupLabels.forEach(label => {
      const items = groupedConversations[label];
      const isCollapsed = collapsedGroups.has(label);
      
      result.push({ 
        type: 'header', 
        label, 
        count: items.length 
      });
      
      if (!isCollapsed) {
        items.forEach(({ conversation }) => {
          result.push({ 
            type: 'item', 
            conversation 
          });
        });
      }
    });
    
    return result;
  }, [orderedGroupLabels, groupedConversations, collapsedGroups]);

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

  const handleConversationSelect = useCallback((id: string) => {
    onConversationSelect?.(id);
  }, [onConversationSelect]);

  const toggleGroup = useCallback((label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const formatTimestampWithoutYear = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      return format(date, "h:mm a");
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
        }
        .ios-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); }
        .ios-backdrop {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
        .conversation-item {
          will-change: transform;
          contain: layout style paint;
        }
        .conversation-item:hover {
          transform: translateY(-1px);
        }
        .hw-accel {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .skeleton {
          animation: shimmer 1.5s infinite;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="px-3 py-3 md:px-4 md:py-4 bg-white/40 ios-backdrop border-b border-gray-100/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10 pointer-events-none" />
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
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-9 md:py-1"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="live_agent" 
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-9 md:py-1"
              >
                Agent
              </TabsTrigger>
              <TabsTrigger 
                value="AI" 
                className="flex-1 text-xs md:text-sm rounded-2xl transition-all duration-300 font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-blue-600 px-6 py-2.5 md:px-9 md:py-1"
              >
                AI
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-shrink-0 -translate-x-1">
            <div className=" mr-0.5 border border-gray-200/60 rounded-2xl bg-white/40 ios-backdrop hover:border-gray-300/60 transition-all duration-300 hover:shadow-sm">
              <FilterMenu filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Content*/}
      <div 
        ref={scrollContainerRef}
        className="flex-1 ios-scrollbar overflow-y-auto"
      >
        {showSkeleton ? (
          <OptimisticSkeletonLayout />
        ) : error ? (
          <div className="flex items-center justify-center p-8 h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100/80 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Error loading conversations: {error.message}</p>
            </div>
          </div>
        ) : filteredAndSearchedResults.length === 0 ? (
          <div className="flex items-center justify-center p-8 h-full">
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
          <div className="hw-accel">
            {flatConversations.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <GroupHeader
                    key={`header-${item.label}`}
                    label={item.label!}
                    count={item.count!}
                    isCollapsed={collapsedGroups.has(item.label!)}
                    onToggle={() => toggleGroup(item.label!)}
                  />
                );
              } else {
                return (
                  <ConversationItem
                    key={item.conversation!.id}
                    conversation={item.conversation!}
                    isSelected={selectedConversationId === item.conversation!.id}
                    onSelect={handleConversationSelect}
                    formatTimestamp={formatTimestampWithoutYear}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ConversationList);
