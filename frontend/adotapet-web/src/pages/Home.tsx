import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patas from '../pata.png';
import '../App.css';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('userId na Home:', userId);
    if (!userId) {
      navigate('/login');
      return;
    }
    fetch(`http://localhost:8080/user/id?id=${userId}`)
      .then(res => res.json())
      .then(json => setUser(json.data));
    fetch(`http://localhost:8080/user/img/${userId}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) setAvatarUrl(`http://localhost:8080/${json.data}`);
      });
  }, [navigate]);

  const buttonData = [
    { label: "Quero Adotar", name: '/dogs-adoption', icon: '🐾' },
    { label: "Pets Curtidos", name: '/liked-pets', icon: '❤️' },
    { label: "Meus pets para adoção", name: '/my-pets', icon: '🐕' },
    { label: "Cadastrar pet para adoção", name: '/cadastro-de-pet', icon: '➕' },
  ];

  return (
    <div style={{
      ...styles.container,
      backgroundImage: `url(${patas})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '45px',
    }}>
      {/* Cabeçalho amarelo */}
      <header style={styles.header}>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            style={styles.headerProfileButton}
            onClick={() => navigate('/profile')}
            aria-label="Perfil"
          >
            👤 Perfil
          </button>
          <span style={styles.headerTitle}>Início</span>
          <span style={{ width: 80 }} /> {/* Espaço para equilibrar visualmente */}
        </div>
      </header>

      {/* Card do usuário */}
      <div style={styles.userCard}>
        <img
          src={avatarUrl || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')}
          alt={user?.name || 'Usuário'}
          style={styles.avatar}
        />
        <h2 style={styles.greeting}>Olá, {user?.name || 'Usuário'}</h2>
        <p style={{ margin: 0, color: '#333', fontSize: 14 }}>
          {user?.email && <>Email: {user.email}<br /></>}
          {user?.city && <>Cidade: {user.city}<br /></>}
          {user?.state && <>Estado: {user.state}<br /></>}
          {user?.country && <>País: {user.country}</>}
        </p>
      </div>

      {/* Botões */}
      <div style={styles.buttonGrid}>
        {buttonData.map((item, idx) => (
          <button
            key={idx}
            className="App-button"
            style={styles.button}
            onClick={() => navigate(item.name)}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Rodapé fixo */}
      <div style={styles.footer}>
        <button className="App-button" style={styles.footerButton} onClick={() => navigate('/home')}>
          🏠 Home
        </button>
        <button className="App-button" style={styles.footerButton} onClick={() => navigate('/chat')}>
          💬 Chat
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    paddingBottom: 70,
  },
  header: {
    width: '100%',
    backgroundColor: '#FFD54F',
    padding: '20px 0 10px 0',
    display: 'flex',
    justifyContent: 'flex-start', // Alinha à esquerda
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    gap: 16, // Espaço entre botão e título
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userCard: {
    background: '#FFD54F',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: 24,
    marginBottom: 32,
    width: 280,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: '2px solid #FFD54F',
    marginBottom: 12,
    objectFit: 'cover' as 'cover',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  buttonGrid: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  button: {
    width: 160,
    height: 100,
    fontSize: 18,
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD54F',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    fontSize: 28,
    marginBottom: 5,
  },
  footer: {
    position: 'fixed' as 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    background: 'black',
    display: 'flex',
    justifyContent: 'space-around',
    padding: 10,
    zIndex: 10,
  },
  footerButton: {
    background: 'black',
    color: '#FFD54F',
    border: 'none',
    fontSize: 16,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  headerProfileButton: {
    backgroundColor: '#FFD54F',
    border: 'none',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
};