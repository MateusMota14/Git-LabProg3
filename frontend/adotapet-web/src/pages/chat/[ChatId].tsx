import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  img: string | null;
}

interface Chat {
  id: string;
  userOwner: User;
  userAdopt: User;
}

interface Message {
  messageId: number;
  chatId: string;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
}

const POLL_INTERVAL = 3000; // 3s

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newText, setNewText] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  const loadChat = useCallback(async () => {
    const res = await fetch(`/api/chat/${chatId}`);
    const js = await res.json();
    if (js.data) setChat(js.data);
  }, [chatId]);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/chat/${chatId}/messages`);
    const js = await res.json();
    setMessages(js.data || []);
    setTimeout(() => {
      if (isScrolledToBottom) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [chatId, isScrolledToBottom]);

  const sendMessage = async () => {
    if (!newText.trim() || userId == null || !chat) return;

    const receiverId =
      chat.userOwner.id === userId ? chat.userAdopt.id : chat.userOwner.id;

    const payload = {
      chat: { id: chat.id },
      userSendId: userId,
      text: newText.trim(),
    };

    try {
      const res = await fetch(`/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('Erro ao enviar:', await res.text());
        return;
      }
      setNewText('');
      await loadMessages();
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Falha no fetch:', err);
    }
  };

  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem('userId');
      if (!stored) {
        navigate('/login');
        return;
      }
      setUserId(parseInt(stored, 10));
      await loadChat();
      await loadMessages();
      setLoading(false);
    })();
  }, [loadChat, loadMessages, navigate]);

  useEffect(() => {
    const interval = setInterval(loadMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadMessages]);

  if (loading || userId === null) {
    return (
      <div style={styles.loader}>
        <div className="spinner"></div>
      </div>
    );
  }

  const other = chat!.userOwner.id === userId ? chat!.userAdopt : chat!.userOwner;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>{other.name}</h1>
      </header>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => {
          const isMine = msg.senderId === userId;
          return (
            <div
              key={msg.messageId}
              style={{
                ...styles.bubble,
                ...(isMine ? styles.bubbleRight : styles.bubbleLeft),
              }}
            >
              <p style={styles.text}>{msg.text}</p>
              <p style={styles.time}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      <div style={styles.inputBar}>
        <input
          type="text"
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}
const styles = {
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    container: {
      display: 'flex',
      flexDirection: 'column' as 'column', 
      height: '100vh',
    },
    header: {
      height: '60px',
      backgroundColor: '#FFD54F',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
    headerTitle: {
      fontSize: '20px',
      color: '#000',
      fontWeight: 'bold',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as 'auto',
      padding: '12px 8px',
    },
    bubble: {
      margin: '4px 0',
      padding: '10px',
      borderRadius: '16px',
      maxWidth: '75%',
    },
    bubbleLeft: {
      backgroundColor: '#EEE',
      alignSelf: 'flex-start',
      borderTopLeftRadius: '0',
    },
    bubbleRight: {
      backgroundColor: '#FFD54F',
      alignSelf: 'flex-end',
      borderTopRightRadius: '0',
    },
    text: {
      fontSize: '16px',
      marginBottom: '4px',
      textAlign: 'right' as 'right', 
    },
    time: {
      fontSize: '12px',
      color: '#555',
      textAlign: 'right' as 'right',
    },
    inputBar: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      borderTop: '1px solid #FFD54F',
      backgroundColor: '#FFF',
    },
    input: {
      flex: 1,
      height: '40px',
      border: '1px solid #DDD',
      borderRadius: '20px',
      padding: '0 12px',
      marginRight: '8px',
    },
    sendBtn: {
      padding: '8px 12px',
      backgroundColor: '#FFD54F',
      borderRadius: '20px',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };