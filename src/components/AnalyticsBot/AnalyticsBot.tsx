import { useEffect, useRef, useState } from 'react';
import { Activity, Send, X } from 'lucide-react';
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
  phase?: 'initial' | 'platform-analysis' | 'final-refinement'; // Add this line
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
    right: 20px;
    bottom: 80px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    border-radius: 12px;
    padding: 16px;
    width: 320px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    color: white;
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
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .processing-step {
    margin: 8px 0;
    transition: all 0.3s ease;
    opacity: 0.5;
    padding: 4px 8px;
    border-radius: 4px;
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
    padding: 1rem;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 1rem;
    margin: 0.5rem 0;
  }

  .typing-indicator span {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #666;
    border-radius: 50%;
    margin: 0 0.25rem;
    animation: bounce 1.5s infinite;
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
  formatted = formatted.replace(/\* (.*?)\n/g, `<span style="margin-left:20px;display: block;height: fit-content;width: 100%;text-align: start;margin-bottom: 0;">&#8226;&nbsp;&nbsp;$1</span>`);
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
          
          // Add the ready message after a short delay
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

  return (
    
    <Card className="h-screen m-4">
        <style>{typingIndicatorStyles}</style>
        <style>{processingOverlayStyles}</style>
      <CardContent className="p-6 flex h-full">
        <div className="flex flex-col h-full w-full bg-white">
          <div className="border-b p-4">
            <h2 className="text-xl font-semibold">Analytics Bot</h2>
          </div>

          <ScrollArea 
            className="flex-1 p-4 h-[calc(100vh-12rem)]" 
            ref={scrollContainerRef}
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === 'outgoing' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === 'outgoing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
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
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
            
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
                className="flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
              <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProcessing(prev => !prev)}
              className="ml-2"
            >
              <Activity size={16} className={showProcessing ? 'text-blue-500' : 'text-gray-500'} />
            </Button>
            </div>
          </div>
        </div>
      </CardContent>
      {showProcessing && (
        <div 
          className={`processing-overlay ${processingState.isVisible ? 'visible' : ''}`}
          style={{ 
            display: processingState.isVisible ? 'block' : 'none' 
          }}
        >
          <div className="processing-header">
            <span className="font-medium">Processing Analysis</span>
            <button
              onClick={() => setShowProcessing(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X size={16} />
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
  );
};

export default AnalyticsBot;