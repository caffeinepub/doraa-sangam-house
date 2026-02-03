import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BRAND_ASSETS } from '../assets/branding';
import { generateRaaHiResponse } from './raahi/raahiResponses';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const GREETING_MESSAGE = "Hi! I'm RaaHi. Need help picking something special?";
const SESSION_KEY = 'raahi_greeted';

export default function RaaHiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Auto-greeting on first open per session
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hasGreeted = sessionStorage.getItem(SESSION_KEY);
      if (!hasGreeted) {
        const greetingMsg: Message = {
          id: `bot-${Date.now()}`,
          text: GREETING_MESSAGE,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages([greetingMsg]);
        sessionStorage.setItem(SESSION_KEY, 'true');
      }
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate response delay
    const delay = prefersReducedMotion ? 300 : 800;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const botResponse = generateRaaHiResponse(userMessage.text);
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`raahi-avatar-button fixed bottom-6 right-6 z-[100] w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 ${
          prefersReducedMotion ? '' : 'raahi-pulse'
        }`}
        aria-label="Open RaaHi Assistant"
      >
        <img
          src={BRAND_ASSETS.botAvatar}
          alt="RaaHi Assistant"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`raahi-chat-window fixed bottom-24 right-6 z-[100] w-[380px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-luxury overflow-hidden flex flex-col ${
            prefersReducedMotion ? 'raahi-chat-instant' : 'raahi-chat-slide-up'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/40 bg-primary/5">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_ASSETS.botAvatar}
                alt="RaaHi"
                className="w-10 h-10 rounded-full border border-primary/30"
              />
              <div>
                <h3 className="font-semibold text-foreground">RaaHi</h3>
                <p className="text-xs text-muted-foreground">Sangam Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl px-4 py-3">
                    <div className={`flex gap-1 ${prefersReducedMotion ? '' : 'raahi-typing-dots'}`}>
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/40 bg-background/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-background/80 border-border/60 focus-visible:ring-primary"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
