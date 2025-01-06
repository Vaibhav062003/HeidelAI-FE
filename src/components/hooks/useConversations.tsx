import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws2';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await conversationService.getAll();
        setConversations(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const ws = new WebSocket(`${WS_URL}/client-${Date.now()}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_conversation') {
        setConversations(prev => [...prev, data.conversation]);
      } else if (data.type === 'conversation_updated') {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.conversation.id ? data.conversation : conv
          )
        );
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError(new Error('WebSocket connection failed'));
    };

    fetchConversations();

    return () => {
      ws.close();
    };
  }, []);

  return { conversations, loading, error };
}