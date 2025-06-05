import React, { useState } from 'react';

interface FormData {
  petName: string;
  petAge: string;
  petBreed: string;
  petDescription: string;
  petImages: string[];
}

export default function CadastroDePet() {
  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petAge: '',
    petBreed: '',
    petDescription: '',
    petImages: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const uris = files.map(file => URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, petImages: uris }));
      if (errors.petImages) setErrors((prev) => ({ ...prev, petImages: false }));
    }
  };

  const validateForm = async () => {
  const newErrors: Partial<Record<keyof FormData, boolean>> = {};
  (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
    const value = formData[field];
    if (typeof value === 'string') {
      if (!value.trim()) newErrors[field] = true;
    } else if (Array.isArray(value)) {
      if (value.length === 0) newErrors[field] = true;
    }
  });
  setErrors(newErrors);
  if (Object.keys(newErrors).length === 0) {
    // Monta o formData para envio de imagens
    const data = new FormData();
    data.append('petName', formData.petName);
    data.append('petAge', formData.petAge);
    data.append('petBreed', formData.petBreed);
    data.append('petDescription', formData.petDescription);
    // Adiciona as imagens
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach((file) => {
        data.append('petImages', file);
      });
    }

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert('Pet cadastrado com sucesso!');
        // Limpe o formulário ou redirecione se quiser
      } else {
        alert('Erro ao cadastrar pet');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor');
    }
  }
};

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Registrar Pet</h2>
      <input
        type="text"
        placeholder="Nome do Pet"
        value={formData.petName}
        onChange={e => handleChange('petName', e.target.value)}
        style={{ width: '100%', height: 40, marginBottom: 10, borderRadius: 8, border: errors.petName ? '2px solid #FF3B30' : '1px solid #FFD54F', padding: 8 }}
      />
      <input
        type="text"
        placeholder="Raça"
        value={formData.petBreed}
        onChange={e => handleChange('petBreed', e.target.value)}
        style={{ width: '100%', height: 40, marginBottom: 10, borderRadius: 8, border: errors.petBreed ? '2px solid #FF3B30' : '1px solid #FFD54F', padding: 8 }}
      />
      <input
        type="text"
        placeholder="Idade do Pet"
        value={formData.petAge}
        onChange={e => handleChange('petAge', e.target.value)}
        style={{ width: '100%', height: 40, marginBottom: 10, borderRadius: 8, border: errors.petAge ? '2px solid #FF3B30' : '1px solid #FFD54F', padding: 8 }}
      />
      <input
        type="text"
        placeholder="Bio"
        value={formData.petDescription}
        onChange={e => handleChange('petDescription', e.target.value)}
        style={{ width: '100%', height: 40, marginBottom: 10, borderRadius: 8, border: errors.petDescription ? '2px solid #FF3B30' : '1px solid #FFD54F', padding: 8 }}
      />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ marginBottom: 10 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        {formData.petImages.map((uri, idx) => (
          <img key={idx} src={uri} alt="pet" style={{ width: 100, height: 100, margin: 5, borderRadius: 8 }} />
        ))}
      </div>
      <button className="App-button" onClick={validateForm}>Enviar</button>
    </div>
  );
}
