"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import Papa from "papaparse";
import { ContactItem } from "../Contacts/ContactItem";
import { ContactListHeader } from "../Contacts/ContactListHeader";
import { PaginationFooter } from "../Contacts/PaginationFooter";
import { ContactForm } from "../Contacts/ContactFormModal";
import { Spinner } from "../Contacts/Spinner";
import TagSidebar from "./TagSidebar";
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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


  const fetchContacts = useCallback(async () => {
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


      const mappedContacts = contactsArray.map((contact: ApiContact, index: number) => {
        return mapApiContactToContact(contact);
      });


      setContacts(mappedContacts);
      setError(null);

    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message || "Failed to load contacts");
  } else {
    setError("Failed to load contacts");
  }
  setContacts([]);
} finally {
      setLoading(false);
    }
  }, [selectedTag]);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchContacts();
      await fetchTags();
    };
    fetchInitialData();
  }, [selectedTag]);

  useEffect(() => {
    fetchContacts();
  }, [selectedTag, fetchContacts]);

  const fetchTags = async () => {
    setTagsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      setError("Failed to load tags");
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

  const handleEditTag = async (
    id: string,
    name: string,
    description: string
  ) => {
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
    }
    
    return filtered;
  }, [contacts, searchQuery, selectedTag]);

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  return (
    <div className="h-full w-full flex bg-white overflow-hidden">
      {/* Tag Sidebar */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        {/* Header */}
        <div className="flex-shrink-0">
          <ContactListHeader
            searchValue={searchQuery}
            onSearch={setSearchQuery}
            onAddContact={() => setSelectedContact({} as Contact)}
            onImportCSV={handleFileUpload}
            onMessageSend={() => {}}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                {searchQuery ? "No matching contacts found 🔍" : "No contacts found 🔍"}
              </p>
            </div>
          ) : (
            <>
              {/* Contact List */}
              <div className="flex-1 overflow-y-auto min-h-0">
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

              {/* Pagination */}
              <div className="flex-shrink-0">
                <PaginationFooter
                  currentPage={currentPage}
                  totalItems={filteredContacts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-md">
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
        <div className="fixed bottom-4 right-4 max-w-sm bg-red-50 text-red-700 rounded-lg shadow-lg flex items-center z-50 p-4 border border-red-200">
          <span className="text-sm flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Import Toast */}
      {isImporting && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-blue-50 text-blue-700 rounded-lg shadow-lg flex items-center gap-3 z-50 p-4 border border-blue-200">
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