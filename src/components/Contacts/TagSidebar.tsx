import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit as EditIcon, Trash } from "lucide-react";

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
  onTagModalOpen?: () => void;
  onTagModalClose?: () => void;
}

const TagSidebar = ({
  tags,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onSelectChannel,
  selectedChannel,
  error,
  onTagModalOpen,
  onTagModalClose,
}: TagSidebarProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.kebab-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showCreateForm || editingTag) {
      onTagModalOpen?.();
    } else {
      onTagModalClose?.();
    }
  }, [showCreateForm, editingTag]);

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
    <div className="w-64 h-screen bg-white p-4 border-r border-gray-200">
      <Button
        onClick={() => {
          setShowCreateForm(true);
          setEditingTag(null);
        }}
        className="w-full mb-4 gap-2"
      >
        <Plus className="w-4 h-4" />
        Create Tag
      </Button>

      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Card className="w-[400px]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingTag ? "Edit Tag" : "Create New Tag"}
              </h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tag Name</label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter tag name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <input
                    type="text"
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter description (optional)"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTag(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTag ? 'Save Changes' : 'Create Tag'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-2">
        {tags.map(tag => (
          <Card
            key={tag.id}
            className={`hover:shadow-sm transition-all cursor-pointer ${
              selectedChannel === tag.id ? "border-blue-600" : ""
            }`}
            onClick={() => onSelectChannel(tag.id)}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{tag.name}</h3>
                  {tag.tag_description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {tag.tag_description}
                    </p>
                  )}
                </div>
                
                <div className="relative kebab-menu">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === tag.id ? null : tag.id);
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {openMenuId === tag.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-1.5 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTag(tag);
                          setNewTagName(tag.name);
                          setNewTagDescription(tag.tag_description);
                          setOpenMenuId(null);
                          setShowCreateForm(true);
                        }}
                      >
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-3 py-1.5 text-sm text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this tag?")) {
                            onDeleteTag(tag.id);
                          }
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TagSidebar;