import { useState, useEffect, useRef } from 'react';
import { ChevronUp, SmilePlus, Send } from 'lucide-react';
import CannedResponses from './CannedResponsesContext';
interface ChatFooterProps {
  onSend: (message: string) => void;
  cannedResponses: Array<{ shortcode: string; message: string }>;
}

const ChatFooter = ({ onSend, cannedResponses }: ChatFooterProps) => {
  const [message, setMessage] = useState('');
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [showShortcodeDropdown, setShowShortcodeDropdown] = useState(false);
  const [filteredShortcodes, setFilteredShortcodes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect '/' input and show shortcode dropdown
  useEffect(() => {
    if (message.startsWith('/')) {
      const query = message.slice(1).toLowerCase();
      const matches = cannedResponses
        .map(r => r.shortcode)
        .filter(shortcode => shortcode.toLowerCase().includes(query));
      
      setFilteredShortcodes(matches);
      setShowShortcodeDropdown(matches.length > 0);
    } else {
      setShowShortcodeDropdown(false);
    }
  }, [message, cannedResponses]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleShortcodeSelect = (shortcode: string) => {
    const selectedResponse = cannedResponses.find(r => r.shortcode === shortcode);
    if (selectedResponse) {
      setMessage(selectedResponse.message);
    }
    setShowShortcodeDropdown(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 relative">
      {/* Canned Responses Panel */}
      {showCannedResponses && (
        <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg max-h-96 overflow-y-auto">
          <CannedResponses 
            onInsertResponse={setMessage}
            onClose={() => setShowCannedResponses(false)}
          />
        </div>
      )}

      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => setShowCannedResponses(!showCannedResponses)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <SmilePlus size={20} />
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or '/' for quick responses"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {/* Shortcode Dropdown */}
          {showShortcodeDropdown && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredShortcodes.map(shortcode => (
                <button
                  key={shortcode}
                  onClick={() => handleShortcodeSelect(shortcode)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>/{shortcode}</span>
                  <span className="text-gray-500 text-sm">
                    {cannedResponses.find(r => r.shortcode === shortcode)?.message}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
