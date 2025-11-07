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
  isMobile?: boolean; 
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
  <div
    className={`py-0.5 px-2.5 w-full cursor-pointer border-b border-gray-100 ${
      isSelected ? "bg-gray-100" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <div className="w-7 h-7 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
        <img 
          src={
            channelType === "whatsapp" ? "/features/whatsapp.png" :
            channelType === "telegram" ? "/features/telegram.png" :
            "/features/instagram.png"
          }
          alt="" 
          className="w-full h-full object-cover" 
          loading="lazy"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="font-semibold text-gray-900 text-[14px] truncate">
            {customerName}
          </h3>
          <span className="text-[11px] text-gray-500 flex-shrink-0">
            {timestamp}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-1.5">
          <p className="text-[14px] text-gray-600 truncate flex-1">
            {lastMessage}
          </p>
          
          {unreadCount > 0 && (
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] text-white font-semibold">
                {unreadCount > 9 ? '9' : unreadCount}
              </span>
            </div>
          )}
        </div>

        {priority && (
          <span
            className={`${getPriorityBadgeStyles(priority)} text-[8px] px-1 rounded-sm capitalize font-medium inline-block border mt-0.5`}
          >
            {priority}
          </span>
        )}
      </div>
    </div>
  </div>
);
}
export default ConversationPreview;
