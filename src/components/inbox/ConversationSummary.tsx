import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Tag, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import api from "@/lib/session_api";

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/cs';


interface ConversationSummaryProps {
  selectedConversationId?: string;
}


interface ConversationData {
  id: string;
  customer_name: string;
  priority: "low" | "medium" | "high";
  query: string;
  summary: string[];
  sentiment: "positive" | "neutral" | "negative";
  suggestions: string[];
  timestamp: string;
}


const LoadingState = () => (
  <Card className="p-4 bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <Image height={30} width={30} src='/icons/summary_icon.png' alt="summary_icon"/>
          <h3 className="font-bold">Conversation Summary</h3>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>


        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>


        <div>
        <h4 className="text-base font-medium mb-2">Summary Points</h4>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>


        <div>
        <h4 className="text-base font-medium mb-2">AI suggestions</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>


        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </Card>
);


const ConversationSummary = ({ selectedConversationId }: ConversationSummaryProps) => {


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [retries, setRetries] = useState(0);


  const maxRetries = 5;
  const retryDelay = 3000;


  // Updated fetch function with new endpoint
const fetchConversation = async (conversationId: string) => {
  if (!conversationId) return;
  
  setLoading(true);
  setError(null);
  
  try {
    
    const response = await api.get(`/ai/chat-analysis/${conversationId}`);
    
    console.log('✅ API Response:', response.data);
    console.log('📊 Response status:', response.status);
    
    setConversation(response.data);
  } catch (err: any) {
    console.error('❌ Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      fullError: err
    });
    
    setError(err instanceof Error ? new Error(err.message) : new Error('Failed to load conversation'));
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (!selectedConversationId) return;


    fetchConversation(selectedConversationId);


    const connectWebSocket = () => {
      const wsConnection = new WebSocket(`${WS_URL}/client-${Date.now()}`);
      
      wsConnection.onopen = () => {
        setError(null);
        setRetries(0);
      };
      
      wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (
          data.type === 'summary_updated' && 
          data.conversation_id === selectedConversationId
        ) {
          fetchConversation(selectedConversationId);
        }
      };


      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(new Error('WebSocket connection failed'));
        if (retries < maxRetries) {
          setRetries(prevRetries => prevRetries + 1);
          setTimeout(() => {
            connectWebSocket();
          }, retryDelay);
        } else {
          setError(new Error('WebSocket connection failed after multiple retries'));
        }
      };


      wsConnection.onclose = () => {
        if (retries < maxRetries) {
          setRetries(prevRetries => prevRetries + 1);
          setTimeout(() => {
            connectWebSocket();
          }, retryDelay);
        } else {
          setError(new Error('WebSocket connection closed after multiple retries'));
        }
      };


      setWs(wsConnection);
    };


    connectWebSocket();
    
    // ✅ ADDED: Cleanup WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [selectedConversationId]);


  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-600";
      case "negative":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };


  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };


  if (loading) {
    return <LoadingState />;
  }


  if (error) {
    return (
      <Card className="p-4 bg-white">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">Failed to load conversation summary</p>
        </div>
      </Card>
    );
  }


  if(!conversation?.summary) return(
    <Card className="p-4 bg-white">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">Failed to load conversation summary</p>
        </div>
      </Card>
  );


  if (!conversation) return null;


  return (
    <Card className="p-4 bg-white h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <Image height={30} width={30} src='/icons/summary_icon.png' alt="summary_icon"/>
            <h3 className="font-semibold">Conversation Summary</h3>
          </div>
          <Badge
            variant="secondary"
            className={getSentimentColor(conversation.sentiment)}
          >
            {conversation.sentiment.charAt(0).toUpperCase() + conversation.sentiment.slice(1)}
          </Badge>
        </div>


        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getUrgencyColor(conversation.priority)}>
            {conversation.priority.toUpperCase()} Priority
          </Badge>
          <Badge variant="outline">{conversation.query}</Badge>
        </div>


        <div>
          <h4 className="text-base font-medium mb-2">Summary Points</h4>
          <ul className="space-y-1">
            {conversation.summary.map((point, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {point}
              </li>
            ))}
          </ul>
        </div>


        <div>
          <h4 className="text-base font-medium mb-2">AI Suggestions</h4>
          <ul className="space-y-1">
            {conversation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};


export default ConversationSummary;
