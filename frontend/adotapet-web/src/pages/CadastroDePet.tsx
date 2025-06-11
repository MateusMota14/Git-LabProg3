import React, { useState } from 'react';
import patas from '../pata.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FormData {
  petName: string;
  petAge: string;
  petBreed: string;
  petDescription: string;
  petGender: string;
  petSize: string;
  petImages: File[];
}

export default function CadastroDePet() {
  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petAge: '',
    petBreed: '',
    petDescription: '',
    petGender: '',
    petSize: '',
    petImages: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, petImages: Array.from(files) }));
      if (errors.petImages) setErrors((prev) => ({ ...prev, petImages: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    if (!formData.petName.trim()) newErrors.petName = true;
    if (!formData.petBreed.trim()) newErrors.petBreed = true;
    if (!formData.petAge.trim()) newErrors.petAge = true;
    if (!formData.petDescription.trim()) newErrors.petDescription = true;
    if (!formData.petGender) newErrors.petGender = true;
    if (!formData.petSize) newErrors.petSize = true;
    if (!formData.petImages.length) newErrors.petImages = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // 1. Cria o dog no backend
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('Usuário não logado');

      const dogRes = await fetch('http://localhost:8080/dog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.petName,
          breed: formData.petBreed,
          age: formData.petAge,
          description: formData.petDescription,
          gender: formData.petGender,
          size: formData.petSize,
          user: { id: Number(userId) }
        }),
      });

      const dogData = await dogRes.json();
      if (!dogRes.ok || !dogData.data || !dogData.data.id) {
        alert('Erro ao cadastrar pet');
        setLoading(false);
        return;
      }
      const dogId = dogData.data.id;

      // 2. Faz upload das fotos
      for (const file of formData.petImages) {
        const reader = new FileReader();
        await new Promise<void>((resolve, reject) => {
          reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            await fetch('http://localhost:8080/dog/upload-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: dogId,
                photoBase64: base64,
              }),
            });
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      alert('Pet cadastrado com sucesso!');
      // Limpe o formulário ou redirecione se quiser
      setFormData({
        petName: '',
        petAge: '',
        petBreed: '',
        petDescription: '',
        petGender: '',
        petSize: '',
        petImages: [],
      });
    } catch (err) {
      alert('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <Header title="Registrar Pet" />
      <div style={styles.content}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Pet"
          value={formData.petName}
          onChange={e => handleChange('petName', e.target.value)}
          style={{ ...styles.input, border: errors.petName ? '2px solid #FF3B30' : styles.input.border }}
        />
        <input
          type="text"
          placeholder="Raça"
          value={formData.petBreed}
          onChange={e => handleChange('petBreed', e.target.value)}
          style={{ ...styles.input, border: errors.petBreed ? '2px solid #FF3B30' : styles.input.border }}
        />
        <input
          type="text"
          placeholder="Idade do Pet"
          value={formData.petAge}
          onChange={e => handleChange('petAge', e.target.value)}
          style={{ ...styles.input, border: errors.petAge ? '2px solid #FF3B30' : styles.input.border }}
        />
        <input
          type="text"
          placeholder="Bio"
          value={formData.petDescription}
          onChange={e => handleChange('petDescription', e.target.value)}
          style={{ ...styles.input, border: errors.petDescription ? '2px solid #FF3B30' : styles.input.border }}
        />

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="Macho"
              checked={formData.petGender === 'Macho'}
              onChange={() => handleChange('petGender', 'Macho')}
            /> Macho
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="Fêmea"
              checked={formData.petGender === 'Fêmea'}
              onChange={() => handleChange('petGender', 'Fêmea')}
            /> Fêmea
          </label>
        </div>

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="size"
              value="Pequeno"
              checked={formData.petSize === 'Pequeno'}
              onChange={() => handleChange('petSize', 'Pequeno')}
            /> Pequeno
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="size"
              value="Médio"
              checked={formData.petSize === 'Médio'}
              onChange={() => handleChange('petSize', 'Médio')}
            /> Médio
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="size"
              value="Grande"
              checked={formData.petSize === 'Grande'}
              onChange={() => handleChange('petSize', 'Grande')}
            /> Grande
          </label>
        </div>

        <label style={styles.selectImageLabel}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <span style={styles.selectImageButton}>Selecionar Imagem</span>
        </label>
        {errors.petImages && <span style={{ color: '#FF3B30', fontSize: 12 }}>Selecione pelo menos uma imagem</span>}

        <div style={styles.previewContainer}>
          {formData.petImages.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="pet"
              style={styles.previewImage}
            />
          ))}
        </div>

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      </div>
     <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    backgroundImage: `url(${patas})`, // Use a imagem importada
    backgroundRepeat: 'repeat',
    backgroundSize: '45px',
    position: 'relative' as 'relative',
    paddingBottom: 90, // ou 100, ajuste conforme a altura real do seu Footer
  },
    content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute' as 'absolute',
    left: 20,
    top: 24,
    background: 'none',
    border: 'none',
    fontSize: 28,
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold',
  },
  form: {
    maxWidth: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  input: {
    width: '96%',
    height: 40,
    marginBottom: 0,
    borderRadius: 8,
    border: '1px solid #FFD54F',
    padding: 8,
    fontSize: 16,
    background: '#fff',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 0,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  selectImageLabel: {
    display: 'block',
    margin: '16px 0 8px 0',
    textAlign: 'center' as 'center',
    cursor: 'pointer',
  },
  selectImageButton: {
    background: '#FFD54F',
    color: '#222',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 16,
    display: 'inline-block',
    cursor: 'pointer',
    border: 'none',
  },
  previewContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    objectFit: 'cover' as 'cover',
    borderRadius: 8,
    border: '1px solid #FFD54F',
  },
  submitButton: {
    background: '#FFD54F',
    color: '#222',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 18,
    border: 'none',
    cursor: 'pointer',
    marginTop: 10,
  },
};
