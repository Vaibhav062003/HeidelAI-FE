import axios from 'axios';
import { Conversation } from '../types/conversation';
import { syncContactFromConversation } from '../utils/contactSync';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const conversationService = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/conversations');
    return response.data;
  },
  
  get: async (id: string): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  getInstagramConversations: async (instagramId: string) => {
    const response = await api.get(`https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/conversations`);
    console.log("Instagram conversations response", response);
    return response.data;
  },

  getWhatsAppConversations: async (whatsappId: string | null) => {
    // Only fetch if a valid whatsapp ID is provided
    if (!whatsappId) {
      console.log("No WhatsApp ID provided, skipping fetch");
      return [];
    }
    
    try {
      const response = await api.get(`https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations`);
      console.log("WhatsApp conversations response", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp conversations:", error);
      throw error;
    }
  },

  getWhatsAppMessages: async (whatsappId: string, conversationId: string) => {
    if (!whatsappId || !conversationId) {
      console.log("Missing required parameters for WhatsApp messages");
      return [];
    }
    
    try {
      const response = await api.get(
        `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${conversationId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp messages:", error);
      throw error;
    }
  },
  
  getWhatsAppAiStatus: async (whatsappId: string, conversationId: string) => {
    if (!whatsappId || !conversationId) {
      return true; // Default to enabled
    }
    
    try {
      const response = await api.get(
        `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${conversationId}/ai`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching WhatsApp AI status:", error);
      return true; // Default to enabled on error
    }
  },
  
  toggleWhatsAppAi: async (whatsappId: string, conversationId: string, enabled: boolean) => {
    if (!whatsappId || !conversationId) {
      console.log("Missing required parameters for WhatsApp AI toggle");
      return { status: "error", message: "Missing parameters" };
    }
    
    try {
      const response = await api.post(
        `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/${conversationId}/toggle_ai`,
        { enabled }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling WhatsApp AI:", error);
      throw error;
    }
  },
  
  sendWhatsAppMessage: async (whatsappId: string, message: any) => {
    if (!whatsappId) {
      console.log("No WhatsApp ID provided for sending message");
      return { status: "error", message: "Missing WhatsApp ID" };
    }
    
    try {
      const response = await api.post(
        `https://egenie-whatsapp.koyeb.app/api/whatsapp/${whatsappId}/conversations/send_message`,
        message
      );
      return response.data;
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      throw error;
    }
  }
};