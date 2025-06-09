import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

      const res = await fetch(`/api/user/logout/${userId}`, { method: 'POST' });
      const json = await res.json();

      if (json.data) {
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        navigate('/');
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

  return (
    <div style={styles.container}>
      {avatarUrl && (
        <img
          src={avatarUrl}
          style={styles.profileImage}
          alt="User"
        />
      )}
      <h1 style={styles.name}>{user?.name}</h1>
      <p style={styles.location}>
        {user?.city} - {user?.state}, {user?.country}
      </p>

      <button
        style={styles.updateButton}
        onClick={() => navigate('/edit-profile')}
      >
        Atualizar Perfil
      </button>

      <button
        style={{
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
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '60px',
      border: '2px solid #FFD54F',
      marginBottom: '12px',
    },
    name: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '4px',
    },
    location: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '20px',
    },
    updateButton: {
      backgroundColor: '#FFD54F',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      color: '#333',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginBottom: '12px',
    },
    logoutButton: {
      backgroundColor: '#E53935',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      color: '#FFF',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '8px',
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  };