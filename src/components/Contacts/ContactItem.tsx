import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { Contact } from '../types/contacts';

// Country code mapping
const countryToCodes: { [key: string]: string } = {
  "United States": "US",
  Germany: "DE",
  India: "IN",
  "United Kingdom": "GB",
  France: "FR",
  Japan: "JP",
  China: "CN",
  Brazil: "BR",
  Australia: "AU",
  Canada: "CA",
};

const countryPrefixes: { [key: string]: string } = {
  "United States": "+1",
  Germany: "+49",
  India: "+91",
  "United Kingdom": "+44",
  France: "+33",
  Japan: "+81",
  China: "+86",
  Brazil: "+55",
  Canada: "+1"
};

// Colors for the avatar background
const avatarColors = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-cyan-500",
];

interface ContactItemProps {
  contact: Contact;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FlagImage = ({ country }: { country: string }) => {
  const countryCode = countryToCodes[country];
  
  if (!countryCode) return <span className="text-gray-400">🌍</span>;

  return (
    <img
      src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${countryCode.toLowerCase()}.svg`}
      alt={`${country} flag`}
      className="w-6 h-4 object-cover rounded-sm inline-block"
    />
  );
};

const ProfileAvatar = ({ firstName, lastName }: { firstName: string; lastName?: string }) => {
  // Get first letter of first name
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  
  // Get first letter of last name if it exists
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  // Combine initials
  const initials = lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  
  // Select a color based on the first name (for consistency)
  const colorIndex = firstName.charCodeAt(0) % avatarColors.length;
  const bgColor = avatarColors[colorIndex];
  
  return (
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${bgColor} text-white font-medium text-lg`}>
      {initials}
    </div>
  );
};

export const ContactItem = ({ contact, onEdit, onDelete }: ContactItemProps) => {
  const formattedTags = Array.isArray(contact.tags) && contact.tags.length > 0
    ? contact.tags.join(', ')
    : '';

  const formattedPhone = contact.phone && contact.country
    ? `${countryPrefixes[contact.country] ?? ""} ${contact.phone}`
    : contact.phone;
  
  return (
    <div className="group bg-white rounded-xl shadow-sm p-3 mb-3 transition-all border border-gray-100 hover:shadow-lg hover:border-indigo-50">
      <div className="flex items-start gap-4">
        <ProfileAvatar firstName={contact.firstName} lastName={contact.lastName} />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {contact.firstName} {contact.lastName}
          </h3>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center min-w-[200px]">
              <span>{contact.email}</span>
            </div>
            
            {contact.company && (
              <div className="flex items-center gap-2 min-w-[150px]">
                <span className="text-gray-400">|</span>
                <span className="text-indigo-500">🏢</span>
                <span>{contact.company}</span>
              </div>
            )}
            
            {formattedPhone && (
              <div className="flex items-center gap-2 min-w-[150px]">
                <span className="text-gray-400">|</span>
                <span>{formattedPhone}</span>
              </div>
            )}
            
            {contact.platform && (
              <div className="flex items-center gap-2 min-w-[120px]">
                <span className="text-gray-400">|</span>
                <span>{contact.platform}</span>
              </div>
            )}
            
            {contact.country && (
              <div className="flex items-center gap-2 min-w-[150px]">
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-2">
                  <FlagImage country={contact.country} />
                  <span>{contact.country}</span>
                </div>
              </div>
            )}
            
            {formattedTags && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">|</span>
                <span className="text-indigo-500"></span>
                <span>{formattedTags}</span>
              </div>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem 
              onClick={() => onEdit(contact.id)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 cursor-pointer"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(contact.id)}
              className="flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ContactItem;