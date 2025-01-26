import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Conversation } from '../types/conversation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Send,
  Paperclip,
  Globe,
  Bot,
  MoreVertical,
  Phone,
  Video,
  UserPlus,
  Smile,
  Mic,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReminderDialog from "./ReminderDialog";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  role: "customer" | "ai" | "agent";
  sender_id: string;
  conversation_id: string;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file" | "voice";
  fileUrl?: string;
}

interface ChatViewProps {
  selectedConversationId?: string;
}

const ChatView = ({
  selectedConversationId,
}: ChatViewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [checked, setChecked] = useState(false)


  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);


  useEffect(() => {
    if (!selectedConversationId) return;

    // Fetch conversation details
    const fetchConversation = async () => {
      try {
        const response = await fetch(`https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}`, {
          method: "GET",
          credentials: "include",  // Allows cookies/auth headers if needed
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setConversation(data);
        console.log("conversation data", data);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/messages`, {
          method: "GET",
          credentials: "include",  // Allows cookies/auth headers if needed
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    const ws = new WebSocket(`wss://egenie-whatsapp.koyeb.app/ws2/client-${Date.now()}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message' && data.message.conversation_id === selectedConversationId) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    fetchConversation();
    fetchMessages();

    return () => ws.close();
  }, [selectedConversationId]);

  // Decide on avatar source
  let avatarSource = "/default-avatar.png";
  if (conversation?.platform === "whatsapp") {
    avatarSource = "/features/whatsapp.png";
  } else if (conversation?.platform === "telegram") {
    avatarSource = "/features/telegram.png";
  } else if (conversation?.platform === "instagram") {
    avatarSource = "/features/instagram.png";
  }

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col bg-white max-h-[94vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <img src={avatarSource} alt="Platform avatar" />
            </Avatar>
            <div>
              <h3 className="font-medium">{conversation?.customer_name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
                <span className="text-xs text-gray-500">Last seen 2m ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start voice call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start video call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReminder(true)}
                >
                  <Clock className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Set reminder</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-2">
              <span className="AI text-xs">AI</span>
              <Switch checked={false} />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Customer Info</DropdownMenuItem>
                <DropdownMenuItem>Block Contact</DropdownMenuItem>
                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem>Export Chat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea ref={scrollAreaRef} className="flex-1 h-full p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "customer" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "customer"
                  ? "bg-gray-100 text-black"
                  : "bg-blue-500 text-white"
              }`}
            >
              {message.type === "image" && message.fileUrl && (
                <img
                  src={message.fileUrl}
                  alt="Shared image"
                  className="rounded-lg mb-2"
                />
              )}
              {message.type === "voice" && message.fileUrl && (
                <audio controls src={message.fileUrl} className="w-full" />
              )}
              {(message.type === "text" || !message.type) && (
                <p>{message.content}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs ${
                    message.role === "customer" ? "text-gray-500" : "text-blue-100"
                  }`}
                >
                  {formatMessageTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {/* Empty div for scrolling */}
        <div ref={lastMessageRef} />
      </div>
    </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {/* {suggestedResponses.map((response, index) => (
              <Button
                key={index}
                variant="secondary"
                className="whitespace-nowrap"
                size="sm"
              >
                {response}
              </Button>
            ))} */}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add emoji</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMicClick}
                  className={isRecording ? "bg-red-100" : ""}
                >
                  <Mic
                    className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? "Stop recording" : "Record voice message"}
              </TooltipContent>
            </Tooltip>

            <Input placeholder="Type your message..." className="flex-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <ReminderDialog
          open={showReminder}
          onOpenChange={setShowReminder}
          onSave={(reminder) => {
            console.log("Reminder saved:", reminder);
            setShowReminder(false);
          }}
        />
      </Card>
    </TooltipProvider>
  );
};

const formatMessageTime = (timestamp: string): string => {
  try {
    // Parse the UTC timestamp
    const date = parseISO(timestamp);
    
    // Convert to IST (UTC+5:30)
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Format to 12-hour time with lowercase am/pm
    return format(istDate, 'h:mma').toLowerCase();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export default ChatView;
