import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Preencha todos os campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('As senhas novas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não logado');

      const res = await fetch(`http://localhost:8080/user/changepassword?id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message && data.message.toLowerCase().includes('changed')) {
        
        alert('Senha alterada com sucesso! Por favor, faça login novamente.');
        // Limpa dados de autenticação
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        // Redireciona para login
        navigate('/login');
      } else {
        alert(data.message || 'Erro ao alterar senha.');
      }
    } catch (err) {
      alert('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Alterar Senha</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <label style={styles.label}>Senha atual</label>
        <input
          type="password"
          style={styles.input}
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />

        <label style={styles.label}>Nova senha</label>
        <input
          type="password"
          style={styles.input}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />

        <label style={styles.label}>Confirmar nova senha</label>
        <input
          type="password"
          style={styles.input}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          style={{ ...styles.saveButton, backgroundColor: '#eee', color: '#333', marginTop: 10 }}
          onClick={() => navigate('/profile')}
          disabled={loading}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '500px',
    margin: '40px auto 0 auto',
    background: '#fff',
    borderRadius: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  label: {
    display: 'block',
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#FFD54F',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    background: '#fafafa',
    border: '1px solid #FFD54F',
  },
  saveButton: {
    backgroundColor: '#FFD54F',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '18px',
    width: '100%',
    textAlign: 'center' as 'center',
    transition: 'background 0.2s',
  },
};