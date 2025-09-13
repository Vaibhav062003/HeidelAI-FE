"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit as EditIcon, Trash, Users, X } from "lucide-react";
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
  onClose?: () => void; // For mobile close functionality
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
  onClose,
}: TagSidebarProps) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);

  // Screen width detection
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleTagSelect = (tagName: string | null) => {
    onTagSelect(tagName);
    // Close sidebar on mobile after selection
    if (screenWidth < 1024 && onClose) {
      onClose();
    }
  };

  // Determine if mobile layout
  const isMobile = screenWidth < 1024;
  
  return (
    <>
      <div className="w-full h-full bg-white flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {/* Loading state */}
          {tagsLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          )}

          {!tagsLoading && (
            <div className="space-y-3 sm:space-y-4">
              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <Button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingTag(null);
                  }}
                  className="w-full bg-white text-black border border-gray-300 hover:border-blue-600 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tag
                </Button>

                <Button
                  onClick={() => handleTagSelect(null)}
                  className={`w-full justify-start text-sm sm:text-base py-2 sm:py-2.5 ${
                    selectedTag === null
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-white text-black border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  All Customers
                </Button>
              </div>

              {/* Tags Section */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 px-1">
                  Tags ({tags.length})
                </h3>
                
                {tags.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tags created yet</p>
                    <p className="text-xs mt-1">Create your first tag to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <Card 
                        key={tag.id} 
                        className={`hover:shadow-sm transition-all cursor-pointer ${
                          selectedTag === tag.name ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={(e) => {
                          // Only trigger tag selection if not clicking on the menu
                          if (!(e.target as Element).closest('.kebab-menu')) {
                            handleTagSelect(tag.name);
                          }
                        }}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium text-sm sm:text-base truncate ${
                                selectedTag === tag.name ? "text-blue-700" : "text-gray-900"
                              }`}>
                                {tag.name}
                              </h3>
                              {tag.tag_description && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                                  {tag.tag_description}
                                </p>
                              )}
                            </div>

                            <div className="relative kebab-menu flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 sm:h-8 sm:w-8 hover:bg-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === tag.id ? null : tag.id);
                                }}
                              >
                                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>

                              {openMenuId === tag.id && (
                                <div className="absolute right-0 mt-1 w-32 sm:w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start px-2 sm:px-3 py-1.5 text-xs sm:text-sm hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTag(tag);
                                      setNewTagName(tag.name);
                                      setNewTagDescription(tag.tag_description);
                                      setShowCreateForm(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <EditIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Are you sure you want to delete this tag?")) {
                                        onDeleteTag(tag.id);
                                      }
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Tag - Responsive */}
      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">
                  {editingTag ? "Edit Tag" : "Create New Tag"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTag(null);
                    setNewTagName("");
                    setNewTagDescription("");
                  }}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tag Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter tag name"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                    placeholder="Enter description (optional)"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500">
                    {newTagDescription.length}/200 characters
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTag(null);
                      setNewTagName("");
                      setNewTagDescription("");
                    }}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 order-1 sm:order-2"
                    disabled={!newTagName.trim()}
                  >
                    {editingTag ? "Save Changes" : "Create Tag"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TagSidebar;
