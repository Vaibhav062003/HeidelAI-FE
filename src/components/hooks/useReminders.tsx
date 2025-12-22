import api from '@/lib/session_api';
import { useState, useEffect, useCallback } from 'react';

interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dateTime: string;
  conversationId: string;
}

export const useReminders = (conversationId?: string) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      // const response = await fetch(
      //   `https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders?conversationId=${conversationId}`,
      //   {
      //     credentials: 'include'
      //   }
      // );
      const response = await api.get(`https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders?conversationId=${conversationId}`)

      if (response.status !== 200) {
        throw new Error(`Error fetching reminders: ${response.statusText}`);
      }

      const data = response.data;
      setReminders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders, conversationId]);

  return { 
    reminders, 
    loading, 
    error, 
    refetchReminders: fetchReminders 
  };
};