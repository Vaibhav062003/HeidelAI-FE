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
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagsLoading, setTagsLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchContacts = useCallback(async () => {
    try {
      let query = supabase
        .from('contacts')
        .select('*');
  
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }
      console.log("selected",selectedTag);
      console.log("query",query);
  
      const { data, error } = await query;
      
      if (error) throw error;
      setContacts(data?.map(c => ({
        ...c,
        tags: Array.isArray(c.tags) ? c.tags : []
      })) || []);
      // console.log("contact",contacts);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [selectedTag]); // Add selectedTagId as a dependency

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchContacts();
      await fetchTags();
    };
    fetchInitialData();
  }, []);

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
    return contacts.filter((contact) => {
      return `${contact.firstName} ${contact.lastName} ${contact.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [contacts, searchQuery]); // Removed client-side tag filtering
  // console.log( "filtered contact", filteredContacts );

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="h-screen w-full flex flex-row bg-background">
      <TagSidebar
        tags={tags}
        tagsLoading={tagsLoading}
        onCreateTag={handleCreateTag}
        onEditTag={handleEditTag}
        onDeleteTag={handleDeleteTag}
        onTagSelect={setSelectedTag}
        selectedTag={selectedTag}
        onTagModalOpen={() => setIsTagModalOpen(true)}
        onTagModalClose={() => setIsTagModalOpen(false)}
        error={error}
      />

      <div className="flex-1 flex flex-col h-screen max-h-screen">
        <div className="flex-none">
          <ContactListHeader
            searchValue={searchQuery}
            onSearch={setSearchQuery}
            onAddContact={() => setSelectedContact({} as any)}
            onImportCSV={handleFileUpload}
            onMessageSend={() => {}} // Add your message sending logic here
          />
        </div>

        <div className="flex-1 overflow-hidden p-4">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : contacts.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">No contacts found 🔍</p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border">
      {filteredContacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          onEdit={() => handleEdit(contact)}
          onDelete={() => handleDelete(contact.id)}
        />
      ))}
              </div>

              {filteredContacts.length > itemsPerPage && (
                <div className="flex-none pt-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-4 rounded flex items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {isImporting && (
        <div className="fixed bottom-4 right-4 bg-blue-100 text-blue-700 p-4 rounded-lg shadow-md flex items-center gap-2">
          <Spinner />
          <span>
            Importing {importingCount} contact{importingCount !== 1 ? "s" : ""}
            ...
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactsDashboard;
