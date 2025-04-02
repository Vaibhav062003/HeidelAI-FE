import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '../types/conversation';

interface Reminder {
  id: string;
  _id: string;
  title: string;
  notes: string;
  status: string;
  dateTime: string;
  conversationId: string;
  recipient_email: string;
  created_at: string;
  user?: {
    full_name: string;
  };
}

interface ApiResponse {
  reminders: Reminder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const RemainderSideBar = () => {
  const [remainder, setRemainder] = useState<Reminder[]>([]);
  const [error, setError] = useState<string>('');
  const { conversations } = useConversations();
  const [isloading, setIsLoading] = useState<boolean>(true);

  const fetchRemainders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://critical-donella-egeniestores2-12e8ec2b.koyeb.app/all-reminders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }

      const data: ApiResponse = await response.json();
      setRemainder(data.reminders || []);
    } catch (err) {
      console.error('Error fetching reminders:', err);
      setError('Failed to load reminders');
      setRemainder([]);
    } finally {
      setIsLoading(false)
    }
  };

  const getCustomerName = (conversationId: string): string => {
    const conversation = conversations.find((conv) => conv.id === conversationId);
    return conversation?.customer_name || 'Unknown Customer';
  };

  const getPriorityBadge = (dateTime: string) => {
    const reminderDate = new Date(dateTime);
    const now = new Date();
    const diffHours = (reminderDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours <= 24) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-600">
          High
        </Badge>
      );
    } else if (diffHours <= 72) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-600">
          Medium
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-100 text-green-600">
        Low
      </Badge>
    );
  };

  useEffect(() => {
    fetchRemainders();
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <Bell className="text-blue-600" size={20} />
          <h1 className="text-xl font-semibold text-gray-800">Reminders</h1>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {remainder.length} Active
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {isloading ? (
          <p className="text-center text-gray-600 py-8">
            Reminders are being loaded, please be patient...
          </p>
        ) : error ? (
          <div className="flex items-center justify-center p-6 bg-red-50 rounded-lg">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-600">{error}</p>
          </div>
        ) : remainder.length > 0 ? (
          remainder.map((reminder) => (
            <Card key={reminder._id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className=" flex gap-3 text-lg font-semibold">
                      {reminder.title}
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(reminder.dateTime)}
                        <Badge 
                          variant="outline" 
                          className={reminder.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                          }
                        >
                          {reminder.status}
                    </Badge>
                  </div>
                    </CardTitle>
                   
                    <CardDescription className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Customer: {getCustomerName(reminder.conversationId)}</span>
                      •
                      <span>Assigned: {reminder.user?.full_name || reminder.recipient_email}</span>
                    </CardDescription>
                  </div>
                  
                </div>
              </CardHeader>
              
              <CardContent className="py-2">
                <p className="text-sm text-gray-600">{reminder.notes}</p>
              </CardContent>

              <CardFooter className="flex justify-between pt-2 border-t">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(reminder.dateTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Created: {new Date(reminder.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reminders</h3>
            <p className="text-gray-500 text-sm">
              You don&apos;t have any active reminders at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemainderSideBar;