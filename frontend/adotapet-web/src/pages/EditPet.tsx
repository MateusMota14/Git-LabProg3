import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patas from '../pata.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface PetData {
  id: number;
  name: string;
  breed: string;
  age: string;
  description: string;
  gender: string;
  size: string;
  img: string | null;
}

export default function EditPet() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<PetData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Função para buscar dados atualizados do pet (inclusive imagem)
  const fetchPetData = async (id: string | number) => {
    const res = await fetch(`http://localhost:8080/dog/id?id=${id}`);
    const json = await res.json();
    setPet({
      id: json.data.id,
      name: json.data.name || '',
      breed: json.data.breed || '',
      age: json.data.age || '',
      description: json.data.description || '',
      gender: json.data.gender || '',
      size: json.data.size || '',
      img: json.data.img ? `http://localhost:8080/${json.data.img}` : null,
    });
  };

  useEffect(() => {
    if (!petId) return;
    fetchPetData(petId);
  }, [petId]);

  const handleInputChange = (field: keyof PetData, value: string) => {
    setPet(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPet(prev => prev ? { ...prev, img: URL.createObjectURL(file) } : prev);
  };

  const handleSave = async () => {
    if (!pet) return;
    setSaving(true);
    try {
      // Atualiza dados do pet
      const res = await fetch('http://localhost:8080/dog/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pet.id,
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          description: pet.description,
          gender: pet.gender,
          size: pet.size,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Erro ao atualizar pet.');
        setSaving(false);
        return;
      }
      // Se trocou a foto, faz upload dela
      if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result?.toString().split(',')[1];
          await fetch('http://localhost:8080/dog/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: pet.id,
              photoBase64: base64,
            }),
          });
          setPhotoFile(null);
          // Busca imagem real do backend após upload
          await fetchPetData(pet.id);
          alert('Pet atualizado com sucesso!');
          setEditing(false);
          setSaving(false);
        };
        reader.readAsDataURL(photoFile);
        return;
      }
      // Atualiza dados do pet após salvar (caso backend altere algo)
      await fetchPetData(pet.id);
      alert('Pet atualizado com sucesso!');
      setEditing(false);
    } catch {
      alert('Erro ao conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  if (!pet) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
  }

  return (
    <div style={styles.page}>
      <Header title="Editar Pet" />
      <div style={styles.content}>
        <form style={styles.form} onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <img
            src={pet.img || 'https://ui-avatars.com/api/?name=' + (pet.name || 'Pet')}
            style={styles.previewImage}
            alt={pet.name}
          />
          <input
            type="file"
            accept="image/*"
            disabled={!editing}
            onChange={handlePhotoChange}
            style={{ marginBottom: 12 }}
          />
          <input
            type="text"
            value={pet.name}
            disabled={!editing}
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="Nome"
            style={styles.input}
          />
          <input
            type="text"
            value={pet.breed}
            disabled={!editing}
            onChange={e => handleInputChange('breed', e.target.value)}
            placeholder="Raça"
            style={styles.input}
          />
          <input
            type="text"
            value={pet.age}
            disabled={!editing}
            onChange={e => handleInputChange('age', e.target.value)}
            placeholder="Idade"
            style={styles.input}
          />
          <input
            type="text"
            value={pet.description}
            disabled={!editing}
            onChange={e => handleInputChange('description', e.target.value)}
            placeholder="Descrição"
            style={styles.input}
          />
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Macho"
                checked={pet.gender === 'Macho'}
                disabled={!editing}
                onChange={() => handleInputChange('gender', 'Macho')}
              /> Macho
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value="Fêmea"
                checked={pet.gender === 'Fêmea'}
                disabled={!editing}
                onChange={() => handleInputChange('gender', 'Fêmea')}
              /> Fêmea
            </label>
          </div>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="Pequeno"
                checked={pet.size === 'Pequeno'}
                disabled={!editing}
                onChange={() => handleInputChange('size', 'Pequeno')}
              /> Pequeno
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="Médio"
                checked={pet.size === 'Médio'}
                disabled={!editing}
                onChange={() => handleInputChange('size', 'Médio')}
              /> Médio
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="size"
                value="Grande"
                checked={pet.size === 'Grande'}
                disabled={!editing}
                onChange={() => handleInputChange('size', 'Grande')}
              /> Grande
            </label>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button
              type="button"
              style={styles.actionButton}
              onClick={() => setEditing(!editing)}
              disabled={saving}
            >
              {editing ? 'Salvar' : 'Editar'}
            </button>
            {editing && (
              <button
                type="button"
                style={{ ...styles.actionButton, backgroundColor: '#eee', color: '#333' }}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancelar
              </button>
            )}
          </div>
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
    backgroundImage: `url(${patas})`,
    backgroundRepeat: 'repeat',
    backgroundSize: '45px',
    position: 'relative' as 'relative',
    paddingBottom: 90,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  previewImage: {
    width: 100,
    height: 100,
    objectFit: 'cover' as 'cover',
    borderRadius: 8,
    border: '1px solid #FFD54F',
    margin: '0 auto 12px auto',
    display: 'block',
  },
  actionButton: {
    background: '#FFD54F',
    color: '#222',
    fontWeight: 'bold',
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    marginTop: 0,
  },
};