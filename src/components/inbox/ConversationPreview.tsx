import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, AlertCircle, ThumbsUp, Bot, User2 } from "lucide-react";
import { getRelativeTime } from '@/components/utils/dateUtils';

interface ConversationPreviewProps {
  id: string;
  channelType: "telegram" | "whatsapp" | "instagram" | "web";
  priority: "high" | "medium" | "low";
  sentiment: "positive" | "neutral" | "negative";
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
  isAiEnabled?: boolean;
  assignedAgentId?: string | null;
}

const ConversationPreview = ({
  id,
  channelType,
  priority,
  sentiment,
  customerName,
  lastMessage,
  timestamp,
  unreadCount,
  avatarUrl,
  isSelected = false,
  onClick,
  isAiEnabled = true,
  assignedAgentId
}: ConversationPreviewProps) => {
  const getPriorityBadgeStyles = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <Card
      className={`p-2 w-full rounded-none cursor-pointer transition-colors ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2.5">
        <Avatar className="relative top-[-3px] left-1">
          {channelType === "whatsapp" && (
            <img src="/features/whatsapp.png" alt="" />
          )}
          {channelType === "telegram" && (
            <img src="/features/telegram.png" alt="" />
          )}
          {channelType === "instagram" && (
            <img src="/features/instagram.png" alt="" />
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-[Inter] font-semibold text-black text-sm truncate mt-[0.5px] ml-[5px]">
                {customerName}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {getRelativeTime(timestamp)}
            </span>
          </div>
          
          {/* Message and Priority Badge on the same line */}
          <div className="flex items-center justify-between mt-1 ml-[5px] gap-2">
            <p className="text-sm text-gray-600 truncate flex-1">
              {lastMessage}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="outline"
                className={`${getPriorityBadgeStyles(priority)} text-xs px-2 py-0 rounded-sm h-auto leading-tight min-h-0 capitalize`}
              >
                {priority}
              </Badge>
              {unreadCount > 0 && (
                <Badge className="bg-blue-500 text-white text-xs px-2 py-0 rounded-full h-auto leading-tight min-h-0">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationPreview;
