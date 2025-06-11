import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  footer: {
    position: 'fixed' as 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'black',
    display: 'flex',
    justifyContent: 'space-around',
    padding: 5,
    zIndex: 10,
  },
  footerButton: {
    background: 'none',
    color: '#FFD54F',
    border: 'none',
    fontSize: 16,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: 8,
  },
};

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div style={styles.footer}>
      <button style={styles.footerButton} onClick={() => navigate('/home')}>
        🏠 Home
      </button>
      <button style={styles.footerButton} onClick={() => navigate('/chat')}>
        💬 Chat
      </button>
    </div>
  );
}