import React, { useState, useEffect } from "react";
import { Plus, X, MessageSquare, Edit } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface CannedResponse {
  id: string;
  shortcode: string;
  message: string;
  created_at: string;
}

interface CannedResponsesProps {
  onInsertResponse: (message: string) => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [error, setError] = useState<string | null>(null);

  // Fetch canned responses from Supabase
  useEffect(() => {
    fetchCannedResponses();
  }, []);

  const fetchCannedResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("canned_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResponse = async () => {
    if (!newShortcode || !newMessage) return;

    try {
      const newResponse = {
        shortcode: newShortcode,
        message: newMessage,
      };

      const { data, error } = await supabase
        .from("canned_responses")
        .insert([newResponse])
        .select()
        .single();

      if (error) throw error;

      setResponses([data, ...responses]);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add response");
    }
  };

  const handleUpdateResponse = async () => {
    if (!editingResponse || !newShortcode || !newMessage) return;

    try {
      const { data, error } = await supabase
        .from("canned_responses")
        .update({
          shortcode: newShortcode,
          message: newMessage,
        })
        .eq("id", editingResponse.id)
        .select()
        .single();

      if (error) throw error;

      setResponses(responses.map((r) => (r.id === data.id ? data : r)));
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update response"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("canned_responses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setResponses(responses.filter((response) => response.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete response"
      );
    }
  };

  const startEditing = (response: CannedResponse) => {
    setEditingResponse(response);
    setNewShortcode(response.shortcode);
    setNewMessage(response.message);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewShortcode("");
    setNewMessage("");
    setEditingResponse(null);
    setIsModalOpen(false);
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
            <div className="bg-red-100 text-red-700 p-1 rounded-md mb-4 border border-red-200">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right text-red-700"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Canned Responses
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center gap-2 transition-colors hover:border-blue-600"
            >
              <Plus size={20} />
              Add Response
            </button>
          </div>

          <p className="text-gray-600 mb-2 text-sm">
            Canned Responses are pre-written reply templates that help you
            quickly respond to conversations. Use the &apos;/&apos; character followed by
            the shortcode to insert a response.
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4">
          {responses.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg bg-white">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              No canned responses found
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="group bg-white p-4 rounded-md border border-gray-200 hover:border-blue-200 transition-colors flex justify-between items-start shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-blue-600 font-mono mb-1">
                      /{response.shortcode}
                    </div>
                    <div className="text-gray-900">{response.message}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => startEditing(response)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(response.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <X size={20} />
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl border border-gray-200 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingResponse ? "Edit Response" : "New Canned Response"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  Shortcode
                </label>
                <input
                  type="text"
                  value={newShortcode}
                  onChange={(e) => setNewShortcode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. shipping-info"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your template message..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    editingResponse ? handleUpdateResponse : handleAddResponse
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {editingResponse ? "Save Changes" : "Save Response"}
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
