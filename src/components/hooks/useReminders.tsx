import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// First, update the useReminders hook
interface Reminder {
    id: string;
    title: string;
    dateTime: string;
    conversationId: string;
  }
  
  export function useReminders(conversationId: string | undefined) {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Only fetch if we have a conversationId
      if (!conversationId) {
        setReminders([]);
        setLoading(false);
        return;
      }
  
      const fetchReminders = async () => {
        try {
          const response = await fetch('https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/reminders', {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setReminders(data.filter((reminder: Reminder) => 
              reminder.conversationId === conversationId &&
              dayjs(reminder.dateTime).isAfter(dayjs())
            ));
          }
        } catch (error) {
          console.error('Error fetching reminders:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchReminders();
    }, [conversationId]);
  
    return { reminders, loading };
  }
  
