"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '@/components/types/conversation';
import { FilterMenu, FilterOptions } from './FilterMenu';

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
  const [filters, setFilters] = useState<FilterOptions>({
    platform: [],
    priority: [],
    sentiment: [],
    unreadOnly: false,
    hasQuery: false,
  });

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
    </ style >
      <div className="w-[290px] max-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations" className="pl-9 pr-4" />
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Me</TabsTrigger>
            <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4">
            <FilterMenu 
              filters={filters}
              onFilterChange={setFilters}
            />
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
      <div className="w-[290px] h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations" className="pl-9 pr-4" />
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Me</TabsTrigger>
            <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4">
            <FilterMenu 
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
      </div>
    <div className="p-4 text-neutral-700">Error loading conversations: {error.message}</div>
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
    </ style >
    
    <div className="w-[290px] max-h-screen bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations" 
              className="pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Me</TabsTrigger>
              <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
              <TabsTrigger value="AI">AI</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4">
            <FilterMenu 
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </div>

      {/* <ScrollArea className="flex-1">
        <div className="p-2 w-80  space-y-2">
          {conversations.map((conversation) => (
            <ConversationPreview
              key={conversation.id}
              channelType={conversation.channelType}
              priority={conversation.priority}
              sentiment={conversation.sentiment}
              customerName={conversation.customerName}
              lastMessage={conversation.lastMessage}
              timestamp={conversation.timestamp}
              unreadCount={conversation.unreadCount}
              avatarUrl={conversation.avatarUrl}
              isSelected={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
            />
          ))}
        </div>
      </ScrollArea> */}
      <div className="flex-1 h-[10px] custom-scrollb  overflow-y-scroll">
      {searchResults.length === 0 ? (
        <EmptyState 
          message={
            activeTab === 'live_agent' 
              ? "No conversations have Live Agent enabled" 
              : activeTab === 'AI' 
                ? "No conversations have AI enabled"
                : "No conversations found"
          } 
        />
      ) : (
        searchResults
          .sort((a, b) => 
            new Date(b.conversation.timestamp).getTime() - 
            new Date(a.conversation.timestamp).getTime()
          )
          .map(({ conversation, matchedOn, matchedText }) => (
            <div key={conversation.id} className="flex w-full flex-col">
              <ConversationPreview
                id={conversation.id}
                channelType={conversation.platform as "telegram" | "whatsapp" | "instagram" | "web"}
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
          ))
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
