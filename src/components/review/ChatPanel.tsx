import { useState, useRef, useEffect } from 'react';
import { ReviewResult, ChatMessage } from '@/utils/types';
import { Send, Bot, User, Loader } from 'lucide-react';

interface Props {
  result: ReviewResult;
  initialQuestion?: string;
}

const QUICK_QUESTIONS = [
  'What is the most critical security issue?',
  'How do I fix the worst bug?',
  'Is this code production-ready?',
  'What would you fix first?',
  'Explain the performance issues',
];

export default function ChatPanel({ result, initialQuestion }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQuestion || '');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (initialQuestion) { setInput(initialQuestion); }
  }, [initialQuestion]);

  async function send(question?: string) {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: q, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          question: q,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
          reviewContext: { code: result.code, language: result.language, issues: result.issues },
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant', content: data.answer || 'Could not get a response.', timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant', content: '⚠️ Could not connect to AI. Check your API key.', timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line/50 bg-raised/30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan/10 border border-cyan/20 flex items-center justify-center">
            <Bot size={12} className="text-cyan" />
          </div>
          <span className="text-sm font-medium text-text">AI Engineer Chat</span>
          <div className="w-1.5 h-1.5 rounded-full bg-lime ml-auto" />
          <span className="text-xs text-dim">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-dim text-center">Ask the AI engineer anything about this code review</p>
            {QUICK_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-line/50 bg-raised/30 text-xs text-soft hover:text-cyan hover:border-cyan/30 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'assistant' ? 'bg-cyan/10 border border-cyan/20' : 'bg-violet/10 border border-violet/20'
            }`}>
              {msg.role === 'assistant' ? <Bot size={12} className="text-cyan" /> : <User size={12} className="text-violet" />}
            </div>
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-violet/10 border border-violet/20 text-soft'
                : 'bg-raised border border-line/50 text-text'
            }`}>
              <pre className="whitespace-pre-wrap font-body text-xs leading-relaxed">{msg.content}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-md bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Bot size={12} className="text-cyan" />
            </div>
            <div className="bg-raised border border-line/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
              <Loader size={12} className="text-cyan animate-spin" />
              <span className="text-xs text-dim">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-line/50 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about this code..."
            className="flex-1 bg-raised border border-line/60 rounded-lg px-3 py-2 text-xs text-text placeholder-muted focus:outline-none focus:border-cyan/40 transition-colors"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center hover:bg-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
