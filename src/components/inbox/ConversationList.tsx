import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import ConversationPreview from "./ConversationPreview";
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '@/components/types/conversation';



interface ConversationListProps {
  selectedConversationId?: string;
  onConversationSelect?: (id: string) => void;
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

const ConversationList = ({
  selectedConversationId,
  onConversationSelect
}: ConversationListProps) => {
  const { conversations, loading, error } = useConversations();

  if (loading) {
    return (
      <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations" className="pl-9 pr-4" />
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
          </TabsList>
        </Tabs>
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>
      {/* Loading Skeletons */}
      <div className="flex-1 overflow-auto">
          {[...Array(8)].map((_, i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations" className="pl-9 pr-4" />
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
          </TabsList>
        </Tabs>
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>
    <div className="p-4 text-neutral-700">Error loading conversations: {error.message}</div>
    </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search conversations" className="pl-9 pr-4" />
        </div>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live_agent">Live Agent</TabsTrigger>
            <TabsTrigger value="AI">AI</TabsTrigger>
          </TabsList>
        </Tabs>
        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
          <Filter className="h-4 w-4" />
          Filter
        </button>
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
      <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation: Conversation) => (
            
        <ConversationPreview
          key={conversation.id}
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
          priority="medium" // Default values for existing props
          sentiment="neutral" // Default values for existing props
        />
      ))}
      </div>
    </div>
  );
};

const formatLastMessage = (message: string) => {
  return message.includes("know_more_request_from_sender") ? "Know more." : message;
};

export default ConversationList;
