import { MoreVertical, Plus, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageComposer } from "../Contacts/Message";

interface Tag {
  id: string;
  name: string;
  tag_description: string;
  created_at?: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
}

interface ContactListHeaderProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onAddContact: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageSend: (data: { tag?: string; platform: "whatsapp" | "instagram"; template: string; }) => void;
}


export const ContactListHeader = ({
  searchValue,
  onSearch,
  onAddContact,
  onImportCSV,
  onMessageSend,
}: ContactListHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const kebabTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        kebabMenuRef.current &&
        !kebabMenuRef.current.contains(event.target as Node) &&
        !kebabTriggerRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuAction = (action: string) => {
    if (action === "add") onAddContact();
    setIsMenuOpen(false);
  };

  return (
    <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
      <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
      <div className="flex gap-4 items-center">
      <MessageComposer 
          onMessageSend={(data) => {
            // Handle the message data here if needed before passing it up
            onMessageSend(data);
          }}
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search customers..."
          className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-gray-900"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />

        {/* Kebab Menu */}
        <div className="relative">
          <button
            ref={kebabTriggerRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div
              ref={kebabMenuRef}
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            >
              <div className="p-1.5">
                <button
                  onClick={() => handleMenuAction("add")}
                  className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                  Add Customer
                </button>
                <label className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer rounded-lg">
                  <Upload className="h-4 w-4" />
                  Import CSV
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={onImportCSV}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};