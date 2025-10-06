"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit as EditIcon, Trash, Users, X, Tag as TagIcon, Hash, Search } from "lucide-react";
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
  onClose?: () => void;
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
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Filtered tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase().trim();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(query) || 
      tag.tag_description.toLowerCase().includes(query)
    );
  }, [tags, searchQuery]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsOperationLoading(true);
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
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleTagSelect = (tagName: string | null) => {
    onTagSelect(tagName);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setIsOperationLoading(true);
    try {
      await onDeleteTag(tagId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const shouldShowInitialLoader = tagsLoading && tags.length === 0;

  return (
    <>
      {/*  Container with flex layout */}
      <div className="w-full h-full bg-white flex flex-col">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <TagIcon className="h-4 w-4 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="h-8 w-8 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSearchExpanded ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchExpanded && (
          <div className="px-4 pb-3 border-b border-gray-200 bg-white lg:hidden flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Desktop search bar */}
        <div className="hidden lg:block px-4 sm:px-5 pt-4 sm:pt-5 pb-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {shouldShowInitialLoader ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <Spinner />
              <p className="mt-3 text-sm text-gray-500">Loading tags...</p>
            </div>
          ) : (
            <>
              {/*  Action Buttons */}
              <div className="px-4 sm:px-5 pt-3 pb-2 flex-shrink-0 relative">
                {/* Operation loading overlay */}
                {isOperationLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span className="text-sm text-gray-600">Processing...</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <button
  onClick={() => {
    setShowCreateForm(true);
    setEditingTag(null);
  }}
  disabled={isOperationLoading}
  className="w-full group bg-gray-200 hover:bg-gray-300 text-black border-0 shadow-sm hover:shadow-md transition-all duration-200 text-sm py-2 sm:py-2.5 rounded-lg font-medium flex items-center justify-start gap-2 pl-14 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
  <span>Create Tag</span>
</button>


                  <button
                    onClick={() => handleTagSelect(null)}
                    disabled={isOperationLoading}
                    className={`w-full transition-all duration-200 text-sm py-2 sm:py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedTag === null
                        ? "bg-gray-100 text-gray-800 shadow-sm border border-gray-300"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ml-10 ${
                      selectedTag === null ? "bg-gray-200" : "bg-gray-100"
                    }`}>
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="flex-1 text-left">All Customers</span>
                  </button>
                </div>
              </div>

              {/*  Tags header */}
              <div className="px-4 sm:px-5 pb-2 flex-shrink-0">
                <h3 className="text-xs font-semibold uppercase text-gray-500 px-1 tracking-wider flex items-center gap-2">
                  <Hash className="w-3 h-3" />
                  Tags ({filteredTags.length})
                </h3>
              </div>

              {/* tags list */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-5">
                {/* Search results message */}
                {searchQuery && filteredTags.length === 0 && (
                  <div className="text-center py-4">
<p className="text-sm text-gray-500">
  No tags found matching &quot;{searchQuery}&quot;
</p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Clear search
                    </button>
                  </div>
                )}
                
                {filteredTags.length === 0 && !searchQuery ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-200 flex items-center justify-center">
                        <TagIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">No tags created yet</p>
                      <p className="text-xs text-gray-500">Create your first tag to organize contacts</p>
                    </div>
                  </div>
                ) : filteredTags.length > 0 ? (
                  /* tags list */
                  <div className="space-y-2 pb-4">
                    {filteredTags.map((tag) => (
                      <Card 
                        key={tag.id} 
                        className={`hover:shadow-md transition-all duration-200 cursor-pointer border ${
                          selectedTag === tag.name 
                            ? "bg-gray-50 border-gray-300 shadow-sm" 
                            : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                        } ${isOperationLoading ? "opacity-50" : ""}`}
                        onClick={(e) => {
                          if (!(e.target as Element).closest('.kebab-menu') && !isOperationLoading) {
                            handleTagSelect(tag.name);
                          }
                        }}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium truncate text-sm sm:text-base ${
                                selectedTag === tag.name ? "text-gray-800" : "text-gray-900"
                              }`}>
                                {tag.name}
                              </h3>
                              {tag.tag_description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 sm:text-sm">
                                  {tag.tag_description}
                                </p>
                              )}
                            </div>

                            {/* Kebab Menu */}
                            <div className="relative kebab-menu flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:bg-gray-200 rounded-md transition-colors sm:h-8 sm:w-8"
                                disabled={isOperationLoading}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isOperationLoading) {
                                    setOpenMenuId(openMenuId === tag.id ? null : tag.id);
                                  }
                                }}
                              >
                                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>

                              {openMenuId === tag.id && !isOperationLoading && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 sm:w-36">
                                  <button
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2 sm:text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTag(tag);
                                      setNewTagName(tag.name);
                                      setNewTagDescription(tag.tag_description);
                                      setShowCreateForm(true);
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <EditIcon className="w-3.5 h-3.5 text-gray-600" />
                                    <span className="text-gray-700">Edit</span>
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2 sm:text-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Are you sure you want to delete this tag?")) {
                                        handleDeleteTag(tag.id);
                                      }
                                      setOpenMenuId(null);
                                    }}
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm shadow-xl sm:max-w-md lg:max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingTag ? "Edit Tag" : "Create New Tag"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingTag ? "Update tag information" : "Add a new tag to organize contacts"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTag(null);
                    setNewTagName("");
                    setNewTagDescription("");
                  }}
                  className="h-8 w-8 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                    placeholder="Enter tag name"
                    required
                    maxLength={50}
                    disabled={isOperationLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none sm:text-base"
                    placeholder="Enter description (optional)"
                    rows={3}
                    maxLength={200}
                    disabled={isOperationLoading}
                  />
                  <p className="text-xs text-gray-500">
                    {newTagDescription.length}/200 characters
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTag(null);
                      setNewTagName("");
                      setNewTagDescription("");
                    }}
                    className="w-full order-2 sm:w-auto sm:order-1"
                    disabled={isOperationLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors order-1 sm:w-auto sm:order-2"
                    disabled={!newTagName.trim() || isOperationLoading}
                  >
                    {isOperationLoading ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        {editingTag ? "Saving..." : "Creating..."}
                      </div>
                    ) : (
                      editingTag ? "Save Changes" : "Create Tag"
                    )}
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
