"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Edit as EditIcon, Trash, Users, X, Tag as TagIcon, Search, MessageSquare } from "lucide-react";
import { Spinner } from "./Spinner";
import { MessageComposer } from "./MessageComposer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MessageData {
  tag?: string;
  platform: "whatsapp" | "instagram";
  template: string;
}

interface Tag {
  id: string;
  name: string;
  tag_description: string;
}

interface TagsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagsPopup = ({ isOpen, onClose }: TagsPopupProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [isMessageComposerOpen, setIsMessageComposerOpen] = useState(false);
  const [selectedTagForMessage, setSelectedTagForMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

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

  const handleEditTag = async (id: string, name: string, description: string) => {
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
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

const filteredTags = useMemo(() => {
  if (!searchQuery.trim()) return tags;
  const query = searchQuery.toLowerCase().trim();
  return tags.filter(tag => {
    const nameMatch = tag.name?.toLowerCase().includes(query) || false;
    const descMatch = tag.tag_description?.toLowerCase().includes(query) || false;
    return nameMatch || descMatch;
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setIsOperationLoading(true);
    try {
      if (editingTag) {
        await handleEditTag(editingTag.id, newTagName.trim(), newTagDescription.trim());
      } else {
        await handleCreateTag(newTagName.trim(), newTagDescription.trim());
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
    setSelectedTag(tagName);
    const event = new CustomEvent('tagSelected', { detail: { tagName } });
    window.dispatchEvent(event);
    onClose();
  };

  const handleDeleteTagClick = async (tagId: string) => {
    setIsOperationLoading(true);
    try {
      await handleDeleteTag(tagId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsOperationLoading(false);
    }
  };

  const handleMessageClick = (tagName: string) => {
    setSelectedTagForMessage(tagName);
    setIsMessageComposerOpen(true);
    setOpenMenuId(null);
  };

  const handleMessageSend = (data: MessageData) => {
    console.log("Message sent:", data);
    setIsMessageComposerOpen(false);
    setSelectedTagForMessage("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[420px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header - More compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <TagIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Manage Tags</h2>
              <p className="text-[10px] text-gray-500">{filteredTags.length} available</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>

        {/* Search - More compact */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          {tagsLoading && tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner />
              <p className="mt-2 text-xs text-gray-500">Loading tags...</p>
            </div>
          ) : (
            <>
              {/* Action Buttons - More compact */}
              <div className="space-y-1.5 mb-3">
                <button
                  onClick={() => {
                    setShowCreateForm(true);
                    setEditingTag(null);
                  }}
                  disabled={isOperationLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Tag
                </button>

                <button
                  onClick={() => handleTagSelect(null)}
                  disabled={isOperationLoading}
                  className={`w-full rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2 transition-all ${
                    selectedTag === null
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    selectedTag === null ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>All Customers</span>
                </button>
              </div>

              {/* Tags List - More compact cards */}
              {searchQuery && filteredTags.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">No tags found</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Try different keywords</p>
                </div>
              ) : filteredTags.length === 0 && !searchQuery ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                    <TagIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs font-medium text-gray-700">No tags yet</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Create your first tag</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`group relative p-2.5 rounded-lg border transition-all cursor-pointer ${
                        selectedTag === tag.name 
                          ? "bg-blue-50 border-blue-200 shadow-sm" 
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={(e) => {
                        if (!(e.target as Element).closest('.kebab-menu') && !isOperationLoading) {
                          handleTagSelect(tag.name);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-xs ${
                            selectedTag === tag.name ? "text-blue-900" : "text-gray-900"
                          }`}>
                            {tag.name}
                          </h3>
                          {tag.tag_description && (
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                              {tag.tag_description}
                            </p>
                          )}
                        </div>

                        {/* Kebab Menu */}
                        <div className="relative kebab-menu">
                          <button
                            className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === tag.id ? null : tag.id);
                            }}
                          >
                            <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                          </button>

                          {openMenuId === tag.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-0.5 z-10">
                              <button
                                className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-gray-50 flex items-center gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMessageClick(tag.name);
                                }}
                              >
                                <MessageSquare className="w-3 h-3 text-blue-600" />
                                <span className="text-gray-700">Message</span>
                              </button>
                              
                              <button
                                className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-gray-50 flex items-center gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTag(tag);
                                  setNewTagName(tag.name);
                                  setNewTagDescription(tag.tag_description);
                                  setShowCreateForm(true);
                                  setOpenMenuId(null);
                                }}
                              >
                                <EditIcon className="w-3 h-3 text-gray-600" />
                                <span className="text-gray-700">Edit</span>
                              </button>
                              
                              <button
                                className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-red-50 flex items-center gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm("Delete this tag?")) {
                                    handleDeleteTag(tag.id);
                                  }
                                  setOpenMenuId(null);
                                }}
                              >
                                <Trash className="w-3 h-3 text-red-600" />
                                <span className="text-red-600">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateForm || editingTag) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-sm shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {editingTag ? "Edit Tag" : "Create Tag"}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {editingTag ? "Update tag details" : "Add a new tag"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTag(null);
                    setNewTagName("");
                    setNewTagDescription("");
                  }}
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {error && (
                <div className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg text-xs border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Tag Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Premium"
                    required
                    maxLength={50}
                    disabled={isOperationLoading}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Description</label>
                  <textarea
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Optional"
                    rows={2}
                    maxLength={200}
                    disabled={isOperationLoading}
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">{newTagDescription.length}/200</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingTag(null);
                      setNewTagName("");
                      setNewTagDescription("");
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                    disabled={isOperationLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={!newTagName.trim() || isOperationLoading}
                  >
                    {isOperationLoading ? "Saving..." : editingTag ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Composer */}
      {isMessageComposerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => {
                setIsMessageComposerOpen(false);
                setSelectedTagForMessage("");
              }}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
            <MessageComposer
              onMessageSend={handleMessageSend}
              directMode={true}
              preSelectedTag={selectedTagForMessage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TagsPopup;
