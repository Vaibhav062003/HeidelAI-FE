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
      className={`p-4 w-full rounded-none cursor-pointer transition-colors ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar>
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
              <span className="font-semibold text-black truncate">{customerName}</span>
              {/* {isAiEnabled ? (
                <Bot className="h-4 w-4 text-blue-500" />
              ) : assignedAgentId ? (
                <User2 className="h-4 w-4 text-green-500" />
              ) : null} */}
            </div>
            <span className="text-xs text-gray-500">{getRelativeTime(timestamp)}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          <div className="flex items-center gap-2 mt-2">
            {priority && priority === "low" && (
              <Badge variant="outline" className="bg-green-100 text-green-600">
                Low
              </Badge>
            )}
            {priority && priority === "medium" && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-600">
                Medium
              </Badge>
            )}
            {priority && priority === "high" && (
              <Badge variant="outline" className="bg-red-100 text-red-600">
                High
              </Badge>
            )}
            {/* {unreadCount > 0 && (
              <Badge className="rounded-full" variant="destructive">{unreadCount}</Badge>
            )} */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationPreview;