import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';
import { syncContactFromConversation } from '../utils/contactSync'; // Add this import

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws2';
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [retries, setRetries] = useState(0);
  const [syncStatus, setSyncStatus] = useState<{[id: string]: 'pending' | 'synced' | 'failed'}>({});

  const handleNewConversation = async (conversation: Conversation) => {
    try {
      // Mark as pending sync
      setSyncStatus(prev => ({...prev, [conversation.id]: 'pending'}));
      
      // Sync contact before updating state
      await syncContactFromConversation(conversation);
      
      // Mark as synced
      setSyncStatus(prev => ({...prev, [conversation.id]: 'synced'}));
      
      setConversations(prev => [conversation, ...prev]);
    } catch (error) {
      console.error('Contact sync failed:', error);
      // Mark as failed
      setSyncStatus(prev => ({...prev, [conversation.id]: 'failed'}));
    }
  };

  const handleConversationUpdate = (updatedConv: Conversation) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConv.id ? updatedConv : conv
      )
    );
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await conversationService.getAll();
        
        // Initialize all conversations as pending sync
        const initialSyncStatus: {[id: string]: 'pending' | 'synced' | 'failed'} = {};
        data.forEach(conv => {
          initialSyncStatus[conv.id] = 'pending';
        });
        setSyncStatus(initialSyncStatus);
        
        // Sync contacts for all existing conversations
        await Promise.all(
          data.map(async conv => {
            try {
              await syncContactFromConversation(conv);
              setSyncStatus(prev => ({...prev, [conv.id]: 'synced'}));
            } catch (error) {
              console.error(`Sync failed for ${conv.id}:`, error);
              setSyncStatus(prev => ({...prev, [conv.id]: 'failed'}));
            }
          })
        );
        
        setConversations(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = () => {
      const wsConnection = new WebSocket(`${WS_URL}/client-${Date.now()}`);

      wsConnection.onopen = () => {
        setError(null);
        setRetries(0);
      };

      wsConnection.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case 'new_conversation':
              await handleNewConversation(data.conversation);
              break;
            case 'conversation_updated':
              handleConversationUpdate(data.conversation);
              break;
          }
        } catch (error) {
          console.error('WebSocket message handling error:', error);
        }
      };

      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (retries < MAX_RETRIES) {
          setTimeout(() => setRetries(prev => prev + 1), RETRY_DELAY);
        } else {
          setError(new Error('WebSocket connection failed after retries'));
        }
      };

      wsConnection.onclose = () => {
        if (retries < MAX_RETRIES) {
          setTimeout(() => setRetries(prev => prev + 1), RETRY_DELAY);
        }
      };

      setWs(wsConnection);
    };

    fetchConversations();
    setupWebSocket();

    return () => {
      ws?.close();
    };
  }, [retries]);

  return { conversations, loading, error, syncStatus };
}