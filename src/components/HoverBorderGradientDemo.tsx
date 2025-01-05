"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Drawer } from 'vaul';

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input2";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/components/supabase/client";
import { useToast } from "@/components/hooks/use-toast";
import { systemPrompt } from "@/components/config/chatSystemPrompt";
import { Message, storeMessage } from "@/components/services/chatService";
import ReactMarkdown from "react-markdown";

import { Toaster, toast as sonnerToast } from 'sonner'

export function HoverBorderGradientDemo() {

  const [isOpen, setIsOpen] = React.useState(false);


  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleDemoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request submitted", { userName, userEmail });
    if (!userName.trim() || !userEmail.trim()) {
      sonnerToast.error('Please enter your name and email.');  
      return;
    }

    try {
      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail })
      });
      sonnerToast.success('Request received! We will contact you shortly.');
    } catch (error) {
      sonnerToast.error('Failed to submit demo request. Please try again.');
      console.error('Error submitting demo request:', error);
    }
  }

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [visitorCompany, setVisitorCompany] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeChat = async () => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setSessionId(newSessionId);
        
        // Send initial greeting message
        const initialMessage: Message = {
          role: 'assistant',
          content: "Hello! I'm HeidelAI's AI Assistant. Before we begin, could you please tell me your name and the company you're representing?"
        };
        
        setMessages([initialMessage]);
        await storeMessage(initialMessage, null, null, newSessionId);
        setIsInitializing(false);
      }

    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await storeMessage(userMessage, visitorName, visitorCompany, sessionId);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [...messages, userMessage],
          systemPrompt,
        },
      });

      if (error) throw error;

      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.choices[0].message.content 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      await storeMessage(assistantMessage, visitorName, visitorCompany, sessionId);

      // Only try to extract visitor info from the first user message
      if (!visitorName && !visitorCompany && messages.length === 1) {
        const nameMatch = userMessage.content.match(/(?:my name is|I'm|I am) ([^,.]+)/i);
        const companyMatch = userMessage.content.match(/(?:from|with|at) ([^,.]+)/i);
        
        if (nameMatch) setVisitorName(nameMatch[1].trim());
        if (companyMatch) setVisitorCompany(companyMatch[1].trim());
      }

    } catch (error) {
      console.error('Error calling chat function:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="z-[100000]">
      <Toaster richColors position="bottom-right" className="z-[10000]"/>
    </div>
    <div className=" flex justify-center space-x-2 text-center">
      <Drawer.Root repositionInputs={false} open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger className="bg-black hover:cursor-pointer border border-white/[0.2] py-2 px-4 rounded-full text-white flex items-center space-x-2">
      
        <span>Request Demo</span>
      
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col  fixed bottom-0  left-0 right-0 max-h-[82vh] rounded-t-[10px] z-[999]">
          <div className="max-w-md flex justify-center flex-col w-full mx-auto overflow-auto p-4 mb-4 rounded-t-[10px]">
            <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

            <Drawer.Title className="text-2xl lg:text-3xl md:text-3xl font-semibold text-black text-center">
              Contact Us
            </Drawer.Title>
            <p className="text-neutral-600 px-4 lg:px-0 text-xs lg:text-base text-center mt-2">
            We will contact you based on the below information
          </p>
            <form onSubmit={handleDemoRequest}>
            <label htmlFor="fname" className="font-medium text-gray-900 text-sm mt-8 mb-2 block">
              Name
            </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              id="name"
              type="fname"
              className="border border-gray-200 bg-white w-full px-3 h-9 rounded-lg outline-none focus:ring-2 focus:ring-black/5 text-gray-900"
            />
            <label htmlFor="name" className="font-medium text-gray-900 text-sm mt-8 mb-2 block">
              Email ID
            </label>
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              type="email"
              className="border border-gray-200 bg-white w-full resize-none rounded-lg p-3 pt-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:ring-offset-0"
            />
            <p className="text-neutral-600  text-xs  mt-2 mb-8">
            By submitting you agree to our Terms & Conditions.
          </p>
            <button onClick={() => setIsOpen(false)} type="submit" className="h-[44px] bg-black mx-auto rounded-full sticky bottom-0 text-gray-50  mt-4 w-full font-medium">Submit</button>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
      
      <Drawer.Root>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] mt-24 h-[85vh] md:h-[90vh] lg:h-[90vh] fixed bottom-0 left-0 right-0 outline-none z-[999]">
          <div className="p-4 overflow-y-auto bg-white rounded-t-[10px] flex flex-col justify-center">
            {/* Header */}

      <div className="w-full px-0 lg:px-6 md:px-6 z-20 sticky top-0 bg-white">
        <div aria-hidden className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
        
        <div className="max-w-3xl mx-auto">
          
         
          <Drawer.Title className="text-2xl lg:text-3xl md:text-3xl font-semibold  text-black text-center">
            Pitch Deck Assistant
          </Drawer.Title>
         
          <p className="text-neutral-600 px-4 text-xs lg:text-base text-center mt-2">
            Your AI companion for exploring HeidelAI&apos;s innovative solutions
          </p>
          <div className="border-gray-300 my-5 lg:my-10 md:my-10 "  />
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-grow relative h-[70vh] bg-white z-10 " ref={scrollAreaRef}>
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl text-sm font-normal  ${
                message.role === 'user'
                  ? 'text-white w-fit bg-gradient-to-br from-indigo-500 to-violet-500 text-right'
                  : 'text-black  bg-gray-100 '
              } max-w-[80%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              {message.role === 'user' ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown 
                  className="prose prose-invert max-w-none"
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-black bg-gray-100 text-sm font-normal p-4 rounded-xl max-w-[80%] animate-pulse backdrop-blur-sm">
              Thinking...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="sticky bg-white w-full z-10 pt-6  bottom-0 ">
        <div className="w-full lg:max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            disabled={isLoading || isInitializing}
            className="flex-grow bg-gray-100 focus-visible:border-none border-none  rounded-full p-4 font-normal placeholder:font-normal text-black placeholder:text-gray-800"
          />
          <Button
            type="submit"
            disabled={isLoading || isInitializing}
            className="relative rounded-full right-0 bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity"
          >
            Send
          </Button>
        </div>
      </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
      
      <HoverBorderGradient
        containerClassName="rounded-full"
        
        className="bg-black text-white flex items-center space-x-2"
      >
        <Drawer.Trigger className="focus-visible:border-none">
        <span >Pitch Deck</span>
        </Drawer.Trigger>
      </HoverBorderGradient>
        </Drawer.Root>

        
    </div>
    </>
  );
}

