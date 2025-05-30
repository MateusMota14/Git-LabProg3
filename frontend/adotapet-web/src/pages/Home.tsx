import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const buttonData = [
    { label: "Quero Adotar", name: '/dogs-adoption', icon: '🐾' },
    { label: "Pets Curtidos", name: '/liked-pets', icon: '❤️' },
    { label: "Meus pets para adoção", name: '/my-pets', icon: '🐕' },
    { label: "Cadastrar pet para adoção", name: '/cadastro-de-pet', icon: '➕' },
  ];

  return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ marginBottom: 30 }}>Olá, Alfredo</h2>
      <img
        src={require('../logo.svg').default}
        alt="Avatar"
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 30 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginBottom: 40 }}>
        {buttonData.map((item, idx) => (
          <button
            key={idx}
            className="App-button"
            style={{
              width: 160,
              height: 80,
              fontSize: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFD54F',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
            onClick={() => navigate(item.name)}
          >
            <span style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'black', display: 'flex', justifyContent: 'space-around', padding: 10 }}>
        <button className="App-button" style={{ background: 'black', color: '#FFD54F' }} onClick={() => navigate('/home')}>
          🏠 Home
        </button>
        <button className="App-button" style={{ background: 'black', color: '#FFD54F' }} onClick={() => navigate('/chat')}>
          💬 Chat
        </button>
      </div>
    </div>
  );
}