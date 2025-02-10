import { useState, useEffect } from "react";
import { supabase } from "../path/to/supabaseClient";

interface Tag {
  id: string;
  name: string;
  tag_description: string;
}

interface TagSidebarProps {
  tags: Tag[];
  onCreateTag: (name: string, description: string) => void;
  onEditTag: (id: string, name: string, description: string) => void;
  onDeleteTag: (id: string) => void;
  onSelectChannel: (channelId: string | null) => void;
  selectedChannel: string | null;
  error?: string | null;
}

const TagSidebar = ({ 
  tags,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onSelectChannel,
  selectedChannel,
  error
}: TagSidebarProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.kebab-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleKebabClick = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === tagId ? null : tagId);
  };

  const handleEditClick = (tag: Tag, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagDescription(tag.tag_description);
    setOpenMenuId(null);
    setShowCreateForm(true);
  };

  const handleDeleteClick = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this tag?")) {
      onDeleteTag(tagId);
    }
    setOpenMenuId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      if (editingTag) {
        await onEditTag(editingTag.id, newTagName.trim(), newTagDescription.trim());
      } else {
        await onCreateTag(newTagName.trim(), newTagDescription.trim());
      }
      
      setNewTagName("");
      setNewTagDescription("");
      setEditingTag(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  return (
    <div className="w-64 border-r border-gray-200 p-3 bg-white flex flex-col h-screen relative shadow-lg">
      <button
        onClick={() => {
          setShowCreateForm(true);
          setEditingTag(null);
        }}
        className="mb-3 bg-gradient-to-br from-blue-600 to-blue-500 text-white px-3 py-2 rounded-md hover:to-blue-600 transition-all shadow-sm hover:shadow-md text-sm font-medium flex items-center justify-center"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        Create Tag
      </button>

      {/* Create/Edit Modal */}
      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-5 rounded-lg w-88 shadow-xl border border-gray-100">
            <h3 className="text-md font-semibold mb-3 text-gray-800">
              {editingTag ? 'Edit Tag' : 'Create New Tag'}
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tag Name</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                <input
                  type="text"
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTag(null);
                  }}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium border border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all"
                >
                  {editingTag ? 'Save Changes' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

<div className="flex-1 overflow-y-auto pr-2">
        {tags.map(tag => (
          <div
            key={tag.id}
            onClick={() => onSelectChannel(tag.id)}
            className={`group p-2 cursor-pointer hover:bg-blue-50/50 rounded-md transition-colors mb-1 ${
              selectedChannel === tag.id 
                ? "bg-blue-50 border-l-2 border-blue-600" 
                : "hover:border-l-2 border-transparent hover:border-blue-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 truncate">{tag.name}</div>
                {tag.tag_description && (
                  <div className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {tag.tag_description}
                  </div>
                )}
              </div>
              
              <div className="relative kebab-menu">
                <button
                  onClick={(e) => handleKebabClick(tag.id, e)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Tag actions"
                >
                  <svg 
                    className="w-4 h-4 text-gray-500 hover:text-gray-700" 
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

                {openMenuId === tag.id && (
                  <div 
                    className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1.5 z-10 border border-gray-200 animate-fade-in-up text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleEditClick(tag, e)}
                      className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >

                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(tag.id, e)}
                      className="w-full px-3 py-1.5 text-red-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSidebar;