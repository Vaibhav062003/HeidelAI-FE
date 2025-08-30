"use cleint"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';
import { getSessionToken } from '../utils/clerkSession';

interface WebSocketMessage {
  type: string;
  platform?: string;
  conversation?: any;
  message?: {
    id: string;
    conversation_id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    timestamp: string;
    [key: string]: any;
  };
}

// const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws';
// const WS_BASE_URL = `${WS_PROTOCOL}://127.0.0.1:8000`;
// const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
// const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;

// WebSocket base URLs
const WS_BASE_URL = 'wss://egenie-whatsapp.koyeb.app';
const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

function normalizeConversation(conv: any): Conversation {
  return {
    id: conv.id || conv.conversation_id || '',
    platform: conv.platform || 'whatsapp',
    customer_id: conv.customer_id || '',
    customer_name: conv.customer_name || 'Unknown',
    last_message: conv.last_message || '',
    timestamp: conv.timestamp || conv.last_message_timestamp || new Date().toISOString(),
    unread_count: conv.unread_count || 0,
    is_ai_enabled: conv.is_ai_enabled ?? true,
    assigned_agent_id: conv.assigned_agent_id || null,
    priority: ['high', 'low'].includes(conv.priority) ? conv.priority : 'medium',
    sentiment: ['positive', 'negative'].includes(conv.sentiment) ? conv.sentiment : 'neutral',
    email: conv.email || '',
    billingAddress: conv.billingAddress || '',
    shippingAddress: conv.shippingAddress || '',
    gstin: conv.gstin || '',
    avatar_url: conv.avatar_url || ''
  };
}

// function useWebSocket(
//   url: string | null,
//   onMessage: (event: MessageEvent) => void,
//   enabled: boolean
// ) {
//   const wsRef = useRef<WebSocket | null>(null);
//   const [retries, setRetries] = useState(0);
//   const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
//   const isConnectingRef = useRef(false);

//   useEffect(() => {
//     if (!url || !enabled) return;

//     const connect = () => {
//       if (isConnectingRef.current) return;
//       isConnectingRef.current = true;

//       // Close existing connection if any
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         wsRef.current.close();
//       }

//       try {
//         const ws = new WebSocket(url);
//         wsRef.current = ws;

//         ws.onopen = () => {
//           setRetries(0);
//           isConnectingRef.current = false;
//           if (process.env.NODE_ENV === 'development') {
//             console.info('WebSocket connected:', url);
//           }
//         };

//         ws.onmessage = onMessage;

//         ws.onerror = (event) => {
//           isConnectingRef.current = false;
//           if (process.env.NODE_ENV === 'development') {
//             console.error('WebSocket error:', event, url);
//           }
//         };

//         ws.onclose = (event) => {
//           isConnectingRef.current = false;
//           if (process.env.NODE_ENV === 'development') {
//             console.warn('WebSocket closed:', event, url);
//           }
          
//           // Only attempt reconnection if not manually closed
//           if (event.code !== 1000 && retries < MAX_RETRIES) {
//             reconnectTimeoutRef.current = setTimeout(() => {
//               setRetries(r => r + 1);
//             }, RETRY_DELAY * Math.pow(2, retries)); // Exponential backoff
//           }
//         };
//       } catch (error) {
//         isConnectingRef.current = false;
//         if (process.env.NODE_ENV === 'development') {
//           console.error('WebSocket connection error:', error);
//         }
//       }
//     };

//     connect();

//     return () => {
//       if (reconnectTimeoutRef.current) {
//         clearTimeout(reconnectTimeoutRef.current);
//       }
//       if (wsRef.current) {
//         wsRef.current.close(1000, 'Component unmounting');
//       }
//       isConnectingRef.current = false;
//     };
//   }, [url, retries, enabled, onMessage]);

//   return wsRef.current;
// }

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch conversations from both platforms
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      let allConversations: Conversation[] = [];
      //all conversationa
      try{
        const allres = await conversationService.getAllConversations();
        if (allres.status === "success" && Array.isArray(allres.data)) {
          allConversations = [
            ...allConversations,
            ...allres.data.map((conv: any) => normalizeConversation({ ...conv, platform: 'whatsapp' }))
          ];
        }
      }
      catch (error){
         if (process.env.NODE_ENV === 'development') {
          console.error("All fetch error:", error);
        }
      }
      // Instagram
      // try {
      //   const igRes = await conversationService.getInstagramConversations();
      //   if (igRes.status === "success" && Array.isArray(igRes.data)) {
      //     allConversations = [
      //       ...allConversations,
      //       ...igRes.data.map((conv: any) => normalizeConversation({ ...conv, platform: 'instagram' }))
      //     ];
      //   }
      // } catch (igError) {
      //   if (process.env.NODE_ENV === 'development') {
      //     console.error("Instagram fetch error:", igError);
      //   }
      // }

      // // WhatsApp
      // try {
      //   const waRes = await conversationService.getWhatsAppConversations();
      //   if (waRes.status === "success" && Array.isArray(waRes.data)) {
      //     allConversations = [
      //       ...allConversations,
      //       ...waRes.data.map((conv: any) => normalizeConversation({ ...conv, platform: 'whatsapp' }))
      //     ];
      //   }
      // } catch (waError) {
      //   if (process.env.NODE_ENV === 'development') {
      //     console.error("WhatsApp fetch error:", waError);
      //   }
      // }

      setConversations(allConversations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      const ensureValidConversation = (conv: any): Conversation => ({
        id: conv.id || conv.conversation_id || '',
        platform: conv.platform || 'whatsapp',
        customer_id: conv.customer_id || '',
        customer_name: conv.customer_name || 'Unknown',
        last_message: conv.last_message || '',
        timestamp: conv.timestamp || conv.last_message_timestamp || new Date().toISOString(),
        unread_count: conv.unread_count || 0,
        is_ai_enabled: conv.is_ai_enabled ?? true,
        assigned_agent_id: conv.assigned_agent_id || null,
        priority: (conv.priority === 'high' || conv.priority === 'low') ? conv.priority : 'medium',
        sentiment: (conv.sentiment === 'positive' || conv.sentiment === 'negative') ? conv.sentiment : 'neutral',
        email: conv.email || '',
        billingAddress: conv.billingAddress || '',
        shippingAddress: conv.shippingAddress || '',
        gstin: conv.gstin || '',
        avatar_url: conv.avatar_url || ''
      });

      // Accept both WhatsApp and Instagram message types
      if (data.type === 'new_conversation' && data.conversation) {
        setConversations(prev => {
          const exists = prev.some(conv => conv.id === data.conversation.id);
          if (exists) return prev;
          return [...prev, ensureValidConversation(data.conversation)];
        });
      } 
      else if (data.type === 'conversation_updated' && data.conversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.conversation.id ? ensureValidConversation(data.conversation) : conv
          )
        );
      }
      // Accept Instagram messages as well
      else if (
        ['new_message', 'new_whatsapp_message', 'instagram_message', 'new_instagram_message'].includes(data.type)
        && data.message
      ) {
        const conversationId = data.message.conversation_id;
        const messageContent = data.message.content || '';
        const messageTimestamp = data.message.timestamp || new Date().toISOString();

        setConversations(prev => {
          const conversationExists = prev.some(conv => conv.id === conversationId);

          if (!conversationExists) {
            fetchSingleConversation(conversationId);
            return prev;
          }

          return prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                last_message: messageContent,
                timestamp: messageTimestamp,
                unread_count: (conv.unread_count || 0) + 1
              };
            }
            return conv;
          });
        });
      } else {
        // Log any other message types for debugging
        console.log("Unhandled WebSocket message type:", data.type, data);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, []);

  // Single conversation fetcher
  const fetchSingleConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await conversationService.getConversation(conversationId);
      if (response.status === "success" && response.data) {
        setConversations(prev => {
          const exists = prev.some(conv => conv.id === conversationId);
          if (exists) return prev;
          return [...prev, normalizeConversation(response.data)];
        });
      }
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
    }
  }, []);

  // Setup WebSockets
  useEffect(() => {
    // Connect to Instagram WebSocket
    const connectInstagramWebSocket = async() => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        console.log('No session ID found, skipping Instagram WebSocket connection');
        return;
      }
      const token = async()=>{
          const sessionId = localStorage.getItem("sessionId");
          if (!sessionId) throw new Error("Session ID not found in localStorage");
      
          const res = await fetch("api/session-token",{
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({sessionId})
          })
          const { token: sessionToken } = await res.json();
          return sessionToken
        }

      

      try {
        // Get or generate client ID
        const clientId = generateAndStoreClientId();
        
        // Create WebSocket connection with proper URL structure
        const wsUrl = `${WS_INSTAGRAM_ENDPOINT}/${clientId}`;
        console.log(`Connecting to Instagram WebSocket: ${wsUrl}`);

        const sessionToken = await token();
        console.log("token is passed")
        const ws = new WebSocket(wsUrl, [sessionToken]);

        ws.onopen = () => {
          console.log(`Instagram WebSocket connected from useConvversations hook`);
        };

        ws.onmessage = (event) => {
          console.log("message received:", event.data);
          handleWebSocketMessage(event);
        };

        ws.onerror = (error) => {
          console.error('Instagram WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('Instagram WebSocket closed');
        };
      } catch (error) {
        console.error('Error establishing Instagram WebSocket:', error);
      }
    };

    // Initial fetch of conversations
    fetchConversations();

    // Connect to WebSockets if appropriate IDs are available
    // connectWhatsAppWebSocket();
    connectInstagramWebSocket();
  }, [handleWebSocketMessage]);

  return { conversations, loading, error };
};

const getWsProtocol = () => {
  if (typeof window !== "undefined") {
    return window.location.protocol === "https:" ? "wss" : "ws";
  }
  return "wss"; // default for SSR
};

const generateAndStoreClientId = (): string => {
  // Check if client_id already exists in localStorage
  let clientId = localStorage.getItem('client_id');
  
  // If no client_id exists, generate a new one and store it
  if (!clientId) {
    // Generate a unique client ID with timestamp and random string
    clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('client_id', clientId);
  }
  
  return clientId;
};