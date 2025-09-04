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

              {/* Conditional icon block */}
            </div>

            <span className="text-xs text-gray-500">
              {getRelativeTime(timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate max-w-[200px] mt-1 ml-[5px]">
            {lastMessage}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {priority === "low" && (
              <Badge
                variant="outline"
                className="ml-52 bg-green-100 text-green-600 text-xs px-1 py-0 rounded-sm h-auto leading-tight min-h-0"
              >
                Low
              </Badge>
            )}
            {priority === "medium" && (
              <Badge
                variant="outline"
                className="ml-52 -mt-1 bg-yellow-100 text-yellow-600 text-xs px-2 py-0 rounded-sm h-auto leading-tight min-h-0"
              >
                Medium
              </Badge>
            )}
            {priority === "high" && (
              <Badge
                variant="outline"
                className="ml-52 bg-red-100 text-red-600 text-xs px-1 py-0 rounded-sm h-auto leading-tight min-h-0"
              >
                High
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationPreview;