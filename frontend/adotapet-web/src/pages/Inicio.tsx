import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src={require('../logo.svg').default}
        alt="Logo"
        style={{ width: 140, height: 140, marginBottom: 20 }}
      />
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#222' }}>
        Bem-vindo ao AdotaPet!
      </h1>
      <button className="App-button" onClick={() => navigate('/sign-up')}>
        Criar Conta
      </button>
      <button className="App-button" onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  );
}
