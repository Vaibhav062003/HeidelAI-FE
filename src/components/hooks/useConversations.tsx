import { useState, useEffect } from 'react';
import { Conversation } from '../types/conversation';
import { conversationService } from '../services/api';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get regular conversations
        // const regularConversations = await conversationService.getAll();
        // let allConversations = [...regularConversations];
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
            // Continue with just regular conversations
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
            // Continue with other conversations
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
    };

    fetchConversations();

    // Optional: Set up a polling interval to refresh conversations
    // const intervalId = setInterval(fetchConversations, 30000); // every 30 seconds
    
    // return () => clearInterval(intervalId);
  }, []);

  return { conversations, loading, error, refetch: () => {} };
};