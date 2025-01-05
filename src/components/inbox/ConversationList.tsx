import React from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import ConversationPreview from "./ConversationPreview";

interface Conversation {
  id: string;
  channelType: "telegram" | "whatsapp" | "instagram" | "web";
  priority: "high" | "medium" | "low";
  sentiment: "positive" | "neutral" | "negative";
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl: string;
}

interface ConversationListProps {
  conversations?: Conversation[];
  selectedConversationId?: string;
  onConversationSelect?: (id: string) => void;
}

const ConversationList = ({
  conversations = [
    {
      id: "1",
      channelType: "telegram",
      priority: "high",
      sentiment: "positive",
      customerName: "Alice Johnson",
      lastMessage: "Thank you for your help!",
      timestamp: "2m ago",
      unreadCount: 3,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      id: "2",
      channelType: "whatsapp",
      priority: "medium",
      sentiment: "neutral",
      customerName: "Bob Smith",
      lastMessage: "When will my order arrive?",
      timestamp: "15m ago",
      unreadCount: 1,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
    {
      id: "3",
      channelType: "instagram",
      priority: "low",
      sentiment: "negative",
      customerName: "Carol White",
      lastMessage: "I'm still waiting for a response",
      timestamp: "1h ago",
      unreadCount: 0,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    },
  ],
  selectedConversationId = "",
  onConversationSelect = () => {},
}: ConversationListProps) => {
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

      <ScrollArea className="flex-1">
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
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
