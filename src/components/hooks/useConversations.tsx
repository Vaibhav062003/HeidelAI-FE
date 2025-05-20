import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';
import { syncContactFromConversation } from '../utils/contactSync'; // Add this import

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws2';
const IG_WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws2/instagram';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [whatsappWs, setWhatsappWs] = useState<WebSocket | null>(null);
  const [instagramWs, setInstagramWs] = useState<WebSocket | null>(null);
  const [retries, setRetries] = useState({ whatsapp: 0, instagram: 0 });
  const [syncStatus, setSyncStatus] = useState<Record<string, 'pending' | 'synced' | 'failed' | undefined>>({});
  const maxRetries = 5; // Maximum number of retries before giving up
  const retryDelay = 3000; // Delay in milliseconds between retries (3 seconds)

  useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        setLoading(true);
        
        // Get regular conversations (WhatsApp)
        const regularData = await conversationService.getAll();
        
        // Get Instagram conversations if Instagram ID exists
        const instagramId = localStorage.getItem('instagram_user_id');
        console.log('Instagram ID:', instagramId);
        let instagramData: Conversation[] = [];
        
        if (instagramId) {
          try {
            instagramData = await conversationService.getInstagramConversations(instagramId);
            console.log(`Fetched ${instagramData.length} Instagram conversations`);
          } catch (igError) {
            console.error('Error fetching Instagram conversations:', igError);
            // Continue with WhatsApp conversations even if Instagram fetch fails
          }
        }
        
        // Combine both types of conversations
        // We can identify Instagram vs WhatsApp by the platform field
        const allConversations = [...regularData, ...instagramData];
        
        // Remove duplicates based on conversation ID
        const uniqueConversations = allConversations.filter((conversation, index, self) =>
          index === self.findIndex((c) => c.id === conversation.id)
        );
        
        setConversations(uniqueConversations);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Function to handle WebSocket messages (for both WhatsApp and Instagram)
    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_conversation') {
        setConversations(prev => {
          // Check if this conversation already exists to avoid duplicates
          const exists = prev.some(conv => conv.id === data.conversation.id);
          if (exists) return prev;
          return [...prev, data.conversation];
        });
      } else if (data.type === 'conversation_updated') {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.conversation.id ? data.conversation : conv
          )
        );
      }
    };

    // Connect to WhatsApp WebSocket
    const connectWhatsAppWebSocket = () => {
      const clientId = `client-${Date.now()}`;
      const wsConnection = new WebSocket(`${WS_URL}/${clientId}`);
      
      wsConnection.onopen = () => {
        console.log('WhatsApp WebSocket connected');
        setError(null);
        setRetries(prev => ({ ...prev, whatsapp: 0 }));
      };
      
      wsConnection.onmessage = handleWebSocketMessage;

      wsConnection.onerror = (error) => {
        console.error('WhatsApp WebSocket error:', error);
        
        // Retry mechanism
        if (retries.whatsapp < maxRetries) {
          setRetries(prev => ({ ...prev, whatsapp: prev.whatsapp + 1 }));
          setTimeout(connectWhatsAppWebSocket, retryDelay);
        } else {
          setError(new Error('WhatsApp WebSocket connection failed after multiple retries'));
        }
      };

      wsConnection.onclose = () => {
        console.log('WhatsApp WebSocket closed');
        if (retries.whatsapp < maxRetries) {
          setRetries(prev => ({ ...prev, whatsapp: prev.whatsapp + 1 }));
          setTimeout(connectWhatsAppWebSocket, retryDelay);
        }
      };

      setWhatsappWs(wsConnection);
    };

    // Connect to Instagram WebSocket if Instagram ID is available
    const connectInstagramWebSocket = () => {
      // Get Instagram ID from localStorage or context
      const instagramId = localStorage.getItem('instagram_user_id');
      
      if (!instagramId) {
        console.log('No Instagram ID found, skipping Instagram WebSocket connection');
        return;
      }

      const clientId = `client-${Date.now()}-ig`;
      const wsConnection = new WebSocket(`${IG_WS_URL}/${clientId}/${instagramId}`);
      
      wsConnection.onopen = () => {
        console.log('Instagram WebSocket connected for ID:', instagramId);
        setRetries(prev => ({ ...prev, instagram: 0 }));
      };
      
      wsConnection.onmessage = handleWebSocketMessage;

      wsConnection.onerror = (error) => {
        console.error('Instagram WebSocket error:', error);
        
        // Retry mechanism
        if (retries.instagram < maxRetries) {
          setRetries(prev => ({ ...prev, instagram: prev.instagram + 1 }));
          setTimeout(connectInstagramWebSocket, retryDelay);
        } else {
          console.error('Instagram WebSocket connection failed after multiple retries');
        }
      };

      wsConnection.onclose = () => {
        console.log('Instagram WebSocket closed');
        if (retries.instagram < maxRetries) {
          setRetries(prev => ({ ...prev, instagram: prev.instagram + 1 }));
          setTimeout(connectInstagramWebSocket, retryDelay);
        }
      };

      setInstagramWs(wsConnection);
    };

    // Connect to both WebSockets
    fetchAllConversations();
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
  }, [retries.whatsapp, retries.instagram]); // Retry effect depends on both retries

  return { conversations, loading, error, syncStatus };
}