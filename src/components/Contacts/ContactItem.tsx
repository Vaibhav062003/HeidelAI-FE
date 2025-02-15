import { useState, useRef, useEffect } from "react";

// Country code prefix mapping
const countryPrefixes: { [key: string]: string } = {
  "United States": "+1",
  Germany: "+49",
  India: "+91",
  "United Kingdom": "+44",
  France: "+33",
  Japan: "+81",
  China: "+86",
  Brazil: "+55",
  // Add more countries as needed
};

interface Contact {
  id: number;
  firstName: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  tags?: string;
}

interface ContactItemProps {
  contact: Contact;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ContactItem = ({
  contact,
  onEdit,
  onDelete,
}: ContactItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get formatted phone number with country prefix
  const formattedPhone =
    contact.phone && contact.country
      ? `${countryPrefixes[contact.country] || ""} ${contact.phone}`
      : contact.phone;

  return (
    <div
      className={`group bg-white rounded-xl shadow-sm p-3 mb-3 transition-all border border-gray-100 ${
        !isMenuOpen ? "hover:shadow-lg hover:border-indigo-50" : ""
      }`}
    >
      {" "}
      <div className="flex items-center gap-5">
        {/* Profile Picture */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.qOSjSxoUNci9aPL9spX_eQHaHa&pid=Api&P=0&h=180"
              alt={contact.firstName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-indigo-50 shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {contact.firstName} {contact.lastName}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-500"></span>
              <span>{contact.email}</span>
            </div>
            {contact.company && (
              <div className="flex items-center gap-1.5">
                <span> | </span>
                <span> </span>
                <span> </span>
                <span className="text-indigo-500">🏢</span>
                <span>{contact.company}</span>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-500"></span>
                <span> | </span>
                <span> </span>
                <span> </span>
                <span>{formattedPhone}</span>
              </div>
            )}
            {contact.country && (
              <div className="flex items-center gap-1.5">
                <span> | </span>
                <span> </span>
                <span> </span>
                <span className="text-indigo-500">🌍</span>
                <span>{contact.country}</span>
              </div>
            )}
            {contact.tags && (
              <div className="flex items-center gap-1.5">
                <span> | </span>
                <span> </span>
                <span> </span>
                <span className="text-indigo-500"></span>
                <span>{contact.tags}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-100">
              <div className="p-2">
                <button
                  onClick={() => {
                    onEdit(contact.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <span className="mr-2"></span>
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(contact.id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <span className="mr-2"></span>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
