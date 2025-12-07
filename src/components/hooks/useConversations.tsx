"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';
import { normalizeConversation } from '@/utils/normalizeConversation';
import { useMainWebSocket } from '@/lib/websocket';

export const useConversations = (status?: "open" | "closed") => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1. Initial Data Fetching
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
        // console.log("All conversations fetched and status: ", allConversations.slice(0,5),status); // Log first 5 for brevity
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
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  const handleNewConversation = useCallback((conv: any) => {
    if (!conv) return;
    const convData = conv.conversation || conv;
    setConversations(prev => [normalizeConversation(convData), ...prev]);
  }, []);

  const handleConversationUpdated = useCallback((conv: any) => {
    if (!conv) return;
    console.log("Conversation updated received:", conv);

    const convData = conv.conversation || conv;
    const updated = normalizeConversation(convData);

    setConversations(prev => {
      // 1. Find index
      const index = prev.findIndex(c => 
        (c.id === convData.conversation_id) || 
        (c.conversation_id === convData.conversation_id)
      );

      // 2. Handle New/Moved Item
      if (index === -1) {
         // Respect the current filter status
         if (status && updated.status !== status) return prev;
         return [updated, ...prev];
      }

      const newList = [...prev];
      newList.splice(index, 1);
      newList.unshift(updated);
      
      return newList;
    });
  }, [status]); // Re-create only if status filter changes

  useMainWebSocket({
    onNewConversation: handleNewConversation,
    onConversationUpdated: handleConversationUpdated,
  });

  // Initial Fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => {
      // Check both id fields based on your normalization logic
      if (c.id === conversationId || c.conversation_id === conversationId) {
        return { ...c, unread_count: 0 };
      }
      return c;
    }));
  }, []);
  
  return { conversations, loading, error, markAsRead };
};