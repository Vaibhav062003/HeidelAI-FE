import axios from 'axios';
import { Conversation } from '../types/conversation';
import { syncContactFromConversation } from '../utils/contactSync';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const conversationService = {
  getAll: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/conversations');
    const conversations = response.data;
    
    // Sync contacts after fetching conversations
    conversations.forEach(conversation => {
      syncContactFromConversation(conversation).catch(error => {
        console.error('Contact sync error:', error);
      });
    });
    
    return conversations;
  },
};
