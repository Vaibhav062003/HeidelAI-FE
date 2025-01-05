import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, AlertCircle, ThumbsUp } from "lucide-react";

interface ConversationPreviewProps {
  channelType?: "telegram" | "whatsapp" | "instagram" | "web";
  priority?: "high" | "medium" | "low";
  sentiment?: "positive" | "neutral" | "negative";
  customerName?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  avatarUrl?: string;
  isSelected?: boolean;
}

const ConversationPreview = ({
  channelType = "telegram",
  priority = "medium",
  sentiment = "neutral",
  customerName = "John Doe",
  lastMessage = "Hey there! I need help with my order...",
  timestamp = "5m ago",
  unreadCount = 2,
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  isSelected = false,
}: ConversationPreviewProps) => {
  const channelColors = {
    telegram: "bg-blue-100 text-blue-600",
    whatsapp: "bg-green-100 text-green-600",
    instagram: "bg-purple-100 text-purple-600",
    web: "bg-gray-100 text-gray-600",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-green-100 text-green-600",
  };

  const sentimentIcons = {
    positive: <ThumbsUp className="h-4 w-4 text-green-500" />,
    neutral: <MessageCircle className="h-4 w-4 text-gray-500" />,
    negative: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <Card
      className={`w-full h-20 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-gray-100" : "bg-white"
      }`}
    >
      <Avatar className="h-12 w-12">
        <img src={avatarUrl} alt={customerName} className="object-cover" />
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{customerName}</span>
            <Badge variant="secondary" className={channelColors[channelType]}>
              {channelType}
            </Badge>
          </div>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={priorityColors[priority]}>
              {priority}
            </Badge>
            {sentimentIcons[sentiment]}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationPreview;
