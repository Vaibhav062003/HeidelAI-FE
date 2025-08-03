import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight, ArrowLeft, Check, PlayIcon } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
// import InstagramProfileView from "../setting_tab/InstagramProfileView";
import { Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MediaItem {
  id: string;
  media_url: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
  media_type: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface PostReelCommentsProps {
  onClose: () => void;
  onComplete: (data: {
    postId: string;
    keywords: string[];
    reply: string;
    automation_name: string;
  }) => void;
  instagramId: string;
}

interface FormData {
  post_id?: string;
  keywords: string[];
  reply: string;
  automation_name: string;
}

const PostReelComments: React.FC<PostReelCommentsProps> = ({
  onClose,
  onComplete,
  instagramId,
}) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPost, setSelectedPost] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    keywords: [],
    reply: "",
    automation_name: "Untitled", 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

const fetchMedia = async () => {
  try {
    setLoading(true);
    setError("");
    
    if (!instagramId) {
      throw new Error("Instagram account not connected");
    }
    
    const response = await fetch(
      `https://egenie-whatsapp.koyeb.app/api/instagram/${instagramId}/posts?limit=24`
    );
    
    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 404) {
        throw new Error("Instagram user not found");
      }
      if (response.status === 401) {
        throw new Error("Please reconnect your Instagram account");
      }
      
      // Try to parse error message
      try {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch media");
      } catch {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const result = await response.json();
    const mediaData = result.data || [];
    
    if (!Array.isArray(mediaData)) {
      throw new Error("Invalid media data format");
    }
    
    setMedia(mediaData);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch media";
    setError(errorMessage);
    
    // Show toast notification
    // toast({
    //   variant: "destructive",
    //   title: "Error loading posts",
    //   description: errorMessage,
    // });
  } finally {
    setLoading(false);
  }
};

  const handlePostSelect = (post: MediaItem) => {
    setSelectedPost(post);
    setFormData((prev) => ({ ...prev, post_id: post.id }));
  };

  const handleKeywordAdd = () => {
    if (newKeyword.trim()) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }));
      setNewKeyword("");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      
      // Validate all fields
      if (!selectedPost) {
        throw new Error("Please select a post");
      }
      if (formData.keywords.length === 0) {
        throw new Error("Please add at least one keyword");
      }
      if (!formData.reply.trim()) {
        throw new Error("Please enter a reply message");
      }

      const automationName = formData.automation_name.trim() || "Untitled";

      const { error } = await supabase.from("insta_dm_table").insert([
        {
          post_id: selectedPost.id,
          keyword: formData.keywords.join(","),
          reply: formData.reply,
          automation_name: automationName,
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      onComplete({
        postId: selectedPost.id,
        keywords: formData.keywords,
        reply: formData.reply,
        automation_name: automationName,
      });

      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedPost) {
      setError("Please select a post");
      return;
    }
    if (currentStep === 2 && formData.keywords.length === 0) {
      setError("Please add at least one keyword");
      return;
    }
    
    setError("");
    setCurrentStep(prev => prev + 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Automation Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Name
              </label>
              <input
                type="text"
                value={formData.automation_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    automation_name: e.target.value,
                  }))
                }
                placeholder="Enter automation name"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Search and Post List */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-purple-500 h-12 w-12" />
              </div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">{error}</div>
            ) : media.length === 0 ? (
              <div className="text-gray-500 p-4 text-center">No posts found</div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {media.map(post => (
                  <div
                    key={post.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedPost?.id === post.id
                        ? 'ring-4 ring-purple-500 scale-[1.02]'
                        : 'ring-1 ring-gray-200'
                    } hover:scale-[1.03]`}
                    onClick={() => handlePostSelect(post)}
                  >
                    {post.media_type === 'VIDEO' ? (
                      <div className="aspect-square bg-gray-200">
                        {post.thumbnail_url ? (
                          <img
                            src={post.thumbnail_url}
                            alt={post.caption || 'Instagram video'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">Video</span>
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayIcon className="h-10 w-10 text-white bg-black/50 rounded-full p-2" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Instagram post'}
                        className="aspect-square object-cover w-full"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <p className="text-white text-sm text-center">
                        {post.caption || 'Instagram post'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Comments must include:
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          keywords: prev.keywords.filter((_, i) => i !== index),
                        }))
                      }
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleKeywordAdd}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4">
            <textarea
              value={formData.reply}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reply: e.target.value }))
              }
              placeholder="Type your DM reply message..."
              className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderSuccessMessage = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Check className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-800">Settings Saved!</h3>
      <p className="text-gray-600 mt-2">Closing automatically...</p>
    </div>
  );

  if (submitSuccess) {
    return (
      <div className="absolute left-full ml-4 w-[500px] h-[650px] bg-white rounded-lg shadow-2xl border border-gray-100 z-50">
        {renderSuccessMessage()}
      </div>
    );
  }

  return (
    <div className="absolute left-full ml-4 w-[500px] h-[700px] bg-white rounded-lg shadow-2xl border border-gray-100 z-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">
          {currentStep === 1 && "Select Post or Reel"}
          {currentStep === 2 && "Set Keywords"}
          {currentStep === 3 && "Create Reply"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {/* {currentStep === 1 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )} */}

        {renderStepContent()}

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() =>
              currentStep > 1 ? setCurrentStep((prev) => prev - 1) : onClose()
            }
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            {currentStep > 1 && <ArrowLeft className="w-4 h-4 mr-2" />}
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep((prev) => prev + 1);
              } else {
                handleSubmit();
              }
            }}
            className={`px-4 py-2 rounded-lg flex items-center ${
              (currentStep === 1 && !selectedPost) ||
              (currentStep === 2 && formData.keywords.length === 0) ||
              (currentStep === 3 && !formData.reply) ||
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
            disabled={
              (currentStep === 1 && !selectedPost) ||
              (currentStep === 2 && formData.keywords.length === 0) ||
              (currentStep === 3 && !formData.reply) ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {currentStep === 3 ? "Finish" : "Next"}
                {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
              </>
            )}
          </button>
        </div>

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default PostReelComments;
