import { useEffect, useRef, useState } from 'react';
import { Activity, Send, X, BarChart3 } from 'lucide-react';
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
  progress: number;
  platform: keyof typeof PLATFORM_THINKING_MESSAGES | '';
  phase?: 'initial' | 'platform-analysis' | 'final-refinement';
}

const STORAGE_KEY = 'analyticsBot_messages';

const THINKING_ANIMATION_STEPS = [
  { message: "🤔 Let me think about this...", duration: 2000 },
  { message: "🔍 Analyzing query patterns...", duration: 3000 },
  { message: "🔄 Synthesizing information...", duration: 3000 },
  { message: "✨ Preparing insights...", duration: 1500 }
];

const REFINEMENT_ANIMATION_STEPS = [
  { message: "🤔 Processing platform analyses...", duration: 1500 },
  { message: "🎯 Refining context...", duration: 2000 },
  { message: "✨ Preparing final insights...", duration: 2000 }
];

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
    color: white;
    font-weight: 500;
    opacity: 1;
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
    background: #60A5FA;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const PLATFORM_THINKING_MESSAGES = {
  youtube: [
    "📺 Scanning YouTube content...",
    "🎥 Analyzing video engagement...",
    "💭 Processing viewer sentiments..."
  ],
  reddit: [
    "🗣️ Exploring Reddit discussions...",
    "📊 Analyzing community insights...",
    "🔍 Processing subreddit data..."
  ],
  google: [
    "🌐 Gathering web information...",
    "📑 Analyzing online sources...",
    "🔍 Processing search results..."
  ],
  instagram: [
    "📸 Scanning Instagram content...",
    "🏷️ Analyzing hashtag trends...",
    "👥 Processing social signals..."
  ]
};

const typingIndicatorStyles = `
  .typing-indicator {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 1rem;
    margin: 0.5rem 0;
  }

  @media (min-width: 640px) {
    .typing-indicator {
      padding: 1rem;
    }
  }

  .typing-indicator span {
    width: 0.4rem;
    height: 0.4rem;
    background-color: #666;
    border-radius: 50%;
    margin: 0 0.2rem;
    animation: bounce 1.5s infinite;
  }

  @media (min-width: 640px) {
    .typing-indicator span {
      width: 0.5rem;
      height: 0.5rem;
      margin: 0 0.25rem;
    }
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
`;

function formatBotMessage(output: string) {
  let formatted = output.replace(/\*\*(.*?)\*\*:/g, `<strong>$1:</strong><br>`);
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);
  formatted = formatted.replace(/\* (.*?)\n/g, `<span style="margin-left:16px;display: block;height: fit-content;width: 100%;text-align: start;margin-bottom: 0;">&#8226;&nbsp;&nbsp;$1</span>`);
  formatted = formatted.replace(/\n\n/g, "<br> <br>");
  formatted = formatted.replace(/\n/g, "<br>");
  return formatted;
}

type ConversationPhase = 
  | 'idle'
  | 'awaiting-refinement'
  | 'platform-analysis'
  | 'awaiting-followup'
  | 'final-analysis';

const DEFAULT_PLATFORMS = ["youtube", "reddit", "google", "instagram"]; // or let user select

const AnalyticsBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isVisible: false,
    currentStep: '',
    progress: 0,
    platform: ''
  });
  const [showProcessing, setShowProcessing] = useState(true);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [conversationPhase, setConversationPhase] = useState<ConversationPhase>('idle');
  const [pendingRefinementQuestion, setPendingRefinementQuestion] = useState<string | null>(null);
  const [pendingFollowupQuestion, setPendingFollowupQuestion] = useState<string | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<{ [q: string]: string }>({});
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

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    } 
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });
    observer.observe(container, {
      childList: true,
      subtree: true
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Use ws:// and correct path
    const wsUrl = 'ws://localhost:8000/ws/analyze';
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      console.log('Connected to FastAPI backend');
      const welcomeMessage: ChatMessage = {
        type: 'incoming',
        content: 'Hello! I\'m ready to analyze data across multiple platforms. What would you like to know?'
      };
      setMessages(prev => [...prev, welcomeMessage]);
    };

    ws.current.onmessage = handleWebSocketMessage;
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const animateThinking = async () => {
    setProcessingState(prev => ({
      ...prev,
      isVisible: true,
      progress: 0
    }));
  
    for (let i = 0; i < THINKING_ANIMATION_STEPS.length; i++) {
      const step = THINKING_ANIMATION_STEPS[i];
      setProcessingState(prev => ({
        ...prev,
        currentStep: step.message,
        progress: (i + 1) * (100 / THINKING_ANIMATION_STEPS.length)
      }));
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  
    setProcessingState(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "status":
          if (data.content.includes("Starting query refinement")) {
            setProcessingState(prev => ({
              ...prev,
              phase: 'initial',
              isVisible: true,
            }));
            await animateThinking();
          } else if (data.content.includes("Starting data collection")) {
            setProcessingState(prev => ({
              ...prev,
              phase: 'platform-analysis',
              isVisible: true,
            }));
            await animateThinking();
          } else {
            const platform = data.content.toLowerCase().match(/analyzing (youtube|reddit|google|instagram)/)?.[1] as keyof typeof PLATFORM_THINKING_MESSAGES;
            if (platform && PLATFORM_THINKING_MESSAGES[platform]) {
              setProcessingState(prev => ({
                ...prev,
                platform,
                isVisible: true
              }));
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          break;

        case "follow_up_questions":
          // Backend sends a list of questions
          setFollowUpQuestions(data.questions || []);
          setConversationPhase('awaiting-followup');
          setIsWaitingForAnswer(true);
          setIsTyping(false);
          // Show each question as a message
          (data.questions || []).forEach((q: string) => {
            setMessages(prev => [...prev, { type: 'incoming', content: `🤖 ${q}` }]);
          });
          break;

        case "result":
          await animateThinking();
          const resultMessage: ChatMessage = {
            type: 'incoming',
            content: `✨ ${formatBotMessage(data.content)}`
          };
          setMessages(prev => [...prev, resultMessage]);
          setIsWaitingForAnswer(false);
          setProcessingState(prev => ({
            ...prev,
            isVisible: false,
            platform: ''
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          const readyMessage: ChatMessage = {
            type: 'incoming',
            content: '🤖 Ready for your next question!'
          };
          setMessages(prev => [...prev, readyMessage]);
          setIsAnalysisComplete(true);
          setIsTyping(false); // Ensure typing indicator is off
          setConversationPhase('idle');
          break;

        case "final_result":
          await animateThinking();
          setMessages(prev => [
            ...prev,
            {
              type: 'incoming',
              content: `✨ ${formatBotMessage(data.combined_analysis)}`
            }
          ]);
          setIsWaitingForAnswer(false);
          setProcessingState(prev => ({
            ...prev,
            isVisible: false,
            platform: ''
          }));
          await new Promise(resolve => setTimeout(resolve, 1000));
          setMessages(prev => [
            ...prev,
            { type: 'incoming', content: '🤖 Ready for your next question!' }
          ]);
          setIsAnalysisComplete(true);
          setIsTyping(false);
          setConversationPhase('idle');
          break;

        case "platform-analysis-start":
          setConversationPhase('platform-analysis');
          setProcessingState(prev => ({
            ...prev,
            phase: 'platform-analysis',
            isVisible: true,
          }));
          break;

        case "platform-analysis-end":
          setProcessingState(prev => ({
            ...prev,
            isVisible: false,
            platform: ''
          }));
          break;

        case "error":
          const errorMessage: ChatMessage = {
            type: 'incoming',
            content: `❌ Error: ${data.content}`
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsWaitingForAnswer(false);
          setConversationPhase('idle');
          break;
      }
    } catch (error) {
      console.error('Error handling websocket message:', error);
    }
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
      setIsAnalysisComplete(false);

      if (ws.current?.readyState === WebSocket.OPEN) {
        if (conversationPhase === 'idle') {
          // Initial user query: send {query, platforms}
          ws.current.send(JSON.stringify({
            query: inputMessage,
            platforms: DEFAULT_PLATFORMS
          }));
          setConversationPhase('platform-analysis');
        } else if (conversationPhase === 'awaiting-followup' && followUpQuestions.length > 0) {
          // Collect answers for all follow-up questions
          const nextQuestion = followUpQuestions.find(q => !followUpAnswers[q]);
          if (nextQuestion) {
            setFollowUpAnswers(prev => ({ ...prev, [nextQuestion]: inputMessage }));
            // If all answered, send context to backend
            const allAnswered = followUpQuestions.every(q => followUpAnswers[q] || (q === nextQuestion));
            if (allAnswered) {
              ws.current.send(JSON.stringify({
                context: { ...followUpAnswers, [nextQuestion]: inputMessage }
              }));
              setFollowUpQuestions([]);
              setFollowUpAnswers({});
              setConversationPhase('final-analysis');
            }
          }
        }
        // ...other phases as needed...
      }

      setInputMessage('');
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Determine layout type
  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  return (
    <div className="h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-gray-50">
      <style>{typingIndicatorStyles}</style>
      <style>{processingOverlayStyles}</style>
      
      <Card className="h-full w-full max-w-full shadow-lg rounded-lg sm:rounded-xl overflow-hidden">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="flex flex-col h-full w-full bg-white">
            {/* Header - Responsive */}
            <div className="border-b p-3 sm:p-4 lg:p-6 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    Analytics Bot
                  </h2>
                </div>
                
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
                      size={isMobile ? 14 : 16} 
                      className={showProcessing ? 'text-blue-500' : 'text-gray-500'} 
                    />
                  </Button>
                )}
              </div>
              
              {isMobile && (
                <p className="text-xs text-gray-500 mt-1">
                  Multi-platform analytics insights
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
                      <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                        Analytics Intelligence Ready
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6">
                        I can analyze data across YouTube, Reddit, Google, and Instagram. 
                        Ask me about trends, insights, or specific metrics.
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setInputMessage("Analyze YouTube engagement trends")}
                          className="px-3 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          YouTube trends
                        </button>
                        <button
                          onClick={() => setInputMessage("Show Reddit sentiment analysis")}
                          className="px-3 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Reddit insights
                        </button>
                        <button
                          onClick={() => setInputMessage("Instagram hashtag performance")}
                          className="px-3 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        >
                          Instagram metrics
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
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
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
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isMobile ? "Ask about analytics..." : "Ask me about analytics across platforms..."}
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
                      className={showProcessing ? 'text-blue-500' : 'text-gray-500'} 
                    />
                  </Button>
                )}
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
              {THINKING_ANIMATION_STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`processing-step ${
                    step.message === processingState.currentStep
                      ? 'active'
                      : index < THINKING_ANIMATION_STEPS.findIndex(s => s.message === processingState.currentStep)
                      ? 'completed'
                      : ''
                  }`}
                >
                  {step.message}
                </div>
              ))}
              {processingState.platform && PLATFORM_THINKING_MESSAGES[processingState.platform]?.map((message, index) => (
                <div
                  key={`platform-${index}`}
                  className="processing-step active"
                >
                  {message}
                </div>
              ))}
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${processingState.progress}%` }}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalyticsBot;
