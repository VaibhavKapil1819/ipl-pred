import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ChevronDown } from 'lucide-react';
import { useMatches } from '../../context/MatchContext';
import { getAgentResponse, type ChatMessage } from '../../lib/cricAgent';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Welcome to the Prediction Analysis Center. Ask me anything about your IPL predictions."
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

    const response = await getAgentResponse(userMsg, {
      matches,
      playerStats
    });

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div style={styles.wrapper}>
      
      {/* BUTTON */}
      <button onClick={() => setIsOpen(!isOpen)} style={styles.fab}>
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div style={styles.chat}>
          
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.botIcon}>
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Cric Agent</div>
              <div style={{ fontSize: 11, color: '#22c55e' }}>Online</div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.close}>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div ref={scrollRef} style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.bubble,
                  ...(m.role === 'assistant'
                    ? styles.assistant
                    : styles.user)
                }}
              >
                {m.content}
              </div>
            ))}

            {isTyping && (
              <div style={styles.assistant}>Typing...</div>
            )}
          </div>

          {/* INPUT */}
          <div style={styles.inputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.send}>
              <Send size={16} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatBot;



// ===== STYLES =====
const styles: any = {
  wrapper: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000
  },

  fab: {
    width: 55,
    height: 55,
    borderRadius: '50%',
    border: 'none',
    background: '#f97316',
    color: 'white',
    cursor: 'pointer'
  },

  chat: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    width: 320,
    height: 480,
    background: '#0f172a',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  header: {
    padding: 10,
    background: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },

  botIcon: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },

  close: {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer'
  },

  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },

  bubble: {
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 13,
    maxWidth: '80%'
  },

  assistant: {
    background: '#1e293b',
    color: '#fff',
    alignSelf: 'flex-start'
  },

  user: {
    background: '#f97316',
    color: '#fff',
    alignSelf: 'flex-end'
  },

  inputArea: {
    display: 'flex',
    padding: 8,
    gap: 6,
    background: '#1e293b'
  },

  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    border: 'none',
    background: '#0f172a',
    color: 'white'
  },

  send: {
    background: '#f97316',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    color: 'white',
    cursor: 'pointer'
  }
};