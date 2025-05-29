import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

const POLL_INTERVAL = 5000; // 5 segundos

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [unread, setUnread] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const fetchChats = useCallback(async (id: number) => {
    try {
      const resp = await fetch(`/api/chat/user/${id}`);
      const json = await resp.json();
      setChats(json.data || []);
    } catch (err) {
      console.error('Failed to load chats', err);
    }
  }, []);

  const checkUnread = useCallback(
    async (chatId: string) => {
      const lastReadStr =
        localStorage.getItem(`lastRead:${chatId}`) || '1970-01-01T00:00:00.000Z';
      const lastRead = new Date(lastReadStr);

      const resp = await fetch(`/api/chat/${chatId}/messages`);
      const json = await resp.json();
      const msgs = json.data || [];
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        const msgDate = new Date(lastMsg.timestamp);
        if (lastMsg.senderId !== userId && msgDate > lastRead) {
          setUnread((u) => ({ ...u, [chatId]: true }));
          return;
        }
      }
      setUnread((u) => ({ ...u, [chatId]: false }));
    },
    [userId]
  );

  const handleChatPress = useCallback(
    async (chatId: string) => {
      localStorage.setItem(`lastRead:${chatId}`, new Date().toISOString());
      setUnread((u) => ({ ...u, [chatId]: false }));
      navigate(`/chat/${chatId}`);
    },
    [navigate]
  );

  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem('userId');
      if (stored) {
        const id = parseInt(stored, 10);
        setUserId(id);
        await fetchChats(id);
      }
      setLoading(false);
    })();
  }, [fetchChats]);

  useEffect(() => {
    if (userId != null) {
      const interval = setInterval(() => fetchChats(userId), POLL_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [userId, fetchChats]);

  useEffect(() => {
    if (userId != null) {
      chats.forEach((c) => checkUnread(c.id));
    }
  }, [chats, userId, checkUnread]);

  if (loading) {
    return (
      <div style={styles.loader}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Chats</h1>
      </header>
      <div style={styles.list}>
        {chats.map((chat) => {
          const other =
            chat.userOwner.id === userId ? chat.userAdopt : chat.userOwner;
          return (
            <div
              key={chat.id}
              style={styles.chatCard}
              onClick={() => handleChatPress(chat.id)}
            >
              <div style={styles.avatarContainer}>
                <img
                  src={
                    other.img || '/assets/images/user_default.png'
                  }
                  alt="Avatar"
                  style={styles.avatar}
                />
                {unread[chat.id] && <div style={styles.unreadDot}></div>}
              </div>
              <div style={styles.textContainer}>
                <p style={styles.name}>{other.name}</p>
                <p style={styles.preview}>Ver mensagens...</p>
              </div>
            </div>
          );
        })}
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
      padding: '20px',
      backgroundColor: '#f5f5f5',
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
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000',
    },
    list: {
      marginTop: '10px',
    },
    chatCard: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #FFD54F',
      cursor: 'pointer',
    },
    avatarContainer: {
      position: 'relative' as 'relative',
    },
    avatar: {
      width: '50px',
      height: '50px',
      borderRadius: '25px',
      backgroundColor: '#EEE',
    },
    unreadDot: {
      position: 'absolute' as 'absolute',
      top: '0',
      right: '0',
      width: '12px',
      height: '12px',
      borderRadius: '6px',
      backgroundColor: 'red',
    },
    textContainer: {
      marginLeft: '12px',
      flex: 1,
    },
    name: {
      fontSize: '18px',
      fontWeight: '600',
    },
    preview: {
      fontSize: '14px',
      color: '#666',
      marginTop: '2px',
    },
  };