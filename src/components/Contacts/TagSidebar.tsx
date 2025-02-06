interface TagSidebarProps {
    tags: Tag[];
    onCreateTag: (name: string) => void;
  }
  
  export const TagSidebar = ({ tags, onCreateTag }: TagSidebarProps) => {
    const [newTag, setNewTag] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newTag.trim()) {
        onCreateTag(newTag.trim());
        setNewTag('');
      }
    };
  
    return (
      <div className="w-64 border-r p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Tags</h2>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Create new tag"
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
          >
            Add Tag
          </button>
        </form>
  
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded">
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };