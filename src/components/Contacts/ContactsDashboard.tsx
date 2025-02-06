import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { ContactListHeader } from "@/components/Contacts/ContactListHeader";
import { ContactItem } from "@/components/Contacts/ContactItem";
import { PaginationFooter } from "@/components/Contacts/PaginationFooter";
import { ContactFormModal }  from "@/components/Contacts/ContactFormModal";
  
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

const ContactsDashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 15;

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validContacts = results.data
          .filter((row: any) => row.name && row.email)
          .map((row: any, index) => ({
            id: `csv-${Date.now()}-${index}`,
            name: row.name,
            email: row.email,
            phone: row.phone || '',
            company: row.company || '',
            notes: row.notes || ''
          }));
        
        setContacts(prev => [...prev, ...validContacts]);
      },
      error: (err) => {
        setError('Error parsing CSV file: ' + err.message);
      }
    });
  }, []);

  const handleSaveContact = useCallback((contact: Partial<Contact>) => {
    if (selectedContact?.id) {
      // Update existing contact
      setContacts(prev => prev.map(c => 
        c.id === selectedContact.id ? { ...c, ...contact } : c
      ));
    } else {
      // Add new contact
      const newContact = {
        ...contact,
        id: `manual-${Date.now()}`
      } as Contact;
      setContacts(prev => [...prev, newContact]);
    }
    setSelectedContact(null);
  }, [selectedContact]);

  const handleDelete = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <ContactListHeader
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onAddContact={() => setSelectedContact({} as Contact)}
        onImportCSV={handleFileUpload}
      />

      <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg mb-4">
                No contacts found. Import CSV or add manually.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedContacts.map(contact => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  onEdit={() => setSelectedContact(contact)}
                  onDelete={() => handleDelete(contact.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {filteredContacts.length > itemsPerPage && (
        <PaginationFooter
          currentPage={currentPage}
          totalItems={filteredContacts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      <ContactFormModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onSave={handleSaveContact}
      />

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
    </div>
  );
};

export default ContactsDashboard;