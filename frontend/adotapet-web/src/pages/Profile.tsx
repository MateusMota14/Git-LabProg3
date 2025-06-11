import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patas from '../pata.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface UserProfile {
  name: string;
  city: string;
  state: string;
  country: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('Usuário não logado');

        const res = await fetch(`http://localhost:8080/user/id?id=${userId}`);
        const json = await res.json();
        setUser(json.data);

        const imgRes = await fetch(`http://localhost:8080/user/img/${userId}`);
        const imgJson = await imgRes.json();
        if (imgJson.data) {
          setAvatarUrl(`http://localhost:8080/${imgJson.data}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não logado');

      const res = await fetch(`http://localhost:8080/user/logout/${userId}`, {
        method: 'POST',
      });
      const json = await res.json();

      console.log('resposta do logout:', json);

      if (res.ok && json.message && json.message.toLowerCase().includes('user logged out')) {
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        navigate('/'); // Já está redirecionando para a página inicial
      } else {
        alert(json.message || 'Falha no logout');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer logout');
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Atualize o retorno do componente para envolver a imagem, nome e localização em um card
  return (
    <div style={styles.pageContainer}>
      <Header title="Perfil" />
      <div style={styles.userCard}>
        <img
        src={avatarUrl || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')}
        style={styles.profileImage}
        alt={user?.name || 'Usuário'}
      />
        <h1 style={styles.name}>{user?.name}</h1>
        <p style={styles.location}>
          {user?.city} - {user?.state}, {user?.country}
        </p>
      </div>

      <div style={styles.buttonsContainer}>

        <button
          style={styles.actionButton}
          onClick={() => navigate('/edit-profile')}
        >
          Atualizar Perfil
        </button>

        <button
          style={styles.actionButton}
          onClick={() => navigate('/change-password')}
        >
          Alterar Senha
        </button>

        <button
          style={{
            ...styles.actionButton,
            ...styles.logoutButton,
            ...(logoutLoading ? styles.buttonDisabled : {}),
          }}
          onClick={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading ? (
            <div className="spinner" style={{ color: '#FFF' }}></div>
          ) : (
            'Logout'
          )}
        </button>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
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
    width: 220, 
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 220, 
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: '2px solid #fff',
    marginBottom: 12,
    objectFit: 'cover' as 'cover',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#333',
    margin: 0,
  },
  actionButton: {
    backgroundColor: '#FFD54F',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px',
    width: 220,
    transition: 'background 0.2s',
  },
  logoutButton: {
    backgroundColor: '#E53935',
    color: '#FFF',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    backgroundImage: `url(${patas})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '45px',
    paddingBottom: '130px', // ajuste conforme a altura do seu Footer
  },
  header: {
    width: '100%',
    backgroundColor: '#FFD54F',
    padding: '20px 0 10px 0',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  headerBackButton: {
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
};