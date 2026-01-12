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

// no scroll issue
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
    /* CSS-first responsive positioning */
    left: 10px;
    right: 10px;
    bottom: 80px;
    width: auto;
    padding: 16px;
    font-size: 0.875rem;
  }

  /* Tablet positioning */
  @media (min-width: 640px) {
    .processing-overlay {
      left: auto;
      right: 20px;
      bottom: 100px;
      width: 280px;
      padding: 12px;
      font-size: 1rem;
    }
  }

  /* Desktop positioning */
  @media (min-width: 1024px) {
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

// Updated typing indicator CSS - CSS-first responsive
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

const DEFAULT_PLATFORMS = ["youtube", "reddit", "google", "instagram"];

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
  
  const ws = useRef<WebSocket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

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
          setFollowUpQuestions(data.questions || []);
          setConversationPhase('awaiting-followup');
          setIsWaitingForAnswer(true);
          setIsTyping(false);
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
          setIsTyping(false);
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
          ws.current.send(JSON.stringify({
            query: inputMessage,
            platforms: DEFAULT_PLATFORMS
          }));
          setConversationPhase('platform-analysis');
        } else if (conversationPhase === 'awaiting-followup' && followUpQuestions.length > 0) {
          const nextQuestion = followUpQuestions.find(q => !followUpAnswers[q]);
          if (nextQuestion) {
            setFollowUpAnswers(prev => ({ ...prev, [nextQuestion]: inputMessage }));
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
      }

      setInputMessage('');
      setTimeout(scrollToBottom, 50);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

return (
    <div className="h-full w-full flex flex-col p-0 bg-white">
      <style>{typingIndicatorStyles}</style>
      <style>{processingOverlayStyles}</style>
      
      <Card className="h-full w-full border-0 shadow-none rounded-none overflow-hidden flex flex-col">
        <CardContent className="p-0 flex flex-col h-full w-full">
            
            {/* Header Area */}
            <div className="border-b border-gray-100 p-4 lg:p-6 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Analytics Bot
                  </h2>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProcessing(prev => !prev)}
                  className="h-9 w-9 hidden sm:flex hover:bg-gray-50"
                  title={showProcessing ? 'Hide processing' : 'Show processing'}
                >
                  <Activity 
                    className={`h-5 w-5 ${showProcessing ? 'text-blue-500' : 'text-gray-400'}`}
                  />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden relative bg-white">
              <ScrollArea
                className="h-full w-full"
                ref={scrollContainerRef}
              >
                <div className="p-4 lg:p-6 w-full"> 
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                       <BarChart3 className="h-16 w-16 text-gray-200 mb-6" />
                       <h3 className="text-xl font-medium text-gray-900 mb-2">
                         Analytics Intelligence Ready
                       </h3>
                       <p className="text-gray-500 max-w-md mb-8">
                         I can analyze data across YouTube, Reddit, Google, and Instagram. 
                         Ask me about trends, insights, or specific metrics.
                       </p>
                       <div className="flex flex-wrap gap-2 justify-center">
                          <button onClick={() => setInputMessage("Analyze YouTube trends")} className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium">YouTube trends</button>
                          <button onClick={() => setInputMessage("Reddit insights")} className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium">Reddit insights</button>
                          <button onClick={() => setInputMessage("Instagram metrics")} className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium">Instagram metrics</button>
                       </div>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.type === 'outgoing' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-5 py-3.5 max-w-[85%] lg:max-w-[75%] shadow-sm ${
                            message.type === 'outgoing'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-100 text-gray-800'
                          }`}
                        >
                          <div
                            className="text-base leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: message.content }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="typing-indicator bg-white border border-gray-100 shadow-sm">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    )}
                    <div ref={lastMessageRef} />
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Input Area - UPDATED SECTION */}
            <div className=" bg-white p-4 lg:p-5 flex-shrink-0">
              <div className="flex gap-3 lg:gap-4 items-end w-full">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about analytics..."
                    className="w-full resize-none rounded-xl border border-gray-200 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-h-[50px] placeholder:text-gray-400"
                    rows={1}
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="h-[50px] w-[50px] rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-sm flex-shrink-0 transition-all"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </Button>
              </div>
            </div>

        </CardContent>
        
        {/* Processing Overlay */}
        {showProcessing && (
           <div 
            className={`processing-overlay ${processingState.isVisible ? 'visible' : ''}`}
            style={{ display: processingState.isVisible ? 'block' : 'none' }}
          >
             <div className="processing-header">
              <span className="font-medium">Processing Analysis</span>
              <button onClick={() => setShowProcessing(false)} className="text-gray-400 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
             <div className="processing-steps">
              {THINKING_ANIMATION_STEPS.map((step, index) => (
                <div key={index} className={`processing-step ${step.message === processingState.currentStep ? 'active' : index < THINKING_ANIMATION_STEPS.findIndex(s => s.message === processingState.currentStep) ? 'completed' : ''}`}>
                  {step.message}
                </div>
              ))}
               {processingState.platform && PLATFORM_THINKING_MESSAGES[processingState.platform]?.map((message, index) => (
                <div key={`p-${index}`} className="processing-step active">{message}</div>
              ))}
            </div>
             <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${processingState.progress}%` }} />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalyticsBot;