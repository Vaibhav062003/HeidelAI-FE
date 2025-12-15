import React, { useState, useEffect } from "react";
import { Plus, X, MessageSquare, Edit } from "lucide-react";
import api from "@/lib/session_api"; // Your existing API instance with JWT

interface CannedResponse {
  _id: string;
  org_id: string;
  shortcut: string;
  response: string;
  updated_at: string;
}

interface CannedResponsesProps {
  onInsertResponse: (message: string) => void;
}

const CannedResponses: React.FC<CannedResponsesProps> = ({
  onInsertResponse,
}) => {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(
    null
  );
  const [newShortcode, setNewShortcode] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch canned responses from API
  useEffect(() => {
    fetchCannedResponses();
  }, []);

  const fetchCannedResponses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get("/api/canned_responses");
      
      if (response.data && response.data.canned_responses) {
        setResponses(response.data.canned_responses);
      } else {
        setResponses([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch canned responses";
      setError(errorMessage);
      console.error("Error fetching canned responses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!newShortcode.trim() || !newMessage.trim()) {
      setError("Both shortcut and message are required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        shortcut: newShortcode.trim(),
        response: newMessage.trim(),
      };

      const response = await api.post("/api/canned_responses", payload);

      if (response.data && response.data.canned_responses) {
        setResponses(response.data.canned_responses);
        resetForm();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add canned response";
      setError(errorMessage);
      console.error("Error adding canned response:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateResponse = async () => {
    if (!editingResponse || !newShortcode.trim() || !newMessage.trim()) {
      setError("Both shortcut and message are required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        shortcut: newShortcode.trim(),
        response: newMessage.trim(),
      };

      const response = await api.post("/api/canned_responses", payload);

      if (response.data && response.data.canned_responses) {
        setResponses(response.data.canned_responses);
        resetForm();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update canned response";
      setError(errorMessage);
      console.error("Error updating canned response:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this canned response?")) {
      return;
    }

    setError(null);

    try {
      // You'll need a DELETE endpoint: DELETE /api/canned_responses/:id
      await api.delete(`/api/canned_responses/${id}`);
      
      // Remove from local state
      setResponses(responses.filter((response) => response._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete canned response";
      setError(errorMessage);
      console.error("Error deleting canned response:", err);
      
      // If delete endpoint doesn't exist, refresh the list
      fetchCannedResponses();
    }
  };

  const startEditing = (response: CannedResponse) => {
    setEditingResponse(response);
    setNewShortcode(response.shortcut);
    setNewMessage(response.response);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewShortcode("");
    setNewMessage("");
    setEditingResponse(null);
    setIsModalOpen(false);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="bg-white p-4 rounded-t-lg border-b mb-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-200 flex items-start justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900 ml-2"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Canned Responses
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover:border-blue-600 hover:bg-gray-50"
            >
              <Plus size={20} />
              Add Response
            </button>
          </div>

          <p className="text-gray-600 mb-2 text-sm">
            Canned Responses are pre-written reply templates that help you
            quickly respond to conversations. Use the &apos;/&apos; character followed by
            the shortcut to insert a response.
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4">
          {responses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg bg-white">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium mb-1">No canned responses yet</p>
              <p className="text-sm text-gray-500">Create your first template to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((response) => (
                <div
                  key={response._id}
                  className="group bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all flex justify-between items-start"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-blue-600 font-mono font-semibold bg-blue-50 px-2 py-1 rounded">
                        {response.shortcut}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(response.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                      {response.response}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(response)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(response._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl border border-gray-200 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingResponse ? "Edit Canned Response" : "New Canned Response"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isSaving}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shortcut <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newShortcode}
                  onChange={(e) => setNewShortcode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., /shipping-info or /greeting"
                  disabled={isSaving}
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Use &apos;/&apos; followed by a unique keyword (e.g., /greeting, /policy)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Response Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter your template message here..."
                  disabled={isSaving}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-gray-500">
                    This message will be inserted when you type the shortcut
                  </p>
                  <span className="text-xs text-gray-400">
                    {newMessage.length}/2000
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingResponse ? handleUpdateResponse : handleAddResponse
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSaving || !newShortcode.trim() || !newMessage.trim()}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingResponse ? "Save Changes" : "Create Response"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CannedResponses;
