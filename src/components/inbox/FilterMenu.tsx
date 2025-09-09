import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // ensure this is the shadcn/radix wrapper
import { Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FaWhatsapp, FaInstagram, FaTelegram } from "react-icons/fa";
import { Globe } from "lucide-react";
import { FilterBadge } from "./FilterBadge";

export interface FilterOptions {
  platform: string[];
  priority: string[];
  sentiment: string[];
  unreadOnly: boolean;
  hasQuery: boolean;
}

interface FilterMenuProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filters,
  onFilterChange,
}) => {
  const platformIcons = {
    whatsapp: <FaWhatsapp className="h-4 w-4 text-green-600" />,
    instagram: <FaInstagram className="h-4 w-4 text-pink-600" />,
    telegram: <FaTelegram className="h-4 w-4 text-blue-500" />,
    web: <Globe className="h-4 w-4 text-gray-600" />,
  };

  const getPriorityColor = (priority: string) =>
    priority === "high"
      ? "text-red-500"
      : priority === "medium"
      ? "text-amber-500"
      : "text-green-500";

  const capitalizeFirstLetter = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <Popover>
      {/* IMPORTANT: asChild so this div IS the trigger */}
      <PopoverTrigger asChild>
  <div
    tabIndex={0}
    role="button"
    aria-haspopup="true"
    className="w-full flex items-center gap-0 px-4 py-2 rounded-md hover:bg-gray-10 cursor-pointer z-50 pointer-events-auto"
  >
    <Filter className="h-4 w-4 ml-3" />
  </div>
</PopoverTrigger>


      <PopoverContent className="w-72">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold">Platform</Label>
            <div className="flex flex-wrap gap-2">
              {["whatsapp", "telegram", "instagram", "web"].map((platform) => (
                <FilterBadge
                  key={platform}
                  active={filters.platform.includes(platform)}
                  onClick={() => {
                    const newPlatforms = filters.platform.includes(platform)
                      ? filters.platform.filter((p) => p !== platform)
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
              {["high", "medium", "low"].map((priority) => (
                <FilterBadge
                  key={priority}
                  active={filters.priority.includes(priority)}
                  onClick={() => {
                    const newPriorities = filters.priority.includes(priority)
                      ? filters.priority.filter((p) => p !== priority)
                      : [...filters.priority, priority];
                    onFilterChange({ ...filters, priority: newPriorities });
                  }}
                  className={!filters.priority.includes(priority) ? getPriorityColor(priority) : ""}
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
                onClick={() =>
                  onFilterChange({ ...filters, unreadOnly: !filters.unreadOnly })
                }
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
