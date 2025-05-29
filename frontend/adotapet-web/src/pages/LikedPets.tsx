import React, { useEffect, useState } from 'react';

export default function EditProfile() {
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Usuário não logado');
      return;
    }

    try {
      const res = await fetch(`/api/user/residence`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, city, state: stateName, country }),
      });

      const json = await res.json();
      if (json.message === 'OK') {
        alert('Moradia atualizada com sucesso.');
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
    <div style={styles.container}>
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

      <button style={styles.saveButton as React.CSSProperties} onClick={handleSubmit}>
        Salvar
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
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