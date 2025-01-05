import React from "react";
import {
  Search,
  Settings,
  BellRing,
  MessageCircle,
  Instagram,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavigationProps {
  selectedChannels?: string[];
  unreadCount?: number;
  onChannelSelect?: (channel: string) => void;
  onSearch?: (query: string) => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

const TopNavigation = ({
  selectedChannels = ["all"],
  unreadCount = 5,
  onChannelSelect = () => {},
  onSearch = () => {},
  onSettingsClick = () => {},
  onNotificationsClick = () => {},
}: TopNavigationProps) => {
  const channels = [
    {
      id: "telegram",
      label: "Telegram",
      icon: MessageCircle,
      color: "text-blue-500",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-500",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "text-purple-500",
    },
    { id: "web", label: "Web Chat", icon: Globe, color: "text-gray-500" },
  ];

  return (
    <div className="w-full h-16 px-4 bg-white border-b flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Button
                key={channel.id}
                variant={
                  selectedChannels.includes(channel.id) ? "default" : "outline"
                }
                size="sm"
                className="gap-2"
                onClick={() => onChannelSelect(channel.id)}
              >
                <Icon className={`h-4 w-4 ${channel.color}`} />
                {channel.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onNotificationsClick}
          className="relative"
        >
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>AI Settings</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNavigation;
