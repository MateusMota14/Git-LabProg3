import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patas from '../pata.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Settings() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    country: string;
    state: string;
    city: string;
    zCode: string;
    img: string | null;
  }>({
    name: '',
    email: '',
    country: '',
    state: '',
    city: '',
    zCode: '',
    img: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Função para buscar dados atualizados do usuário
  const fetchUserData = async (userId: string) => {
    const res = await fetch(`http://localhost:8080/user/id?id=${userId}`);
    const json = await res.json();
    setUser(prev => ({
      ...prev,
      name: json.data.name || '',
      email: json.data.email || '',
      country: json.data.country || '',
      state: json.data.state || '',
      city: json.data.city || '',
      zCode: json.data.zCode || '',
    }));
    // Buscar imagem do usuário
    const imgRes = await fetch(`http://localhost:8080/user/img/${userId}`);
    const imgJson = await imgRes.json();
    if (imgJson.data) {
      setUser(prev => ({
        ...prev,
        img: `http://localhost:8080/${imgJson.data}`,
      }));
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchUserData(userId).finally(() => setLoading(false));
  }, [navigate]);

  const handleEditToggle = () => {
    if (editing) {
      setShowPassword(true);
    } else {
      setEditing(true);
    }
  };

const handleSave = async () => {
  setSaving(true);
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Usuário não logado');
      setSaving(false);
      return;
    }
    if (!password) {
      alert('Senha obrigatória para atualizar o perfil.');
      setSaving(false);
      return;
    }
    // Atualizar dados do usuário
    const res = await fetch(`http://localhost:8080/user/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(userId),
        name: user.name,
        email: user.email,
        country: user.country,
        state: user.state,
        city: user.city,
        zCode: user.zCode,
        password: password, // <-- campo correto
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Erro ao atualizar dados.');
      setSaving(false);
      return;
    }
    // Se trocou a foto, faz upload dela
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(',')[1];
        await fetch('http://localhost:8080/user/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Number(userId), // envie como número
            photoBase64: base64,
          }),
        });
        setPhotoFile(null);
        // Após upload da foto, buscar imagem atualizada
        await fetchUserData(userId);
        alert('Dados atualizados com sucesso!');
        setEditing(false);
        setShowPassword(false);
        setPassword('');
        setSaving(false);
      };
      reader.readAsDataURL(photoFile);
      return; // aguarde o FileReader terminar antes de finalizar a função
    } else {
      // Se não trocou a foto, buscar dados atualizados normalmente
      await fetchUserData(userId);
    }
    alert('Dados atualizados com sucesso!');
    setEditing(false);
    setShowPassword(false);
    setPassword('');
  } catch {
    alert('Erro ao conectar ao servidor.');
  } finally {
    setSaving(false);
  }
};

  const handleInputChange = (field: string, value: string) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setUser(prev => ({
      ...prev,
      img: URL.createObjectURL(file),
    }));
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  }

  const avatarUrl = user.img;

  return (
    <div style={styles.pageContainer}>
      <Header title="Configurações" />
      <div style={styles.userCard}>
        <img
          src={avatarUrl || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')}
          style={styles.profileImage}
          alt={user?.name || 'Usuário'}
        />
        <input
          type="file"
          accept="image/*"
          disabled={!editing}
          onChange={handlePhotoChange}
          style={{ marginBottom: 12 }}
        />
        <label>Nome</label>
        <input
          type="text"
          value={user.name}
          disabled={!editing}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={user.email}
          disabled={!editing}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />

        <label>País</label>
        <input
          type="text"
          value={user.country}
          disabled={!editing}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />

        <label>Estado</label>
        <input
          type="text"
          value={user.state}
          disabled={!editing}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />

        <label>Cidade</label>
        <input
          type="text"
          value={user.city}
          disabled={!editing}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />

        <label>CEP</label>
        <input
          type="text"
          value={user.zCode}
          disabled={!editing}
          onChange={(e) => handleInputChange('zCode', e.target.value)}
        />

        <button
          style={styles.actionButton}
          onClick={handleEditToggle}
          disabled={saving}
        >
          {editing ? (saving ? 'Salvando...' : 'Salvar') : 'Editar Perfil'}
        </button>
        {editing && (
          <button
            style={{ ...styles.actionButton, backgroundColor: '#eee', color: '#333', marginTop: 10 }}
            onClick={() => setEditing(false)}
            disabled={saving}
            type="button"
          >
            Cancelar
          </button>
        )}
        {showPassword && (
          <div style={{ marginTop: 0, width: '70%' }}>
            <label style={styles.label}>Senha atual</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 3, marginTop: 10, justifyContent: 'center' }}>
              <button
                style={styles.actionButton}
                onClick={handleSave}
                disabled={saving}
              >
                Confirmar
              </button>
              <button
                type="button"
                style={{
                  ...styles.actionButton,
                  backgroundColor: '#eee',
                  color: '#333',
                }}
                onClick={() => {
                  setShowPassword(false);
                  setPassword('');
                }}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
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
    width: 260,
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
    backgroundColor: '#FF9800',
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
    paddingBottom: 90,
  },
  input: {
    width: '100%',
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '6px',
    padding: '10px',
    marginTop: '4px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    color: '#333',
    marginTop: '12px',
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