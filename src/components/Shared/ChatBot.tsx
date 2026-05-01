import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMatches } from '../../context/MatchContext';
import { getAgentResponse, type ChatMessage } from '../../lib/cricAgent';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Welcome to the Prediction Analysis Center. I am your Cric Agent. Ask anything about IPL predictions."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { matches, playerStats } = useMatches();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await getAgentResponse(userMsg, { matches, playerStats });

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>

      {/* BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#f97316',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* CHAT */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: 80,
          right: 0,
          width: 380,
          height: 520,
          background: '#0f172a',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>

          {/* HEADER */}
          <div style={{
            padding: 12,
            background: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Bot size={18} />
            <div>
              <div style={{ fontWeight: 600 }}>Cric Agent</div>
              <div style={{ fontSize: 11, color: '#22c55e' }}>Online</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none' }}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  maxWidth: '80%',
                  alignSelf: m.role === 'assistant' ? 'flex-start' : 'flex-end',
                  background:
                    m.role === 'assistant' ? '#1e293b' : '#f97316',
                  color: 'white'
                }}
              >
                {m.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ color: '#94a3b8', fontSize: 12 }}>
                Typing...
              </div>
            )}
          </div>

          {/* INPUT */}
          <div style={{
            display: 'flex',
            padding: 10,
            gap: 6,
            background: '#1e293b'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: 'none',
                background: '#0f172a',
                color: 'white'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: '#f97316',
                border: 'none',
                borderRadius: 8,
                padding: 8,
                color: 'white'
              }}
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatBot;