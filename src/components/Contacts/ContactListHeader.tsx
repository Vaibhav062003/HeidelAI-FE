import { MoreVertical, Plus, Upload, Search, X, Send, Filter, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageComposer } from "./MessageComposer";

interface ContactListHeaderProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onAddContact: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageSend: (data: {
    tag?: string;
    platform: "whatsapp" | "instagram";
    template: string;
  }) => void;
}

interface MessageData {
  tag?: string;
  platform: "whatsapp" | "instagram";
  template: string;
}


interface ActionButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "default" | "primary" | "success";
  className?: string;
}

export const ContactListHeader = ({
  searchValue,
  onSearch,
  onAddContact,
  onImportCSV,
  onMessageSend,
}: ContactListHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMessageComposerOpen, setIsMessageComposerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const kebabTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

const handleMessageSend = (data: MessageData) => {
  console.log("Message sent:", data);
  setIsMessageComposerOpen(false);
};

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
      
      if (
        isSearchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isSearchExpanded]);

  const handleMenuAction = (action: string) => {
    if (action === "add") onAddContact();
    if (action === "import") fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleOpenMessageComposer = () => {
    setIsMessageComposerOpen(true);
  };

  const ActionButton: React.FC<ActionButtonProps> = ({ 
    onClick, 
    icon: Icon, 
    label, 
    variant = "default", 
    className = "" 
  }) => (
    <button
      onClick={onClick}
      className={`
        group relative
        flex items-center justify-center
        h-9 w-9 sm:h-10 sm:w-10
        rounded-2xl
        transition-all duration-200
        hover:scale-105 active:scale-95
        ${variant === "primary" 
          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg" 
          : variant === "success"
          ? "bg-gray-100 hover:bg-gray-200 text-black shadow-md hover:shadow-lg"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
        }
        ${className}
      `}
      aria-label={label}
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );

  interface QuickActionMenuProps {
    className?: string;
  }

  const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ className = "" }) => (
    <div className={`relative ${className}`}>
      <button
        ref={kebabTriggerRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="
          group relative
          flex items-center justify-center
          h-9 w-9 sm:h-10 sm:w-10
          bg-gray-100 hover:bg-gray-200
          text-gray-700 hover:text-gray-900
          rounded-2xl
          transition-all duration-200
          hover:scale-105 active:scale-95
        "
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      
      {isMenuOpen && (
        <div
          ref={kebabMenuRef}
          className="
            absolute right-0 top-12 
            w-56 
            bg-white 
            border border-gray-200 
            rounded-2xl 
            shadow-xl 
            z-50
            backdrop-blur-sm
            overflow-hidden
          "
        >
          <div className="p-2">
            <button
              onClick={() => handleMenuAction("add")}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                text-sm font-medium text-gray-700 
                hover:bg-blue-50 hover:text-blue-700
                rounded-xl
                transition-all duration-200
                group
              "
            >
              <div className="
                flex items-center justify-center
                h-8 w-8
                bg-blue-100 group-hover:bg-blue-200
                text-blue-600
                rounded-lg
                transition-colors duration-200
              ">
                <Plus className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">Add Contact</div>
                <div className="text-xs text-gray-500 group-hover:text-blue-600">Create new contact</div>
              </div>
            </button>
            
            <button
              onClick={() => handleMenuAction("import")}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                text-sm font-medium text-gray-700 
                hover:bg-green-50 hover:text-green-700
                rounded-xl
                transition-all duration-200
                group
              "
            >
              <div className="
                flex items-center justify-center
                h-8 w-8
                bg-green-100 group-hover:bg-green-200
                text-green-600
                rounded-lg
                transition-colors duration-200
              ">
                <Upload className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-medium">Import CSV</div>
                <div className="text-xs text-gray-500 group-hover:text-green-600">Bulk import contacts</div>
              </div>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={onImportCSV}
            />
          </div>
        </div>
      )}
    </div>
  );

  const MessageButton: React.FC<{ 
    size?: "sm" | "md" | "lg"; 
  }> = ({ 
    size = "md"
  }) => (
    <button
      onClick={handleOpenMessageComposer}
      className={`
        flex items-center gap-2
        bg-gradient-to-r from-blue-600 to-blue-700
        hover:from-blue-700 hover:to-blue-800
        text-white font-medium
        rounded-2xl
        shadow-md hover:shadow-lg
        transition-all duration-200
        hover:scale-10 active:scale-95
        ${size === "sm" ? "px-3 py-2 text-sm" : 
          size === "md" ? "px-4 py-2.5 text-sm" :
          "px-6 py-3 text-base"
        }
      `}
    >
      <Send className={`${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"}`} />
      <span>Message</span>
    </button>
  );

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="px-4 py-3">
          {/* Top Action Bar */}
          <div className="flex items-center justify-between">
            {/* Left: Quick Message Button */}
            <div className="flex items-center gap-2">
              <MessageButton size="sm" />
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <ActionButton
                onClick={handleSearchToggle}
                icon={isSearchExpanded ? X : Search}
                label={isSearchExpanded ? "Close search" : "Search contacts"}
                variant={isSearchExpanded ? "default" : "default"}
              />
              
              <ActionButton
                onClick={onAddContact}
                icon={Plus}
                label="Add contact"
                variant="success"
              />
              
              <QuickActionMenu />
            </div>
          </div>

          {/* Expandable Search Bar */}
          {isSearchExpanded && (
            <div className="mt-3 animate-in slide-in-from-top duration-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search contacts..."
                  className="
                    w-full pl-11 pr-4 py-3
                    bg-gray-50 border border-gray-200
                    text-gray-900 placeholder-gray-500
                    rounded-2xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    focus:bg-white
                    transition-all duration-200
                  "
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* MOBILE */}
          {isMessageComposerOpen && (
            <div className="mt-3 animate-in slide-in-from-top duration-200">
              <div className="relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                <button
                  onClick={() => setIsMessageComposerOpen(false)}
                  className="absolute top-2 right-2 p-1 hover:bg-white/60 rounded-lg transition-colors z-10"
                  aria-label="Close message composer"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                <MessageComposer 
                  directMode={true}
                  onMessageSend={(data) => {
                    onMessageSend(data);
                    setIsMessageComposerOpen(false);
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden sm:block lg:hidden">
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="
                  flex items-center justify-center
                  h-12 w-12
                  bg-gradient-to-br from-blue-600 to-blue-700
                  text-white
                  rounded-2xl
                  shadow-lg
                ">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageButton size="md" />
                <QuickActionMenu />
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="
                    w-full pl-12 pr-4 py-3
                    border border-gray-300
                    text-gray-900 placeholder-gray-500
                    rounded-2xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                  "
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>

            {/* TABLET */}
            {isMessageComposerOpen && (
              <div className="animate-in slide-in-from-top duration-200">
                <div className="relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                  <button
                    onClick={() => setIsMessageComposerOpen(false)}
                    className="absolute top-2 right-2 p-1 hover:bg-white/60 rounded-lg transition-colors z-10"
                    aria-label="Close message composer"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                  <MessageComposer 
                    directMode={true}
                    onMessageSend={(data) => {
                      onMessageSend(data);
                      setIsMessageComposerOpen(false);
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <MessageButton size="lg" />
              
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="
                    pl-12 pr-4 py-3
                    w-80 xl:w-96
                    border border-gray-300
                    text-gray-900 placeholder-gray-500
                    rounded-2xl
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200
                  "
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              
              <QuickActionMenu />
            </div>
          </div>

         {isMessageComposerOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="relative w-full max-w-6xl">
      <button
        onClick={() => setIsMessageComposerOpen(false)}
        className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      <MessageComposer
        onMessageSend={handleMessageSend}
        directMode={true}  // Set this to true
      />
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};
