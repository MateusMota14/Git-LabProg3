import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EditProfile() {
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadCurrent = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await fetch(`/api/user/id?id=${userId}`);
        const json = await res.json();
        const user = json.data;

        setCity(user.city);
        setStateName(user.state);
        setCountry(user.country);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro ao carregar dados do usuário:', error.message);
        } else {
          console.error('Erro desconhecido:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCurrent();
  }, []);

   const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Usuário não logado');
      return;
    }
    if (!password) {
      alert('Senha obrigatória para atualizar a localização.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(userId),
          city,
          state: stateName,
          country,
          password: password,
        }),
      });

      const json = await res.json();
      if (json.message === 'OK') {
        alert('Moradia atualizada com sucesso.');
        setShowPassword(false);
        setPassword('');
      } else {
        throw new Error(json.message || 'Erro ao atualizar');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`Erro: ${error.message}`);
      } else {
        alert('Erro desconhecido.');
      }
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header title="Atualizar Localização" />
      <div style={styles.container}>
        <form onSubmit={showPassword ? handleSubmit : handleSaveClick}>
          <label style={styles.label}>Cidade</label>
          <input
            type="text"
            style={styles.input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <label style={styles.label}>Estado</label>
          <input
            type="text"
            style={styles.input}
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
          />

          <label style={styles.label}>País</label>
          <input
            type="text"
            style={styles.input}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          {showPassword && (
            <>
              <label style={styles.label}>Digite sua senha para confirmar:</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  type="submit"
                  style={styles.saveButton as React.CSSProperties}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.saveButton,
                    backgroundColor: '#eee',
                    color: '#333',
                    border: '1px solid #ccc',
                  }}
                  onClick={() => {
                    setShowPassword(false);
                    setPassword('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {!showPassword && (
            <button
              type="submit"
              style={styles.saveButton as React.CSSProperties}
            >
              Salvar
            </button>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}
const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    paddingBottom: '130px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    color: '#333',
    marginTop: '12px',
  },
  input: {
    width: '100%',
    borderWidth: '1px',
    borderColor: '#ccc',
    borderRadius: '6px',
    padding: '10px',
    marginTop: '4px',
  },
  saveButton: {
    backgroundColor: '#FFD54F',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '24px',
    display: 'block',
    width: '100%',
    textAlign: 'center' as 'center',
  },
};