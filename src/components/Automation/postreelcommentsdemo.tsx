// PostReelComments.tsx
import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
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
}

interface PostReelCommentsProps {
  onClose: () => void;
  onComplete: () => void;
}

interface FormData {
  post_id?: string;
  keywords: string[];
  reply: string;
  automation_name: string;
}

const PostReelComments: React.FC<PostReelCommentsProps> = ({ onClose, onComplete }) => {
  // State management
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPost, setSelectedPost] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState<FormData>({ 
    keywords: [], 
    reply: '', 
    automation_name: 'Untitled'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch media data
useEffect(() => {
  const fetchMedia = async () => {
    try {
      // Retrieve Instagram connection data from localStorage
      const instagramConnection = localStorage.getItem('instagram_connection');
      
      if (!instagramConnection) {
        throw new Error("Instagram account not connected");
      }
      
      const connectionData = JSON.parse(instagramConnection);
      const accessToken = connectionData.token;
      const instagramUserId = connectionData.userId;

      // Prepare request to backend
      const response = await fetch("http://localhost:5000/api/media", {
        method: 'GET',
        headers: {
          'Instagram-Account-ID': instagramUserId,
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch media");
      }
      
      const result = await response.json();
      
      // The media data is in result.data according to your getUserMedia function
      const mediaData = result.data;
      
      if (!Array.isArray(mediaData)) {
        throw new Error("Invalid media data format");
      }
      
      setMedia(mediaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Media load failed");
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if we have a valid connection
  const isConnected = localStorage.getItem('instagram_connection') !== null;
  if (isConnected) {
    fetchMedia();
  } else {
    setLoading(false);
    setError("Instagram account not connected");
  }
}, []);

  // Handlers
  const handlePostSelect = (post: MediaItem) => {
    setSelectedPost(post);
    setFormData(prev => ({ ...prev, post_id: post.id }));
  };

  const handleKeywordAdd = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      // Validation
      const automationName = formData.automation_name.trim() || 'Untitled';
      if (!selectedPost?.id) throw new Error("Please select a post");
      if (formData.keywords.length === 0) throw new Error("Add at least one keyword");
      if (!formData.reply.trim()) throw new Error("Reply message is required");

      // Supabase insert
      const { error } = await supabase
        .from('insta_dm_table')
        .insert([{
          post_id: selectedPost.id,
          keyword: formData.keywords.join(','),
          reply: formData.reply,
          automation_name: automationName
        }]);

      if (error) throw new Error(`Database error: ${error.message}`);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      console.error("Submission Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content rendering
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Name
              </label>
              <input
                type="text"
                value={formData.automation_name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  automation_name: e.target.value.trim() || 'Untitled'
                }))}
                placeholder="Enter automation name"
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

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

            <div className="space-y-4 overflow-y-auto h-[400px]">
              {media
                .filter(item => 
                  item.caption?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePostSelect(item)}
                    className={`border rounded-lg p-3 cursor-pointer ${
                      selectedPost?.id === item.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.media_url}
                        alt="Post thumbnail"
                        className="w-24 h-24 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">{item.username}</div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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
                  <div key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        keywords: prev.keywords.filter((_, i) => i !== index)
                      }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, reply: e.target.value }))}
              placeholder="Type your DM reply message..."
              className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Success message
  const renderSuccessMessage = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <Check className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-800">Automation Saved!</h3>
      <p className="text-gray-600 mt-2">Closing configuration...</p>
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
    <div className="absolute left-full ml-4 w-[500px] h-[650px] bg-white rounded-lg shadow-2xl border border-gray-100 z-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">
          {currentStep === 1 && 'Setup Automation'}
          {currentStep === 2 && 'Configure Keywords'}
          {currentStep === 3 && 'Create Response'}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {renderStepContent()}

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : onClose()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            {currentStep > 1 && <ArrowLeft className="w-4 h-4 mr-2" />}
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStep < 3) {
                setCurrentStep(prev => prev + 1);
              } else {
                handleSubmit();
              }
            }}
            className={`px-4 py-2 rounded-lg flex items-center ${
              (currentStep === 1 && !selectedPost) || 
              (currentStep === 2 && formData.keywords.length === 0) ||
              (currentStep === 3 && !formData.reply) ||
              isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                {currentStep === 3 ? 'Finish' : 'Next'}
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