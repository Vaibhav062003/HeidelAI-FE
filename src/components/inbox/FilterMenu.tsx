import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Instagram, Globe } from "lucide-react";
// You'll need to install react-icons for the Telegram icon
import { FaTelegram, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { FilterBadge } from "./FilterBadge";


interface FilterMenuProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  platform: string[];
  priority: string[];
  sentiment: string[];
  unreadOnly: boolean;
  hasQuery: boolean;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
};

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const FilterMenu = ({ filters, onFilterChange }: FilterMenuProps) => {
    const platformIcons = {
        whatsapp: <FaWhatsapp className="h-4 w-4 text-green-600" />,
        instagram: <FaInstagram className="h-4 w-4 text-pink-600" />,
        telegram: <FaTelegram className="h-4 w-4 text-blue-500" />,
        web: <Globe className="h-4 w-4 text-gray-600" />
    };

    return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold">Platform</Label>
                <div className="flex flex-wrap gap-2">
                  {['whatsapp', 'telegram', 'instagram', 'web'].map((platform) => (
                    <FilterBadge
                      key={platform}
                      active={filters.platform.includes(platform)}
                      onClick={() => {
                        const newPlatforms = filters.platform.includes(platform)
                          ? filters.platform.filter(p => p !== platform)
                          : [...filters.platform, platform];
                        onFilterChange({ ...filters, platform: newPlatforms });
                      }}
                      icon={platformIcons[platform as keyof typeof platformIcons]}
                    >
                      {capitalizeFirstLetter(platform)}
                    </FilterBadge>
                  ))}
                </div>
              </div>
    
              <div className="space-y-2">
                <Label className="font-bold">Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {['high', 'medium', 'low'].map((priority) => (
                    <FilterBadge
                      key={priority}
                      active={filters.priority.includes(priority)}
                      onClick={() => {
                        const newPriorities = filters.priority.includes(priority)
                          ? filters.priority.filter(p => p !== priority)
                          : [...filters.priority, priority];
                        onFilterChange({ ...filters, priority: newPriorities });
                      }}
                      className={filters.priority.includes(priority) ? '' : getPriorityColor(priority)}
                    >
                       {capitalizeFirstLetter(priority)}
                    </FilterBadge>
                  ))}
                </div>
              </div>
    
              <div className="space-y-2">
                <Label className="font-bold">Other Filters</Label>
                <div className="flex flex-wrap gap-2">
                  <FilterBadge
                    active={filters.unreadOnly}
                    onClick={() => onFilterChange({ 
                      ...filters, 
                      unreadOnly: !filters.unreadOnly 
                    })}
                  >
                    Unread only
                  </FilterBadge>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
};