import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }

    if (field === 'zipCode' && value.replace(/\D/g, '').length === 8) {
      fetchAddressFromCEP(value);
    }
  };

  const fetchAddressFromCEP = async (cep: string) => {
    const sanitizedCep = cep.replace(/\D/g, '');

    if (!/^\d{8}$/.test(sanitizedCep)) {
      alert('CEP inválido. Informe um CEP brasileiro com 8 números.');
      setErrors((prev) => ({ ...prev, zipCode: true }));
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP inválido. Não foi possível encontrar esse CEP.');
        setErrors((prev) => ({ ...prev, zipCode: true }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        country: 'Brasil',
        state: data.uf,
        city: data.localidade,
      }));
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      alert('Erro ao buscar o endereço.');
    }
  };

  const handleSignup = async () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};

    // Valida campos vazios
    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = true;
      }
    });

    // Valida senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = true;
      alert('As senhas não coincidem.');
    }

    // Valida formato do CEP
    if (!/^\d{8}$/.test(formData.zipCode.replace(/\D/g, ''))) {
      newErrors.zipCode = true;
      alert('Informe um CEP brasileiro válido (8 dígitos).');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.message === 'User created') {
        alert('Conta criada com sucesso!');
        navigate('/login');
      } else if (data.message === 'User already exists') {
        setErrors((prev) => ({ ...prev, email: true }));
        alert('Este e-mail já está em uso. Por favor, tente outro.');
      } else {
        alert(data.message || 'Erro ao criar conta.');
      }
    } catch (error) {
      console.error(error);
      alert('Falha ao conectar ao servidor.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Criar Conta</h1>

      {[
        { placeholder: 'Nome', field: 'name' },
        { placeholder: 'E-mail', field: 'email', type: 'email' },
        { placeholder: 'Senha', field: 'password', type: 'password' },
        { placeholder: 'Confirmar Senha', field: 'confirmPassword', type: 'password' },
        { placeholder: 'CEP', field: 'zipCode', type: 'text' },
      ].map(({ placeholder, field, type }) => (
        <input
          key={field}
          type={type || 'text'}
          placeholder={placeholder}
          value={formData[field as keyof FormData]}
          onChange={(e) => handleChange(field as keyof FormData, e.target.value)}
          style={{
            ...styles.input,
            ...(errors[field as keyof FormData] ? styles.inputError : {}),
          }}
        />
      ))}

      <input
        type="text"
        placeholder="País"
        value={formData.country}
        onChange={(e) => handleChange('country', e.target.value)}
        style={{
          ...styles.input,
          ...(errors.country ? styles.inputError : {}),
        }}
      />
      <input
        type="text"
        placeholder="Estado"
        value={formData.state}
        onChange={(e) => handleChange('state', e.target.value)}
        style={{
          ...styles.input,
          ...(errors.state ? styles.inputError : {}),
        }}
      />
      <input
        type="text"
        placeholder="Cidade"
        value={formData.city}
        onChange={(e) => handleChange('city', e.target.value)}
        style={{
          ...styles.input,
          ...(errors.city ? styles.inputError : {}),
        }}
      />

      <button style={styles.button} onClick={handleSignup}>
        Criar Conta
      </button>
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
  },
  inputError: {
    borderColor: '#FF3B30',
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
};