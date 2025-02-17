import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface CannedResponse {
  id: string;
  shortcode: string;
  message: string;
  created_at: string;
}

interface ChatInputProps {
  onSend: (message: string) => void;
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CannedResponse[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchSuggestions = async (query: string) => {
      let queryBuilder = supabase
        .from('canned_responses')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.ilike('shortcode', `${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (!error && data) {
        setSuggestions(data);
        setShowSuggestions(true);
      }
    };

    if (input.startsWith('/')) {
      const query = input.slice(1).trim();
      const debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        // Insert selected suggestion
        const selected = suggestions[selectedIndex];
        onSend(selected.message);
        setInput('');
        setShowSuggestions(false);
      } else if (input.startsWith('/')) {
        // Check for exact shortcode match
        const shortcode = input.slice(1).trim();
        const { data } = await supabase
          .from('canned_responses')
          .select('*')
          .eq('shortcode', shortcode)
          .single();

        if (data) {
          onSend(data.message);
        } else {
          onSend(input); // Fallback to sending raw input
        }
        setInput('');
      } else {
        // Send normal message
        onSend(input);
        setInput('');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message or / to see canned responses"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full mb-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((response, index) => (
            <div
              key={response.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                onSend(response.message);
                setInput('');
                setShowSuggestions(false);
              }}
            >
              <div className="font-mono text-sm text-blue-600">
                /{response.shortcode}
              </div>
              <div className="text-gray-600 truncate">{response.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;