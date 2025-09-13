import { MoreVertical, Plus, Upload, Search, Menu, X } from "lucide-react";
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

export const ContactListHeader = ({
  searchValue,
  onSearch,
  onAddContact,
  onImportCSV,
  onMessageSend,
}: ContactListHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kebabMenuRef = useRef<HTMLDivElement>(null);
  const kebabTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Screen width detection
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
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
      
      // Close expanded search on mobile when clicking outside
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
    setIsMenuOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  // Determine layout based on screen size
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Mobile Layout */}
        {isMobile && (
          <div className="space-y-3">
            {/* Top row - Title and actions */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                Contacts
              </h1>
              
              <div className="flex items-center gap-2">
                {/* Search toggle button */}
                <button
                  onClick={handleSearchToggle}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                >
                  {isSearchExpanded ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
                
                {/* Kebab menu */}
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
            
            {/* Search row - expandable */}
            {isSearchExpanded && (
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search customers..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    value={searchValue}
                    onChange={(e) => onSearch(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Message composer row */}
            <div className="flex justify-start">
              <MessageComposer onMessageSend={onMessageSend} />
            </div>
          </div>
        )}

        {/* Tablet Layout */}
        {isTablet && (
          <div className="space-y-3">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
              
              <div className="flex items-center gap-3">
                <MessageComposer onMessageSend={onMessageSend} />
                
                {/* Kebab menu */}
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
            
            {/* Search row */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        {isDesktop && (
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
            
            <div className="flex items-center gap-4">
              <MessageComposer onMessageSend={onMessageSend} />
              
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-64 xl:w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  value={searchValue}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              
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
        )}
      </div>
    </div>
  );
};
