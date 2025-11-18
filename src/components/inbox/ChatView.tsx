"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "./Sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { toast, Toaster } from "sonner";
import { Conversation } from "../types/conversation";
import {
  ShoppingCart,
  MapPin,
  Upload,
  FileText,
  FileImage,
  FileVideo,
  Music,
  File,
  Loader2,
  X,
  ChevronDown,
  CheckCircle,
  RefreshCw,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "../ui/dialog";
import dynamic from "next/dynamic";
import { useReminders } from "../hooks/useReminders";
import { H1, H2, H3, Body, Small } from "@/components/typography";
import { Trash2, User, Plus } from "lucide-react";
import TimerDisplay from "./TimerDisplay";
import { useTypingIndicator } from "../hooks/typingIndicator";
import { createClient } from "@supabase/supabase-js";
import {
  conversationService,
  WhatsAppMessage,
} from "@/components/services/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Send,
  Paperclip,
  MoreVertical,
  Menu,
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
import "../../app/dashboard/dashboard.css";
import Image from "next/image";
import CustomerInfo from "./CustomerInfo";
import LandingDashboard from "./LandingDashboard";
import api from "@/lib/session_api";
import { useConversations } from "../hooks/useConversations";
import { storeData, getData, getAllKeys, deleteData } from "@/lib/indexedDB";
import { Product } from "../types/product";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);


import InstagramPost from "../instagram/messaging/InstagramPost";
import InstagramReel from "../instagram/messaging/InstagramReel";
import InstagramStory from "../instagram/messaging/InstagramStory";
import LazyMediaLoader from "../LazyMediaLoader";
import { MessageWrapper } from "../messaging/MessageWrapper";
import { useUser } from "@clerk/nextjs";
import MediaMessage from "../messaging/MediaMessage";
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

interface MessageReactions {
  emoji: string;
  username: string;
  full_name: string;
  timestamp: string;
  profile_picture_url: string;
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

// Skeletons

const MessageSkeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {/* Left side message */}
    <div className="flex items-start gap-2 max-w-[50%]">
      <div className="w-8 h-8 bg-gray-200 rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded-full" />
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
      </div>
    </div>

    {/* Right side message */}
    <div className="flex items-start gap-2 max-w-[50%] self-end">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-24 bg-gray-200 rounded-full self-end" />
        <div className="h-10 w-56 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <Card className="h-screen flex flex-col bg-white ">
    {/* Header skeleton */}
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </div>

    {/* Messages area */}
    <ScrollArea className="flex-1 h-full p-4">
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <MessageSkeleton key={i} />
        ))}
      </div>
    </ScrollArea>

    {/* Input area skeleton */}
    <div className="p-4 border-t">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  </Card>
);

// const parseProductData = (productDataString: string): ProductData[] => {
//   try {
//     return JSON.parse(productDataString);
//   } catch (error) {
//     console.error('Error parsing product data:', error);
//     return [];
//   }
// };

const SharedProductPreview = ({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) => (
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
      <p className="text-base font-medium text-gray-900 ">
        {product.name.length > 50
          ? `${product.name.substring(0, 50)}...`
          : product.name}
      </p>
      <p className="text-sm text-gray-500">₹{product.price}</p>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={onRemove}
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

const RemindersPopover = ({
  reminders,
  onCreateReminder,
  onDeleteReminder,
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
              <Button variant="outline" size="sm" onClick={onCreateReminder}>
                <Plus className="h-4 w-4 mr-1" />
                Add your first reminder
              </Button>
            </div>
          ) : (
            reminders.map(
              (reminder) => (
                console.log("reminder", reminder),
                (
                  <div
                    key={reminder.id}
                    className="flex items-start justify-between p-2 rounded-lg border bg-white group"
                  >
                    <div>
                      <p className="font-medium text-sm">{reminder.title}</p>
                      {reminder.notes && (
                        <p className="text-xs text-gray-500">
                          {reminder.notes}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          // Add IST offset (UTC+5:30)
                          new Date(
                            new Date(reminder.dateTime).getTime() +
                              5.5 * 60 * 60 * 1000
                          ),
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
                )
              )
            )
          )}
        </div>
      </div>
    </PopoverContent>
  );
};

const CartMessage = ({ items }: { items: CartItem[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const total = items.reduce(
    (sum, item) => sum + item.item_price * item.quantity,
    0
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="flex flex-col w-fit mb-4 bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center gap-4">
          <img
            src={items[0].product_data.image_url}
            alt={items[0].product_data.name}
            className="w-24 h-24  rounded"
          />
          <div className="flex flex-col space-y-2">
            <div className="relative flex space-x-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <div className="font-medium ">{totalQuantity} items</div>
            </div>
            <div className="text-sm">
              ₹{total.toLocaleString("en-IN")} (estimated total)
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => setIsModalOpen(true)}
        >
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
                  className="w-24 h-24  rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2">
                    {item.product_data.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span>Quantity: {item.quantity}</span>
                    <div className="text-right">
                      <div className="font-medium">
                        ₹
                        {(item.item_price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.quantity} × ₹
                        {item.item_price.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-4 text-lg font-medium">
              <span>Total ({totalQuantity} items)</span>
              <span className="font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AddressMessage = ({ data }: { data: AddressData }) => {
  return (
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
          <span>
            {data.address.city}, {data.address.state}
          </span>
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
  );
};

const FilePreview = ({
  file,
  caption,
  setCaption,
  onCancel,
}: {
  file: File;
  caption: string;
  setCaption: (text: string) => void;
  progress: number;
  onCancel: () => void;
}) => {
  const isVideo = file.type.startsWith("video/");
  const previewUrl = URL.createObjectURL(file);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="relative">
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        {/* Media preview */}
        <div className="aspect-video w-full relative">
          {isVideo ? (
            <video
              src={previewUrl}
              className="w-full h-full object-contain"
              controls={false}
            />
          ) : (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}

          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/75 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Caption input - WhatsApp style */}
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
};

const MessageItem = memo(
  ({
    message,
    isLast,
    index,
    isLatest,
    isReplyMessage
  }: {
    message: Message;
    isLast: boolean;
    index: number;
    isLatest: boolean;
    isReplyMessage: boolean;
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
    <>
      <div
        className={`rounded-3xl px-3 py-2 sm:px-4 sm:py-3 w-full shadow-sm border hw-accel ${message.role === "customer"
            ? `bg-white/90 backdrop-blur-sm ${isReplyMessage ? "rounded-tl-lg" : "rounded-bl-lg"} text-gray-900 border-gray-200/60`
            : `bg-blue-600/90 backdrop-blur-sm ${isReplyMessage ? "rounded-tr-lg" : "rounded-br-lg"} text-white border-blue-500/60`
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

      
    </>
  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
    prevProps.isLast === nextProps.isLast &&
    JSON.stringify(prevProps.message.reaction) === JSON.stringify(nextProps.message.reaction);
});
MessageItem.displayName = "MessageItem";

const ChatView = ({
  selectedConversationId,
  sharedProduct,
  onClearSharedProduct,
  isRightSidebarVisible,
  onOpenRightSidebar,
}: ChatViewProps) => {
  const {user, isLoaded} = useUser();
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
  const [filteredResponses, setFilteredResponses] = useState<CannedResponse[]>(
    []
  );
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioModalOpen, setIsAudioModalOpen] = useState(false);
  const [mode, setMode] = useState<"reply" | "private">("reply");
  const [currentTimer, setCurrentTimer] = useState(0);
  const [isResolved, setIsResolved] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [conversationStatus, setConversationStatus] = useState<
    "open" | "closed" | "followup"
  >("open");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [fileCaption, setFileCaption] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { reminders = [], refetchReminders } = useReminders(
    selectedConversationId
  );
  const [typingUsers, setTypingUsers] = useState<
    Map<
      string,
      {
        agent_name: string;
        timestamp: number;
      }
    >
  >(new Map());

  const [globalMuted, setGlobalMuted] = useState(true);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [activeMediaType, setActiveMediaType] = useState<
    "reel" | "story" | "video" | null
  >(null);

 


  const handlePlay = (id: string, type: "reel" | "story" | "video") => {
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
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });
    const { token: sessionToken } = await res.json();
    return sessionToken;
  };

  const startRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    const fetchCannedResponses = async () => {
      const { data, error } = await supabase
        .from("canned_responses")
        .select("*");

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

  useEffect(()=>{
    const setConversatioStatus= async ()=>{
      if(!selectedConversationId) return;
      const status = conversation?.status
      if(status){
        setConversationStatus(status as "open" | "closed" | "followup");
        setIsResolved(status === "closed");
        setIsFollowUp(status === "followup");
    }
  }
    setConversatioStatus();
  },[selectedConversationId, conversation]);
  const handleSendAudio = async () => {
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
        throw new Error(
          errorData?.message || `Server error: ${response.status}`
        );
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
      toast.error(
        error instanceof Error ? error.message : "Failed to send voice message"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (
    file: File | null,
    recipient: string,
    caption: string = ""
  ) => {
    if (!file || !selectedConversationId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const whatsappId = localStorage.getItem("whatsapp_user_id");
      if (!whatsappId) {
        toast.error("WhatsApp user ID not found");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("recipient_id", recipient.split("_")[1]);
      if (caption.trim()) formData.append("caption", caption.trim());

      const response = await api.post(`whatsapp/${whatsappId}/media/send`, {
        data: formData,
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to upload file: ${response.statusText || response.status}`
        );
      }

      const data = response.data;

      setMessages((prev) => [
        ...prev,
        {
          id: data.details.message_id || Date.now().toString(),
          content: caption || `[File]`,
          type: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
            ? "video"
            : file.type.startsWith("audio/")
            ? "voice"
            : "file",
          role: "agent",
          conversation_id: selectedConversationId,
          timestamp: new Date().toISOString(),
          sender_id: "agent",
          fileUrl: data.details.media_id,
          fileName: file.name,
          fileType: file.type,
        },
      ]);

      toast.success("File sent successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setFileCaption("");
      setIsFileModalOpen(false);
    }
  };

  const handleShareProduct = async (messageText: string, product: Product) => {
    if (!selectedConversationId) return;

    if (!messageText.trim()) {
      toast.error("Cannot send empty message", {
        description: "Please add a message to send with the product",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        "https://egenie-whatsapp.koyeb.app/api/send_single_product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_id: selectedConversationId,
            product_id: product.product_id,
            message: messageText.trim() || undefined,
          }),
          credentials: "include",
        }
      );

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
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedConversationId || isSending) return;

    let contentToSend = message.trim();
    const platform = selectedConversationId.split("_")[0];
    const sender_id = selectedConversationId.split("_")[1];

    if (contentToSend.startsWith("/")) {
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
      if (platform === "whatsapp") {
        const whatsappId = localStorage.getItem("whatsapp_user_id");
        if (!whatsappId) throw new Error("No WhatsApp ID found");

        const payload = {
          conversation_id: selectedConversationId,
          content: contentToSend,
          sender_id: sender_id,
        };
        response = await conversationService.sendWhatsAppMessage(
          whatsappId,
          payload
        );
        if (response.status !== "success")
          throw new Error(response.message || "Failed to send message");
      } else if (platform === "instagram") {
        const data = {
          conversation_id: selectedConversationId,
          content: contentToSend,
          sender_id: sender_id,
        };
        response = await api.post(
          `/api/instagram/conversations/send_message`,
          data
        );
        if (response.status !== 200) throw new Error("Failed to send message");
      }
      setMessage("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const toggleAI = async () => {
    if (!selectedConversationId || isToggling) return;

    setIsToggling(true);
    try {
      const platform = selectedConversationId.split("_")[0];
      let response;
      if (platform === "whatsapp") {
        const whatsappId = localStorage.getItem("whatsapp_user_id");
        if (!whatsappId) throw new Error("No WhatsApp ID found");
        response = await conversationService.toggleWhatsAppAi(
          whatsappId,
          selectedConversationId,
          !isAIEnabled
        );
        if (response.status !== "success")
          throw new Error(response.message || "Failed to toggle AI");
      } else if (platform === "instagram") {
        response = await api.post(
          `/api/instagram/conversations/${selectedConversationId}/toggle_ai`,
          {
            enabled: !isAIEnabled,
          }
        );
        if (response.status !== 200) throw new Error("Failed to toggle AI");
      }
      setIsAIEnabled(!isAIEnabled);
      toast.success(
        `AI ${!isAIEnabled ? "enabled" : "disabled"} for this conversation`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to toggle AI status"
      );
    } finally {
      setIsToggling(false);
    }
  };

  const saveCustomerInfo = async (updatedData: {
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
          headers: {
            "Content-Type": "application/json",
          },
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
  };

  const handleResolve = useCallback(async(selectedConversationId:string) => {
    setIsResolved(true);
    setIsFollowUp(false);
    setConversationStatus("closed");
    setIsStatusDropdownOpen(false);
    setStatusLoading(true);
    const agentName = "You";

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was marked Closed by ${agentName}`,
      type: "system",
      role: "system",
      conversation_id: selectedConversationId || "",
      timestamp: new Date().toISOString(),
      sender_id: "system",
    };

    setMessages((prev) => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);

    try {
    // Use encodeURIComponent to be safe with IDs that contain special chars
    const res = await api.post(
      `/api/conversations/${encodeURIComponent(selectedConversationId)}/close`
    );

    // handle non-2xx as error
    if (!(res && (res.status === 200 || res.status === 204))) {
      throw new Error(
        `Unexpected response from server: ${res?.status ?? "no status"}`
      );
    }

    toast.success("Closed conversation successfully");
  } catch (err) {
    // Rollback optimistic UI: remove system message we added earlier
    console.error("Error closing conversation:", err);
    setMessages((prev) =>
      prev.filter((msg) => msg.id !== systemMessage.id)
    );

    // rollback other state if you want (optional — uncomment to revert)
    // setIsResolved(false);
    // setConversationStatus("open");

    const message =
      (typeof err === "object" && err !== null && "response" in err && typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string")
        ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
        : "Failed to close conversation. Try again.";
    toast.error(message);
  } finally{
     setStatusLoading(false);
  }
  }, [selectedConversationId]);

  const handleReopen = useCallback(() => {
    setIsResolved(false);
    setIsFollowUp(false);
    setConversationStatus("open");
    setIsStatusDropdownOpen(false);
    // setStatusLoading(true); 
    const agentName = "You";


    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was reopened by ${agentName}`,
      type: "system",
      role: "system",
      conversation_id: selectedConversationId || "",
      timestamp: new Date().toISOString(),
      sender_id: "system",
    };

    setMessages((prev) => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  }, [selectedConversationId]);

  const handleFollowUp = useCallback(async(selectedConversationId:string) => {
    setIsResolved(false);
    setIsFollowUp(true);
    setConversationStatus("followup");
    setIsStatusDropdownOpen(false);
    setStatusLoading(true);
    const agentName = "You";

    try{
      const res = await api.post(`/api/ai/schedule-message/${selectedConversationId}`);

      if (!(res && (res.status === 200 || res.status === 204))) {
      throw new Error(
        `Unexpected response from server: ${res?.status ?? "no status"}`
      );
    }
      toast.success("Marked conversation for follow-up successfully");
    }catch (err){
      console.error("Error scheduling message for follow-up:", err);
    setMessages((prev) =>
      prev.filter((msg) => msg.id !== systemMessage.id)
    );

    // rollback other state if you want (optional — uncomment to revert)
    // setIsResolved(false);
    // setConversationStatus("open");

    const message =
      (typeof err === "object" && err !== null && "response" in err && typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string")
        ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
        : "Failed to set conversation for follow-up. Try again.";
    toast.error(message);
    }finally{
      setStatusLoading(false);
    }

    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      content: `Conversation was marked for follow-up by ${agentName}`,
      type: "system",
      role: "system",
      conversation_id: selectedConversationId || "",
      timestamp: new Date().toISOString(),
      sender_id: "system",
    };

    setMessages((prev) => [...prev, systemMessage]);

    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  }, [selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return () => {};

    const setUnreadCount = async () => {
      try {
        const platform = selectedConversationId.split("_")[0];
        let url;
        if (platform === "instagram") {
          url = `/api/instagram/conversations/${selectedConversationId}/read`;
          await api.get(url);
        } else if (platform === "whatsapp") {
          const whatsappId = localStorage.getItem("whatsapp_user_id");
          if (!whatsappId) return;
          url = `/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/read`;
          await api.get(url);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error setting unread count:", error);
        }
      }
    };

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const platform = selectedConversationId.split("_")[0];
        let response;
        if (platform === "instagram") {
          response = await api.get(
            `/api/instagram/conversations/${selectedConversationId}`
          );
          setConversation(response?.data);
        } else if (platform === "whatsapp") {
          const whatsappId = localStorage.getItem("whatsapp_user_id");
          if (!whatsappId) return;
          response = await conversationService.getWhatsAppConversations();
          if (response.status === "success") {
            const dataArray = Array.isArray(response.data) ? response.data : [];
            const found = dataArray.find(
              (c: Conversation) => c.id === selectedConversationId
            );
            setConversation(found || null);
          }
        }
      } catch (error) {
        toast.error("Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    const fetchAIStatus = async () => {
      try {
        const platform = selectedConversationId.split("_")[0];
        let response;
        if (platform === "instagram") {
          response = await api.get(
            `/api/instagram/conversations/${selectedConversationId}/ai`
          );
          setIsAIEnabled(!!response?.data);
        } else if (platform === "whatsapp") {
          const whatsappId = localStorage.getItem("whatsapp_user_id");
          if (!whatsappId) return;
          response = await conversationService.getWhatsAppAiStatus(
            whatsappId,
            selectedConversationId
          );
          setIsAIEnabled(!!response.data);
        }
      } catch (error) {
        setIsAIEnabled(true);
      }
    };

    const fetchMessages = async () => {
      if (!isLoaded || !user) return;
      const agent_username = user.username;
      try {
        const platform = selectedConversationId.split("_")[0];
        let response;
        if (platform === "instagram") {
          response = await api.get(
            `/api/instagram/conversations/${selectedConversationId}/messages?agent_username=${agent_username}`
          );
          setMessages(response?.data.messages || []);
        } else if (platform === "whatsapp") {
          const whatsappId = localStorage.getItem("whatsapp_user_id");
          if (!whatsappId) return;
          response = await conversationService.getWhatsAppMessages(
            whatsappId,
            selectedConversationId
          );
          setMessages(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        toast.error("Failed to load messages");
      }
    };

    const WS_BASE_URL = "wss://egenie-whatsapp.koyeb.app";
    const platform = selectedConversationId.split("_")[0];

    function getOrCreateChatClientId() {
      let id = localStorage.getItem("chat_client_id");
      if (!id) {
        id = `chat-view-${Date.now()}`;
        localStorage.setItem("chat_client_id", id);
      }
      return id;
    }
    const chatClientId = getOrCreateChatClientId();

    if (platform === "instagram") {
      token()
        .then((sessionToken) => {
          const clientId =
            localStorage.getItem("chat_client_id") || chatClientId;
          const ws = new WebSocket(
            `${WS_BASE_URL}/ws2/${platform}/${clientId}`,
            [sessionToken]
          );
          wsRef.current = ws;

          ws.onopen = () => {
            console.log(
              `ChatView: Connected to Instagram WebSocket with ID ${clientId}`
            );
          };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("ChatView: Instagram WebSocket received message: ", data);

          // Handle typing indicators

          if (data.type === 'typing_indicator') {
            const myClientId = localStorage.getItem('chat_client_id');
            // Only show typing if it's for this conversation
            if (
              data.agent_id !== myClientId &&
              data.conversation_id === selectedConversationId
            ) {
              if (data.is_typing) {
                setTypingUsers(prev => {
                  const next = new Map(prev);
                  next.set(data.agent_id, { agent_name: data.user, timestamp: Date.now() });
                  return next;
                });
              } else {
                setTypingUsers(prev => {
                  const next = new Map(prev);
                  next.delete(data.agent_id);
                  return next;
                });
              }
            }
          }

          if (data.type === 'new_message' && data.message.conversation_id === selectedConversationId) {
            console.log("ChatView: new_message event type ✅ && data conv_id: ", data.message.conversation_id);

            // Check if this message already exists in the messages array to avoid duplicates
            const messageExists = messages.some(msg =>
              msg.id === data.message.id ||
              (msg.content === data.message.content &&
                msg.timestamp === data.message.timestamp &&
                msg.sender_id === data.message.sender_id)
            );

            // Only add the message if it's not already in the messages array
            if (!messageExists) {
              setMessages(prev => [...prev, data.message]);
            }
          }

          if (data.type === 'message_reaction' && data.message.conversation_id === selectedConversationId) {
            const updatedMessage = data.message;
            
            setMessages(prev => prev.map(message => {
              if (message.id === updatedMessage.message_id || message.id === updatedMessage.id) {
                return {
                  ...message,
                  reaction: updatedMessage.reaction
                };
              }
              return message;
            }));

            console.log(`ChatView: Reaction updated for message ${updatedMessage.message_id || updatedMessage.id}`);
          }

          else if (data.type === 'message_deleted' && data.conversation_id === selectedConversationId) {
            setMessages(prev =>
              prev.filter(msg => msg.id !== data.message_id)
            );

              console.log(
                `ChatView: Message with ID ${data.message_id} was deleted`
              );
            }
          };

          ws.onerror = (error) => {
            console.error("ChatView: WebSocket error: ", error);
          };

          ws.onclose = (event) => {
            console.log(
              `ChatView: WebSocket closed with code ${event.code}: ${event.reason}`
            );
          };
        })
        .catch((error) => {
          console.error("Failed to get session token:", error);
        });
    }
    if (platform === "whatsapp") {
      const whatsappId = localStorage.getItem("whatsapp_user_id");
      const clientId = `client-${Date.now()}-wa`;

      if (whatsappId) {
        const ws = new WebSocket(
          `${WS_BASE_URL}/ws2/whatsapp/${clientId}/${whatsappId}`
        );
        wsRef.current = ws;
        console.log("Connected to WhatsApp WebSocket");

        ws.onopen = () => {
          console.log(
            `ChatView: Connected to WhatsApp WebSocket with ID ${clientId}`
          );
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("ChatView: WhatsApp WebSocket received message: ", data);

          if (
            data.type === "new_message" &&
            data.message.conversation_id === selectedConversationId
          ) {
            console.log(
              "ChatView: new_message event type ✅ && data conv_id: ",
              data.message.conversation_id
            );
            setMessages((prev) => [...prev, data.message]);
          } else if (
            data.type === "message_deleted" &&
            data.conversation_id === selectedConversationId
          ) {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== data.message_id)
            );
            console.log(
              `ChatView: Message with ID ${data.message_id} was deleted`
            );
          }
        };

        ws.onerror = (error) => {
          console.error("ChatView: WebSocket error: ", error);
        };

        ws.onclose = (event) => {
          console.log(
            `ChatView: WebSocket closed with code ${event.code}: ${event.reason}`
          );
        };
      }
    }

    fetchConversation();
    setUnreadCount();
    fetchAIStatus();
    fetchMessages();
    setTypingUsers(new Map());

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [selectedConversationId]);
  

  const sendFn = (payload: Record<string, unknown>) => {
    console.log("🚀 Trying to send:", payload, wsRef.current?.readyState);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify(payload);
      wsRef.current.send(msg);
    }
  };

  const { handleTyping } = useTypingIndicator(sendFn, selectedConversationId);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  };

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
        {!selectedConversationId ? (
          <div className="h-full flex flex-col bg-white">
            <LandingDashboard />
          </div>
        ) : (
          <Card className="h-full flex flex-col bg-white max-h-screen rounded-none border border-gray-200 overflow-hidden">
            {/* Desktop Header */}
            <div className="px-6 py-1 border-b border-gray-100 bg-white items-center justify-between flex">
              {/* Customer Info Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {avatarSource ? (
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-gray-100">
                      <img
                        src={avatarSource}
                        alt="Platform avatar"
                        className="object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
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
                        <DialogTitle className="text-2xl">
                          {conversation?.customer_name} Information
                        </DialogTitle>
                      </DialogHeader>
                      {conversation && (
                        <CustomerInfo
                          name={conversation?.customer_name || "Unknown"}
                          email={conversation?.email || "Unknown"}
                          billingaddress={
                            conversation?.billingAddress || "Unknown"
                          }
                          shippingaddress={
                            conversation?.shippingAddress || "Unknown"
                          }
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
                          <span className="font-medium">
                            Close Conversation
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleFollowUp(selectedConversationId)}
                          className="flex items-center px-4 py-3 cursor-pointer text-sm hover:bg-amber-50 rounded-xl mx-2"
                          disabled={statusLoading}
                        >
                          <Clock className="h-4 w-4 mr-3 text-amber-600" />
                          <span className="font-medium">
                            Mark for Follow-up
                          </span>
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
                              const response = await fetch(
                                `https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders/${id}`,
                                {
                                  method: "DELETE",
                                  credentials: "include",
                                }
                              );

                              if (!response.ok) {
                                throw new Error("Failed to delete reminder");
                              }

                              toast.success("Reminder deleted successfully");
                              // Refresh reminders after deletion
                              refetchReminders();
                            } catch (error) {
                              toast.error("Failed to delete reminder");
                              console.error("Error deleting reminder:", error);
                            }
                          }}
                        />
                      </Popover>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {reminders.length > 0
                      ? `${reminders.length} reminder${
                          reminders.length > 1 ? "s" : ""
                        } set`
                      : "Set reminder"}
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

                {/* Right Sidebar Toggle Button */}
                {onOpenRightSidebar && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onOpenRightSidebar}
                        className={`rounded-xl transition-all duration-200 ${
                          isRightSidebarVisible
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                          />
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRightSidebarVisible ? "Hide details" : "Show details"}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Kebab Menu */}
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Customer Info Dialog */}
            <Dialog open={showCustomerInfo} onOpenChange={setShowCustomerInfo}>
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Customer Information
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div className="space-y-1">
                        <div className="text-gray-500">Name</div>
                        <div className="font-medium">
                          {conversation?.customer_name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-gray-500">
                          {conversation?.platform === "instagram"
                            ? "Username"
                            : "Phone"}
                        </div>
                        <div className="font-medium">
                          {conversation?.platform === "instagram"
                            ? selectedConversationId?.split("_")[1]
                            : selectedConversationId
                                ?.split("_")[1]
                                ?.replace(/^(\d{2})(\d+)/, "+$1 $2")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  <div className="grid pl-4 grid-cols-2 gap-6">
                    {messages.some((m) => extractAddressData(m.content)) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Latest Address</h3>
                        {messages
                          .filter((m) => extractAddressData(m.content))
                          .slice(-1)
                          .map((m, idx) => {
                            const addressData = extractAddressData(m.content);
                            return (
                              <div
                                key={idx}
                                className="rounded-lg py-4 space-y-3"
                              >
                                <div className="space-y-2 text-sm">
                                  <div className="flex gap-2">
                                    <div className="text-gray-500 w-20">
                                      Full Name
                                    </div>
                                    <div className="font-medium">
                                      {addressData?.address.full_name}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="text-gray-500 w-20">
                                      Email
                                    </div>
                                    <div className="font-medium">
                                      {addressData?.address.email}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="text-gray-500 w-20">
                                      Address
                                    </div>
                                    <div className="font-medium">
                                      {addressData?.address.address}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="text-gray-500 w-20">
                                      City
                                    </div>
                                    <div className="font-medium">
                                      {addressData?.address.city},{" "}
                                      {addressData?.address.state}{" "}
                                      {addressData?.address.pin_code}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="text-gray-500 w-20">
                                      Country
                                    </div>
                                    <div className="font-medium">
                                      {addressData?.address.country.replace(
                                        "0_",
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {messages.some((m) => extractCartData(m.content)) && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium">Latest Cart</h3>
                        {messages
                          .filter((m) => extractCartData(m.content))
                          .slice(-1)
                          .map((m, idx) => {
                            const cartItems = extractCartData(m.content);
                            return (
                              <div
                                key={idx}
                                className="rounded-lg p-4 space-y-4"
                              >
                                <div className="space-y-4">
                                  {cartItems?.map((item, itemIdx) => (
                                    <div
                                      key={itemIdx}
                                      className="flex gap-3 text-sm border-b pb-4 last:border-0 last:pb-0"
                                    >
                                      <img
                                        src={item.product_data.image_url}
                                        alt={item.product_data.name}
                                        className="w-16 h-16 rounded object-cover"
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium line-clamp-2">
                                          {item.product_data.name}
                                        </div>
                                        <div className="text-gray-500 mt-1">
                                          {item.quantity} × {item.currency}{" "}
                                          {item.item_price}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  <div className="text-base font-medium">
                                    Total: {cartItems?.[0].currency}{" "}
                                    {cartItems?.reduce(
                                      (sum, item) =>
                                        sum + item.item_price * item.quantity,
                                      0
                                    )}
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

            {/* File Modal */}
            <Dialog
              open={isFileModalOpen}
              onOpenChange={(open) => {
                setIsFileModalOpen(open);
                if (!open) {
                  setFileCaption("");
                  setSelectedFile(null);
                }
              }}
            >
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
                        if (
                          file &&
                          (file.type.startsWith("image/") ||
                            file.type.startsWith("video/"))
                        ) {
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
                      if (
                        file &&
                        (file.type.startsWith("image/") ||
                          file.type.startsWith("video/"))
                      ) {
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

            <ReminderDialog
              open={showReminder}
              onOpenChange={setShowReminder}
              onSave={(reminderData) => {
                console.log("Reminder saved:", reminderData);
                refetchReminders();
                setShowReminder(false);
              }}
              conversationId={selectedConversationId}
            />

          {/* Messages Area */}
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 h-full px-3 py-0.1 bg-gray-50"
          >
            <div className="space-y-3 max-w-full pb-4 sm:pb-0">
              
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
                         <div
                          key={message.id}
                          className="relative group w-full message-item"
                          >
                          <div className={`flex ${message.role === "customer" ? "justify-start" : "justify-end"}`}>
                            <div
                              className={`flex flex-col max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${message.role === "customer" ? "items-start" : "items-end"
                                }`}
                            >
                              <MessageWrapper message={message} index={index} allMessages={messages}>
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
                                  {(message.type === "ig_story" || message.type === "story_reply") && message.payload && (
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
                                      content={message.content}
                                      storyOwnerUsername={message.payload.owner_username}
                                      type={message.type}
                                      />
                                  )}

                                  {/* Render Images / Videos */}
                                  {(message.type === "image" || message.type === "video") && message.payload && (
                                    <MediaMessage
                                      type={message.type === "image" ? "image" : "video"}
                                      url={message.payload.url}
                                      isAgent={message.role.toLowerCase() === "agent"}
                                      isLatest={isLatest}
                                      isActive={
                                        activeMediaType === "video" &&
                                        activeMediaId === message.id
                                      }
                                      onPlay={(id) => handlePlay(id, "video")}
                                      isMuted={globalMuted}
                                      onMuteToggle={(muted) => setGlobalMuted(muted)}
                                      id={message.id}
                                      timestamp={formatMessageTime(message.timestamp)}
                                    />
                                  )}
                                </LazyMediaLoader>

                                {/* Normal Messages */}
                                {!["ig_story", "story_reply", "ig_reel", "share", "image", "video"].includes(message.type ?? "") && (
                                  <MessageItem
                                    key={message.id}
                                    message={message}
                                    index={index}
                                    isLatest={isLatest}
                                    isLast={index === messages.length - 1}
                                    isReplyMessage={message.type == "message_reply"}
                                  />
                                )}
                              </MessageWrapper>
                          </div>
                        </div>
                      </div>
                      )
                    })}
                  <div ref={lastMessageRef} />
                </>
            </div>
          </ScrollArea>

            {/* Input Section */}
            <div className="flex-shrink-0 mb-3 bg-gray-50">
              {/* Typing Users */}
              {typingUsers.size > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
                  <div className="flex gap-1">
                    {Array.from(typingUsers.values()).map((user, index) => (
                      <span key={index}>
                        {user.agent_name}
                        {index < typingUsers.size - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                  <span>{typingUsers.size === 1 ? "is" : "are"} typing...</span>
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}

              {sharedProduct && (
                <div className="mb-3 px-3">
                  <SharedProductPreview
                    product={sharedProduct}
                    onRemove={onClearSharedProduct}
                  />
                </div>
              )}

              {audioURL ? (
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-200/60 mx-3">
                  <audio controls src={audioURL} className="flex-1" />
                  <button
                    className="p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
                    onClick={() => setAudioURL(null)}
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-3 hover:border-gray-300/60 flex flex-col shadow-xl mx-3">
                  {/* Mode Toggle */}
                  <div className="mb-5 w-40 bg-gray-100/80 rounded-2xl p-0.5 flex items-center">
                    <button
                      className={`flex-1 text-xs px-4 py-2 rounded-2xl transition-all duration-300 font-medium ${
                        mode === "reply"
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() => setMode("reply")}
                    >
                      Reply
                    </button>
                    <button
                      className={`flex-1 text-xs px-4 py-2 rounded-2xl transition-all duration-300 font-medium ${
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
                      onChange={(e) => {
                        setMessage(e.target.value)
                        handleTyping()
                      }}
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
                    <div className="flex gap-2">
                      {/* Emoji picker */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors">
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
                            className="p-2.5 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors"
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
                            className={`p-2.5 rounded-xl transition-colors ${
                              isRecording
                                ? "bg-red-100/80 hover:bg-red-200/80 text-red-600"
                                : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600"
                            }`}
                            onClick={
                              isRecording ? stopRecording : startRecording
                            }
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
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-500 font-medium">
                        {message.length}/1000
                      </div>

                      <button
                        className={`px-6 py-2.5 rounded-2xl flex items-center justify-center transition-all duration-300 font-medium text-sm ${
                          message.trim() || audioURL || sharedProduct
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
      </TooltipProvider>
    </>
  );
};

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
