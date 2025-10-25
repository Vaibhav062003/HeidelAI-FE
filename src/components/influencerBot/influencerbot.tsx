import { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, Send, X, Instagram, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from '@/components/ui/card';

interface ChatMessage {
  type: 'incoming' | 'outgoing';
  content: string;
}

interface ProcessingState {
  isVisible: boolean;
  currentStep: string;
}

const STORAGE_KEY = 'influencerBot_messages';
const WELCOME_SHOWN_KEY = 'influencerBot_welcomeShown';

const processingOverlayStyles = `
  .processing-overlay {
    position: fixed;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    color: white;
    z-index: 50;
  }

  /* Mobile positioning */
  @media (max-width: 640px) {
    .processing-overlay {
      left: 10px;
      right: 10px;
      bottom: 80px;
      width: auto;
      padding: 16px;
      font-size: 0.875rem;
    }
  }

  /* Tablet positioning */
  @media (min-width: 641px) and (max-width: 1024px) {
    .processing-overlay {
      right: 20px;
      bottom: 100px;
      width: 280px;
    }
  }

  /* Desktop positioning */
  @media (min-width: 1025px) {
    .processing-overlay {
      right: 20px;
      bottom: 80px;
      width: 320px;
    }
  }

  .processing-overlay.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .processing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 8px;
  }

  .processing-steps {
    color: rgba(255, 255, 255, 0.7);
  }

  .processing-step {
    margin: 6px 0;
    transition: all 0.3s ease;
    opacity: 0.5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  @media (min-width: 640px) {
    .processing-step {
      font-size: 0.9rem;
      margin: 8px 0;
    }
  }

  .processing-step.active {
    opacity: 1;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
  }

  .processing-step.completed {
    opacity: 0.3;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin-top: 12px;
  }

  .progress-bar-fill {
    height: 100%;
    background: #EC4899;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const InfluencerBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isVisible: false,
    currentStep: ''
  });
  const [showProcessing, setShowProcessing] = useState(true);
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

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const wsUrl = 'wss://localhost:8001/ws/influencer-bot'; // Update with your FastAPI WebSocket URL
    
    const connectWebSocket = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to local FastAPI backend');
        const hasShownWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
        
        if (!hasShownWelcome) {
          const welcomeMessage: ChatMessage = {
            type: 'incoming',
            content: '👋 Hello! I can analyze Instagram profiles. Enter usernames (comma-separated) to begin analysis.\n\nExample: username1, username2'
          };
          setMessages([welcomeMessage]);
          localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
        }
      };

      ws.current.onmessage = handleWebSocketMessage;
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setMessages(prev => [...prev, {
          type: 'incoming',
          content: '❌ Connection error. Please try again later.'
        }]);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        localStorage.removeItem(WELCOME_SHOWN_KEY);
        setTimeout(connectWebSocket, 3000);
      };
    };

    localStorage.removeItem(WELCOME_SHOWN_KEY);
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);
  
  const showProcessingState = (step: string) => {
    setProcessingState({
      isVisible: true,
      currentStep: step
    });
  };

  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      if (!event.data) return;
      
      const data = JSON.parse(event.data);
      if (!data?.type) return;

      switch (data.type) {
        case "status":
          setIsTyping(true);
          showProcessingState(data.content || 'Processing...');
          break;

        case "analysis":
          if (data.content?.username && data.content?.analysis) {
            const analysisMessage: ChatMessage = {
              type: 'incoming',
              content: `📊 Analysis for @${data.content.username}:\n${data.content.analysis}`
            };
            setMessages(prev => [...prev, analysisMessage]);
          }
          break;

        case "complete":
          setIsTyping(false);
          setProcessingState({ isVisible: false, currentStep: '' });
          const completeMessage: ChatMessage = {
            type: 'incoming',
            content: '✅ Analysis complete! Enter more Instagram profiles to analyze.'
          };
          setMessages(prev => [...prev, completeMessage]);
          scrollToBottom();
          break;

        case "error":
          setIsTyping(false);
          setProcessingState({ isVisible: false, currentStep: '' });
          const errorMessage: ChatMessage = {
            type: 'incoming',
            content: `❌ ${data.content || 'An unexpected error occurred'}`
          };
          setMessages(prev => [...prev, errorMessage]);
          scrollToBottom();
          break;
      }
    } catch (error) {
      console.error('Error handling websocket message:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const usernames = inputMessage.split(',').map(u => u.trim());
    const validUsernames = usernames.every(u => /^[a-zA-Z0-9._]+$/.test(u));

    if (!validUsernames) {
      const errorMessage: ChatMessage = {
        type: 'incoming',
        content: '❌ Please enter valid Instagram usernames (letters, numbers, dots, and underscores only)'
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: ChatMessage = {
      type: 'outgoing',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(inputMessage);
    } else {
      const errorMessage: ChatMessage = {
        type: 'incoming',
        content: '❌ Not connected to server. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }

    setInputMessage('');
  };

  const clearChat = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
      const welcomeMessage: ChatMessage = {
        type: 'incoming',
        content: '👋 Hello! I can analyze Instagram profiles. Enter usernames (comma-separated) to begin analysis.\n\nExample: username1, username2'
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }, []);

  // Determine layout type
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-gray-50">
      <style>{processingOverlayStyles}</style>
      
      <Card className="h-full w-full max-w-full shadow-lg rounded-lg sm:rounded-xl overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex flex-col h-full w-full bg-white">
            {/* Header - Responsive */}
            <div className="border-b p-3 sm:p-4 lg:p-6 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    {isMobile ? 'InfluIndex' : 'Instagram Influencer Analysis'}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Clear chat button */}
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    onClick={clearChat}
                    className="text-gray-500 hover:text-pink-500"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {!isMobile && "Clear"}
                  </Button>
                  
                  {/* Processing toggle - desktop only */}
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowProcessing(prev => !prev)}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                      title={showProcessing ? 'Hide processing' : 'Show processing'}
                    >
                      <Activity 
                        size={16} 
                        className={showProcessing ? 'text-pink-500' : 'text-gray-500'} 
                      />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Status indicator for mobile */}
              {isMobile && showProcessing && processingState.isVisible && (
                <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg">
                  {processingState.currentStep}
                </div>
              )}
              
              {isMobile && (
                <p className="text-xs text-gray-500 mt-1">
                  Analyze Instagram influencer profiles
                </p>
              )}
            </div>

            {/* Messages Container - Responsive */}
            <div className="flex-1 overflow-hidden relative">
              <ScrollArea className="h-full w-full" ref={scrollContainerRef}>
                <div className="p-3 sm:p-4 lg:p-6">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16">
                      <Instagram className="h-12 w-12 sm:h-16 sm:w-16 text-pink-400 mb-4" />
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        Instagram Influencer Analyzer
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6">
                        Enter Instagram usernames to get detailed influencer analysis 
                        including engagement rates, audience insights, and performance metrics.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setInputMessage("cristiano")}
                          className="px-3 py-2 text-xs sm:text-sm bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                        >
                          Analyze @cristiano
                        </button>
                        <button
                          onClick={() => setInputMessage("arianagrande")}
                          className="px-3 py-2 text-xs sm:text-sm bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                        >
                          Analyze @arianagrande
                        </button>
                        <button
                          onClick={() => setInputMessage("therock, kyliejenner")}
                          className="px-3 py-2 text-xs sm:text-sm bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                        >
                          Compare profiles
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.type === 'outgoing' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${
                            message.type === 'outgoing'
                              ? 'bg-pink-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                            {message.content}
                          </pre>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg sm:rounded-xl">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
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
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isMobile 
                        ? "Enter usernames..." 
                        : "Enter Instagram usernames (comma-separated)..."
                    }
                    className="w-full rounded-lg sm:rounded-xl border border-gray-300 p-2.5 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                
                {/* Mobile processing toggle */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowProcessing(prev => !prev)}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <Activity 
                      size={16} 
                      className={showProcessing ? 'text-pink-500' : 'text-gray-500'} 
                    />
                  </Button>
                )}
              </div>
              
              {/* Mobile helper text */}
              {isMobile && (
                <p className="text-xs text-gray-500 mt-2">
                  Separate multiple usernames with commas
                </p>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Processing Overlay - Responsive positioning via CSS */}
        {showProcessing && (
          <div 
            className={`processing-overlay ${processingState.isVisible ? 'visible' : ''}`}
            style={{ 
              display: processingState.isVisible ? 'block' : 'none' 
            }}
          >
            <div className="processing-header">
              <span className="font-medium text-sm sm:text-base">Processing Analysis</span>
              <button
                onClick={() => setShowProcessing(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X size={isMobile ? 14 : 16} />
              </button>
            </div>
            <div className="processing-steps">
              <div className="processing-step active">
                {processingState.currentStep}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InfluencerBot;
