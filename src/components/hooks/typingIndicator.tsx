import { useUser } from '@clerk/nextjs';
import { useState, useRef, useCallback, useEffect } from 'react';


export function useTypingIndicator(sendFn: (payload: Record<string, unknown>) => void, conversationId: string) {
  const [isTyping, setIsTyping] = useState(false);
  const { user, isLoaded } = useUser();
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  let agentId: string | null = null;
  if (typeof window !== 'undefined') {
    agentId = localStorage.getItem('chat_client_id');
  }
   
  const handleTyping = useCallback(() => {
    if (!isLoaded || !user) return;
    const User = user.username;
    if (!isTyping) {
      sendFn({ type: 'typing_indicator', is_typing: true, agent_id: agentId, user:User , conversation_id: conversationId });
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendFn({ type: 'typing_indicator', is_typing: false, agent_id: agentId, user:User, conversation_id: conversationId });
      setIsTyping(false);
    }, 2000);
  }, [isTyping, sendFn, agentId, isLoaded, user , conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return { isTyping, handleTyping };
}