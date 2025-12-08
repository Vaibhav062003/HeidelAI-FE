import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2, XCircle, Clock, RefreshCw } from "lucide-react";
import { useCallback, useState} from "react";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  role: "customer" | "ai" | "agent" | "system";
  sender_id: string;
  conversation_id: string;
  status?: "sent" | "delivered" | "read" | "sending";
  type?:
    | "text"
    | "image"
    | "file"
    | "voice"
    | "video"
    | "share"
    | "ig_story"
    | "ig_reel"
    | "story_reply"
    | "system"
    | "message_reply";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  product_data?: ProductData[];
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  reaction?: MessageReactions;
}

interface ProductData {
  id: number;
  image_link: string;
  name: string;
  on_sale: string;
  permalink: string;
  price: number;
  regular_price: string;
}

interface MessageReactions {
  emoji: string;
  username: string;
  full_name: string;
  timestamp: string;
  profile_picture_url: string;
}


interface UserStatusProps {
  conversationStatus: "open" | "closed" | "followup";
  isStatusDropdownOpen: boolean;
  setIsStatusDropdownOpen: (open: boolean) => void;
  selectedConversationId: string;
  statusLoading: boolean;
  message: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  lastMessageRef: React.RefObject<HTMLDivElement | null>;
  setConversationStatus: (status: "open" | "closed" | "followup") => void;
  handleResolve: (id: string) => void;
  handleFollowUp: (id: string) => void;
  handleReopen: () => void;
}

const User_Status: React.FC<UserStatusProps> = ({
  conversationStatus,
  isStatusDropdownOpen,
  setIsStatusDropdownOpen,
  selectedConversationId,
  statusLoading,
  message,
  setMessages,
  lastMessageRef,
  setConversationStatus,
  handleResolve,
  handleFollowUp,
  handleReopen,
}) => {

  return (
    <div>
      <DropdownMenu
        open={isStatusDropdownOpen}
        onOpenChange={setIsStatusDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-2xl hover:bg-gray-100 flex items-center space-x-1 px-3 py-2.5 bg-white"
            disabled={statusLoading}
          >
            {conversationStatus === "closed" ? (
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            ) : conversationStatus === "followup" ? (
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm font-medium text-gray-800">
              {conversationStatus === "closed"
                ? "Closed"
                : conversationStatus === "followup"
                ? "Follow-up"
                : "Open"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-600" />
            {statusLoading && (
              <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-600" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl shadow-xl border bg-white py-2"
        >
          {conversationStatus === "open" && (
            <>
              <DropdownMenuItem
                onClick={() => handleResolve(selectedConversationId)}
                className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-red-50 rounded-xl mx-2"
                disabled={statusLoading}
              >
                <XCircle className="h-4 w-4 mr-3 text-red-600" />
                <span className="font-medium">Close Conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFollowUp(selectedConversationId)}
                className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-amber-50 rounded-xl mx-2"
                disabled={statusLoading}
              >
                <Clock className="h-4 w-4 mr-3 text-amber-600" />
                <span className="font-medium">Mark for Follow-up</span>
              </DropdownMenuItem>
            </>
          )}
          {(conversationStatus === "closed" ||
            conversationStatus === "followup") && (
            <DropdownMenuItem
              onClick={handleReopen}
              className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-green-50 rounded-xl mx-2"
              disabled={statusLoading}
            >
              <RefreshCw className="h-4 w-4 mr-3 text-green-600" />
              <span className="font-medium">Reopen Conversation</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default User_Status;