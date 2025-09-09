"use client";
import React, { useState } from "react";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '@/components/types/conversation';
import { FilterMenu, FilterOptions } from './FilterMenu';
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { SlidersHorizontal } from "lucide-react";

interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect?: (id: string) => void;
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
  onConversationSelect
}: ConversationListProps) => {
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

      // console.log("platform: ", conversation.platform)

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

  // Group conversations by date
  const groupedConversations = searchResults.reduce((groups, { conversation, matchedOn, matchedText }) => {
    const date = new Date(conversation.timestamp);
    let groupLabel: string;

    if (isToday(date)) {
      groupLabel = "Today";
    } else if (isYesterday(date)) {
      groupLabel = "Yesterday";
    } else if (date >= subDays(startOfDay(new Date()), 7)) {
      groupLabel = "This Week";
    } else {
      groupLabel = format(date, "MMMM d, yyyy");
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = [];
    }
    
    groups[groupLabel].push({ conversation, matchedOn, matchedText });
    return groups;
  }, {} as Record<string, SearchResult[]>);

  // Order groups: Today -> Yesterday -> This Week -> Specific dates
  const fixedGroups = ["Today", "Yesterday", "This Week"];
  const specificDateGroups = Object.keys(groupedConversations)
    .filter(label => !fixedGroups.includes(label))
    .sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  
  const orderedGroupLabels = [
    ...fixedGroups.filter(label => groupedConversations[label]),
    ...specificDateGroups
  ];

  // Set all groups open by default on initial load
  useEffect(() => {
    if (!initialGroupsSet && Object.keys(groupedConversations).length > 0) {
      setOpenGroups(orderedGroupLabels);
      setInitialGroupsSet(true);
    }
  }, [groupedConversations]);

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
        <div className="w-[340px] max-h-screen bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative" style={{ width: "270px" }}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-2 px-[-1]">
              <Tabs defaultValue="all">
                <TabsList className="flex gap-2">
                  <TabsTrigger value="all">Me</TabsTrigger>
                  <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
                  <TabsTrigger value="AI">AI</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="ml-15 pr-5 w-64">
      <FilterMenu filters={filters} onFilterChange={setFilters} />
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
      <div className="w-[340px] h-full bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative" style={{ width: "270px" }}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="flex items-center justify-between mt-2 px-[-1]">
            <Tabs defaultValue="all">
              <TabsList className="flex gap-2">
                <TabsTrigger value="all">Me</TabsTrigger>
                <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
                <TabsTrigger value="AI">AI</TabsTrigger>
              </TabsList>
            </Tabs>

              <div className="ml-15 pr-5 w-64">
      <FilterMenu filters={filters} onFilterChange={setFilters} />
    </div>
          </div>
        </div>
        <div className="p-4 text-neutral-700">
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

      <div className="w-[340px] max-h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative" style={{ width: "270px" }}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

            <div className="flex items-center justify-between mt-2 px-[-1]">
            <Tabs defaultValue="all">
              <TabsList className="flex gap-2">
                <TabsTrigger value="all">Me</TabsTrigger>
                <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
                <TabsTrigger value="AI">AI</TabsTrigger>
              </TabsList>
            </Tabs>

              <div className="ml-15 pr-5 w-64">
      <FilterMenu filters={filters} onFilterChange={setFilters} />
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
                  <AccordionTrigger className="py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-md hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {groupedConversations[label].length} conversation
                        {groupedConversations[label].length !== 1 ? 's' : ''}
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
                        .map(({ conversation, matchedOn, matchedText }) => (
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
                              timestamp={conversation.timestamp}
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