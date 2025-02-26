"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit as EditIcon, Trash, Users } from "lucide-react";
import { Spinner } from "./Spinner";

interface Tag {
  id: string;
  name: string;
  tag_description: string;
}

interface TagSidebarProps {
  tags: Tag[];
  tagsLoading?: boolean;
  onCreateTag: (name: string, description: string) => void;
  onEditTag: (id: string, name: string, description: string) => void;
  onDeleteTag: (id: string) => void;
  onTagSelect: (tagId: string | null) => void;
  selectedTag: string | null;
  error?: string | null;
  onTagModalOpen?: () => void;
  onTagModalClose?: () => void;
}

interface TagWithCount extends Tag {
  count: number;
}

const TagSidebar = ({
  tags,
  tagsLoading,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onTagSelect,
  selectedTag,
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
      if (!(e.target as Element).closest(".kebab-menu")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showCreateForm || editingTag) {
      onTagModalOpen?.();
    } else {
      onTagModalClose?.();
    }
  }, [showCreateForm, editingTag, onTagModalOpen, onTagModalClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      if (editingTag) {
        onEditTag(editingTag.id, newTagName.trim(), newTagDescription.trim());
      } else {
        onCreateTag(newTagName.trim(), newTagDescription.trim());
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
      {/* Loading state */}
      {tagsLoading && (
        <div className="p-4 text-center text-gray-500">
          <Spinner />
        </div>
      )}
      <div className="space-y-3">
        <Button
          onClick={() => {
            setShowCreateForm(true);
            setEditingTag(null);
          }}
          className="w-full bg-white text-black border border-gray-300 hover:border-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tag
        </Button>

        <Button
          onClick={() => onTagSelect(null)}
          className={`w-full justify-start ${
            selectedTag === null
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-white text-black border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          All Customers
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 px-1">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <Card 
              key={tag.id} 
              className={`hover:shadow-sm transition-all cursor-pointer ${
                selectedTag === tag.name ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={(e) => {
                // Only trigger tag selection if not clicking on the menu
                if (!(e.target as Element).closest('.kebab-menu')) {
                  onTagSelect(tag.name);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm ${
                      selectedTag === tag.name ? "text-blue-700" : ""
                    }`}>
                      {tag.name}
                    </h3>
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
                            setShowCreateForm(true);
                            setOpenMenuId(null);
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
                            if (window.confirm("Are you sure?")) {
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

      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <Card className="w-[400px] shadow-lg">
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
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
                    className="bg-white text-black border border-gray-300 hover:border-blue-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-white text-black border border-gray-300 hover:border-blue-600"
                  >
                    {editingTag ? "Save Changes" : "Create Tag"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>  
  );
};

export default TagSidebar;