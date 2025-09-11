

import React, { useState, useEffect, useRef, use } from "react";

import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Switch } from "@/components/ui/switch";

import { ScrollArea } from "@/components/ui/scroll-area";

import {

  Popover,

  PopoverContent,

  PopoverTrigger,

} from "@/components/ui/popover";

import { Avatar } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { format, parseISO } from "date-fns";

import { toast, Toaster } from "sonner";

// import { toZonedTime } from 'date-fns-tz';

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

  RefreshCw

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

import { Trash2 } from "lucide-react";

import { User } from "lucide-react";

import TimerDisplay from "./TimerDisplay";

import { Plus } from "lucide-react";

import { createClient } from "@supabase/supabase-js";



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



import {

  Tooltip,

  TooltipContent,

  TooltipTrigger,

  TooltipProvider,

} from "@/components/ui/tooltip";

import {

  Send,

  Paperclip,

  // Globe,

  // Bot,

  MoreVertical,

  Menu,

  // Phone,

  // Video,

  // UserPlus,

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



interface Product {

  id: string;

  category: string;

  description: string;

  images: string;

  name: string;

  on_sale: string; // Use boolean if the data contains `true/false` instead of `"True"/"False"`

  permalink: string;

  price: number;

  product_id: number;

  purchasable: string; // Use boolean if the data contains `true/false`

  regular_price: string; // Use `number` if parsed as numeric values

  sale_price: string; // Use `number` if parsed as numeric values

  slug: string;

  stock_quantity: number;

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

  type?: "text" | "image" | "file" | "voice" | "video" | "system";

  product_data?: ProductData[];

  fileUrl?: string;

  fileName?: string;

  fileType?: string;

}



interface ChatViewProps {

  selectedConversationId: string;

  sharedProduct: Product | null;

  onClearSharedProduct: () => void;

  // Controls for right sidebar visibility (to place open button near 3-dots)
  isRightSidebarVisible?: boolean;
  onOpenRightSidebar?: () => void;

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

  // progress,

  onCancel,

}: {

  file: File;

  progress: number;

  onCancel: () => void;

}) => {

  const isVideo = file.type.startsWith("video/");

  const previewUrl = URL.createObjectURL(file);



  return (

    <div className="relative">

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">

        {isVideo ? (

          <video

            src={previewUrl}

            className="w-full h-full object-cover"

            controls={false}

          />

        ) : (

          <img

            src={previewUrl}

            alt="Preview"

            className="w-full h-full object-cover"

          />

        )}



        {/* Progress overlay */}

        {/* <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">

          <div className="w-3/4">

            <div className="text-white text-sm mb-2 text-center">

              {progress < 100 ? 'Uploading...' : 'Processing...'}

              {progress < 100 && ` ${Math.round(progress)}%`}

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div 

                className="bg-blue-600 h-2 rounded-full transition-all duration-300"

                style={{ width: `${progress}%` }}

              />

            </div>

          </div>

        </div> */}



        {/* Cancel button */}

        <button

          onClick={onCancel}

          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/75 transition-colors"

        >

          <X className="h-4 w-4 text-white" />

        </button>

      </div>

    </div>

  );

};



// const MessageTimer = ({ lastMessageTime }: { lastMessageTime: string }) => {

//   const [timeLeft, setTimeLeft] = useState<string>('');

//   const [isExpired, setIsExpired] = useState(false);



//   useEffect(() => {

//     const calculateTimeLeft = () => {

//       const messageTime = new Date(lastMessageTime);

//       const deadline = new Date(messageTime.getTime() + 24 * 60 * 60 * 1000);

//       const now = new Date();

//       const difference = deadline.getTime() - now.getTime();



//       if (difference <= 0) {

//         setIsExpired(true);

//         setTimeLeft('Window expired');

//         return;

//       }



//       const hours = Math.floor(difference / (1000 * 60 * 60));

//       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));



//       setTimeLeft(`${hours}h ${minutes}m remaining`);

//       setIsExpired(false);

//     };



//     calculateTimeLeft();

//     const timer = setInterval(calculateTimeLeft, 60000); // Update every minute



//     return () => clearInterval(timer);

//   }, [lastMessageTime]);



//   return (

//     <div className={cn(

//       "text-xs text-center mb-2",

//       isExpired ? "text-red-500" : "text-gray-500",

//       timeLeft.includes('1h') ? "text-amber-500" : ""

//     )}>

//       {timeLeft}

//     </div>

//   );

// };



const ChatView = ({

  selectedConversationId,

  sharedProduct,

  onClearSharedProduct,

  isRightSidebarVisible,
  onOpenRightSidebar,

}: ChatViewProps) => {

  const [isRecording, setIsRecording] = useState(false);

  const [showReminder, setShowReminder] = useState(false);

  const [isAIEnabled, setIsAIEnabled] = useState(false);

  const [isToggling, setIsToggling] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);

  const [conversation, setConversation] = useState<Conversation | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const [uploading, setUploading] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [isSending, setIsSending] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { reminders = [], refetchReminders } = useReminders(

    selectedConversationId

  );

  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);

  const [showCannedResponses, setShowCannedResponses] = useState(false);

  const [filteredResponses, setFilteredResponses] = useState<CannedResponse[]>(

    []

  );

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const [ShowInfo, setShowInfo] = useState(false);

  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [audioModalOpen, setIsAudioModalOpen] = useState(false);

  const [mode, setMode] = useState<"reply" | "private">("reply");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [customerTimers, setCustomerTimers] = useState<Record<string, number>>(

    {}

  );

  const [currentTimer, setCurrentTimer] = useState(0);

const [isResolved, setIsResolved] = useState(false);

const [resolveHistory, setResolveHistory] = useState<Array<{

  action: string, 

  agent: string, 

  timestamp: Date

}>>([]);

const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);




  // Add this useEffect to handle the timer logic

  useEffect(() => {

    let timerInterval: NodeJS.Timeout | null = null;



    if (selectedConversationId) {

      // Initialize timer for this conversation if it doesn't exist

      if (customerTimers[selectedConversationId] === undefined) {

        setCustomerTimers((prev) => ({

          ...prev,

          [selectedConversationId]: 24, // Start from 24

        }));

      }



      // Set up interval to update the timer

      timerInterval = setInterval(() => {

        setCustomerTimers((prev) => {

          const currentTime = prev[selectedConversationId] ?? 24;

          if (currentTime > 0) {

            return {

              ...prev,

              [selectedConversationId]: currentTime - 1, // Count down

            };

          }

          return prev; // Stop at 0

        });



        // Update current timer display

        setCurrentTimer(customerTimers[selectedConversationId] ?? 24);

      }, 3600000); // Update every hour (3600000ms)

    }



    return () => {

      if (timerInterval) {

        clearInterval(timerInterval);

      }

    };

  }, [selectedConversationId, customerTimers]);



  // Dynamic text area height adjustment

  useEffect(() => {

    if (textareaRef.current) {

      textareaRef.current.style.height = "auto";

      textareaRef.current.style.height = `${Math.min(

        textareaRef.current.scrollHeight,

        150

      )}px`;

    }

  }, [message]);



  const startRecording = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {

        mimeType: "audio/webm;codecs=opus", // Ensure WebM format with Opus codec

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

      // Stop all audio tracks

      mediaRecorderRef.current.stream

        .getTracks()

        .forEach((track) => track.stop());

    }

  };



  // Add this useEffect for loading canned responses

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



  // Add this useEffect for handling canned response suggestions

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



  const handleMicClick = () => {

    setIsRecording(!isRecording);

  };



  const handleSendAudio = async () => {

    if (!audioURL || !selectedConversationId) return;



    setIsSending(true);

    try {

      // Create a new FormData instance

      const formData = new FormData();



      // Convert the audioURL blob to a File object

      const audioBlob = await fetch(audioURL).then((r) => r.blob());

      const audioFile = new window.File([audioBlob], "voice-message.webm", {

        type: "audio/webm", // Keep original WebM format from recording

      });



      // Add required metadata

      formData.append("file", audioFile);

      formData.append("type", "audio");

      formData.append("messaging_product", "whatsapp");

      formData.append("conversation_id", selectedConversationId);



      // Send the audio file

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



      // Add the voice message to the messages array

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



      // Clear the audio state

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



  const handleFileUpload = async (file: File | null, recipient: string) => {

    if (!file) return;



    setUploading(true);

    setUploadProgress(0);

    const formData = new FormData();

    formData.append("file", file);



    try {

      const response = await fetch(

        `https://egenie-whatsapp.koyeb.app/media/${recipient}/upload`,

        {

          method: "POST",

          credentials: "include",

          body: formData,

        }

      );

      const data = await response.json();



      // setMessages(prev => [...prev, {

      //   id: Date.now().toString(),

      //   content: data.fileUrl,

      //   type: file.type.startsWith('image/') ? 'image' : 'video',

      //   role: 'agent',

      //   conversation_id: selectedConversationId ?? '', // Ensure it's always a string

      //   timestamp: new Date().toISOString(),

      //   sender_id: 'agent',

      //   fileUrl: data.fileUrl,

      //   fileName: file.name,

      //   fileType: file.type

      // }]);

    } catch (error) {

      toast.error("Failed to upload file");

      console.log("file upload error:", error);

    } finally {

      setUploading(false);

      setUploadProgress(0);

      setSelectedFile(null);

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

            message: messageText.trim() || undefined, // Only send message if not empty

          }),

          credentials: "include",

        }

      );



      if (!response.ok) {

        throw new Error("Failed to share product");

      }



      // Clear the message input and shared product

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



    // Check for canned response

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



      if (platform === "instagram") {

        // Use Instagram-specific endpoint

        const instagramId = localStorage.getItem("instagram_user_id");



        if (!instagramId) {

          console.error("No Instagram ID found for sending message");

          throw new Error("No Instagram ID found");

        }



        response = await fetch(

          `https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/conversations/send_message`,

          {

            method: "POST",

            credentials: "include",

            headers: {

              "Content-Type": "application/json",

            },

            body: JSON.stringify({

              conversation_id: selectedConversationId,

              content: contentToSend,

              type: "text",

              sender_id: sender_id,

            }),

          }

        );

      } else if (platform === "whatsapp") {

        // Use WhatsApp-specific endpoint

        const whatsappId = localStorage.getItem("whatsapp_user_id");



        if (!whatsappId) {

          console.error("No WhatsApp ID found for sending message");

          throw new Error("No WhatsApp ID found");

        }



        response = await fetch(

          `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/send_message`,

          {

            method: "POST",

            credentials: "include",

            headers: {

              "Content-Type": "application/json",

            },

            body: JSON.stringify({

              conversation_id: selectedConversationId,

              content: contentToSend,

              type: "text",

              sender_id: sender_id,

            }),

          }

        );

      }



      if (response && !response.ok) throw new Error("Failed to send message");

      setMessage("");

    } catch (error) {

      console.error("Error sending message:", error);

      toast.error("Failed to send message");

    } finally {

      setIsSending(false);

    }

  };



  useEffect(() => {

    // Scroll to the bottom when new messages are added

    if (lastMessageRef.current) {

      lastMessageRef.current.scrollIntoView({

        behavior: "smooth",

        block: "end",

      });

    }

  }, [messages]);



  // Update the toggleAI function



  const toggleAI = async () => {

    if (!selectedConversationId || isToggling) return;



    setIsToggling(true);

    try {

      const platform = selectedConversationId.split("_")[0];

      let url;



      if (platform === "instagram") {

        const instagramId = localStorage.getItem("instagram_user_id");



        if (!instagramId) {

          console.error("No Instagram ID found for toggling AI");

          throw new Error("No Instagram ID found");

        }



        // Use Instagram-specific endpoint

        url = `https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}/toggle_ai`;

      } else if (platform === "whatsapp") {

        const whatsappId = localStorage.getItem("whatsapp_user_id");



        if (!whatsappId) {

          console.error("No WhatsApp ID found for toggling AI");

          throw new Error("No WhatsApp ID found");

        }



        // Use WhatsApp-specific endpoint

        url = `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/toggle_ai`;

      } else {

        // Use regular endpoint for other conversations

        url = `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/toggle_ai`;

      }



      const response = await fetch(url, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({ enabled: !isAIEnabled }),

      });



      if (!response.ok) throw new Error("Failed to toggle AI");



      setIsAIEnabled(!isAIEnabled);

      toast.success(

        `AI ${!isAIEnabled ? "enabled" : "disabled"} for this conversation`

      );

    } catch (error) {

      console.error("Failed to toggle AI status", error);

      toast.error("Failed to toggle AI status");

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

        `https://your-api-endpoint/conversations/${selectedConversationId}/update_customer_info`,

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

      setConversation(updatedConversation); // Update the state with the new data

      toast.success("Customer information updated successfully!");

    } catch (error) {

      console.error("Error updating customer info:", error);

      toast.error("Failed to update customer information.");

    }

  };



  useEffect(() => {

    if (!selectedConversationId) return () => {};



    const setUnreadCount = async () => {

      try {

        // Check if this is an Instagram or WhatsApp conversation

        const platform = selectedConversationId.split("_")[0];

        let url;



        if (platform === "instagram") {

          const instagramId = localStorage.getItem("instagram_user_id");



          if (!instagramId) {

            console.error("No Instagram ID found for setting unread count");

            return;

          }



          url = `https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}/read`;

        } else if (platform === "whatsapp") {

          const whatsappId = localStorage.getItem("whatsapp_user_id");



          if (!whatsappId) {

            console.error("No WhatsApp ID found for setting unread count");

            return;

          }



          url = `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/read`;

        } else {

          url = `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/read`;

        }



        await fetch(url, {

          method: "GET",

          credentials: "include",

          headers: {

            "Content-Type": "application/json",

          },

        });

      } catch (error) {

        console.error("Error setting unread count:", error);

      }

    };



    // Fetch conversation details

    const fetchConversation = async () => {

      try {

        setLoading(true);



        // Check if this is an Instagram or WhatsApp conversation

        const platform = selectedConversationId.split("_")[0];

        let response;



        if (platform === "instagram") {

          const instagramId = localStorage.getItem("instagram_user_id");



          if (!instagramId) {

            console.error("No Instagram ID found for fetching conversation");

            throw new Error("No Instagram ID found");

          }



          response = await fetch(

            `https://heidelai-backend2.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        } else if (platform === "whatsapp") {

          const whatsappId = localStorage.getItem("whatsapp_user_id");



          if (!whatsappId) {

            console.error("No WhatsApp ID found for fetching conversation");

            throw new Error("No WhatsApp ID found");

          }



          response = await fetch(

            `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        }

        // else {

        //   response = await fetch(

        //     `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}`,

        //     {

        //       method: "GET",

        //       credentials: "include",

        //       headers: {

        //         "Content-Type": "application/json",

        //       },

        //     }

        //   );

        // }



        const data = await response?.json();

        const enhancedData = {

          ...data,

          customer_name: data.customer?.name || "Unknown",

          email: data.customer?.email || "Unknown",

          billingAddress: data.customer?.billing_address || "Unknown",

          shippingAddress: data.customer?.shipping_address || "Unknown",

        };

        setConversation(data);

        console.log("conversation data", data);

      } catch (error) {

        console.error("Error fetching conversation:", error);

      } finally {

        setLoading(false);

      }

    };



    const fetchAIStatus = async () => {

      try {

        setLoading(true);



        // Check conversation platform

        const platform = selectedConversationId.split("_")[0];

        let response;



        if (platform === "instagram") {

          const instagramId = localStorage.getItem("instagram_user_id");



          if (!instagramId) {

            console.error("No Instagram ID found for fetching AI status");

            throw new Error("No Instagram ID found");

          }



          response = await fetch(

            `https://heidelai-backend2.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}/ai`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        } else if (platform === "whatsapp") {

          const whatsappId = localStorage.getItem("whatsapp_user_id");



          if (!whatsappId) {

            console.error("No WhatsApp ID found for fetching AI status");

            throw new Error("No WhatsApp ID found");

          }



          response = await fetch(

            `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/ai`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        }

        // else {

        //   response = await fetch(

        //     `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/ai`,

        //     {

        //       method: "GET",

        //       credentials: "include",

        //       headers: {

        //         "Content-Type": "application/json",

        //       },

        //     }

        //   );

        // }



        const data = await response?.json();

        setIsAIEnabled(data);

        console.log("AI data", data);

      } catch (error) {

        console.error("Error fetching AI status:", error);

      } finally {

        setLoading(false);

      }

    };



    const fetchMessages = async () => {

      try {

        setLoading(true);



        // Check conversation platform

        const platform = selectedConversationId.split("_")[0];

        let response;



        if (platform === "instagram") {

          const instagramId = localStorage.getItem("instagram_user_id");



          if (!instagramId) {

            console.error("No Instagram ID found for fetching messages");

            throw new Error("No Instagram ID found");

          }



          response = await fetch(

            `https://heidelai-backend2.koyeb.app/api/instagram/${instagramId}/conversations/${selectedConversationId}/messages`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        } else if (platform === "whatsapp") {

          const whatsappId = localStorage.getItem("whatsapp_user_id");



          if (!whatsappId) {

            console.error("No WhatsApp ID found for fetching messages");

            throw new Error("No WhatsApp ID found");

          }



          response = await fetch(

            `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${selectedConversationId}/messages`,

            {

              method: "GET",

              credentials: "include",

              headers: {

                "Content-Type": "application/json",

              },

            }

          );

        }

        // else {

        //   response = await fetch(

        //     `https://egenie-whatsapp.koyeb.app/conversations/${selectedConversationId}/messages`,

        //     {

        //       method: "GET",

        //       credentials: "include",

        //       headers: {

        //         "Content-Type": "application/json",

        //       },

        //     }

        //   );

        // }



        const data = await response?.json();

        setMessages(data);

        console.log("messages data", data);

      } catch (error) {

        console.error("Error fetching messages:", error);

        toast.error("Failed to load messages");

      } finally {

        setLoading(false);

      }

    };



    // Set up WebSocket connection based on platform

    const platform = selectedConversationId.split("_")[0];

    let ws: WebSocket | null = null;



    if (platform === "instagram") {

      const instagramId = localStorage.getItem("instagram_user_id");

      const clientId = `client-${Date.now()}-ig`;



      if (instagramId) {

        ws = new WebSocket(

          `wss://heidelai-backend2.koyeb.app/ws2/instagram/${clientId}/${instagramId}`

        );

        console.log("Connected to Instagram WebSocket");

      }

    } else if (platform === "whatsapp") {

      const whatsappId = localStorage.getItem("whatsapp_user_id");

      const clientId = `client-${Date.now()}-wa`;



      if (whatsappId) {

        ws = new WebSocket(

          `wss://egenie-whatsapp.koyeb.app/ws2/whatsapp/${clientId}/${whatsappId}`

        );

        console.log("Connected to WhatsApp WebSocket");

      }

    }

    // else {

    //   // Regular WebSocket for other conversations

    //   ws = new WebSocket(`wss://egenie-whatsapp.koyeb.app/ws2/client-${Date.now()}`);

    // }



    if (ws) {

      ws.onmessage = (event) => {

        const data = JSON.parse(event.data);

        if (

          data.type === "new_message" &&

          data.message.conversation_id === selectedConversationId

        ) {

          setMessages((prev) => [...prev, data.message]);

        } else if (

          data.type === "message_deleted" &&

          data.conversation_id === selectedConversationId

        ) {

          setMessages((prev) =>

            prev.filter((msg) => msg.id !== data.message_id)

          );

          console.log(`Message with ID ${data.message_id} was deleted`);

        }

      };

    }



    fetchConversation();

    setUnreadCount();

    fetchAIStatus();

    fetchMessages();



    return () => {

      if (ws) ws.close();

    };

  }, [selectedConversationId]);



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

  

// Update your handleResolve and handleReopen functions
const handleResolve = () => {
  setIsResolved(true);
  setIsStatusDropdownOpen(false);
  const agentName = "You";
  
  const systemMessage: Message = {
    id: `system-${Date.now()}`,
    content: `Conversation was marked resolved by ${agentName}`,
    type: 'system',
    role: 'system',
    conversation_id: selectedConversationId || '',
    timestamp: new Date().toISOString(),
    sender_id: 'system'
  };
  
  setMessages(prev => [...prev, systemMessage]);
  
  setTimeout(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, 100);
};

const handleReopen = () => {
  setIsResolved(false);
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
      lastMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, 100);
};

// Add the handleFollowUp function
const handleFollowUp = () => {
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
      lastMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, 100);
};




  return (

    <>

      <Toaster richColors position="top-right" />

      <style>

        {`

          

          .product-scroll::-webkit-scrollbar {

            width: 6px;

            height: 6px;

          }

          .product-scroll::-webkit-scrollbar-thumb {

            background-color: #cbd5e1;

            border-radius: 20px;

          }

          .product-scroll::-webkit-scrollbar-track {

            background: transparent;

          }

          .custom-scroll::-webkit-scrollbar {

            width: 6px;

            height: 6px;

          }

          .custom-scroll::-webkit-scrollbar-thumb {

            background-color: #cbd5e1;

            border-radius: 20px;

          }

          .custom-scroll::-webkit-scrollbar-track {

            background: transparent;

          }

        `}

      </style>

      <TooltipProvider>

        {!selectedConversationId ? (

          <Card className="h-full flex flex-col bg-white  items-center justify-center">

            <div className="text-center text-gray-500">

              <LandingDashboard />

              {/* <h3 className="text-3xl font-bold text-black mb-2">Welcome to your dashboard!</h3>

            <p>Select a conversation from the list to continue</p> */}

            </div>

          </Card>

        ) : (

          <Card className="h-full flex flex-col bg-white max-h-screen">

            <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between shadow-sm">

              {/* Customer Info Section */}

              <div className="flex items-center space-x-4">

                <div className="flex items-center">

                  {/* Timer display */}

                  {selectedConversationId &&

                    customerTimers[selectedConversationId] !== undefined && (

                      <TimerDisplay

                        hours={customerTimers[selectedConversationId]}

                      />

                    )}

                </div>

                <div className="relative ml-3">

                  <Avatar className="h-8 w-8 border-1 border-white shadow-md">

                    <img

                      src={avatarSource}

                      alt="Platform avatar"

                      className="object-cover"

                    />

                  </Avatar>

                </div>



                <div>

                  <Dialog>

                    <DialogTrigger asChild>

                      <div className="group cursor-pointer">

                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-200">

                          {conversation?.customer_name}

                          {/* <span className="ml-2 text-xs font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded-full">

                            {conversation?.platform || "Chat"}

                          </span> */}

                        </h3>

                      </div>

                    </DialogTrigger>



                    <DialogContent className="max-w-4xl rounded-xl shadow-xl">

                      <DialogHeader className="border-b pb-4">

                        <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">

                          <User className="h-6 w-6 mr-2 text-blue-600" />

                          Customer Information

                        </DialogTitle>

                      </DialogHeader>



                      {conversation && (

                        <div className="py-4">

                          <CustomerInfo

                            name={conversation?.customer_name || "Not Saved"}

                            email={conversation?.email || "Not Saved"}

                            billingaddress={

                              conversation?.billingAddress || "Not Saved"

                            }

                            shippingaddress={

                              conversation?.shippingAddress || "Not Saved"

                            }

                            platform={conversation?.platform || ""}

                            selectedConversationId={selectedConversationId}

                            saveCustomerInfo={saveCustomerInfo}

                          />

                        </div>

                      )}

                    </DialogContent>

                  </Dialog>

                </div>

              </div>



              {/* Action Buttons Section */}

            <div className="flex items-center space-x-1 mr-10">

  {/* Resolve/Reopen Button */}

<DropdownMenu open={isStatusDropdownOpen} onOpenChange={setIsStatusDropdownOpen}>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className="rounded-full hover:bg-blue-100 transition-colors duration-200 flex items-center space-x-1"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-blue-600" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className="text-sm font-medium text-blue-600">
        {isResolved ? "Reopen" : "Resolve"}
      </span>
      <ChevronDown className="h-4 w-4 text-blue-600" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
    {!isResolved && (
      <DropdownMenuItem 
        onClick={handleResolve}
        className="flex items-center px-4 py-2.5 cursor-pointer text-sm"
      >
        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
        Mark as Resolved
      </DropdownMenuItem>
    )}
    {isResolved && (
      <DropdownMenuItem 
        onClick={handleReopen}
        className="flex items-center px-4 py-2.5 cursor-pointer text-sm"
      >
        <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
        Reopen Conversation
      </DropdownMenuItem>
    )}
    <DropdownMenuItem 
      onClick={handleFollowUp}
      className="flex items-center px-4 py-2.5 cursor-pointer text-sm"
    >
      <Clock className="h-4 w-4 mr-2 text-amber-600" />
      Mark for Follow-up
    </DropdownMenuItem>
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

                            className="rounded-full hover:bg-blue-100 transition-colors duration-200 group relative"

                          >

                            <Clock className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />

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

                <div className="flex flex-col items-center">

                  <div className="flex items-center space-x-2 rounded-full px-3 py-1.5">

                    <Switch

                      checked={isAIEnabled}

                      onCheckedChange={toggleAI}

                      disabled={isToggling}

                      className="data-[state=checked]:bg-blue-600"

                    />

                    <span className="text-xs font-medium text-gray-700">

                      AI

                    </span>

                  </div>

                  {/* <span className="text-[10px] text-gray-500 mt-1">

                    {isAIEnabled ? "Enabled" : "Disabled"}

                  </span> */}

                </div>



                {/* More Options Menu */}

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>

                    <Button

                      variant="ghost"

                      size="icon"

                      className="rounded-full bg-gray-100 hover:bg-blue-100 transition-colors duration-200"

                    >

                      <MoreVertical className="h-5 w-5 text-gray-600" />

                    </Button>

                  </DropdownMenuTrigger>



                  <DropdownMenuContent

                    align="end"

                    className="rounded-xl shadow-lg border border-gray-200 min-w-[200px] py-2"

                  >

                    <DropdownMenuItem

                      onClick={() => setShowCustomerInfo(true)}

                      className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"

                    >

                      <User className="h-4 w-4 mr-3 text-gray-600" />

                      <span className="font-medium">View Customer Info</span>

                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors">

                      <FileText className="h-4 w-4 mr-3 text-gray-600" />

                      <span className="font-medium">Export Chat</span>

                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors">

                      <Trash2 className="h-4 w-4 mr-3 text-gray-600" />

                      <span className="font-medium">Clear Chat</span>

                    </DropdownMenuItem>

                  </DropdownMenuContent>

                </DropdownMenu>

                {/* Right sidebar menu button (only when hidden) */}
                {/* {!isRightSidebarVisible && onOpenRightSidebar && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 rounded-full bg-gray-100 hover:bg-blue-100"
                    onClick={onOpenRightSidebar}
                    aria-label="Open right sidebar"
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </Button>
                )} */}

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



                {/* Contact Details Section */}

                <div className="space-y-6">

                  <div className=" rounded-lg p-6">

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



                  {/* Divider */}

                  <div className="h-px bg-gray-200" />



                  {/* Address and Cart Container */}

                  <div className="grid pl-4 grid-cols-2 gap-6">

                    {/* Address Information */}

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

                                className=" rounded-lg py-4 space-y-3"

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



                    {/* Cart Information */}

                    {messages.some((m) => extractCartData(m.content)) && (

                      <div className="space-y-3">

                        <h3 className="text-lg font-medium">Latest Cart</h3>

                        {messages

                          .filter((m) => extractCartData(m.content))

                          .slice(-1)

                          .map((m, idx) => {

                            const cartItems = extractCartData(m.content);

                            return (

                              <div key={idx} className="space-y-3">

                                <div className="space-y-3">

                                  {cartItems?.map((item, itemIdx) => (

                                    <div

                                      key={itemIdx}

                                      className="flex gap-3 text-sm pb-3 border-b last:border-0 last:pb-0"

                                    >

                                      <img

                                        src={item.product_data.image_url}

                                        alt={item.product_data.name}

                                        className="w-14 h-14 rounded object-cover"

                                      />

                                      <div className="flex-1 min-w-0">

                                        <div className="font-medium line-clamp-1">

                                          {item.product_data.name}

                                        </div>

                                        <div className="text-gray-500 text-sm mt-0.5">

                                          {item.quantity} × {item.currency}{" "}

                                          {item.item_price}

                                        </div>

                                      </div>

                                    </div>

                                  ))}

                                  <div className="text-base font-medium pt-2">

                                    Total: {cartItems?.[0].currency}

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



            {/* Modal for attaching files */}

            <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>

              <DialogContent className="sm:max-w-lg">

                <DialogHeader>

                  <DialogTitle>Upload Media</DialogTitle>

                  <DialogDescription>

                    Upload an image or video file

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

                      progress={uploadProgress}

                      onCancel={() => {

                        setSelectedFile(null);

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

                    onClick={() => setIsFileModalOpen(false)}

                    disabled={uploading}

                  >

                    Cancel

                  </Button>

                  <Button

                    type="button"

                    disabled={!selectedFile || uploading}

                    onClick={() =>

                      handleFileUpload(selectedFile, selectedConversationId)

                    }

                  >

                    {uploading ? (

                      <>

                        <Loader2 className="h-4 w-4 animate-spin mr-2" />

                        Sending...

                      </>

                    ) : (

                      "Send"

                    )}

                  </Button>

                </div>

              </DialogContent>

            </Dialog>



            <ScrollArea

              ref={scrollAreaRef}

              className="flex-1 h-full pl-5 pr-4 py-0"

            >

              <div className="space-y-3">

                {messages.map((message, index) => {



                  if (message.role === "system") {

    return (

      <div key={message.id} className="flex justify-center my-4">

        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-full">

          <span className="font-medium">{message.content}</span>

          <span className="ml-2 text-gray-400">

            {formatMessageTime(message.timestamp)}

          </span>

        </div>

      </div>

    );

  }



                  const productInfo = message.content

                    ? extractProductInfo(message.content)

                    : null;

                  const botProductInfo = message.content

                    ? extractBotProductInfo(message.content)

                    : null;

                  const addressData = message.content

                    ? extractAddressData(message.content)

                    : null;

                  const agentProductInfo = message.content

                    ? extractAgentProductInfo(message.content)

                    : null;



                  return (

                    <div key={message.id}>

      {productInfo && message.role === "customer" && (

        <div className="flex flex-col w-fit mb-4">

          {productInfo.map(

            (product: ProductInfo, idx: number) => (

              <a

                key={idx}

                href={product.link}

                target="_blank"

                rel="noopener noreferrer"

                className="flex items-center space-x-4 p-3 rounded-lg border hover:shadow-md transition-shadow"

              >

                <img

                  src={product.image_url}

                  alt={product.name}

                  className="w-16 h-16 object-cover rounded"

                />

                <div className="flex-1 min-w-0">

                  <h3 className="text-sm font-medium line-clamp-2">

                    {product.name}

                  </h3>

                  <div className="flex items-center space-x-2 mt-1">

                    <span className="text-black font-semibold">

                      {product.sale_price}

                    </span>

                    {!product.sale_price && (

                      <>

                        <span className="text-black font-semibold">

                          {product.price}

                        </span>

                      </>

                    )}

                    {product.sale_price && (

                      <span className="text-gray-500 line-through text-sm">

                        {product.price}

                      </span>

                    )}

                  </div>

                </div>

              </a>

            )

          )}

        </div>

      )}

      

                      <div

                        className={`flex ${

                          message.role === "customer"

                            ? "justify-start"

                            : "justify-end"

                        }`}

                      >

                        <div

                          className={`max-w-[75%] flex flex-col ${

                            message.role === "customer"

                              ? "items-start"

                              : "items-end"

                          }`}

                        >

                          {botProductInfo && message.role === "ai" && (

                            <img

                              className="w-80 rounded-lg border mb-2"

                              src={botProductInfo[0].image_url}

                            />

                          )}

                          {agentProductInfo && message.role === "ai" && (

                            <img

                              className="w-80 rounded-lg border mb-2"

                              src={agentProductInfo[0].image_url}

                            />

                          )}



                          {/* Message Bubble Container */}

                          <div

                            className={`rounded-2xl p-2 w-full ${

                              message.role === "customer"

                                ? "bg-gray-100 rounded-tl-sm text-black"

                                : "bg-blue-500 text-white"

                            } ${

                              (extractCartData(message.content) &&

                                message.role === "customer") ||

                              (addressData && message.role === "customer") ||

                              message.fileUrl

                                ? "bg-transparent"

                                : ""

                            }`}

                            style={{ wordBreak: "break-word" }}

                          >

                            {message.content &&

                              extractCartData(message.content) &&

                              message.role === "customer" && (

                                <CartMessage

                                  items={extractCartData(message.content) ?? []}

                                />

                              )}



                            {addressData && message.role === "customer" && (

                              <AddressMessage data={addressData} />

                            )}



                            {/* Message content */}

                            {message.type === "image" && message.fileUrl && (

                              <img

                                src={message.fileUrl}

                                alt="Shared image"

                                className="rounded-lg mb-2 border shadow-sm max-w-full"

                              />

                            )}

                            {message.type === "video" && message.fileUrl && (

                              <video

                                src={message.fileUrl}

                                className="rounded-lg mb-2 border shadow-sm max-w-full"

                                controls

                              />

                            )}

                            {message.type === "voice" && message.fileUrl && (

                              <audio

                                controls

                                src={message.fileUrl}

                                className="w-full"

                              />

                            )}



                            {/* Text content with guaranteed wrapping */}

                            <div className="whitespace-normal break-words">

                              {(message.type === "text" || !message.type) &&

                                !productInfo &&

                                !agentProductInfo &&

                                !botProductInfo &&

                                !extractCartData(message.content) &&

                                !checkAIMessage(message) &&

                                !addressData && <p>{message.content}</p>}

                              {(message.type === "text" || !message.type) &&

                                message.role === "ai" &&

                                checkAIMessage(message) && (

                                  <p>{checkAIMessage(message)}</p>

                                )}

                              {(message.type === "text" || !message.type) &&

                                productInfo &&

                                message.role === "customer" && (

                                  <p>Know more.</p>

                                )}

                              {(message.type === "text" || !message.type) &&

                                botProductInfo &&

                                message.role === "ai" && (

                                  <div>

                                    <b>{botProductInfo[0].name}</b>

                                    <br />

                                    <br />

                                    <span className="text-white font-semibold">

                                      {botProductInfo[0].sale_price}

                                    </span>

                                    {!botProductInfo[0].sale_price && (

                                      <>

                                        <span className="text-white font-semibold">

                                          {botProductInfo[0].price}

                                        </span>

                                        <br />

                                        <br />

                                      </>

                                    )}

                                    {botProductInfo[0].sale_price && (

                                      <>

                                        <span className="text-gray-200 line-through text-sm ml-2">

                                          {botProductInfo[0].price}

                                        </span>

                                        <br />

                                        <br />

                                      </>

                                    )}

                                    🎉<b>Key Highlights:</b>

                                    <br />

                                    - EMI Available! ✅<br />

                                    - Get GST invoice and save up to 28% on

                                    business purchases

                                    <br />

                                    - Free Shipping all over India 🚚

                                    <br />

                                    <br />

                                    <span className="text-gray-200 text-sm">

                                      <i>

                                        To contact us, simply type Live Agent

                                      </i>

                                    </span>

                                  </div>

                                )}

                              {(message.type === "text" || !message.type) &&

                                agentProductInfo &&

                                message.role === "ai" && (

                                  <div>

                                    <b>{agentProductInfo[0].name}</b>

                                    <br />

                                    <br />

                                    <span className="text-white font-semibold">

                                      {agentProductInfo[0].sale_price}

                                    </span>

                                    {!agentProductInfo[0].sale_price && (

                                      <>

                                        <span className="text-white font-semibold">

                                          {agentProductInfo[0].price}

                                        </span>

                                        <br />

                                        <br />

                                      </>

                                    )}

                                    {agentProductInfo[0].sale_price && (

                                      <>

                                        <span className="text-gray-200 line-through text-sm ml-2">

                                          {agentProductInfo[0].price}

                                        </span>

                                        <br />

                                        <br />

                                      </>

                                    )}

                                    {extractAgentProductText(

                                      message.content

                                    ) && (

                                      <span className="block mb-2">

                                        {extractAgentProductText(

                                          message.content

                                        )}

                                      </span>

                                    )}

                                  </div>

                                )}

                            </div>



                            {/* Timestamp */}

                            <div className="flex justify-end mt-2">

                              <span

                                className={`text-xs ${

                                  message.role === "customer"

                                    ? "text-gray-500"

                                    : "text-blue-100"

                                } ${message.fileUrl ? "!text-gray-800" : ""}`}

                              >

                                {formatMessageTime(message.timestamp)}

                              </span>

                            </div>

                          </div>



                          {/* Product data */}

                          {message.product_data && (

                            <div className="w-full bg-white mt-4">

                              <div className="relative overflow-x-auto">

                                <div className="flex gap-4 snap-x snap-mandatory product-scroll overflow-x-auto py-4 px-2">

                                  {message.product_data.map((product) => (

                                    <a

                                      href={product.permalink}

                                      target="_blank"

                                      rel="noopener noreferrer"

                                      key={product.id}

                                      className="snap-start flex-none w-[280px] border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"

                                    >

                                      <div className="relative">

                                        <img

                                          src={product.image_link}

                                          alt={product.name}

                                          className="w-full h-48 object-cover"

                                        />

                                        {product.on_sale === "True" && (

                                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">

                                            Sale

                                          </span>

                                        )}

                                      </div>

                                      <div className="p-4">

                                        <h3 className="font-medium text-black text-sm line-clamp-2 mb-2">

                                          {product.name}

                                        </h3>

                                        <div className="flex items-baseline gap-2">

                                          <span className="text-lg text-black font-bold">

                                            ₹

                                            {product.price.toLocaleString(

                                              "en-IN"

                                            )}

                                          </span>

                                          {product.on_sale === "True" && (

                                            <span className="text-sm text-gray-500 line-through">

                                              ₹

                                              {parseInt(

                                                product.regular_price

                                              ).toLocaleString("en-IN")}

                                            </span>

                                          )}

                                        </div>

                                      </div>

                                    </a>

                                  ))}

                                </div>

                              </div>

                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  );

                })}

                <div ref={lastMessageRef} />

              </div>

            </ScrollArea>



            <div className={` p-5 border-t `}>

              {/* <div className="flex gap-2 mb-4 overflow-x-auto">

            {suggestedResponses.map((response, index) => (

              <Button

                key={index}

                variant="secondary"

                className="whitespace-nowrap"

                size="sm"

              >

                {response}

              </Button>

            ))}

          </div> */}



              {sharedProduct && (

                <div className="flex justify-start ml-36 mr-12">

                  <SharedProductPreview

                    product={sharedProduct}

                    onRemove={onClearSharedProduct}

                  />

                </div>

              )}



              {/* <div className="w-full p-4 bg-white border-t border-gray-100 rounded-t-lg shadow-[0_-4px_12px_rgba(0,0,0,0.02)]"> */}

              {/* Compact Mode Toggle */}



              {/* Professional Input Area */}

              <div className="w-full p-3 bg-white border-t border-gray-100 rounded-t-lg shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">

                <div className="relative w-full">

                  {audioURL ? (

                    <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">

                      <audio controls src={audioURL} className="flex-1" />

                      <button

                        className="p-1.5 rounded-lg hover:bg-gray-100"

                        onClick={() => setAudioURL(null)}

                      >

                        <X className="h-4 w-4 text-gray-500" />

                      </button>

                    </div>

                  ) : (

                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-gray-300 flex flex-col">

                      {/* Reply/Private buttons inside the text box */}

                      <div className="mb-3 w-36 bg-gray-100 rounded-full p-1 flex items-center shadow-inner">

                        <button

                          className={`flex-1 text-sm px-4 py-1.5 rounded-full transition-all duration-300 ${

                            mode === "reply"

                              ? "bg-blue-600 text-white font-semibold shadow-md"

                              : "text-gray-600 hover:text-blue-600"

                          }`}

                          onClick={() => setMode("reply")}

                        >

                          Reply

                        </button>

                        <button

                          className={`flex-1 text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${

                            mode === "private"

                              ? "bg-purple-600 text-white font-semibold shadow-md"

                              : "text-gray-600 hover:text-purple-600"

                          }`}

                          onClick={() => setMode("private")}

                        >

                          Private

                        </button>

                      </div>



                      {/* Textarea below the buttons */}

                      <div className="flex-1">

                        <textarea

                          ref={textareaRef}

                          value={message}

                          onChange={(e) => setMessage(e.target.value)}

                          onKeyDown={handleKeyDown}

                          placeholder={

                            mode === "reply"

                              ? sharedProduct

                                ? "Add a message about this product..."

                                : "Shift+Enter for new line • Type / for canned responses"

                              : "Add a private note (only visible to agents)"

                          }

                          rows={1}

                          className="w-full bg-transparent border-none outline-none focus:outline-none resize-none max-h-40 overflow-y-auto text-gray-800 placeholder-gray-400 text-sm"

                        />



                        {/* Hint text below textarea */}

                        {/* <div className="flex justify-between mt-[-11]">

            <p className="text-xs text-gray-500">

              {mode === "private"

                ? "Shift+Enter for new line • Visible only to agents"

                : "Shift+Enter for new line • Type / for canned responses"}

            </p>

          </div> */}

                      </div>



                      {/* Action buttons at the bottom */}

                      <div className="flex justify-between items-center mt-3">

                        <div className="flex gap-1.5">

                          <Popover>

                            <PopoverTrigger asChild>

                              <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">

                                <Smile className="h-4 w-4 text-gray-500" />

                              </button>

                            </PopoverTrigger>

                            <PopoverContent

                              className="w-80 p-0 rounded-xl shadow-lg"

                              side="top"

                              align="start"

                            >

                              <Picker

                                onEmojiClick={(emojiData) =>

                                  setMessage((prev) => prev + emojiData.emoji)

                                }

                                width="100%"

                                height={350}

                                previewConfig={{ showPreview: false }}

                                searchPlaceholder="Search emoji..."

                                lazyLoadEmojis={true}

                                skinTonesDisabled

                              />

                            </PopoverContent>

                          </Popover>



                          <Tooltip>

                            <TooltipTrigger asChild>

                              <button

                                className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"

                                onClick={() => setIsFileModalOpen(true)}

                              >

                                <Paperclip className="h-4 w-4 text-gray-500" />

                              </button>

                            </TooltipTrigger>

                            <TooltipContent className="text-xs py-1 px-2 bg-gray-800 text-white">

                              Attach file

                            </TooltipContent>

                          </Tooltip>



                          <Tooltip>

                            <TooltipTrigger asChild>

                              <button

                                className={`p-2 rounded-lg transition-colors ${

                                  isRecording

                                    ? "bg-red-50 hover:bg-red-100 text-red-500"

                                    : "bg-gray-50 hover:bg-gray-100 text-gray-500"

                                }`}

                                onClick={

                                  isRecording ? stopRecording : startRecording

                                }

                              >

                                <Mic className="h-4 w-4" />

                              </button>

                            </TooltipTrigger>

                            <TooltipContent className="text-xs py-1 px-2 bg-gray-800 text-white">

                              {isRecording

                                ? "Stop recording"

                                : "Record voice message"}

                            </TooltipContent>

                          </Tooltip>

                        </div>



                        {/* Professional Send Button */}

                        {/* word count - keep inline next to send button */}
                        <div className="flex items-center gap-3 ml-auto mr-2">
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {message.length}/1000
                          </div>
                        </div>



                        <button

                          className={`p-2.5 rounded-lg flex items-center justify-center transition-colors duration-200 ${

                            message.trim() || audioURL || sharedProduct

                              ? mode === "reply"

                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"

                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"

                              : "bg-gray-100 text-gray-400 cursor-not-allowed"

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

                              <span className="ml-1.5 text-xs font-medium">

                                {mode === "reply" ? "Send" : "Add Note"}

                              </span>

                            </>

                          )}

                        </button>

                      </div>

                    </div>

                  )}



                  {/* Canned responses dropdown */}

                  {showCannedResponses && (

                    <div className="absolute bottom-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mb-2 max-h-60 overflow-y-auto z-10">

                      <div className="p-2 border-b border-gray-100">

                        <input

                          type="text"

                          placeholder="Search canned responses..."

                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-200"

                          onChange={(e) => {

                            // Add filtering logic here

                          }}

                        />

                      </div>

                      <div className="max-h-52 overflow-y-auto">

                        {filteredResponses.map((response) => (

                          <div

                            key={response.id}

                            onClick={() => {

                              setMessage(response.message);

                              setShowCannedResponses(false);

                            }}

                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"

                          >

                            <div className="flex items-start justify-between">

                              <div>

                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">

                                  /{response.shortcode}

                                </span>

                                <p className="text-gray-700 text-sm mt-1.5 line-clamp-2">

                                  {response.message}

                                </p>

                              </div>

                              <span className="text-xs text-gray-400 whitespace-nowrap">

                                {format(parseISO(response.created_at), "MMM d")}

                              </span>

                            </div>

                          </div>

                        ))}

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>



            <ReminderDialog

              open={showReminder}

              onOpenChange={setShowReminder}

              onSave={async (reminder) => {

                console.log("Reminder saved:", reminder);

                setShowReminder(false);

                // Refresh reminders after creating new one

                refetchReminders();

              }}

              conversationId={selectedConversationId}

            />

          </Card>

        )}

      </TooltipProvider>

    </>

  );

};



const formatMessageTime = (timestamp: string): string => {

  try {

    // Parse the UTC timestamp

    const date = parseISO(timestamp);



    // Convert to IST (UTC+5:30)

    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);



    // Format to 12-hour time with lowercase am/pm

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

