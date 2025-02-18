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


interface ContactItemProps {
  contact: Contact;
  onEdit: (id: string) => void;  // Changed from number to string
  onDelete: (id: string) => void;  // Changed from number to string
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

export const ContactItem = ({ contact, onEdit, onDelete }: ContactItemProps) => {
  const formattedTags = Array.isArray(contact.tags) && contact.tags.length > 0
    ? contact.tags.join(', ')
    : '';

    const formattedPhone = contact.phone && contact.country
    ? `${countryPrefixes[contact.country] ?? ""} ${contact.phone}`
    : contact.phone;
  
  return (
    <div className="group bg-white rounded-xl shadow-sm p-4 mb-3 transition-all border border-gray-100 hover:shadow-lg hover:border-indigo-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {contact.firstName}
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
