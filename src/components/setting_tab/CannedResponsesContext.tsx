import React, { useState, useEffect } from 'react';
import { Plus, X, MessageSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface CannedResponse {
  id: string;
  shortcode: string;
  message: string;
  created_at: string;
}

interface CannedResponsesProps {
  onInsertResponse: (message: string) => void;
  onClose: () => void;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const CannedResponses: React.FC<CannedResponsesProps> =  ({ onInsertResponse, onClose }: CannedResponsesProps) => {
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShortcode, setNewShortcode] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch canned responses from Supabase
  useEffect(() => {
    fetchCannedResponses();
  }, []);

  const fetchCannedResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('canned_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
        .from('canned_responses')
        .insert([newResponse])
        .select()
        .single();

      if (error) throw error;

      setResponses([data, ...responses]);
      setNewShortcode('');
      setNewMessage('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add response');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('canned_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResponses(responses.filter(response => response.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete response');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 border border-red-200">
            {error}
            <button onClick={() => setError(null)} className="float-right text-red-700">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Canned Responses</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Response
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Canned Responses are pre-written reply templates that help you quickly respond to conversations.
          Use the '/' character followed by the shortcode to insert a response.
        </p>

        {responses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            No canned responses found
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map(response => (
              <div
                key={response.id}
                className="group bg-white p-4 rounded-md border border-gray-200 hover:border-blue-200 transition-colors flex justify-between items-start shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-blue-600 font-mono mb-1">/{response.shortcode}</div>
                  <div className="text-gray-900">{response.message}</div>
                </div>
                <button
                  onClick={() => handleDelete(response.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors ml-4"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">New Canned Response</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Shortcode</label>
                  <input
                    type="text"
                    value={newShortcode}
                    onChange={(e) => setNewShortcode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. shipping-info"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-medium">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your template message..."
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddResponse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CannedResponses;