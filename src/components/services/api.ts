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
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch Instagram conversations: ${response.statusText}`);
    // }
    // const data = await response.json();
    // console.log("Instagram conversations data", data);
    // return data; // Return the conversations array directly
  }
};
