'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/aria/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, context: typeof window !== 'undefined' ? window.location.pathname : '' }),
      });
      const data = await res.json();
      const aiMsg: Message = { id: `a_${Date.now()}`, role: 'assistant', content: data?.reply || data?.message || 'I\'m here to help! Try asking about your leads, listings, or any PropertyPilot feature.', timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { id: `e_${Date.now()}`, role: 'assistant', content: 'Sorry, I couldn\'t process that. Please try again.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="AI Copilot"
      >
        <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed z-50 ${isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6 w-[380px]'}`}>
      {isMinimized ? (
        <button onClick={() => setIsMinimized(false)} className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-center">
          <Maximize2 className="h-5 w-5" />
        </button>
      ) : (
        <div className="bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span className="font-semibold text-foreground text-sm">AI Copilot</span>
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsMinimized(true)}>
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setIsOpen(false); setIsMinimized(false); }}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[340px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 text-indigo-500/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Ask me anything about your leads, listings, or PropertyPilot features.</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {['Show hot leads', 'Generate a listing', 'How does CMA work?'].map(q => (
                    <button key={q} onClick={() => { setInput(q); }} className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask AI..."
                className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full" disabled={!input.trim() || loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
