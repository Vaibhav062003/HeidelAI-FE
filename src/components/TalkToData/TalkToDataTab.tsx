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
    width: 4%;
    height: 47px;
    padding-left: 1.5%;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background-color: #b2b2b2;
    border-radius: 50%;
    margin-right: 4px;
    animation: typing 1.5s infinite;
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
`;

function formatBotMessage(output: string) {
  // Replace specific headings with bold and newlines for spacing
  let formatted = output.replace(/\*\*(.*?)\*\*:/g, `<strong>$1:</strong><br>`);

  // Replace bold text with <strong> tags
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, `<strong>$1</strong>`);

  // Add spacing for list-like items using tabs
  formatted = formatted.replace(/\* (.*?)\n/g, `<span style="margin-left:20px;display: block;height: fit-content;width: 100%;text-align: start;margin-bottom: 0;">&#8226;&nbsp;&nbsp;$1</span>`);

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
  });  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);



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

  return (
      <Card className="h-[100vh] w-[1350px] translate-x-[-40px] mx-auto my-4 shadow-lg rounded-xl">
      <style>{typingIndicatorStyles}</style>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex flex-col h-full w-full bg-white">
           <div className="border-b p-4">
           <h2 className="text-xl font-semibold">Talk to Data</h2>
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
                    message.type === "outgoing"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === "outgoing"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <div
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
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about your data..."
                className="flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={1}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalkToDataTab;