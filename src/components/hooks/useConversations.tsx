/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
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

// WebSocket base URLs
const WS_BASE_URL = 'wss://egenie-whatsapp.koyeb.app';
const WS_WHATSAPP_ENDPOINT = `${WS_BASE_URL}/ws2/whatsapp`;
const WS_INSTAGRAM_ENDPOINT = `${WS_BASE_URL}/ws2/instagram`;

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [whatsappWs, setWhatsappWs] = useState<WebSocket | null>(null);
  const [instagramWs, setInstagramWs] = useState<WebSocket | null>(null);
  const [retries, setRetries] = useState({ whatsapp: 0, instagram: 0 });

  const maxRetries = 5;
  const retryDelay = 3000;

  // Function to fetch all conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      let allConversations: Conversation[] = [];
      
      // Check for Instagram connection
      const instagramId = localStorage.getItem('instagram_user_id');
      if (instagramId) {
        try {
          const instagramConversations = await conversationService.getInstagramConversations(instagramId);
          console.log("Instagram conversations:", instagramConversations);
          
          // Transform and add Instagram conversations
          if (Array.isArray(instagramConversations)) {
            const formattedIGConversations = instagramConversations.map(conv => ({
              ...conv,
              platform: 'instagram' // Ensure platform is set
            }));
            allConversations = [...allConversations, ...formattedIGConversations];
          }
        } catch (igError) {
          console.error("Error fetching Instagram conversations:", igError);
        }
      }
      
      // Check for WhatsApp connection
      const whatsappId = localStorage.getItem('whatsapp_user_id');
      if (whatsappId) {
        try {
          const whatsappConversations = await conversationService.getWhatsAppConversations(whatsappId);
          console.log("WhatsApp conversations:", whatsappConversations);
          
          // Transform and add WhatsApp conversations
          if (Array.isArray(whatsappConversations)) {
            const formattedWAConversations = whatsappConversations.map(conv => ({
              ...conv,
              platform: 'whatsapp' // Ensure platform is set
            }));
            allConversations = [...allConversations, ...formattedWAConversations];
          }
        } catch (waError) {
          console.error("Error fetching WhatsApp conversations:", waError);
        }
      }
      
      setConversations(allConversations);
      setError(null);
    } catch (err) {
      console.error("Error in useConversations:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);
    console.log("WebSocket message received:", data);
    
    // Helper function to ensure conversation objects match your required type
    const ensureValidConversation = (conv: any): Conversation => {
      // Only keep the necessary normalization to fix type issues
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
        priority: (conv.priority === 'high' || conv.priority === 'low') ? conv.priority : 'medium',
        sentiment: (conv.sentiment === 'positive' || conv.sentiment === 'negative') ? conv.sentiment : 'neutral',
        email: conv.email || '',
        billingAddress: conv.billingAddress || '',
        shippingAddress: conv.shippingAddress || '',
        gstin: conv.gstin || '',
        avatar_url: conv.avatar_url || ''
      };
    };
    
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
    // else if (['new_message', 'new_whatsapp_message'].includes(data.type) && data.message) {
    //   const conversationId = data.message.conversation_id;
    //   const messageContent = data.message.content || '';
    //   const messageTimestamp = data.message.timestamp || new Date().toISOString();
      
    //   setConversations(prev => {
    //     // Check if we have this conversation already
    //     const conversationExists = prev.some(conv => conv.id === conversationId);
        
    //     if (!conversationExists) {
    //       // Schedule a refetch if we don't have this conversation
    //       setTimeout(fetchConversations, 500);
    //       return prev;
    //     }
        
    //     // Update the existing conversation with the new message
    //     return prev.map(conv => {
    //       if (conv.id === conversationId) {
    //         return {
    //           ...conv,
    //           last_message: messageContent,
    //           timestamp: messageTimestamp,
    //           unread_count: (conv.unread_count || 0) + 1
    //         };
    //       }
    //       return conv;
    //     });
    //   });
    // }
  } catch (error) {
    console.error('Error handling WebSocket message:', error);
  }
}, []);

  // Setup WebSockets
  useEffect(() => {
    // Connect to WhatsApp WebSocket
    const connectWhatsAppWebSocket = () => {
      const whatsappId = localStorage.getItem('whatsapp_user_id');
      if (!whatsappId) {
        console.log('No WhatsApp ID found, skipping WhatsApp WebSocket connection');
        return;
      }

      try {
        // Generate a client ID for this connection
        const clientId = `client_${Math.random().toString(36).substring(2, 15)}`;
        
        // Create WebSocket connection with proper URL structure
        const wsUrl = `${WS_WHATSAPP_ENDPOINT}/${clientId}/${whatsappId}`;
        console.log(`Connecting to WhatsApp WebSocket: ${wsUrl}`);
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log(`WhatsApp WebSocket connected for user ID: ${whatsappId}`);
          setRetries(prev => ({ ...prev, whatsapp: 0 }));
        };
        
        ws.onmessage = handleWebSocketMessage;
        
        ws.onerror = (error) => {
          console.error('WhatsApp WebSocket error:', error);
          
          // Only retry if not at max retries
          if (retries.whatsapp < maxRetries) {
            setTimeout(() => {
              setRetries(prev => ({ ...prev, whatsapp: prev.whatsapp + 1 }));
            }, retryDelay);
          }
        };
        
        ws.onclose = () => {
          console.log('WhatsApp WebSocket closed');
          
          // Only retry if not at max retries
          if (retries.whatsapp < maxRetries) {
            setTimeout(() => {
              setRetries(prev => ({ ...prev, whatsapp: prev.whatsapp + 1 }));
            }, retryDelay);
          }
        };
        
        setWhatsappWs(ws);
      } catch (error) {
        console.error('Error establishing WhatsApp WebSocket:', error);
      }
    };
    
    // Connect to Instagram WebSocket
    const connectInstagramWebSocket = () => {
      const instagramId = localStorage.getItem('instagram_user_id');
      if (!instagramId) {
        console.log('No Instagram ID found, skipping Instagram WebSocket connection');
        return;
      }
      
      try {
        // Generate a client ID for this connection
        const clientId = `client_${Math.random().toString(36).substring(2, 15)}`;
        
        // Create WebSocket connection with proper URL structure
        const wsUrl = `${WS_INSTAGRAM_ENDPOINT}/${clientId}/${instagramId}`;
        console.log(`Connecting to Instagram WebSocket: ${wsUrl}`);
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log(`Instagram WebSocket connected for user ID: ${instagramId}`);
          setRetries(prev => ({ ...prev, instagram: 0 }));
        };
        
        ws.onmessage = handleWebSocketMessage;
        
        ws.onerror = (error) => {
          console.error('Instagram WebSocket error:', error);
          
          // Only retry if not at max retries
          if (retries.instagram < maxRetries) {
            setTimeout(() => {
              setRetries(prev => ({ ...prev, instagram: prev.instagram + 1 }));
            }, retryDelay);
          }
        };
        
        ws.onclose = () => {
          console.log('Instagram WebSocket closed');
          
          // Only retry if not at max retries
          if (retries.instagram < maxRetries) {
            setTimeout(() => {
              setRetries(prev => ({ ...prev, instagram: prev.instagram + 1 }));
            }, retryDelay);
          }
        };
        
        setInstagramWs(ws);
      } catch (error) {
        console.error('Error establishing Instagram WebSocket:', error);
      }
    };
    
    // Initial fetch of conversations
    fetchConversations();
    
    // Connect to WebSockets if appropriate IDs are available
    connectWhatsAppWebSocket();
    connectInstagramWebSocket();
    
    // Cleanup function
    return () => {
      if (whatsappWs) {
        console.log('Closing WhatsApp WebSocket');
        whatsappWs.close();
      }
      
      if (instagramWs) {
        console.log('Closing Instagram WebSocket');
        instagramWs.close();
      }
    };
}, [handleWebSocketMessage, retries.whatsapp, retries.instagram]);



  return { conversations, loading, error };
};