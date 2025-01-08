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
  console.log("ConversationPreview", customerName);
  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
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
              {isAiEnabled ? (
                <Bot className="h-4 w-4 text-blue-500" />
              ) : assignedAgentId ? (
                <User2 className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
            <span className="text-sm text-gray-500">{getRelativeTime(timestamp)}</span>
          </div>
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          <div className="flex items-center gap-2 mt-2">
            {channelType === "whatsapp" && (
              <Badge variant="outline" className="bg-green-50">
                WhatsApp
              </Badge>
            )}
            {channelType === "telegram" && (
              <Badge variant="outline" className="bg-blue-50">
                Telegram
              </Badge>
            )}
            {channelType === "instagram" && (
              <Badge variant="outline" className="bg-purple-50">
                Instagram
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationPreview;