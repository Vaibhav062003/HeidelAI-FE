"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";
import { ContactItem } from "../Contacts/ContactItem";
import { ContactListHeader } from "../Contacts/ContactListHeader";
import { PaginationFooter } from "../Contacts/PaginationFooter";
import { ContactForm } from "../Contacts/ContactFormModal";
import { Spinner } from "../Contacts/Spinner";
import TagSidebar from "../Contacts/TagSidebar";
import api from "@/lib/session_api";
import { ApiContact, Contact, Tag } from "../types/contacts";

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
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagsLoading, setTagsLoading] = useState(true);
  const itemsPerPage = 10;

  const mapApiContactToContact = (apiContact: ApiContact): Contact => {
    const fullName = apiContact.full_name || "Unknown";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "";

    return {
      id: apiContact.conversation_id,
      firstName,
      lastName,
      email: apiContact.email || `@${apiContact.platform}.user`,
      phone: apiContact.phone_number,
      company: undefined,
      country: apiContact.country || undefined,
      tags: apiContact.categories || [],
      platform: apiContact.platform,
      profile_url: apiContact.profile_url,
      username: apiContact.username,
      instagram_id: apiContact.instagram_id,
      full_name: fullName,
      conversation_id: apiContact.conversation_id,
      categories: apiContact.categories,
    };
  };

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/api/contacts");

      let contactsArray: ApiContact[] = [];

      if (Array.isArray(response.data)) {
        contactsArray = response.data;
      } else if (response.data && Array.isArray(response.data.contacts)) {
        contactsArray = response.data.contacts;
      } else {
        setContacts([]);
        setError("Invalid response format from API");
        setLoading(false);
        return;
      }


      if (contactsArray.length === 0) {
        setContacts([]);
        setError(null);
        setLoading(false);
        return;
      }

      const mappedContacts = contactsArray.map((contact: ApiContact, index: number) => {
        return mapApiContactToContact(contact);
      });


      setContacts(mappedContacts);
      setError(null);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
      console.log("🏁 Fetch complete");
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag !== null) {
      fetchContacts();
    }
  }, [selectedTag]);

  const fetchTags = async () => {
    setTagsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;      setTags(data || []);
    } catch (err) {
      console.error(" Tags error:", err);
    } finally {
      setTagsLoading(false);
    }
  };

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
            setImportingCount(results.data.length);
            await fetchContacts();
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
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSaveContact = useCallback(
    async (updatedContact: Partial<Contact>) => {
      try {
        if (selectedContact?.conversation_id) {
          const response = await api.post("/api/contacts/update-categories", {
            conversation_id: selectedContact.conversation_id,
            categories: updatedContact.tags || [],
          });

          setContacts((prev) =>
            prev.map((c) =>
              c.id === selectedContact.id
                ? mapApiContactToContact(response.data)
                : c
            )
          );
        }
        setSelectedContact(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to save contact");
      }
    },
    [selectedContact]
  );

  const handleCreateTag = async (name: string, description: string) => {
    try {
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id")
        .ilike("name", name);

      if (existingTags && existingTags.length > 0) {
        throw new Error("Tag name already exists");
      }

      const { data, error } = await supabase
        .from("tags")
        .insert([{ name, tag_description: description }])
        .select();

      if (error) throw error;
      setTags((prev) => [data[0], ...prev]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEditTag = async (id: string, name: string, description: string) => {
    try {
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id")
        .ilike("name", name)
        .neq("id", id);

      if (existingTags && existingTags.length > 0) {
        throw new Error("Tag name already exists");
      }

      const { data, error } = await supabase
        .from("tags")
        .update({ name, tag_description: description })
        .eq("id", id)
        .select();

      if (error) throw error;
      setTags((prev) => prev.map((tag) => (tag.id === id ? data[0] : tag)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this tag?")) return;

      const { error } = await supabase.from("tags").delete().eq("id", id);

      if (error) throw error;
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const filteredContacts = useMemo(() => {
    console.log(`Filtering - Total: ${contacts.length}, Search: "${searchQuery}", Tag: ${selectedTag}`);
    
    let filtered = contacts;
    
    if (selectedTag) {
      filtered = filtered.filter((contact) =>
        contact.tags.includes(selectedTag)
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter((contact) => {
        const searchText = `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.username || ""}`;
        return searchText.toLowerCase().includes(searchQuery.toLowerCase());
      });
      console.log(` After search: ${filtered.length}`);
    }
    
    return filtered;
  }, [contacts, searchQuery, selectedTag]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredContacts.slice(start, end);
  }, [filteredContacts, currentPage, itemsPerPage]);

return (
      <div className="h-full w-full flex bg-white overflow-hidden">
      <div className="w-64 flex-shrink-0 h-full bg-white border-r border-gray-200">
        <TagSidebar
          tags={tags}
          tagsLoading={tagsLoading}
          onCreateTag={handleCreateTag}
          onEditTag={handleEditTag}
          onDeleteTag={handleDeleteTag}
          onTagSelect={setSelectedTag}
          selectedTag={selectedTag}
          onTagModalOpen={() => setIsTagModalOpen(true)}
          error={error}
        />
        </div>


    <div className="flex-1 flex flex-col h-screen max-h-screen">
      <div className="flex-none">
        <ContactListHeader
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          onAddContact={() => setSelectedContact({} as Contact)}
          onImportCSV={handleFileUpload}
          onMessageSend={() => {}}
        />
      </div>

      <div className="flex-1 overflow-hidden">
         {/* Active Filters Bar */}
        {(selectedTag || searchQuery) && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <span className="text-sm text-gray-600 font-medium">Filters:</span>
            
            {selectedTag && (
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-indigo-200 shadow-sm">
                <span className="text-sm text-indigo-700 font-medium">🏷️ {selectedTag}</span>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full p-0.5 transition-colors"
                  title="Remove tag filter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {searchQuery && (
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-indigo-200 shadow-sm">
                <span className="text-sm text-indigo-700 font-medium">🔍 "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full p-0.5 transition-colors"
                  title="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <button
              onClick={() => {
                setSelectedTag(null);
                setSearchQuery("");
              }}
              className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
            >
              Clear all
            </button>
            
            <span className="text-xs text-gray-500">
              {filteredContacts.length} of {contacts.length} contacts
            </span>
          </div>
        )}

        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Spinner />
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500 text-lg">No contacts found 🔍</p>
            <p className="text-gray-400 text-sm">
              {contacts.length > 0 
                ? `${contacts.length} total contacts (hidden by filters)`
                : "Check your API connection or add contacts"}
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Contact List */}
            <div className="flex-1 overflow-y-auto bg-white">
              {paginatedContacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  onEdit={() => handleEdit(contact)}
                  onDelete={() => handleDelete(contact.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredContacts.length > itemsPerPage && (
              <div className="flex-none border-t border-gray-200 bg-white">
                <PaginationFooter
                  currentPage={currentPage}
                  totalItems={filteredContacts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>

      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
            <ContactForm
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onSave={handleSaveContact}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-700 p-4 rounded-lg shadow-lg flex items-center z-50 border border-red-200">
          <span className="text-sm flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {isImporting && (
        <div className="fixed bottom-4 right-4 bg-blue-50 text-blue-700 p-4 rounded-lg shadow-md flex items-center gap-2 z-50 border border-blue-200">
          <Spinner />
          <span className="text-sm">
            Importing {importingCount} contact{importingCount !== 1 ? "s" : ""}...
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
