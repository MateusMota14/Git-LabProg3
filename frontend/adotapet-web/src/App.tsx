import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import DogsAdoption from './pages/DogsAdoption';
import EditProfile from './pages/EditProfile';
import LikedPets from './pages/LikedPets';
import MyPets from './pages/MyPets';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
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
          onClick={() => navigate('/sign-up')}
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
        <button
          className="App-button"
          onClick={() => navigate('/edit-profile')}
        >
          Editar Perfil
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/liked-pets')}
        >
          Pets curtidos
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/my-pets')}
        >
          Meus pets
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/profile')}
        >
          Perfil
        </button>
        <button
          className="App-button"
          onClick={() => navigate('/settings')}
        >
          Configurações
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
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro-de-pet" element={<CadastroDePet />} />
        <Route path="/dogs-adoption" element={<DogsAdoption />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/liked-pets" element={<LikedPets />} />
        <Route path="/my-pets" element={<MyPets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
