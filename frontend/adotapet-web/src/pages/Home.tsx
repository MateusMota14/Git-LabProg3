import React from 'react';
import { useNavigate } from 'react-router-dom';
import Alfredo from '../assets/images/Alfredo.png';
import patas from '../pata.png';
import '../App.css';

export default function Home() {
  const navigate = useNavigate();

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
        <span style={styles.headerTitle}>Início</span>
      </header>

      {/* Card do usuário */}
      <div style={styles.userCard}>
        <img
          src={Alfredo}
          alt="Alfredo"
          style={styles.avatar}
        />
        <h2 style={styles.greeting}>Olá, Alfredo</h2>
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
    paddingBottom: 70, // espaço para o rodapé
  },
  header: {
    width: '100%',
    backgroundColor: '#FFD54F',
    padding: '20px 0 10px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
};