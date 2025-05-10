import axios from 'axios';
import { Conversation } from '../types/conversation';

const api = axios.create({
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
    const response = await fetch(`https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/conversations`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram conversations: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data; // Return the conversations array directly
  }
};