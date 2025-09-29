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
import { Clock, Calendar, Bell, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '../types/conversation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface RemainderSideBarProps {
  onToggleVisibility?: () => void;
}

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

const RemainderSideBar = ({ onToggleVisibility }: RemainderSideBarProps) => {
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
    <TooltipProvider>
      <Card className="h-full max-h-screen bg-white/95 ios-backdrop border-l border-gray-200/60 overflow-hidden flex flex-col relative">
        <style>
          {`
            .ios-backdrop {
              backdrop-filter: blur(20px) saturate(180%);
              -webkit-backdrop-filter: blur(20px) saturate(180%);
            }
          `}
        </style>

        {/* Close Button - Same as Sidebar */}
        {onToggleVisibility && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleVisibility}
                className="
                  absolute -right-[-9] top-2 z-20 h-8 w-8 
                  bg-white/90 ios-backdrop rounded-2xl 
                  transition-all duration-200 hover:scale-110
                  flex items-center justify-center
                "
                aria-label="Hide details sidebar"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-gray-900/90 ios-backdrop text-white rounded-xl text-xs">
              Hide sidebar
            </TooltipContent>
          </Tooltip>
        )}

        {/* Header */}
        <div className="flex items-center p-3 bg-white/40 ios-backdrop border-b border-gray-100/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="text-blue-600" size={18} />
            <h1 className="text-base font-semibold text-gray-900">Reminders</h1>
          </div>
<span className="ml-24 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
    {remainder.length} Active
  </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 space-y-3 ios-scrollbar">
          <style>
            {`
              .ios-scrollbar::-webkit-scrollbar {
                width: 3px;
              }

              .ios-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }

              .ios-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.1);
                border-radius: 8px;
                transition: all 0.3s ease;
              }

              .ios-scrollbar:hover::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.2);
              }
            `}
          </style>

          {isloading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 bg-blue-100/80 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border border-blue-600 border-t-transparent"></div>
                </div>
                <p className="text-sm text-gray-600">Loading reminders...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4 bg-red-50/80 ios-backdrop rounded-lg border border-red-200/60">
              <AlertCircle className="text-red-500 mr-2" size={18} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : remainder.length > 0 ? (
            remainder.map((reminder) => (
              <Card key={reminder._id} className="transition-all hover:shadow-md bg-white/80 ios-backdrop border border-gray-100/60">
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        {reminder.title}
                        <div className="flex items-center gap-1">
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
                      <CardDescription className="flex items-center gap-1 text-xs text-gray-500">
                        <span>Customer: {getCustomerName(reminder.conversationId)}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-3 pb-2">
                  <p className="text-xs text-gray-600 leading-relaxed">{reminder.notes}</p>
                </CardContent>

                <CardFooter className="flex justify-between px-3 py-2 border-t border-gray-100/60">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(reminder.dateTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
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
              <div className="w-16 h-16 bg-gray-100/80 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">No reminders</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                You don&apos;t have any active reminders at the moment.
              </p>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default RemainderSideBar;
