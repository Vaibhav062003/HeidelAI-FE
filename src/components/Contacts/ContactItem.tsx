interface ContactItemProps {
  contact: Contact;
  tags: Tag[];
  onEdit: () => void;
  onDelete: () => void;
}

export const ContactItem = ({ contact, tags, onEdit, onDelete }: ContactItemProps) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium">{contact.name}</h3>
        <p className="text-sm text-gray-600">{contact.email}</p>
        {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {contact.tags?.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? (
              <span key={tagId} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {tag.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>
    </div>
  </div>
);