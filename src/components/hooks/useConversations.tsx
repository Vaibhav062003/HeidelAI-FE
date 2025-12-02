"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';

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

const WS_BASE_URL = 'wss://egenie-whatsapp.koyeb.app';
const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;

function normalizeConversation(conv: any): Conversation {
  return {
    conversation_id : conv.id || conv.conversation_id || '',
    id: conv.id || conv.conversation_id || '',
    platform: conv.platform,
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

// Helper to generate ID (moved outside component to avoid recreation)
const generateAndStoreClientId = (): string => {
  if (typeof window === 'undefined') return '';
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
};

// Helper to get token
const fetchSessionToken = async () => {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) throw new Error("Session ID not found in localStorage");
  
  const res = await fetch("api/session-token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId })
  });
  const { token } = await res.json();
  return token;
};

export const useConversations = (status?: "open" | "closed") => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refs to hold active WebSocket connections
  const wsInstagramRef = useRef<WebSocket | null>(null);
  const wsWhatsappRef = useRef<WebSocket | null>(null);
  // Ref to prevent double-connection logic in Strict Mode
  const isConnectingRef = useRef(false);

  // 1. Initial Data Fetching
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const allres = await conversationService.getConversationByStatus(status);
      if (allres.status === "success" && Array.isArray(allres.data)) {
        setConversations(allres.data.map((conv: any) => normalizeConversation({ ...conv })));
      }
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Single conversation fetcher (used when new message arrives for unknown conv)
  const fetchSingleConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await conversationService.getConversation(conversationId);
      if (response.status === "success" && response.data) {
        setConversations(prev => {
          const exists = prev.some(conv => conv.conversation_id === conversationId);
          if (exists) return prev;
          return [normalizeConversation(response.data), ...prev]; // Add to top
        });
      }
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
    }
  }, []);

  // 2. WebSocket Message Handler
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      // console.log("WS Message:", data.type); 

      const ensureValidConversation = (conv: any): Conversation => normalizeConversation(conv);

      if (data.type === 'new_conversation' && data.conversation) {
        setConversations(prev => {
          const exists = prev.some(conv => conv.conversation_id === data.conversation.conversation_id);
          if (exists) return prev;
          return [ensureValidConversation(data.conversation), ...prev];
        });
      } 
      else if (data.type === 'conversation_updated' && data.conversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv.conversation_id === data.conversation.conversation_id ? ensureValidConversation(data.conversation) : conv
          )
        );
      } 
      else if (
        ['new_message', 'new_whatsapp_message', 'instagram_message', 'new_instagram_message'].includes(data.type) 
        && data.message
      ) {
        const conversationId = data.message.conversation_id;
        const messageContent = data.message.content || '';
        const messageTimestamp = data.message.timestamp || new Date().toISOString();

        setConversations(prev => {
          const conversationExists = prev.some(conv => conv.conversation_id === conversationId);

          if (!conversationExists) {
            fetchSingleConversation(conversationId);
            return prev;
          }

          // Move updated conversation to top and update data
          return prev.map(conv => {
            if (conv.conversation_id === conversationId) {
              return {
                ...conv,
                last_message: messageContent,
                timestamp: messageTimestamp,
                unread_count: (conv.unread_count || 0) + 1
              };
            }
            return conv;
          }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }, [fetchSingleConversation]);

  // 3. Effect: Initial Fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // 4. Effect: WebSocket Connection & Cleanup
  useEffect(() => {
    // Flag to cancel connection logic if component unmounts mid-async-setup
    let isMounted = true; 

    const connectWebSockets = async () => {
      // Prevent multiple connection attempts
      if (isConnectingRef.current) return;
      isConnectingRef.current = true;

      const clientId = generateAndStoreClientId();
      const sessionId = localStorage.getItem('sessionId');
      
      if (!sessionId) {
        console.log("No session ID, skipping WS");
        isConnectingRef.current = false;
        return;
      }

      try {
        const token = await fetchSessionToken();
        
        if (!isMounted) return; // Stop if component unmounted

        // --- INSTAGRAM CONNECT ---
        if (!wsInstagramRef.current || wsInstagramRef.current.readyState === WebSocket.CLOSED) {
          const igUrl = `${WS_INSTAGRAM_ENDPOINT}/${clientId}`;
          const wsIg = new WebSocket(igUrl, [token]);
          
          wsIg.onopen = () => console.log("IG WS Connected");
          wsIg.onmessage = handleWebSocketMessage; // Attach handler
          wsIg.onerror = (e) => console.error("IG WS Error", e);
          
          wsInstagramRef.current = wsIg;
        }

        // --- WHATSAPP CONNECT ---
        const whatsappId = localStorage.getItem("whatsapp_user_id");
        if (whatsappId && (!wsWhatsappRef.current || wsWhatsappRef.current.readyState === WebSocket.CLOSED)) {
           const waUrl = `${WS_WHATSAPP_ENDPOINT}/${clientId}/${whatsappId}`;
           const wsWa = new WebSocket(waUrl, [token]);

           wsWa.onopen = () => console.log("WA WS Connected");
           wsWa.onmessage = handleWebSocketMessage; // Attach handler
           wsWa.onerror = (e) => console.error("WA WS Error", e);

           wsWhatsappRef.current = wsWa;
        }

      } catch (err) {
        console.error("WS Setup Failed", err);
      } finally {
        if (isMounted) isConnectingRef.current = false;
      }
    };

    connectWebSockets();

    // CLEANUP FUNCTION: Strictly required to close connections on unmount
    return () => {
      isMounted = false;
      
      if (wsInstagramRef.current) {
        console.log("Closing IG WS");
        wsInstagramRef.current.close();
        wsInstagramRef.current = null;
      }
      
      if (wsWhatsappRef.current) {
        console.log("Closing WA WS");
        wsWhatsappRef.current.close();
        wsWhatsappRef.current = null;
      }
      
      isConnectingRef.current = false;
    };
  }, [handleWebSocketMessage]); // Re-run only if handler changes (it shouldn't due to useCallback)

  return { conversations, loading, error };
};