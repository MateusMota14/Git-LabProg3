import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof LoginForm, value: string) => {
    setLogin((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });
      const data = await response.json();
      const message = data.message;

      if (message?.startsWith('Login Sucessfull') && data.data?.id) {
        // Guarda o ID do usuário para uso em outras telas
        localStorage.setItem('userId', String(data.data.id));
        localStorage.setItem('city', String(data.data.city));

        alert('Login realizado com sucesso!');
        navigate('/home');
      } else if (message === 'Password incorrect') {
        alert('Senha incorreta. Tente novamente.');
      } else if (message === 'User not found') {
        alert('Usuário não encontrado. Verifique o e‑mail.');
      } else {
        alert(message || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error(error);
      alert('Falha ao conectar ao servidor.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <input
        type="email"
        style={styles.input}
        placeholder="E‑mail"
        value={login.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />

      <input
        type="password"
        style={styles.input}
        placeholder="Senha"
        value={login.password}
        onChange={(e) => handleChange('password', e.target.value)}
      />

      <button style={styles.button} onClick={handleLogin}>
        Entrar
      </button>

      <p style={styles.linkText}>
        Não tem uma conta?{' '}
        <span
          style={styles.link}
          onClick={() => navigate('/auth/SignUp')}
        >
          Crie uma aqui
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    height: '40px',
    border: '1px solid #FFD54F',
    borderRadius: '8px',
    padding: '0 10px',
    marginBottom: '15px',
    fontSize: '16px',
    backgroundColor: '#FFF',
  },
  button: {
    width: '100%',
    height: '40px',
    backgroundColor: '#FFD54F',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#333',
  },
  linkText: {
    fontSize: '16px',
    marginTop: '10px',
    color: '#000',
  },
  link: {
    color: '#FFD54F',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};