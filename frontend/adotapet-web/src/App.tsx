import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import DogsAdoption from './pages/DogsAdoption';
import Inicio from './pages/Inicio';
import Home from './pages/Home';
import CadastroDePet from './pages/CadastroDePet';
import './App.css';
import logo from './icon_3x.png';

function IndexPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div style={{ paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: 140, height: 140, marginBottom: 20 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#222' }}>
          Bem-vindo ao AdotaPet!
        </h1>
        <button
          className="App-button"
          onClick={() => navigate('/signup')}
        >
          Criar Conta
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/home')}
        >
          Home
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/cadastro-de-pet')}
        >
          Cadastrar Pet
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/dogs-adoption')}
        >
          Adotar Pet
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro-de-pet" element={<CadastroDePet />} />
        <Route path="/cadastro-de-pet" element={<DogsAdoption />} />
        {/* Add more routes for other screens as needed */}
      </Routes>
    </Router>
  );
}

export default App;
