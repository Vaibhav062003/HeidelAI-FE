import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageCircle, AlertCircle, ThumbsUp, Bot, User2, Globe, CheckCircle2, Loader2 } from "lucide-react";
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
  contactSynced?: boolean;
  syncStatus?: 'synced' | 'failed' | 'pending';
}

const formatName = (fullName: string) => {
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0].toUpperCase() : '';
  
  return lastInitial 
    ? `${firstName} ${lastInitial}.` 
    : firstName;
};

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
  assignedAgentId,
  contactSynced = false,
  syncStatus = 'pending'
}: ConversationPreviewProps) => {
  const formattedName = formatName(customerName);

  return (
    <Card
      className={`p-4 w-full rounded-none cursor-pointer transition-colors ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="shrink-0">
          {channelType === "whatsapp" && <img src="/features/whatsapp.png" alt="WhatsApp" />}
          {channelType === "telegram" && <img src="/features/telegram.png" alt="Telegram" />}
          {channelType === "instagram" && <img src="/features/instagram.png" alt="Instagram" />}
          {channelType === "web" && <Globe className="h-6 w-6 text-blue-500" />}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between whitespace-nowrap">
            <div className="flex items-center gap-2 overflow-hidden">
              <span 
                className="font-semibold text-black truncate max-w-full" 
                title={customerName}
              >
                {formattedName}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {contactSynced && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
                {syncStatus === 'failed' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                {syncStatus === 'pending' && (
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                )}
              </div>
            </div>
            <span className="text-xs text-gray-500 shrink-0 ml-2">{getRelativeTime(timestamp)}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate pr-2">{lastMessage}</p>
            <div className="flex items-center gap-2 shrink-0">
              {isAiEnabled ? (
                <Bot className="h-4 w-4 text-blue-500" />
              ) : assignedAgentId ? (
                <User2 className="h-4 w-4 text-green-500" />
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {priority === "low" && (
              <Badge variant="outline" className="bg-green-100 text-green-600">
                Low
              </Badge>
            )}
            {priority === "medium" && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-600">
                Medium
              </Badge>
            )}
            {priority === "high" && (
              <Badge variant="outline" className="bg-red-100 text-red-600">
                High
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge className="rounded-full" variant="destructive">
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
