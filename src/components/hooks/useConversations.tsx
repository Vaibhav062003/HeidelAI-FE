import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';

const WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws2';
// const WS_URL = 'wss://egenie-whatsapp.koyeb.app/ws/conversationlist';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [retries, setRetries] = useState(0);

  const maxRetries = 5; // Maximum number of retries before giving up
  const retryDelay = 3000; // Delay in milliseconds between retries (3 seconds)

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

    const connectWebSocket = () => {
      const wsConnection = new WebSocket(`${WS_URL}/client-${Date.now()}`);
      
      wsConnection.onopen = () => {
        setError(null); // Reset any previous error when WebSocket successfully opens
        setRetries(0); // Reset retries on successful connection
      };
      
      wsConnection.onmessage = (event) => {
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

      wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(new Error('WebSocket connection failed'));
        // Retry mechanism
        if (retries < maxRetries) {
          setRetries(prevRetries => prevRetries + 1);
          setTimeout(() => {
            connectWebSocket(); // Attempt to reconnect
          }, retryDelay);
        } else {
          setError(new Error('WebSocket connection failed after multiple retries'));
        }
      };

      wsConnection.onclose = () => {
        if (retries < maxRetries) {
          setRetries(prevRetries => prevRetries + 1);
          setTimeout(() => {
            connectWebSocket(); // Attempt to reconnect if closed
          }, retryDelay);
        } else {
          setError(new Error('WebSocket connection closed after multiple retries'));
        }
      };

      setWs(wsConnection); // Set the WebSocket instance in the state
    };

    connectWebSocket();
    fetchConversations();

    return () => {
      ws?.close();
    };
  }, [retries]); // Retry effect dependency on retries

  return { conversations, loading, error };
}
