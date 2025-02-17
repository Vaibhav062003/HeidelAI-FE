import { useState, useCallback, useEffect } from "react";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import { ContactItem } from "./ContactItem";
import { ContactListHeader } from "./ContactListHeader";
import { PaginationFooter } from "./PaginationFooter";
import { ContactForm } from "./ContactFormModal";
import { Spinner } from "./Spinner";
import TagSidebar from "./TagSidebar";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
}

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


  // const [channels, setChannels] = useState<BroadcastChannel[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from("contacts").select("*");
      if (error) setError(error.message);
      else setContacts(data || []);
      setLoading(false);
    };
    fetchContacts();
  }, []);

  // Fetch initial tags
  useEffect(() => {
    fetchTags();
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      setError(null);
      setImportingCount(0);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const requiredFields = ["firstName", "email"];
            const missingFields = requiredFields.filter(
              (f) => !results.meta.fields?.includes(f)
            );
            if (missingFields.length)
              throw new Error(`Missing columns: ${missingFields.join(", ")}`);

            const contactsToImport = results.data.map((row: any, index) => {
              const missing = requiredFields.filter(
                (f) => !row[f]?.toString().trim()
              );
              if (missing.length)
                throw new Error(
                  `Row ${index + 1} missing: ${missing.join(", ")}`
                );

              return {
                firstName: row.firstName.toString().trim(),
                lastName: row.lastName?.toString().trim() || "",
                email: row.email.toString().trim(),
                phone: (row.phone || "").toString().trim(),
                company: (row.company || "").toString().trim(),
              };
            });

            setImportingCount(contactsToImport.length);
            const { data, error } = await supabase
              .from("contacts")
              .insert(contactsToImport)
              .select();
            if (error) throw error;

            setContacts((prev) => [...prev, ...data]);
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

  const handleSaveContact = useCallback(
    (contact: Partial<Contact>) => {
      if (selectedContact?.id) {
        // Update existing contact
        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContact.id ? { ...c, ...contact } : c
          )
        );
      } else {
        // Add new contact
        const newContact = {
          ...contact,
          id: `manual-${Date.now()}`,
        } as Contact;
        setContacts((prev) => [...prev, newContact]);
      }
      setSelectedContact(null);
    },
    [selectedContact]
  );

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact); // Set selected contact to be edited
  };

  const handleDelete = async (contactId: string) => {
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", contactId);

    if (error) {
      alert("Error deleting contact: " + error.message);
    } else {
      setContacts(contacts.filter((contact) => contact.id !== contactId));
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName} ${contact.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // fetch tags
  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, tag_description')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tags:', error);
      setError('Failed to load tags');
    } else {
      setTags(data);
    }
  };

  const handleCreateTag = async (name: string, description: string) => {
    setError(null);
    
    // Check for existing tag first
    const { data: existingTags } = await supabase
      .from('tags')
      .select('id')
      .ilike('name', name);

    if (existingTags && existingTags.length > 0) {
      setError('Tag name already exists');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('tags')
      .insert([{ 
        name: name,
        tag_description: description 
      }])
      .select();

    if (insertError) {
      console.error('Error creating tag:', insertError);
      setError('Failed to create tag');
    } else if (data) {
      setTags(prev => [data[0], ...prev]); // Add new tag to top
    }
  };

  // tag edit and delete 
  const handleEditTag = async (id: string, newName: string, newDescription: string) => {
    setError(null);
    // When editing a tag, clear the contact edit modal:
    setSelectedContact(null);

    // Check for existing tags excluding the current one
    const { data: existingTags } = await supabase
      .from("tags")
      .select("id")
      .ilike("name", newName)
      .neq("id", id);

    if (existingTags && existingTags.length > 0) {
      setError("Tag name already exists");
      return;
    }

    const { data, error } = await supabase
      .from("tags")
      .update({
        name: newName,
        tag_description: newDescription,
      })
      .eq("id", id)
      .select();
        
    if (error) {
      console.error("Error updating tag:", error);
      setError("Failed to update tag");
    } else if (data) {
      setTags((prev) =>
        prev.map((tag) => (tag.id === id ? { ...tag, ...data[0] } : tag))
      );
    }
  };

  const handleDeleteTag = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tag:', error);
      setError('Failed to delete tag');
    } else {
      setTags(prev => prev.filter(tag => tag.id !== id));
    }
  };

  return (
    <div className="h-screen w-full flex flex-row bg-background">
      {/* Sidebar - fixed height */}
      <TagSidebar
        tags={tags}
        onCreateTag={handleCreateTag}
        onEditTag={handleEditTag}
        onDeleteTag={handleDeleteTag}
        onSelectChannel={(channelId) => {
          /* your select logic */
        }}
        onTagModalOpen={() => setIsTagModalOpen(true)}
        onTagModalClose={() => setIsTagModalOpen(false)}

        selectedChannel={null}
        error={error}
      />

      {/* Main content area - fixed height with internal scrolling */}
      <div className="flex-1 flex flex-col h-screen max-h-screen">
        {/* Header - fixed at top */}
        <div className="flex-none">
          <ContactListHeader
            searchValue={searchQuery}
            onSearch={setSearchQuery}
            onAddContact={() => setSelectedContact({} as Contact)}
            onImportCSV={handleFileUpload}
          />
        </div>

        {/* Main content - scrollable */}
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
              {/* Contact list - scrollable */}
              <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border">
                {paginatedContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onEdit={() => setSelectedContact(contact)}
                    onDelete={() => handleDelete(contact.id)}
                  />
                ))}
              </div>

              {/* Pagination - fixed at bottom */}
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

      {/* Modals and notifications */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
            <ContactForm
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onSave={(newContact) => {
                handleSaveContact(newContact);
                setSelectedContact(null);
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-700 p-4 rounded">
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