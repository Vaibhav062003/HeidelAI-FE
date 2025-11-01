"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "./Sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { toast, Toaster } from "sonner";
import { Conversation } from "../types/conversation";
import {
  ShoppingCart, MapPin, Upload, FileText, FileImage, FileVideo, Music, File,
  Loader2, X, ChevronDown, CheckCircle, RefreshCw, XCircle, ChevronLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "../ui/dialog";
import dynamic from "next/dynamic";
import { useReminders } from "../hooks/useReminders";
import { H1, H2, H3, Body, Small } from "@/components/typography";
import { Trash2, User, Plus } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import { useTypingIndicator } from "../hooks/typingIndicator";
import { createClient } from '@supabase/supabase-js';
import { conversationService, WhatsAppMessage } from "@/components/services/api";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Send, Paperclip, MoreVertical, Menu, Smile, Mic, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReminderDialog from "./ReminderDialog";
import "../../app/dashboard/dashboard.css";
import Image from "next/image";
import CustomerInfo from "./CustomerInfo";
import LandingDashboard from "./LandingDashboard";
import api from "@/lib/session_api";
import { useConversations } from "../hooks/useConversations";
import { storeData, getData, getAllKeys, deleteData } from '@/lib/indexedDB';
import { Product } from "../types/product";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Picker = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "@/components/ui/tooltip";
// import {
//   Send,
//   Paperclip,
//   // Globe,
//   // Bot,
//   MoreVertical,
//   // Phone,
//   // Video,
//   // UserPlus,
//   Smile,
//   Mic,
//   Clock,
// } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import ReminderDialog from "./ReminderDialog";

// // import '../../app/dashboard/dashboard.css';
// import Image from "next/image";
// import CustomerInfo from './CustomerInfo';
// import LandingDashboard from "./LandingDashboard";
// import api from "@/lib/session_api";
// import { useTypingIndicator } from "../hooks/typingIndicator";
import Conversation_Status from "./Conversation_Status";
import InstagramPost from "../instagram/messaging/InstagramPost";
import InstagramReel from "../instagram/messaging/InstagramReel";
import InstagramStory from "../instagram/messaging/InstagramStory";
import LazyMediaLoader from "../LazyMediaLoader";
// import Image from "next/image";
// import { IconShoppingCartFilled } from "@tabler/icons-react";
// import { Progress } from "@radix-ui/react-progress";

interface CustomerInfo {
  name: string;
  phone: string;
  address?: AddressData;
  cart?: CartItem[];
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

// interface Product {
//   id: string;
//   category: string;
//   description: string;
//   images: string;
//   name: string;
//   on_sale: string;
//   permalink: string;
//   price: number;
//   product_id: number;
//   purchasable: string;
//   regular_price: string;
//   sale_price: string;
//   slug: string;
//   stock_quantity: number;
// }

interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dateTime: string;
  conversationId: string;
}

interface ProductInfo {
  name: string;
  price: string;
  link: string;
  image_url: string;
  sale_price?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  role: "customer" | "ai" | "agent" | "system";
  sender_id: string;
  conversation_id: string;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file" | "voice" | "video" | "share" | "ig_story" | "ig_reel" | "system";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  product_data?: ProductData[];
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface ChatViewProps {
  selectedConversationId: string;
  sharedProduct: Product | null;
  onClearSharedProduct: () => void;
  isRightSidebarVisible?: boolean;
  onOpenRightSidebar?: () => void;
  isMobile?: boolean;
  onBackToList?: () => void;
}

interface CartProductData {
  name: string;
  price: string;
  sale_price: string;
  image_url: string;
  link: string;
}

interface CartItem {
  product_data: CartProductData;
  quantity: number;
  item_price: number;
  currency: string;
}

interface AddressDetails {
  country: string;
  city: string;
  address: string;
  full_name: string;
  flow_token: string;
  state: string;
  email: string;
  pin_code: string;
}

interface OrderItem {
  product_retailer_id: string;
  quantity: number;
  item_price: number;
  currency: string;
}

interface AddressData {
  sender_id: string;
  order_details: OrderItem[];
  address: AddressDetails;
}

interface CannedResponse {
  id: string;
  shortcode: string;
  message: string;
  created_at: string;
}

const MessageSkeleton = memo(() => (
  <div className="flex flex-col gap-4">
    <div className="flex items-start gap-2 max-w-[50%]">
      <div className="w-8 h-8 skeleton rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 skeleton rounded-full" />
        <div className="h-10 w-48 skeleton rounded-lg" />
      </div>
    </div>
    <div className="flex items-start gap-2 max-w-[50%] self-end">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 skeleton rounded-full self-end" />
        <div className="h-10 w-56 skeleton rounded-lg" />
      </div>
    </div>
  </div>
));
MessageSkeleton.displayName = "MessageSkeleton";

const LoadingState = memo(() => (
  <Card className="h-screen flex flex-col bg-white">
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 skeleton rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 skeleton rounded-full" />
          <div className="h-3 w-24 skeleton rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 skeleton rounded-full" />
        <div className="w-8 h-8 skeleton rounded-full" />
        <div className="w-8 h-8 skeleton rounded-full" />
      </div>
    </div>
    <ScrollArea className="flex-1 h-full p-4">
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <MessageSkeleton key={i} />
        ))}
      </div>
    </ScrollArea>
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 skeleton rounded-lg" />
        <div className="flex-1 h-10 skeleton rounded-lg" />
        <div className="w-8 h-8 skeleton rounded-lg" />
      </div>
    </div>
  </Card>
));
LoadingState.displayName = "LoadingState";

const SharedProductPreview = memo(({ product, onRemove }: { product: Product; onRemove: () => void }) => (
  <div className="flex items-center w-fit gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200 mb-2">
    <div className="w-15 h-15 relative">
      <Image
        src={product.images}
        alt={product.name}
        height={80}
        width={80}
        className="rounded object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-base font-medium text-gray-900">
        {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
      </p>
      <p className="text-sm text-gray-500">₹{product.price}</p>
    </div>
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRemove}>
      <X className="h-4 w-4" />
    </Button>
  </div>
));
SharedProductPreview.displayName = "SharedProductPreview";

const RemindersPopover = ({
  reminders,
  onCreateReminder,
  onDeleteReminder
}: {
  reminders: Reminder[];
  onCreateReminder: () => void;
  onDeleteReminder: (id: string) => void;
}) => {
  return (
    <PopoverContent className="w-80" align="end">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Reminders</h4>
          {reminders.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateReminder}
              className="h-8 px-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Reminder
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500 mb-4">No reminders set</div>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateReminder}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add your first reminder
              </Button>
            </div>
          ) : (
            reminders.map((reminder) => (
              console.log("reminder", reminder),
              <div
                key={reminder.id}
                className="flex items-start justify-between p-2 rounded-lg border bg-white group"
              >
                <div>
                  <p className="font-medium text-sm">{reminder.title}</p>
                  {reminder.notes && (
                    <p className="text-xs text-gray-500">{reminder.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {format(
                      // Add IST offset (UTC+5:30)
                      new Date(new Date(reminder.dateTime).getTime() + (5.5 * 60 * 60 * 1000)),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteReminder(reminder.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </PopoverContent>
  );
};
// RemindersPopover.displayName = "RemindersPopover";

const CartMessage = memo(({ items }: { items: CartItem[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { total, totalQuantity } = useMemo(() => ({
    total: items.reduce((sum, item) => sum + item.item_price * item.quantity, 0),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
  }), [items]);

  return (
    <>
      <div className="flex flex-col w-fit mb-4 bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center gap-4">
          <img
            src={items[0].product_data.image_url}
            alt={items[0].product_data.name}
            className="w-24 h-24 rounded"
            loading="lazy"
          />
          <div className="flex flex-col space-y-2">
            <div className="relative flex space-x-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <div className="font-medium">{totalQuantity} items</div>
            </div>
            <div className="text-sm">
              ₹{total.toLocaleString("en-IN")} (estimated total)
            </div>
          </div>
        </div>
        <Button variant="outline" className="mt-3" onClick={() => setIsModalOpen(true)}>
          View Cart ({totalQuantity} items)
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cart Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-auto p-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4">
                <img
                  src={item.product_data.image_url}
                  alt={item.product_data.name}
                  className="w-24 h-24 rounded"
                  loading="lazy"
                />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2">{item.product_data.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span>Quantity: {item.quantity}</span>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹{(item.item_price * item.quantity).toLocaleString("en-IN")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × ₹{item.item_price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-4 text-lg font-medium">
              <span>Total ({totalQuantity} items)</span>
              <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});
CartMessage.displayName = "CartMessage";

const AddressMessage = memo(({ data }: { data: AddressData }) => (
  <div className="flex flex-col w-fit mb-4 bg-gray-50 rounded-lg p-4 border max-w-md hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-3">
      <MapPin className="h-5 w-5 text-blue-600" />
      <div className="font-medium">Delivery Address</div>
    </div>
    <div className="space-y-3 text-sm">
      <div className="flex flex-col">
        <span className="font-medium">{data.address.full_name}</span>
        <span className="text-gray-600">{data.address.email}</span>
        <span className="text-gray-600">+{data.sender_id}</span>
      </div>
      <div className="flex flex-col">
        <span>{data.address.address}</span>
        <span>{data.address.city}, {data.address.state}</span>
        <span>{data.address.pin_code}</span>
        <span>{data.address.country.replace("0_", "")}</span>
      </div>
      <div className="pt-3 border-t">
        <div className="text-xs text-gray-500 mb-1">Order Summary</div>
        {data.order_details.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{item.quantity} items</span>
            <span className="font-medium">
              {item.currency} {item.item_price.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
));
AddressMessage.displayName = "AddressMessage";

const FilePreview = memo(({
  file,
  caption,
  setCaption,
  onCancel
}: {
  file: File;
  caption: string;
  setCaption: (text: string) => void;
  progress: number;
  onCancel: () => void;
}) => {
  const isVideo = file.type.startsWith("video/");
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="relative">
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <div className="aspect-video w-full relative">
          {isVideo ? (
            <video src={previewUrl} className="w-full h-full object-contain" controls={false} />
          ) : (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          )}
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
FilePreview.displayName = "FilePreview";

const MessageItem = memo(({
  message,
  isLast,
  index,
  isLatest
}: {
  message: Message;
  isLast: boolean;
  index: number;
  isLatest: boolean
}) => {
  

  if (message.role === "system") {
    return (
      <div className="flex justify-center my-4 message-item">
        <div className="bg-white/80 backdrop-blur-sm text-gray-600 text-sm px-4 py-2 rounded-2xl border border-gray-200/60 shadow-sm hw-accel">
          <span className="font-medium">{message.content}</span>
          <span className="ml-0.5 text-gray-400 text-xs">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    );
  }

  return (

          <div
            className={`rounded-3xl px-3 py-2 sm:px-4 sm:py-3 w-full shadow-sm border hw-accel ${message.role === "customer"
                ? "bg-white/90 backdrop-blur-sm rounded-bl-lg text-gray-900 border-gray-200/60"
                : "bg-blue-600/90 backdrop-blur-sm rounded-br-lg text-white border-blue-500/60"
              }`}
            style={{ wordBreak: "break-word" }}
          >
            <div className="break-words">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            <div className="flex justify-end mt-2">
              <span
                className={`text-xs ${message.role === "customer" ? "text-gray-500" : "text-white/70"
                  }`}
              >
                {formatMessageTime(message.timestamp)}
              </span>
            </div>
          </div>

  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
    prevProps.isLast === nextProps.isLast;
});
MessageItem.displayName = "MessageItem";

const ChatView = ({
  selectedConversationId,
  sharedProduct,
  onClearSharedProduct,
  isRightSidebarVisible,
  onOpenRightSidebar,
  isMobile = false,
  onBackToList,
}: ChatViewProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [filteredResponses, setFilteredResponses] = useState<CannedResponse[]>([]);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [ShowInfo, setShowInfo] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioModalOpen, setIsAudioModalOpen] = useState(false);
  const [mode, setMode] = useState<"reply" | "private">("reply");
  const [customerTimers, setCustomerTimers] = useState<Record<string, number>>({});
  const [currentTimer, setCurrentTimer] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<'open' | 'closed' | 'followup'>('open');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [fileCaption, setFileCaption] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { reminders = [], refetchReminders } = useReminders(selectedConversationId);
  const [typingUsers, setTypingUsers] = useState<Map<string, {
    agent_name: string;
    timestamp: number;
  }>>(new Map());

  const [globalMuted, setGlobalMuted] = useState(true);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<"reel" | "story" | null>(null);

  const handlePlay = (id: string, type: "reel" | "story") => {
    setActiveMediaId(id);
    setActiveMediaType(type);
  };

  const handleMuteToggle = (muted: boolean) => {
    setGlobalMuted(muted);
  };

  const token = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) throw new Error("Session ID not found in localStorage");

    const res = await fetch("api/session-token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    const { token: sessionToken } = await res.json();
    return sessionToken;
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Error accessing microphone. Please check your permissions.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const handleMicClick = useCallback(() => {
    setIsRecording(!isRecording);
  }, [isRecording]);

  const handleSendAudio = useCallback(async () => {
    if (!audioURL || !selectedConversationId) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      const audioBlob = await fetch(audioURL).then((r) => r.blob());
      const audioFile = new window.File([audioBlob], "voice-message.webm", {
        type: "audio/webm",
      });

      formData.append("file", audioFile);
      formData.append("type", "audio");
      formData.append("messaging_product", "whatsapp");
      formData.append("conversation_id", selectedConversationId);

      const response = await fetch(
        `https://egenie-whatsapp.koyeb.app/media/${selectedConversationId}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.fileUrl || audioURL,
          type: "voice",
          role: "agent",
          conversation_id: selectedConversationId,
          timestamp: new Date().toISOString(),
          sender_id: "agent",
          fileUrl: data.fileUrl || audioURL,
        },
      ]);

      setAudioURL(null);
      toast.success("Voice message sent successfully");
    } catch (error) {
      console.error("Error sending audio message:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send voice message");
    } finally {
      setIsSending(false);
    }
  }, [audioURL, selectedConversationId]);


  const handleFileUpload = useCallback(async (file: File | null, recipient: string, caption: string = "") => {
    if (!file || !selectedConversationId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const whatsappId = localStorage.getItem('whatsapp_user_id');
      if (!whatsappId) {
        toast.error('WhatsApp user ID not found');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('recipient_id', recipient.split('_')[1]);
      if (caption.trim()) formData.append('caption', caption.trim());

      const response = await api.post(
        `whatsapp/${whatsappId}/media/send`,
        { data: formData }
      );

      if (response.status !== 200) {
        throw new Error(`Failed to upload file: ${response.statusText || response.status}`);
      }

      const data = response.data;

      setMessages(prev => [
        ...prev,
        {
          id: data.details.message_id || Date.now().toString(),
          content: caption || `[File]`,
          type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'voice' : 'file',
          role: 'agent',
          conversation_id: selectedConversationId,
          timestamp: new Date().toISOString(),
          sender_id: 'agent',
          fileUrl: data.details.media_id,
          fileName: file.name,
          fileType: file.type
        }
      ]);

      toast.success('File sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setFileCaption("");
      setIsFileModalOpen(false);
    }
  }, [selectedConversationId]);

  const handleShareProduct = useCallback(async (messageText: string, product: Product) => {
    if (!selectedConversationId) return;

    if (!messageText.trim()) {
      toast.error("Cannot send empty message", {
        description: "Please add a message to send with the product",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('https://egenie-whatsapp.koyeb.app/api/send_single_product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConversationId,
          product_id: product.product_id,
          message: messageText.trim() || undefined
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to share product");
      }

      setMessage("");
      onClearSharedProduct();
      toast.success("Product shared successfully");
    } catch (error) {
      console.error("Error sharing product:", error);
      toast.error("Failed to share product");
    } finally {
      setIsSending(false);
    }
  }, [selectedConversationId, onClearSharedProduct]);

  const debouncedSetMessage = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMessage(value);
      }, 50);
    };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!message.trim() || !selectedConversationId || isSending) return;

    let contentToSend = message.trim();
    const platform = selectedConversationId.split('_')[0];
    const sender_id = selectedConversationId.split('_')[1];

    if (contentToSend.startsWith('/')) {
      const shortcode = contentToSend.slice(1).toLowerCase();
      const cannedResponse = cannedResponses.find(
        (cr) => cr.shortcode.toLowerCase() === shortcode
      );
      if (cannedResponse) {
        contentToSend = cannedResponse.message;
      }
    }

    setIsSending(true);
    try {

      let response;
      if (platform === 'whatsapp') {
        const whatsappId = localStorage.getItem('whatsapp_user_id');
        if (!whatsappId) throw new Error('No WhatsApp ID found');

        const payload = {
          conversation_id: selectedConversationId,
          content: contentToSend,
          sender_id: sender_id,
        };
        response = await conversationService.sendWhatsAppMessage(whatsappId, payload);
        if (response.status !== "success") throw new Error(response.message || 'Failed to send message');
      } else if (platform === 'instagram') {
        const data = {
          conversation_id: selectedConversationId,
          content: contentToSend,
          sender_id: sender_id
        };
        response = await api.post(`/api/instagram/conversations/send_message`, data);
        if (response.status !== 200) throw new Error('Failed to send message');
      }
      setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [message, selectedConversationId, isSending, cannedResponses]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const toggleAI = async () => {
    if (!selectedConversationId || isToggling) return;

    setIsToggling(true);
    try {
      const platform = selectedConversationId.split('_')[0];
      let response;
      if (platform === 'whatsapp') {
        const whatsappId = localStorage.getItem('whatsapp_user_id');
        if (!whatsappId) throw new Error('No WhatsApp ID found');
        response = await conversationService.toggleWhatsAppAi(whatsappId, selectedConversationId, !isAIEnabled);
        if (response.status !== "success") throw new Error(response.message || 'Failed to toggle AI');
      } else if (platform === 'instagram') {
        response = await api.post(`/api/instagram/conversations/${selectedConversationId}/toggle_ai`, {
          enabled: !isAIEnabled
        });
        if (response.status !== 200) throw new Error('Failed to toggle AI');
      }
      setIsAIEnabled(!isAIEnabled);
      toast.success(`AI ${!isAIEnabled ? "enabled" : "disabled"} for this conversation`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to toggle AI status');
    } finally {
      setIsToggling(false);
    }
  }

  const saveCustomerInfo = useCallback(async (updatedData: {
    name: string;
    email: string;
    billingaddress: string;
    shippingaddress: string;
    gstin: string;
  }) => {
    try {
      const response = await fetch(
        `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/update_customer_info`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer info");
      }

      const updatedConversation = await response.json();
      setConversation(updatedConversation);
      toast.success("Customer information updated successfully!");
    } catch (error) {
      console.error("Error updating customer info:", error);
      toast.error("Failed to update customer information.");
    }
  }, [selectedConversationId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (sharedProduct) {
        handleShareProduct(message, sharedProduct);
      } else if (audioURL) {
        handleSendAudio();
      } else {
        sendMessage();
      }
    }
    if (e.key === "/" && message === "") {
      setShowCannedResponses(true);
    }
  }, [sharedProduct, message, audioURL, handleShareProduct, handleSendAudio, sendMessage]);

  const handleResolve = useCallback(() => {
    setIsResolved(true);
    setIsFollowUp(false);
    setConversationStatus('closed');
    setIsStatusDropdownOpen(false);
    const agentName = "You";

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was marked Closed by ${agentName}`,
      type: 'system',
      role: 'system',
      conversation_id: selectedConversationId || '',
      timestamp: new Date().toISOString(),
      sender_id: 'system'
    };

    setMessages(prev => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  }, [selectedConversationId]);

  const handleReopen = useCallback(() => {
    setIsResolved(false);
    setIsFollowUp(false);
    setConversationStatus('open');
    setIsStatusDropdownOpen(false);
    const agentName = "You";

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was reopened by ${agentName}`,
      type: 'system',
      role: 'system',
      conversation_id: selectedConversationId || '',
      timestamp: new Date().toISOString(),
      sender_id: 'system'
    };

    setMessages(prev => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  }, [selectedConversationId]);

  const handleFollowUp = useCallback(() => {
    setIsResolved(false);
    setIsFollowUp(true);
    setConversationStatus('followup');
    setIsStatusDropdownOpen(false);
    const agentName = "You";

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was marked for follow-up by ${agentName}`,
      type: 'system',
      role: 'system',
      conversation_id: selectedConversationId || '',
      timestamp: new Date().toISOString(),
      sender_id: 'system'
    };

    setMessages(prev => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  }, [selectedConversationId]);

  // const avatarSource = useMemo(() => {
  //   if (conversation?.platform === "whatsapp") return "/features/whatsapp.png";
  //   if (conversation?.platform === "telegram") return "/features/telegram.png";
  //   if (conversation?.platform === "instagram") return "/features/instagram.png";
  //   return "";
  // }, [conversation?.platform]);

  // const { lastCustomerMessage, isWindowExpired } = useMemo(() => {
  //   const lastMsg = messages
  //     .filter((m) => m.role === "customer")
  //     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  //   const expired = lastMsg
  //     ? new Date().getTime() - new Date(lastMsg.timestamp).getTime() > 24 * 60 * 60 * 1000
  //     : true;

  //   return { lastCustomerMessage: lastMsg, isWindowExpired: expired };
  // }, [messages]);

  // Store conversation in localStorage so desktop Sidebar can access it
  // useEffect(() => {
  //   if (conversation) {
  //     localStorage.setItem(`conversation_${selectedConversationId}`, JSON.stringify(conversation));
  //     window.dispatchEvent(new Event('conversationUpdated'));
  //   }
  // }, [conversation, selectedConversationId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

useEffect(() => {
  if (!selectedConversationId) return;

  const timerInterval = setInterval(() => {
    setCustomerTimers((prev) => ({
      ...prev,
      [selectedConversationId]: (prev[selectedConversationId] ?? 24) - 1,
    }));
  }, 3600000);

  return () => clearInterval(timerInterval);
}, [selectedConversationId]);


  useEffect(() => {
    const fetchCannedResponses = async () => {
      const { data, error } = await supabase.from("canned_responses").select("*");
      if (!error && data) {
        setCannedResponses(data);
      }
    };
    fetchCannedResponses();
  }, []);

  useEffect(() => {
    if (message.startsWith("/")) {
      const query = message.substring(1).toLowerCase();
      const filtered = cannedResponses.filter((response) =>
        response.shortcode.toLowerCase().includes(query)
      );
      setFilteredResponses(filtered);
      setShowCannedResponses(true);
    } else {
      setShowCannedResponses(false);
    }
  }, [message, cannedResponses]);

// Add these refs at the top of your ChatView component
const messageIdsRef = useRef(new Set<string>());
const isCleaningUpRef = useRef(false);
const typingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

// Main useEffect for conversation handling
useEffect(() => {
  if (!selectedConversationId) return;

  // Mark as not cleaning up
  isCleaningUpRef.current = false;
  
  // Clear everything immediately when switching conversations
  setMessages([]);
  messageIdsRef.current.clear();
  setTypingUsers(new Map());
  setLoading(true);

    const setUnreadCount = async () => {
      try {
        const platform = selectedConversationId.split('_')[0];
        let url;
        if (platform === 'instagram') {
          url = `/api/instagram/conversations/${selectedConversationId}/read`;
          await api.get(url);
        } else if (platform === 'whatsapp') {
          const whatsappId = localStorage.getItem('whatsapp_user_id');
          if (!whatsappId) return;
          url = `/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/read`;
          await api.get(url);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error setting unread count:", error);
        }
      }
    };

  const fetchConversation = async () => {
    try {
      const platform = selectedConversationId.split('_')[0];
      let response;
      if (platform === 'instagram') {
        response = await api.get(`/api/instagram/conversations/${selectedConversationId}`);
        setConversation(response?.data);
      } else if (platform === 'whatsapp') {
        const whatsappId = localStorage.getItem('whatsapp_user_id');
        if (!whatsappId) return;
        response = await conversationService.getWhatsAppConversations();
        if (response.status === "success") {
          const dataArray = Array.isArray(response.data) ? response.data : [];
          const found = dataArray.find((c: Conversation) => c.id === selectedConversationId);
          setConversation(found || null);
        }
      }
    } catch (error) {
      toast.error("Failed to load conversation");
    }
  };

  const fetchAIStatus = async () => {
    try {
      const platform = selectedConversationId.split('_')[0];
      let response;
      if (platform === 'instagram') {
        response = await api.get(`/api/instagram/conversations/${selectedConversationId}/ai`);
        setIsAIEnabled(!!response?.data);
      } else if (platform === 'whatsapp') {
        const whatsappId = localStorage.getItem('whatsapp_user_id');
        if (!whatsappId) return;
        response = await conversationService.getWhatsAppAiStatus(whatsappId, selectedConversationId);
        setIsAIEnabled(!!response.data);
      }
    } catch (error) {
      setIsAIEnabled(true);
    }
  };

  const fetchMessages = async () => {
    try {
      const platform = selectedConversationId.split('_')[0];
      let response;
      if (platform === 'instagram') {
        response = await api.get(`/api/instagram/conversations/${selectedConversationId}/messages`);
        const fetchedMessages = response?.data || [];
        // Keep only last 100 messages to prevent memory bloat
        const recentMessages = fetchedMessages.slice(-100);
        setMessages(recentMessages);
        recentMessages.forEach((msg: Message) => messageIdsRef.current.add(msg.id));
      } else if (platform === 'whatsapp') {
        const whatsappId = localStorage.getItem('whatsapp_user_id');
        if (!whatsappId) return;
        response = await conversationService.getWhatsAppMessages(whatsappId, selectedConversationId);
        const fetchedMessages = Array.isArray(response.data) ? response.data : [];
        // Keep only last 100 messages to prevent memory bloat
        const recentMessages = fetchedMessages.slice(-100);
        setMessages(recentMessages);
        recentMessages.forEach((msg: Message) => messageIdsRef.current.add(msg.id));
      }
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  
  const WS_BASE_URL = "wss://egenie-whatsapp.koyeb.app";
  const platform = selectedConversationId.split('_')[0];
  
  function getOrCreateChatClientId() {
    let id = localStorage.getItem('chat_client_id');
    if (!id) {
      id = `chat-view-${Date.now()}`;
      localStorage.setItem('chat_client_id', id);
    }
    return id;
  }
  
  const chatClientId = getOrCreateChatClientId();

  // Message handler for WebSocket
  const handleMessage = (data: any) => {
    if (data.type === 'typing_indicator') {
      const myClientId = localStorage.getItem('chat_client_id');
      if (data.agent_id !== myClientId && data.conversation_id === selectedConversationId) {
        if (data.is_typing) {
          // Clear any existing timeout for this agent
          const existingTimeout = typingTimeoutsRef.current.get(data.agent_id);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          setTypingUsers(prev => {
            const next = new Map(prev);
            next.set(data.agent_id, { agent_name: data.user, timestamp: Date.now() });
            return next;
          });
          
          // Auto-remove typing indicator after 3 seconds
          const timeout = setTimeout(() => {
            setTypingUsers(prev => {
              const next = new Map(prev);
              next.delete(data.agent_id);
              return next;
            });
            typingTimeoutsRef.current.delete(data.agent_id);
          }, 3000);
          
          typingTimeoutsRef.current.set(data.agent_id, timeout);
        } else {
          // Clear timeout and remove typing indicator immediately
          const timeout = typingTimeoutsRef.current.get(data.agent_id);
          if (timeout) {
            clearTimeout(timeout);
            typingTimeoutsRef.current.delete(data.agent_id);
          }
          
          setTypingUsers(prev => {
            const next = new Map(prev);
            next.delete(data.agent_id);
            return next;
          });
        }
      }
    }

    if (data.type === 'new_message' && data.message.conversation_id === selectedConversationId) {
      // O(1) duplicate check using Set
      if (messageIdsRef.current.has(data.message.id)) return;
      
      messageIdsRef.current.add(data.message.id);
      
      // Keep only last 100 messages to prevent unbounded growth
      setMessages(prev => {
        const updated = [...prev, data.message];
        return updated.slice(-100);
      });
    }
    else if (data.type === 'message_deleted' && data.conversation_id === selectedConversationId) {
      messageIdsRef.current.delete(data.message_id);
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    }
  };

  // WebSocket setup for Instagram
  if (platform === 'instagram') {
    token().then(sessionToken => {
      if (isCleaningUpRef.current) {
        console.log('Already cleaning up, skipping WebSocket creation');
        return;
      }

      const clientId = localStorage.getItem('chat_client_id') || chatClientId;
      const ws = new WebSocket(`${WS_BASE_URL}/ws2/${platform}/${clientId}`, [sessionToken]);
      
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`ChatView: Instagram WebSocket connected for ${selectedConversationId}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("ChatView: WebSocket error:", error);
      };
      
      ws.onclose = (event) => {
        console.log(`ChatView: WebSocket closed with code ${event.code}`);
        wsRef.current = null;
      };

    }).catch(error => {
      console.error("Failed to get session token:", error);
    });
  } 
  // WebSocket setup for WhatsApp
  else if (platform === 'whatsapp') {
    const whatsappId = localStorage.getItem('whatsapp_user_id');
    const clientId = `client-${Date.now()}-wa`;
    
    if (whatsappId) {
      const ws = new WebSocket(`${WS_BASE_URL}/ws2/whatsapp/${clientId}/${whatsappId}`);
      
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`ChatView: WhatsApp WebSocket connected for ${selectedConversationId}`);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error("ChatView: WebSocket error:", error);
      };
      
      ws.onclose = (event) => {
        console.log(`ChatView: WebSocket closed with code ${event.code}`);
        wsRef.current = null;
      };
    }
  }

  // Execute all async functions
  fetchConversation();
  setUnreadCount();
  fetchAIStatus();
  fetchMessages();

  // Cleanup function
  return () => {
    console.log(`ChatView: Cleaning up conversation ${selectedConversationId}`);
    isCleaningUpRef.current = true;
    
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close(1000, "Switching conversations");
      wsRef.current = null;
    }
    
    // Clear all typing indicator timeouts
    typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    typingTimeoutsRef.current.clear();
    
    // Clear all state
    setMessages([]);
    messageIdsRef.current.clear();
    setTypingUsers(new Map());
  };
}, [selectedConversationId]);

// Separate useEffect for customer timer
useEffect(() => {
  if (!selectedConversationId) return;

  // Initialize timer if not exists
  if (customerTimers[selectedConversationId] === undefined) {
    setCustomerTimers(prev => ({
      ...prev,
      [selectedConversationId]: 24,
    }));
  }

  // Set up interval
  const timerInterval = setInterval(() => {
    setCustomerTimers(prev => {
      const currentValue = prev[selectedConversationId] ?? 24;
      return {
        ...prev,
        [selectedConversationId]: Math.max(0, currentValue - 1),
      };
    });
  }, 3600000); // 1 hour

  return () => {
    clearInterval(timerInterval);
  };
}, [selectedConversationId]); 

  const sendFn = (payload: Record<string, unknown>) => {
    console.log("🚀 Trying to send:", payload, wsRef.current?.readyState)
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(payload);
      wsRef.current.send(msg);
      // console.log("📤 Sent to backend:", msg);
    } else {
      // console.warn("⚠️ WS not open:", wsRef.current?.readyState);
    }
  };


  const { handleTyping } = useTypingIndicator(sendFn, selectedConversationId);

  // Decide on avatar source

  let avatarSource = "";

  if (conversation?.platform === "whatsapp") {

    avatarSource = "/features/whatsapp.png";

  } else if (conversation?.platform === "telegram") {

    avatarSource = "/features/telegram.png";

  } else if (conversation?.platform === "instagram") {

    avatarSource = "/features/instagram.png";

  }



  if (loading) {

    return <LoadingState />;

  }



  const lastCustomerMessage = messages

    .filter((m) => m.role === "customer")

    .sort(

      (a, b) =>

        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()

    )[0];



  const isWindowExpired = lastCustomerMessage

    ? new Date().getTime() - new Date(lastCustomerMessage.timestamp).getTime() >

    24 * 60 * 60 * 1000

    : true;



  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

  //   if (e.key === "Enter" && !e.shiftKey) {

  //     e.preventDefault();

  //     if (sharedProduct) {

  //       handleShareProduct(message, sharedProduct);

  //     } else if (audioURL) {

  //       handleSendAudio();

  //     } else {

  //       sendMessage();

  //     }

  //   }



  //   if (e.key === "/" && message === "") {

  //     setShowCannedResponses(true);

  //   }

  // };

  //   const lastCustomerMessage = messages

  //     .filter((m) => m.role === "customer")

  //     .sort(

  //       (a, b) =>

  //         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()

  //     )[0];



  //   const isWindowExpired = lastCustomerMessage

  //     ? new Date().getTime() - new Date(lastCustomerMessage.timestamp).getTime() >

  //       24 * 60 * 60 * 1000

  //     : true;



  //   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

  //     if (e.key === "Enter" && !e.shiftKey) {

  //       e.preventDefault();

  //       if (sharedProduct) {

  //         handleShareProduct(message, sharedProduct);

  //       } else if (audioURL) {

  //         handleSendAudio();

  //       } else {

  //         sendMessage();

  //       }

  //     }



  //     if (e.key === "/" && message === "") {

  //       setShowCannedResponses(true);

  //     }

  //   };



  // const handleResolve = () => {
  //   setIsResolved(true);
  //   setIsFollowUp(false);
  //   setConversationStatus('closed');
  //   setIsStatusDropdownOpen(false);
  //   const agentName = "You";

  //   const systemMessage: Message = {
  //     id: `system-${Date.now()}`,
  //     content: `Conversation was marked Closed by ${agentName}`,
  //     type: 'system',
  //     role: 'system',
  //     conversation_id: selectedConversationId || '',
  //     timestamp: new Date().toISOString(),
  //     sender_id: 'system'
  //   };

  //   setMessages(prev => [...prev, systemMessage]);

  //   setTimeout(() => {
  //     if (lastMessageRef.current) {
  //       lastMessageRef.current.scrollIntoView({ 
  //         behavior: "smooth", 
  //         block: "end" 
  //       });
  //     }
  //   }, 100);
  // };

  // const handleReopen = () => {
  //   setIsResolved(false);
  //   setIsFollowUp(false);
  //   setConversationStatus('open');
  //   setIsStatusDropdownOpen(false);
  //   const agentName = "You";

  //   const systemMessage: Message = {
  //     id: `system-${Date.now()}`,
  //     content: `Conversation was reopened by ${agentName}`,
  //     type: 'system',
  //     role: 'system',
  //     conversation_id: selectedConversationId || '',
  //     timestamp: new Date().toISOString(),
  //     sender_id: 'system'
  //   };

  //   setMessages(prev => [...prev, systemMessage]);

  //   setTimeout(() => {
  //     if (lastMessageRef.current) {
  //       lastMessageRef.current.scrollIntoView({ 
  //         behavior: "smooth", 
  //         block: "end" 
  //       });
  //     }
  //   }, 100);
  // };

  // const handleFollowUp = () => {
  //   setIsResolved(false);
  //   setIsFollowUp(true);
  //   setConversationStatus('followup');
  //   setIsStatusDropdownOpen(false);
  //   const agentName = "You";

  //   const systemMessage: Message = {
  //     id: `system-${Date.now()}`,
  //     content: `Conversation was marked for follow-up by ${agentName}`,
  //     type: 'system',
  //     role: 'system',
  //     conversation_id: selectedConversationId || '',
  //     timestamp: new Date().toISOString(),
  //     sender_id: 'system'
  //   };

  //   setMessages(prev => [...prev, systemMessage]);

  //   setTimeout(() => {
  //     if (lastMessageRef.current) {
  //       lastMessageRef.current.scrollIntoView({ 
  //         behavior: "smooth", 
  //         block: "end" 
  //       });
  //     }
  //   }, 100);
  // };

  return (
  <>
    <Toaster richColors position="top-right" />
    <style>
      {`
        .product-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .product-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .product-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .skeleton { background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%); background-size: 200% 100%; animation: loading 1.5s infinite; }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}
    </style>

    <TooltipProvider>
      {/* Mobile Sidebar */}
      <div className={`${showMobileSidebar ? 'fixed inset-0 z-50 sm:hidden' : 'hidden'} chat-container`}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm hw-accel"
          onClick={() => setShowMobileSidebar(false)}
        />
        {/* Sidebar content */}
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl hw-accel">
          <Sidebar
            selectedConversationId={selectedConversationId}
            conversation={conversation}
            onShareProduct={sharedProduct ? onClearSharedProduct : () => { }}
            onConversationSelect={() => { }}
            onToggleVisibility={() => setShowMobileSidebar(false)}
            isMobile={true}
            isOpen={showMobileSidebar}
          />
        </div>
      </div>
      {!selectedConversationId ? (
        <div className="h-full flex flex-col bg-white">
          <LandingDashboard />
        </div>
      ) : (
        <Card className="h-full flex flex-col bg-white max-h-screen rounded-none sm:rounded-l border border-gray-200 overflow-hidden">

          {/* Mobile Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0 block sm:hidden">
            <div className="flex items-center gap-3">
              {onBackToList && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBackToList}
                  className="h-10 w-10 hover:bg-gray-100 rounded-2xl flex-shrink-0"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative">
                  {avatarSource ? (
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <img
                        src={avatarSource}
                        alt="Platform avatar"
                        className="object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden h-full w-full avatar-placeholder rounded-full"></div>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 skeleton rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {conversation ? (
                    <>
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {conversation?.customer_name || "Chat"}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {conversation?.platform === "instagram" ? "Instagram" : "WhatsApp"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="h-4 w-24 skeleton rounded mb-1"></div>
                      <div className="h-3 w-16 skeleton rounded"></div>
                    </>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSidebar(true)}
                className="h-10 w-10 hover:bg-gray-100 rounded-2xl flex-shrink-0"
                aria-label="Options"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="px-6 py-1 border-b border-gray-100 bg-white items-center justify-between hidden sm:flex">
            {/* Customer Info Section */}
            <div className="flex items-center space-x-4">
              {selectedConversationId &&
                customerTimers[selectedConversationId] !== undefined &&
                conversation?.platform === 'whatsapp' && (
                  <TimerDisplay hours={customerTimers[selectedConversationId]} />
                )}

              <div className="relative">
                {avatarSource ? (
                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-gray-100">
                    <img
                      src={avatarSource}
                      alt="Platform avatar"
                      className="object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden h-full w-full avatar-placeholder rounded-full"></div>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 skeleton rounded-full"></div>
                )}
              </div>

              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer">
                      {conversation ? (
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                          {conversation?.customer_name}
                        </h3>
                      ) : (
                        <div className="h-4 w-32 skeleton rounded"></div>
                      )}
                    </div>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[900px] sm:max-h-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{conversation?.customer_name} Information</DialogTitle>
                    </DialogHeader>
                    {conversation && (
                      <CustomerInfo
                        name={conversation?.customer_name || "Unknown"}
                        email={conversation?.email || "Unknown"}
                        billingaddress={conversation?.billingAddress || "Unknown"}
                        shippingaddress={conversation?.shippingAddress || "Unknown"}
                        platform={conversation?.platform || ""}
                        selectedConversationId={selectedConversationId}
                        saveCustomerInfo={saveCustomerInfo}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex items-center space-x-2">
              {/* Status Dropdown */}
              <DropdownMenu open={isStatusDropdownOpen} onOpenChange={setIsStatusDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-2xl hover:bg-gray-100 flex items-center space-x-1 px-3 py-2.5 bg-white"
                  >
                    {conversationStatus === 'closed' ? (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    ) : conversationStatus === 'followup' ? (
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    <span className="text-sm font-medium text-gray-800">
                      {conversationStatus === 'closed' ? "Closed" :
                        conversationStatus === 'followup' ? "Follow-up" :
                          "Open"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl shadow-xl border bg-white py-2"
                >
                  {conversationStatus === 'open' && (
                    <>
                      <DropdownMenuItem
                        onClick={handleResolve}
                        className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-red-50 rounded-xl mx-2"
                      >
                        <XCircle className="h-4 w-4 mr-3 text-red-600" />
                        <span className="font-medium">Close Conversation</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleFollowUp}
                        className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-amber-50 rounded-xl mx-2"
                      >
                        <Clock className="h-4 w-4 mr-3 text-amber-600" />
                        <span className="font-medium">Mark for Follow-up</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  {(conversationStatus === 'closed' || conversationStatus === 'followup') && (
                    <DropdownMenuItem
                      onClick={handleReopen}
                      className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-green-50 rounded-xl mx-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-3 text-green-600" />
                      <span className="font-medium">Reopen Conversation</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reminders Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative mr-2"
                        >
                          <Clock className="h-5 w-5" />
                          {reminders.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                              {reminders.length}
                            </Badge>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <RemindersPopover
                        reminders={reminders}
                        onCreateReminder={() => setShowReminder(true)}
                        onDeleteReminder={async (id) => {
                          try {
                            const response = await fetch(`https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders/${id}`, {
                              method: 'DELETE',
                              credentials: 'include'
                            });

                            if (!response.ok) {
                              throw new Error('Failed to delete reminder');
                            }

                            toast.success('Reminder deleted successfully');
                            // Refresh reminders after deletion
                            refetchReminders();
                          } catch (error) {
                            toast.error('Failed to delete reminder');
                            console.error('Error deleting reminder:', error);
                          }
                        }}
                      />
                    </Popover>

                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {reminders.length > 0
                    ? `${reminders.length} reminder${reminders.length > 1 ? 's' : ''} set`
                    : 'Set reminder'
                  }
                </TooltipContent>
              </Tooltip>

              {/* AI Toggle */}
              <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 hover:bg-gray-100">
                <Switch
                  checked={isAIEnabled}
                  onCheckedChange={toggleAI}
                  disabled={isToggling}
                  className="data-[state=checked]:bg-blue-600 mr-3 scale-90"
                />
                <span className="text-sm font-medium text-gray-800">AI</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowCustomerInfo(true)}>
                    View Customer Info
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Block Contact</DropdownMenuItem>
              <DropdownMenuItem>Clear Chat</DropdownMenuItem>
              <DropdownMenuItem>Export Chat</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Customer Info Dialog */}
          <Dialog open={showCustomerInfo} onOpenChange={setShowCustomerInfo}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Customer Information</DialogTitle>
              </DialogHeader>

              {/* Contact Details Section */}
              <div className="space-y-6">
                <div className=" rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div className="space-y-1">
                      <div className="text-gray-500">Name</div>
                      <div className="font-medium">{conversation?.customer_name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500">
                        {conversation?.platform === "instagram" ? "Username" : "Phone"}
                      </div>
                      <div className="font-medium">
                        {conversation?.platform === "instagram"
                          ? selectedConversationId?.split('_')[1]
                          : selectedConversationId?.split('_')[1]?.replace(/^(\d{2})(\d+)/, '+$1 $2')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200" />

                {/* Address and Cart Container */}
                <div className="grid pl-4 grid-cols-2 gap-6">
                  {/* Address Information */}
                  {messages.some(m => extractAddressData(m.content)) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Latest Address</h3>
                      {messages
                        .filter(m => extractAddressData(m.content))
                        .slice(-1)
                        .map((m, idx) => {
                          const addressData = extractAddressData(m.content);
                          return (
                            <div key={idx} className=" rounded-lg py-4 space-y-3">
                              <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                  <div className="text-gray-500 w-20">Full Name</div>
                                  <div className="font-medium">{addressData?.address.full_name}</div>
                                </div>
                                <div className="flex gap-2">
                                  <div className="text-gray-500 w-20">Email</div>
                                  <div className="font-medium">{addressData?.address.email}</div>
                                </div>
                                <div className="flex gap-2">
                                  <div className="text-gray-500 w-20">Address</div>
                                  <div className="font-medium">{addressData?.address.address}</div>
                                </div>
                                <div className="flex gap-2">
                                  <div className="text-gray-500 w-20">City</div>
                                  <div className="font-medium">
                                    {addressData?.address.city}, {addressData?.address.state} {addressData?.address.pin_code}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <div className="text-gray-500 w-20">Country</div>
                                  <div className="font-medium">{addressData?.address.country.replace('0_', '')}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Cart Information */}
                  {messages.some(m => extractCartData(m.content)) && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium">Latest Cart</h3>
                      {messages
                        .filter(m => extractCartData(m.content))
                        .slice(-1)
                        .map((m, idx) => {
                          const cartItems = extractCartData(m.content);
                          return (
                            <div key={idx} className="rounded-lg p-4 space-y-4">
                              <div className="space-y-4">
                                {cartItems?.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex gap-3 text-sm border-b pb-4 last:border-0 last:pb-0">
                                    <img
                                      src={item.product_data.image_url}
                                      alt={item.product_data.name}
                                      className="w-16 h-16 rounded object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="font-medium line-clamp-2">{item.product_data.name}</div>
                                      <div className="text-gray-500 mt-1">
                                        {item.quantity} × {item.currency} {item.item_price}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-base font-medium ">
                                  Total: {cartItems?.[0].currency} {cartItems?.reduce((sum, item) => sum + (item.item_price * item.quantity), 0)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal for attaching files */}
          <Dialog open={isFileModalOpen} onOpenChange={(open) => {
            setIsFileModalOpen(open);
            if (!open) {
              setFileCaption("");
              setSelectedFile(null);
            }
          }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
                <DialogDescription>
                  Upload an image or video file with an optional caption
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                {!selectedFile ? (
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer"
                    onClick={() => inputFileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                        setSelectedFile(file);
                      }
                    }}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Drop your media here or click to browse
                    </p>
                  </div>
                ) : (
                  <FilePreview
                    file={selectedFile}
                    caption={fileCaption}
                    setCaption={setFileCaption}
                    progress={uploadProgress}
                    onCancel={() => {
                      setSelectedFile(null);
                      setFileCaption("");
                      setUploadProgress(0);
                    }}
                  />
                )}

                <input
                  type="file"
                  ref={inputFileRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                      setSelectedFile(file);
                    }
                  }}
                  accept="image/*,video/*"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFileModalOpen(false);
                    setSelectedFile(null);
                    setFileCaption("");
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!selectedFile || uploading}
                  onClick={() => handleFileUpload(selectedFile, selectedConversationId, fileCaption)}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Messages Area */}
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 h-full px-3 py-0.1 bg-gray-50"
          >
            <div className="space-y-3 max-w-full pb-4 sm:pb-0">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[75%] ${i % 2 === 0 ? "items-start" : "items-end"} flex flex-col`}>
                        <div className={`skeleton rounded-3xl ${i % 2 === 0 ? "rounded-bl-lg" : "rounded-br-lg"} p-4 w-48 h-16`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {messages.map((message, index) => {
                    const latestMediaMessage = [...messages]
                      .reverse()
                      .find((m) => m.type === "ig_reel" || m.type === "ig_story");

                    const latestMediaId = latestMediaMessage?.payload?.reel_video_id || latestMediaMessage?.payload?.story_media_id;

                    const isLatest =
                      (message.type === "ig_reel" &&
                        message.payload?.reel_video_id === latestMediaId) ||
                      (message.type === "ig_story" &&
                        message.payload?.story_media_id === latestMediaId);
                    return (
                      <div key={message.id} className="w-full message-item">
                        <div className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}>
                          <div
                            className={`flex flex-col max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${message.role === "customer" ? "items-start" : "items-end"
                              }`}
                          >
                            {/* IG Media Messages */}
                            <LazyMediaLoader key={index} index={index}>
                              {/* Render IG Posts */}
                              {message.type === "share" && message.payload && (
                                <InstagramPost
                                  mediaUrl={message.payload.url}
                                  timestamp={formatMessageTime(message.timestamp)}
                                />
                              )}

                              {/* Render IG Reels */}
                              {message.type === "ig_reel" && message.payload && (
                                <InstagramReel
                                  key={index}
                                  id={message.payload.reel_video_id}
                                  reelVideoUrl={message.payload.url}
                                  title={message.payload.caption}
                                  timestamp={formatMessageTime(message.timestamp)}
                                  viewOnInstagramUrl={`https://instagram.com/reel/${message.payload.reel_video_id}`}
                                  isLatest={isLatest}
                                  isActive={
                                    activeMediaType === "reel" &&
                                    activeMediaId === message.payload.reel_video_id
                                  }
                                  onPlay={(id) => handlePlay(id, "reel")} // stops others
                                  isMuted={globalMuted}
                                  onMuteToggle={handleMuteToggle}
                                  isAgent={message.role.toLowerCase() === "agent"}
                                />
                              )}

                              {/* Render IG Story */}
                              {message.type === "ig_story" && message.payload && (
                                <InstagramStory
                                  id={message.payload.story_media_id}
                                  sharedBy="You"
                                  storyOwnerName={"Instagram User"}
                                  storyMediaUrl={message.payload.story_media_url}
                                  isActive={
                                    activeMediaType === "story" &&
                                    activeMediaId === message.payload.story_media_id
                                  } // only one plays
                                  onPlay={(id) => handlePlay(id, "story")}
                                  isMuted={globalMuted}
                                  isLatest={isLatest}
                                  onMuteToggle={(muted) => setGlobalMuted(muted)}
                                  isAgent={message.role.toLowerCase() === "agent"}
                                  timestamp={formatMessageTime(message.timestamp)}
                                />
                              )}
                            </LazyMediaLoader>

                            {/* Normal Messages */}
                            {!message.payload && (
                              <MessageItem
                                key={message.id}
                                message={message}
                                index={index}
                                isLatest={isLatest}
                                isLast={index === messages.length - 1}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                    )
                  })}
                <div ref={lastMessageRef} />
                </>
              )}
            </div>
          </ScrollArea>


          {/*Input Section */}
          <div className="bg-white/40 backdrop-blur-sm sm:p-0 hw-accel">
          {/* Typing Users */}
          {typingUsers.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                <div className="flex gap-1">
                  {Array.from(typingUsers.values()).map((user, index) => (
                    <span key={index}>
                      {user.agent_name}
                      {index < typingUsers.size - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                <span>
                  {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </span>
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            )}

            {sharedProduct && (
              <div className="mb-3 px-3 sm:px-0">
                <SharedProductPreview
                  product={sharedProduct}
                  onRemove={onClearSharedProduct}
                />
              </div>
            )}

  {audioURL ? (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-200/60 hw-accel mx-3 sm:mx-0">
      <audio controls src={audioURL} className="flex-1" />
      <button
        className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors hw-accel"
        onClick={() => setAudioURL(null)}
      >
        <X className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  ) : (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-2.5 sm:p-3 hover:border-gray-300/60 flex flex-col shadow-sm hw-accel mx-3 sm:mx-0">
      {/* Mode Toggle */}
      <div className="mb-5 w-32 sm:w-40 bg-gray-100/80 rounded-2xl p-0.5 flex items-center">
        <button
          className={`flex-1 text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl transition-all duration-300 font-medium hw-accel ${
            mode === "reply"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setMode("reply")}
        >
          Reply
        </button>
        <button
          className={`flex-1 text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl transition-all duration-300 font-medium hw-accel ${
            mode === "private"
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-600 hover:text-purple-600"
          }`}
          onClick={() => setMode("private")}
        >
          Private
        </button>
      </div>

      {/* Textarea */}
      <div className="flex-1 mb-1.5">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "reply"
              ? sharedProduct
                ? "Add a message about this product..."
                : "Type your message..."
              : "Add a private note..."
          }
          rows={2}
          className="w-full bg-transparent border-none outline-none focus:outline-none resize-none max-h-32 overflow-y-auto text-gray-800 placeholder-gray-500 text-sm leading-relaxed p-0"
        />
      </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 sm:gap-2">
                    {/* Emoji picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-2 sm:p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors hw-accel">
                          <Smile className="h-4 w-4 text-gray-600" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-80 p-0 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-xl"
                        side="top"
                        align="start"
                      >
                        {/* Emoji picker content */}
                      </PopoverContent>
                    </Popover>

                    {/* File attachment */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="p-2 sm:p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors hw-accel"
                          onClick={() => setIsFileModalOpen(true)}
                        >
                          <Paperclip className="h-4 w-4 text-gray-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl">
                        Attach media
                      </TooltipContent>
                    </Tooltip>

                    {/* Voice recording */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`p-2 sm:p-2.5 rounded-xl transition-colors hw-accel ${isRecording
                              ? "bg-red-100/80 hover:bg-red-200/80 text-red-600"
                              : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600"
                            }`}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          <Mic className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900/90 backdrop-blur-sm text-white rounded-xl">
                        {isRecording ? "Stop recording" : "Record message"}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Character count and send button */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="text-xs text-gray-500 font-medium hidden sm:block">
                      {message.length}/1000
                    </div>

                    <button
                      className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl flex items-center justify-center transition-all duration-300 font-medium text-sm hw-accel ${message.trim() || audioURL || sharedProduct
                          ? mode === "reply"
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-200/80 text-gray-400 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (sharedProduct) {
                          handleShareProduct(message, sharedProduct);
                        } else if (audioURL) {
                          handleSendAudio();
                        } else {
                          sendMessage();
                        }
                      }}
                      disabled={
                        isSending ||
                        (!message.trim() && !audioURL && !sharedProduct)
                      }
                    >
                      {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span className="ml-2">
                            {mode === "reply" ? "Send" : "Add Note"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </Card>
      )}
    </TooltipProvider >
  </>
);

}



const formatMessageTime = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    return format(istDate, "h:mma").toLowerCase();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const checkAIMessage = (message: Message) => {

  if (

    message.content.includes("Thanks for sending your us cart!") &&

    message.role === "ai"

  ) {

    return (

      <>

        <b>Complete your order</b> <br /> <br />

        Thanks for sending your us cart! 📦🤩 <br />

        <br />

        Before we can proceed, we just need a few more details about <br />{" "}

        <b>your address</b> so we know exactly where to deliver your order.{" "}

        <br />

        <br />

        Let&apos;s get this sorted and your items will be on their way!🚀

      </>

    );

  }

  if (

    message.content.includes(

      " I'm *Talkative*, an AI-powered agent for eGenie Stores. I'm here to help you find the perfect tech products for your needs."

    ) &&

    message.role === "ai"

  ) {

    return (

      <>

        <img

          src="https://egeniestores.com/wp-content/uploads/egenie.jpeg"

          className="rounded-sm mb-2 w-80 "

        />

        Hi👋 I&apos;m <b>Talkative</b>, an AI-powered agent for <br /> eGenie

        Stores. I&apos;m here to help you find the <br /> perfect tech products

        for your needs. <br /> <br />

        <b>✅Whether you&apos;re looking for:</b> <br />

        - A new phone <br />

        - A powerful gaming laptop <br />

        - A custom-built PC <br />

        <br />

        I can help you find the best options for your <br /> budget and

        preferences.🎉 <br /> <br />

        Feel free to ask me any questions you may <br /> have about our{" "}

        <b>services</b> or <b>policies</b> , and I&apos;ll <br /> be happy to

        assist!📕

      </>

    );

  }

  if (

    message.content.includes(

      "Complete your payment and confirm your order with us."

    ) &&

    message.role === "ai"

  ) {

    return (

      <div className="flex flex-col">

        <b>Complete your order</b> <br />

        You are one step away! 😎 <br />

        <br />

        Complete your payment and confirm your <br />

        order with us.📦 <br />

        <br />

        To contact us regarding any queries

        <br /> please reply with <b>Live Agent</b>

        {/* <Button 

          variant="outline" 

          className="mt-3 bg-white text-black"

          

        >

         Payment Button

        </Button> */}

      </div>

    );

  }

  return null;

};



const extractProductInfo = (content: string) => {

  try {

    const match = content.match(/know_more_request_from_sender=(\[.*?\])/);

    if (match) {

      const jsonStr = match[1]

        .replace(/'/g, '"') // Convert single quotes to double quotes

        .replace(/"name":\s*"([^"]*?)"/g, (match, nameValue) => {

          const fixedName = nameValue.replace(/(?<!\\)"/g, '\\"'); // Escape only unescaped double quotes inside the name

          return `"name": "${fixedName}"`;

        });



      return JSON.parse(jsonStr);

    }

    return null;

  } catch (error) {

    console.error("Error parsing product info:", error);

    return null;

  }

};



const extractBotProductInfo = (content: string) => {

  try {

    const match = content.match(/know_more_details_from_bot=(\[.*?\])/);

    if (match) {

      const jsonStr = match[1].replace(/'/g, '"');

      return JSON.parse(jsonStr);

    }

    return null;

  } catch (error) {

    console.error("Error parsing product info:", error);

    return null;

  }

};



const extractAgentProductInfo = (content: string) => {

  try {

    // Extract product info between =(...)]

    const match = content.match(

      /send_product_request_from_agent=\(.*?\)=(\[.*?\])/

    );

    if (match) {

      const jsonStr = match[1].replace(/'/g, '"');

      return JSON.parse(jsonStr);

    }

    return null;

  } catch (error) {

    console.error("Error parsing agent product info:", error);

    return null;

  }

};



const extractAgentProductText = (content: string): string | null => {

  try {

    // Extract text between parentheses

    const match = content.match(/send_product_request_from_agent=\((.*?)\)=/);

    if (match && match[1]) {

      console.log("match", match[1]);

      return match[1];

    }

    return null;

  } catch (error) {

    console.error("Error parsing agent product text:", error);

    return null;

  }

};



const extractCartData = (content: string) => {

  try {

    const match = content.match(/cart_data_from_sender=(\[.+?\])/);

    if (!match) return null;



    const cartItems: CartItem[] = JSON.parse(match[1]);

    return cartItems;

  } catch (error) {

    console.error("Error parsing cart data:", error);

    return null;

  }

};



const extractAddressData = (content: string): AddressData | null => {

  try {

    const match = content.match(/address_data_from_sender\s*=\s*({.+})/);

    if (!match) return null;



    const jsonStr = match[1].replace(/'/g, '"');

    return JSON.parse(jsonStr);

  } catch (error) {

    console.error("Error parsing address data:", error);

    return null;

  }

};



const formatPrice = (price: string) => {

  return price.replace(/\\u20b9/g, "₹").replace(/\u20b9/g, "₹");

};

export const FileMessage = ({

  fileUrl,

  fileName,

  fileType,

}: {

  fileUrl: string;

  fileName: string;

  fileType?: string;

}) => {

  const getFileIcon = () => {

    if (fileType?.startsWith("image/"))

      return <FileImage className="h-5 w-5 text-blue-500" />;

    if (fileType?.startsWith("video/"))

      return <FileVideo className="h-5 w-5 text-purple-500" />;

    if (fileType?.startsWith("audio/"))

      return <Music className="h-5 w-5 text-green-500" />;

    if (fileType === "application/pdf")

      return <FileText className="h-5 w-5 text-red-500" />;

    return <File className="h-5 w-5 text-gray-500" />;

  };



  const isImage = fileType?.startsWith("image/");

  const isPDF = fileType === "application/pdf";



  if (isImage) {

    return <img src={fileUrl} alt={fileName} className="max-w-sm rounded-lg" />;

  }



  if (isPDF) {

    return (

      <div className="flex flex-col gap-2">

        <a

          href={fileUrl}

          target="_blank"

          rel="noopener noreferrer"

          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50"

        >

          {getFileIcon()}

          <div className="flex flex-col">

            <span className="text-sm text-blue-600">{fileName}</span>

            <span className="text-xs text-gray-500">PDF Document</span>

          </div>

        </a>

        <iframe

          src={`${fileUrl}#view=FitH`}

          className="w-full h-[400px] rounded-lg border"

        />

      </div>

    );

  }



  return (

    <a

      href={fileUrl}

      target="_blank"

      rel="noopener noreferrer"

      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50"

    >

      {getFileIcon()}

      <div className="flex flex-col">

        <span className="text-sm text-blue-600">{fileName}</span>

        <span className="text-xs text-gray-500">

          {fileType?.split("/")[1].toUpperCase() || "Document"}

        </span>

      </div>

    </a>

  );

};

export default ChatView;

