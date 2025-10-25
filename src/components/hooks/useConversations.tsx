'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 min
const STORAGE_KEY = 'conversation_cache_v2';
const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

<<<<<<< ours
const WS_BASE_URL = 'wss://heidelai-backend2.koyeb.app';
=======
// <<<<<<< HEAD
// // const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws';
// // const WS_BASE_URL = `ws://127.0.0.1:8000`;
// // const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
// // const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;
// =======
// >>>>>>> 46af3aa4b10e3dc3eb7d0949fafa717556636c2d

// WebSocket base URLs
const WS_BASE_URL = 'wss://egenie-whatsapp.koyeb.app';
const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
>>>>>>> theirs
const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;

function normalizeConversation(conv: any): Conversation {
  return {
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
    avatar_url: conv.avatar_url || '',
  };
}

interface ConversationCache {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  lastFetched: number;
  isStale: boolean;
}
interface ConversationContextType extends ConversationCache {
  refetch: () => Promise<void>;
  clearCache: () => void;
  retry: () => Promise<void>;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addConversation: (conversation: Conversation) => void;
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;

}
const ConversationContext = createContext<ConversationContextType | null>(null);

const generateAndStoreClientId = (): string => {
  let clientId = localStorage.getItem('client_id');
  if (!clientId) {
    clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('client_id', clientId);
  }
  return clientId;
};

async function getSessionToken() {
  const sessionId = localStorage.getItem('sessionId');
  if (!sessionId) throw new Error("Session ID not found in localStorage");
  const res = await fetch("api/session-token", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({sessionId})
  });
  const { token: sessionToken } = await res.json();
  return sessionToken;
}

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<ConversationCache>({
    conversations: [],
    loading: false,
    error: null,
    lastFetched: 0,
    isStale: false,
  });
  const [retryCount, setRetryCount] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isConnectingRef = useRef(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!hasInitialized) {
      loadFromCache();
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Save to localStorage on update
  useEffect(() => {
    if (cache.conversations.length > 0 && !cache.error && cache.lastFetched > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        conversations: cache.conversations,
        lastFetched: cache.lastFetched,
      }));
    }
  }, [cache.conversations, cache.lastFetched, cache.error]);

<<<<<<< ours
  // Setup WebSocket when loaded
  useEffect(() => {
    if (cache.conversations.length > 0) setupWebSocket();
    return () => cleanup();
  }, [cache.conversations.length > 0]);

  // load from cache
  function loadFromCache() {
    const savedCache = localStorage.getItem(STORAGE_KEY);
    if (savedCache) {
      try {
        const parsedCache = JSON.parse(savedCache);
        const now = Date.now();
        const isStale = now - parsedCache.lastFetched > CACHE_DURATION;
        if (parsedCache.conversations && parsedCache.conversations.length > 0) {
          setCache(prev => ({
            ...prev,
            conversations: parsedCache.conversations,
            lastFetched: parsedCache.lastFetched,
            isStale,
            loading: false,
          }));
          if (isStale) setTimeout(() => fetchConversations(false), 100);
          return;
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    fetchConversations(true);
  }

  // fetch all
  const fetchConversations = useCallback(async (showLoading = true) => {
    if (showLoading && cache.conversations.length === 0) setCache(prev => ({ ...prev, loading: true, error: null }));
    else setCache(prev => ({ ...prev, error: null }));
    try {
      let allConversations: Conversation[] = [];
      const allres = await conversationService.getAllConversations();
      if (allres.status === "success" && Array.isArray(allres.data)) {
        allConversations = allres.data.map((conv: any) => normalizeConversation(conv));
=======
export const useConversations = (status?: "open" | "closed") => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // console.log("status in useConv::::", status)

  // console.log("con::::", conversations)
  // Fetch conversations from both platforms
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      let allConversations: Conversation[] = [];
      //all conversations
      try{
        const allres = await conversationService.getConversationByStatus(status);
        // Example: in useConversations or API service
        // console.log("Fetching conversations with status:", status);
        if (allres.status === "success" && Array.isArray(allres.data)) {
          allConversations = [
            ...allConversations,
            ...allres.data.map((conv: any) => normalizeConversation({ ...conv }))
          ];
        }
>>>>>>> theirs
      }
      setCache({
        conversations: allConversations,
        loading: false,
        error: null,
        lastFetched: Date.now(),
        isStale: false,
      });
      setRetryCount(0);
    } catch (error) {
      setCache(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
        isStale: true,
      }));
      if (retryCount < MAX_RETRIES && cache.conversations.length === 0) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchConversations(false);
        }, delay);
      }
    }
<<<<<<< ours
  }, [cache.conversations.length, retryCount]);

  // single fetch
  const fetchSingleConversation = useCallback(async (conversationId: string) => {
    try {
      const response = await conversationService.getConversation(conversationId);
      if (response.status === "success" && response.data) {
        setCache(prev => {
          const exists = prev.conversations.some(conv => conv.id === conversationId);
          if (exists) return prev;
          return {
            ...prev,
            conversations: [...prev.conversations, normalizeConversation(response.data)]
          };
        });
      }
    } catch (error){ }
  }, []);
=======
  }, [status]);
>>>>>>> theirs

// web socket
  const setupWebSocket = useCallback(async () => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) return;
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;
    isConnectingRef.current = true;
    try {
      const sessionToken = await getSessionToken();
      const clientId = generateAndStoreClientId();
      const wsUrl = `${WS_INSTAGRAM_ENDPOINT}/${clientId}`;
      const ws = new WebSocket(wsUrl, [sessionToken]);
      wsRef.current = ws;
      ws.onopen = () => { isConnectingRef.current = false; };
      ws.onmessage = handleWebSocketMessage;
      ws.onerror = () => { isConnectingRef.current = false; };
      ws.onclose = (event) => {
        isConnectingRef.current = false;
        if (event.code !== 1000 && cache.conversations.length > 0) {
          reconnectTimeoutRef.current = setTimeout(setupWebSocket, RETRY_DELAY);
        }
      }
    } catch {
      isConnectingRef.current = false;
    }
  }, [cache.conversations.length]);

  // WS MESSAGE HANDLER
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const ensureValidConversation = (conv: any): Conversation => normalizeConversation(conv);
      if (data.type === 'new_conversation' && data.conversation) {
        setCache(prev => {
          const exists = prev.conversations.some(conv => conv.id === data.conversation.id);
          if (exists) return prev;
          return {
            ...prev,
            conversations: [...prev.conversations, ensureValidConversation(data.conversation)]
          }
        });
      } 
      else if (data.type === 'conversation_updated' && data.conversation) {
        setCache(prev => ({
          ...prev,
          conversations: prev.conversations.map(conv => 
            conv.id === data.conversation.id ? ensureValidConversation(data.conversation) : conv
          )
        }));
      } 
      else if (
        ['new_message', 'new_whatsapp_message', 'instagram_message', 'new_instagram_message'].includes(data.type)
        && data.message
      ) {
        const conversationId = data.message.conversation_id;
        const messageContent = data.message.content || '';
        const messageTimestamp = data.message.timestamp || new Date().toISOString();
        setCache(prev => {
          const conversationExists = prev.conversations.some(conv => conv.id === conversationId);
          if (!conversationExists) { fetchSingleConversation(conversationId); return prev; }
          return {
            ...prev,
            conversations: prev.conversations.map(conv =>
              conv.id === conversationId
                ? { ...conv, last_message: messageContent, timestamp: messageTimestamp, unread_count: (conv.unread_count || 0) + 1 }
                : conv
            )
          };
        });
<<<<<<< ours
=======
      } else if (data.type === 'typing_indicator') {
        console.log("Typing indicator received:", data);
      } else {
        // Log any other message types for debugging
        console.log("Unhandled WebSocket message type:", data.type, data);
>>>>>>> theirs
      }
    } catch {}
  }, []);

  const refetch = useCallback(() => fetchConversations(true), [fetchConversations]);
  const clearCache = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    cleanup();
    setCache({
      conversations: [],
      loading: false,
      error: null,
      lastFetched: 0,
      isStale: false,
    });
    setRetryCount(0);
    fetchConversations(true);
  }, []);
<<<<<<< ours
  const updateConversation = useCallback((id: string, updates: Partial<Conversation>) => {
    setCache(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv =>
        conv.id === id ? { ...conv, ...updates } : conv
      )
    }));
  }, []);
  const addConversation = useCallback((conversation: Conversation) => {
    setCache(prev => {
      const exists = prev.conversations.some(conv => conv.id === conversation.id);
      if (exists) return prev;
      return {
        ...prev,
        conversations: [...prev.conversations, conversation]
      }
    });
  }, []);
=======

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
  }, [handleWebSocketMessage, fetchConversations]);

  return { conversations, loading, error };
};
>>>>>>> theirs

  function cleanup() {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (wsRef.current) wsRef.current.close(1000, 'Provider cleanup');
    isConnectingRef.current = false;
  }

const retry = useCallback(async () => {
  setRetryCount(0);
  await fetchConversations(true);
}, [fetchConversations]);


  return (
    <ConversationContext.Provider value={{
      ...cache,
      refetch,
      clearCache,
      retry,
      updateConversation,
      addConversation,
      currentConversation,
      setCurrentConversation,

    }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) throw new Error('useConversations must be used within ConversationProvider');
  return context;
}
