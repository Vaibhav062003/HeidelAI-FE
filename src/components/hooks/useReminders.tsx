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
      const response = await fetch(
        `https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders?conversationId=${conversationId}`,
        {
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }

      const data = await response.json();
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