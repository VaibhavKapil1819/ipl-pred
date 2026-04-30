import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMatches } from '../../context/MatchContext';
import { getAgentResponse, type ChatMessage } from '../../lib/cricAgent';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to the Prediction Analysis Center. I am your Cric Agent, specialized in data-driven insights for the IPL 2026 Prediction League. I have been configured with full access to current standings, historical performance, and predictive modeling. How can I assist your strategy today?" }
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
    
    // Get Agentic Response
    const response = await getAgentResponse(userMsg, { matches, playerStats });
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 20px rgba(234, 88, 12, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isOpen ? 'rotate(90deg) scale(0.9)' : 'scale(1)',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '0',
            width: '420px',
            height: '600px',
            background: '#0f172a',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
            .msg-bubble {
              padding: 12px 16px;
              border-radius: 18px;
              max-width: 90%;
              font-size: 14px;
              line-height: 1.6;
              word-wrap: break-word;
            }
            .assistant-bubble {
              background: #1e293b;
              border-bottom-left-radius: 2px;
              align-self: flex-start;
              color: #f1f5f9;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .user-bubble {
              background: #f97316;
              color: white;
              border-bottom-right-radius: 2px;
              align-self: flex-end;
              box-shadow: 0 2px 10px rgba(249, 115, 22, 0.2);
            }
            .msg-bubble table {
              border-collapse: collapse;
              width: 100%;
              margin: 12px 0;
              font-size: 12px;
              background: rgba(255,255,255,0.03);
              border-radius: 8px;
              overflow: hidden;
            }
            .msg-bubble th, .msg-bubble td {
              border: 1px solid rgba(255,255,255,0.1);
              padding: 8px;
              text-align: left;
            }
            .msg-bubble th {
              background: rgba(249, 115, 22, 0.2);
              color: #f97316;
              font-weight: 700;
            }
            .msg-bubble h1, .msg-bubble h2, .msg-bubble h3 {
              margin: 12px 0 8px 0;
              font-size: 15px;
              color: #f97316;
              font-weight: 700;
            }
            .msg-bubble p {
              margin: 8px 0;
            }
            .msg-bubble ul, .msg-bubble ol {
              padding-left: 20px;
              margin: 8px 0;
            }
            .msg-bubble li {
              margin: 4px 0;
            }
            .chat-input:focus {
              outline: none;
              border-color: #f97316 !important;
            }
            ::-webkit-scrollbar {
              width: 5px;
            }
            ::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
            }
          `}</style>

          {/* Header */}
          <div style={{ padding: '15px', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700' }}>Cric Agent</div>
              <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
                Strategic Analysis Active
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <ChevronDown size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`msg-bubble ${m.role === 'assistant' ? 'assistant-bubble' : 'user-bubble'}`}>
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
              <div className="msg-bubble assistant-bubble" style={{ display: 'flex', gap: '5px', padding: '14px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', animation: 'pulse 1s infinite' }}></div>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', animation: 'pulse 1s infinite 0.2s' }}></div>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f97316', animation: 'pulse 1s infinite 0.4s' }}></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ padding: '15px', background: '#1e293b', display: 'flex', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the Cric Agent anything..."
              className="chat-input"
              style={{
                flex: 1,
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '12px 15px',
                color: 'white',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)',
                transition: 'transform 0.2s'
              }}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
