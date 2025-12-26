import api from '@/lib/session_api';
import { useState, useEffect, useCallback } from 'react';

interface Reminder {
  id: string;
  conversation_id: string;
  title: string;
  notes: string;
  trigger_time: string;
  status: "OVERDUE" | "SNOOZED" | "DONE";
  snooze_count: number;
  last_triggered_at: string;
  created_at: string;
  updated_at: string;
  recipient_email: string;
}

export const useReminders = (conversationId?: string) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    try {
      const url =`https://heidelai-2.koyeb.app/reminders/conversation/${conversationId}`
      const response = await api.get(url)

      if (response.status !== 200) {
        throw new Error(`Error fetching reminders: ${response.statusText}`);
      }

      const data = response.data;
      setReminders(Array.isArray(data) ? data : []);
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
  };
};