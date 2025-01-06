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
  }
};