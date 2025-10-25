import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  type: 'incoming' | 'outgoing';
  content: string;
}

const STORAGE_KEY = 'talkToData_messages';

const typingIndicatorStyles = `
  .typing-indicator {
    margin-top: 2.8%;
    display: flex;
    align-items: center;
    background: #2e2e2e00;
    border-radius: 10px;
    width: 60px;
    height: 47px;
    padding-left: 12px;
  }

  .typing-indicator span {
    width: 6px;
    height: 6px;
    background-color: #b2b2b2;
    border-radius: 50%;
    margin-right: 3px;
    animation: typing 1.5s infinite;
  }

  @media (min-width: 640px) {
    .typing-indicator span {
      width: 8px;
      height: 8px;
      margin-right: 4px;
    }
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  /* Mobile message bubbles */
  @media (max-width: 639px) {
    .message-bubble {
      max-width: 85% !important;
      font-size: 0.875rem;
    }
    
    .message-bubble strong {
      font-size: 0.9rem;
    }
  }
`;

function formatBotMessage(output: string) {
  // Replace specific headings with bold and newlines for spacing
  let formatted = output.replace(/\*\*(.*?)\*\*:/g, `<strong>$1:</strong><br>`);

  // Replace bold text with <strong> tags
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);

  // Add spacing for list-like items using tabs - responsive spacing
  formatted = formatted.replace(/\* (.*?)\n/g, `<span style="margin-left:16px;display: block;height: fit-content;width: 100%;text-align: start;margin-bottom: 0;">&#8226;&nbsp;&nbsp;$1</span>`);

  // Replace double newlines with a single <br> for better spacing
  formatted = formatted.replace(/\n\n/g, "<br> <br>");

  // Ensure single newlines are rendered as <br>
  formatted = formatted.replace(/\n/g, "<br>");

  return formatted;
}

const TalkToDataTab = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const ws = useRef<WebSocket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    
    // Create observer for content changes
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });

    // Start observing
    observer.observe(container, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {
    ws.current = new WebSocket('wss://backend-chatbot.koyeb.app/ws');
    
    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onmessage = (event) => {
      try {
        setIsTyping(false);
        const formattedMessage = formatBotMessage(event.data);
        const newMessage: ChatMessage = {
          type: 'incoming',
          content: formattedMessage
        };
        setMessages(prev => [...prev, newMessage]);
        // Use a slight delay to ensure content is rendered
        setTimeout(scrollToBottom, 50);
      } catch (error) {
        console.error('Error handling websocket message:', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
      setTimeout(initializeWebSocket, 5000);
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
  
    try {
      const newMessage: ChatMessage = { 
        type: 'outgoing', 
        content: inputMessage 
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);
      
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(inputMessage);
      }
  
      setInputMessage('');
      // Scroll after sending message
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Determine if mobile layout
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-gray-50">
      <style>{typingIndicatorStyles}</style>
      
      <Card className="h-full w-full max-w-full shadow-lg rounded-lg sm:rounded-xl overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex flex-col h-full w-full bg-white">
            {/* Header - Responsive */}
            <div className="border-b p-3 sm:p-4 lg:p-6 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                  Talk to Data
                </h2>
              </div>
              {isMobile && (
                <p className="text-xs text-gray-500 mt-1">
                  Ask questions about your data
                </p>
              )}
            </div>

            {/* Messages Container - Responsive */}
            <div className="flex-1 overflow-hidden relative">
              <ScrollArea
                className="h-full w-full"
                ref={scrollContainerRef}
              >
                <div className="p-3 sm:p-4 lg:p-6">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16">
                      <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        Start a conversation
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md">
                        Ask me anything about your data. I can help you analyze trends, 
                        find insights, and answer questions.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setInputMessage("Show me recent trends in my data")}
                          className="px-3 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Recent trends
                        </button>
                        <button
                          onClick={() => setInputMessage("What are my top performing metrics?")}
                          className="px-3 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Top metrics
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.type === "outgoing"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`message-bubble rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${
                            message.type === "outgoing"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div
                            className="text-sm sm:text-base leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    )}
                    <div ref={lastMessageRef} />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input Area - Responsive */}
            <div className="border-t bg-white p-3 sm:p-4 lg:p-6 flex-shrink-0">
              <div className="flex gap-2 sm:gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isMobile ? "Ask about your data..." : "Ask me anything about your data..."}
                    className="w-full resize-none rounded-lg sm:rounded-xl border border-gray-300 p-2.5 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={isMobile ? 1 : isTablet ? 2 : 1}
                    style={{ minHeight: isMobile ? '40px' : '44px' }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              
              {/* Mobile helper text */}
              {isMobile && (
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send • Shift+Enter for new line
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalkToDataTab;
