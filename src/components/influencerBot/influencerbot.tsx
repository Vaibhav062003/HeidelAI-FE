import { useEffect, useRef, useState, useCallback } from 'react';
import { Activity, Send, X, Instagram } from 'lucide-react';
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
  phase?: 'analysis' | 'comparison';
}

const STORAGE_KEY = 'influencerBot_messages';

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

// Update the THINKING_ANIMATION_STEPS to remove duration
const THINKING_ANIMATION_STEPS = [
  { message: "🔍 Starting analysis...", step: 0 },
  { message: "📊 Fetching Instagram data...", step: 1 },
  { message: "🎯 Processing profile metrics...", step: 2 },
  { message: "📈 Generating insights...", step: 3 },
  { message: "🔄 Comparing accounts...", step: 4 }
];

const InfluencerBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isVisible: false,
    currentStep: '',
    progress: 0
  });
  const [showProcessing, setShowProcessing] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const wsUrl = 'ws://localhost:8001/ws/influencer';
    
    const connectWebSocket = () => {
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to local FastAPI backend');
        const welcomeMessage: ChatMessage = {
          type: 'incoming',
          content: '👋 Hello! I can analyze Instagram profiles. Enter usernames (comma-separated) to begin analysis.\n\nExample: username1, username2'
        };
        setMessages(prev => {
          if (prev.length === 0) {
            return [welcomeMessage];
          }
          return prev;
        });
      };

      ws.current.onmessage = handleWebSocketMessage;

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        const errorMessage: ChatMessage = {
          type: 'incoming',
          content: 'Reconneting to server. Please try again later.'
        };
        setMessages(prev => [...prev, errorMessage]);
      };

      ws.current.onclose = () => {
        console.log('WebSocket closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Update the animateProgress function
  const animateProgress = () => {
    let step = 0;
    const animateStep = () => {
      if (step < THINKING_ANIMATION_STEPS.length) {
        setProcessingState(prev => ({
          ...prev,
          currentStep: THINKING_ANIMATION_STEPS[step].message,
          progress: ((step + 1) / THINKING_ANIMATION_STEPS.length) * 100,
          isVisible: true
        }));
        step++;
        setTimeout(animateStep, 1500); // Change step every 1.5 seconds
      }
    };
    animateStep();
  };

  // Update the handleWebSocketMessage function
  const handleWebSocketMessage = async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "status":
          if (data.content.includes("Starting analysis")) {
            animateProgress();
          }
          setIsTyping(true);
          break;

        case "analysis":
          const analysisMessage: ChatMessage = {
            type: 'incoming',
            content: `📊 Analysis for @${data.content.username}:\n${data.content.analysis}`
          };
          setMessages(prev => [...prev, analysisMessage]);
          scrollToBottom();
          break;

        case "comparison":
          const comparisonMessage: ChatMessage = {
            type: 'incoming',
            content: `🔄 Comparison Results:\n${data.content}`
          };
          setMessages(prev => [...prev, comparisonMessage]);
          scrollToBottom();
          break;

        case "complete":
          setProcessingState(prev => ({
            ...prev,
            isVisible: false
          }));
          setIsTyping(false);
          const completeMessage: ChatMessage = {
            type: 'incoming',
            content: '✅ Analysis complete! Enter more usernames to analyze.'
          };
          setMessages(prev => [...prev, completeMessage]);
          scrollToBottom();
          break;

        case "error":
          const errorMessage: ChatMessage = {
            type: 'incoming',
            content: `❌ ${data.content}`
          };
          setMessages(prev => [...prev, errorMessage]);
          scrollToBottom();
          break;
      }
    } catch (error) {
      console.error('Error handling websocket message:', error);
    }
  };

  // Add useEffect for immediate scroll on messages update
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

  return (
    <Card className="h-screen m-4">
      <style>{processingOverlayStyles}</style>
      <CardContent className="p-6 flex h-full">
        <div className="flex flex-col h-full w-full">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Instagram Influencer Analysis</h2>
            </div>
            {showProcessing && processingState.isVisible && (
              <div className="text-sm text-gray-500">
                {processingState.currentStep}
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" ref={scrollContainerRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === 'outgoing'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {message.content}
                    </pre>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 px-4 py-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              )}
              <div ref={lastMessageRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter Instagram usernames (comma-separated)..."
                className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProcessing(prev => !prev)}
                className="ml-2"
              >
                <Activity 
                  size={16} 
                  className={showProcessing ? 'text-pink-500' : 'text-gray-500'} 
                />
              </Button>
            </div>
          </div>
        </div>
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
                    index === Math.floor((processingState.progress / 100) * THINKING_ANIMATION_STEPS.length)
                      ? 'active'
                      : index < Math.floor((processingState.progress / 100) * THINKING_ANIMATION_STEPS.length)
                      ? 'completed'
                      : ''
                  }`}
                >
                  {step.message}
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
      </CardContent>
    </Card>
  );
};

export default InfluencerBot;

