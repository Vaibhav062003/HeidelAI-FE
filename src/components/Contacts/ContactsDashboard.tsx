"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";
import { ContactItem } from "../Contacts/ContactItem";
import { ContactListHeader } from "../Contacts/ContactListHeader";
import { PaginationFooter } from "../Contacts/PaginationFooter";
import { ContactForm } from "../Contacts/ContactFormModal";
import { Spinner } from "../Contacts/Spinner";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  tags: string[];
}

interface Tag {
  id: string;
  name: string;
  tag_description: string;
  created_at?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ContactsDashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importingCount, setImportingCount] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleTagSelected = (event: CustomEvent) => {
      const tagName = event.detail?.tagName;
      console.log(' Tag selected in ContactsDashboard:', tagName);
      setSelectedTag(tagName);
      setCurrentPage(1); // Reset to first page when filtering
    };

    window.addEventListener('tagSelected', handleTagSelected as EventListener);
    return () => window.removeEventListener('tagSelected', handleTagSelected as EventListener);
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('contacts').select('*');
      
      //  Filter by tag if selected
      if (selectedTag) {
        console.log('🔍 Filtering contacts by tag:', selectedTag);
        query = query.contains('tags', [selectedTag]);
      }
  
      const { data, error } = await query;
      
      if (error) throw error;
      
      const mappedContacts = data?.map(c => ({
        ...c,
        tags: Array.isArray(c.tags) ? c.tags : []
      })) || [];
      
      console.log('📋 Fetched contacts:', mappedContacts.length, 'contacts');
      setContacts(mappedContacts);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to load contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    fetchContacts();
  }, [selectedTag, fetchContacts]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      setError(null);
      setImportingCount(0);

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const requiredFields = ["firstName", "email"];
            const missingFields = requiredFields.filter(
              (f) => !results.meta.fields?.includes(f)
            );
            if (missingFields.length) {
              throw new Error(`Missing columns: ${missingFields.join(", ")}`);
            }

            const contactsToImport = results.data.map((row) => {
              const missing = requiredFields.filter(
                (f) => !row[f]?.toString().trim()
              );
              if (missing.length) {
                throw new Error(`Row missing: ${missing.join(", ")}`);
              }

              return {
                firstName: row.firstName?.toString().trim() || "",
                lastName: row.lastName?.toString().trim() || "",
                email: row.email?.toString().trim() || "",
                phone: row.phone?.toString().trim() || "",
                company: row.company?.toString().trim() || "",
                country: row.country?.toString().trim() || "",
                tags:
                  row.tags
                    ?.split(",")
                    .map((t) => t.trim())
                    .filter(Boolean) || [],
              };
            });

            setImportingCount(contactsToImport.length);
            const { data, error } = await supabase
              .from("contacts")
              .insert(contactsToImport)
              .select();

            if (error) throw error;
            setContacts((prev) => [
              ...prev,
              ...(data?.map((c) => ({
                ...c,
                tags: Array.isArray(c.tags) ? c.tags : [],
              })) || []),
            ]);
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setIsImporting(false);
            setImportingCount(0);
            if (event.target) event.target.value = "";
          }
        },
        error: (err) => setError(`CSV error: ${err.message}`),
      });
    },
    []
  );

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleDelete = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", contactId);

      if (error) throw error;
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSaveContact = useCallback(
    (newContact: Partial<Contact>) => {
      const updatedContact = {
        ...newContact,
        tags: newContact.tags || [],
      };

      setContacts((prev) => {
        if (selectedContact?.id) {
          return prev.map((c) =>
            c.id === selectedContact.id
              ? ({ ...c, ...updatedContact } as Contact)
              : c
          );
        }
        return [
          ...prev,
          { ...updatedContact, id: `manual-${Date.now()}` } as Contact,
        ];
      });
      setSelectedContact(null);
    },
    [selectedContact]
  );

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      return `${contact.firstName} ${contact.lastName} ${contact.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [contacts, searchQuery]);

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-white border-b border-gray-200">
        <ContactListHeader
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          onAddContact={() => setSelectedContact({} as Contact)}
          onImportCSV={handleFileUpload}
          onMessageSend={() => {}}
        />
      </div>

      {/* Tag Filter Bar */}
      {selectedTag && (
        <div className="flex-none px-4 py-2.5 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">
                Filtered by tag: <span className="font-semibold">{selectedTag}</span>
              </span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
              </span>
            </div>
            <button
              onClick={() => setSelectedTag(null)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
            >
              Clear filter
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-1 sm:p-4 lg:p-0.5 min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg text-center px-4">
              {selectedTag 
                ? `No contacts found with tag "${selectedTag}" 🏷️`
                : searchQuery 
                  ? "No matching contacts found 🔍" 
                  : "No contacts found 🔍"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border min-h-0">
              <div className="divide-y divide-gray-100">
                {paginatedContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onEdit={() => handleEdit(contact)}
                    onDelete={() => handleDelete(contact.id)}
                  />
                ))}
              </div>
            </div>

            <div className="flex-none pt-1 sm:pt-2">
              <PaginationFooter
                currentPage={currentPage}
                totalItems={filteredContacts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-sm sm:max-w-md lg:max-w-xl mx-2">
            <ContactForm
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onSave={handleSaveContact}
            />
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-xs lg:max-w-sm bg-red-100 text-red-700 rounded-lg shadow-lg flex items-center z-50 p-3 sm:p-4">
          <span className="text-sm sm:text-base flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-3 sm:ml-4 text-red-700 hover:text-red-900 text-sm sm:text-base flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Import Toast */}
      {isImporting && (
        <div className="fixed bottom-20 sm:bottom-4 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-xs lg:max-w-sm bg-blue-100 text-blue-700 rounded-lg shadow-md flex items-center gap-2 z-50 p-3 sm:p-4">
          <Spinner />
          <span className="text-sm sm:text-base">
            Importing {importingCount} contact{importingCount !== 1 ? "s" : ""}...
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
