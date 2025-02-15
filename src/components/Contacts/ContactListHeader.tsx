import { MoreVertical, Plus, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface ContactListHeaderProps {
  searchValue: string;
  onSearch: (value: string) => void;
  onAddContact: () => void;
  onImportCSV: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactListHeader = ({
  searchValue,
  onSearch,
  onAddContact,
  onImportCSV
}: ContactListHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMenuAction = (action: 'import' | 'add') => {
    setIsMenuOpen(false);
    if (action === 'add') onAddContact();
    if (action === 'import' && fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Contacts</h1>
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search customers..."
          className="px-4 py-2 border rounded w-64"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />

        {/* Kebab Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-1">
                <button
                  onClick={() => handleMenuAction('add')}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Customer
                </button>
                <label className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
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