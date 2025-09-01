import { useState, useRef, useCallback, useEffect } from 'react';


export function useTypingIndicator(sendFn: (payload: Record<string, unknown>) => void) {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const agentId = localStorage.getItem('chat_client_id');
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      sendFn({ type: 'typing_indicator', is_typing: true, agent_id: agentId });
      setIsTyping(true);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendFn({ type: 'typing_indicator', is_typing: false });
      setIsTyping(false);
    }, 2000);
  }, [isTyping, sendFn]);

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