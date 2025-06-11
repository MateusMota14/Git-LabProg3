import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface DogDetail {
  id: number;
  name: string;
  breed: string;
  age: string;
  description?: string;
  gender: string;
  size: string;
  urlPhotos?: string[];
  userLike?: number[];
}

export default function DogProfilePage() {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();

  const [dog, setDog] = useState<DogDetail | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadDog() {
      try {
        const res = await fetch(`http://localhost:8080/dog/id?id=${dogId}`);
        const json = await res.json();
        const data: DogDetail = json.data;
        setDog(data);

        // Monta as URLs das fotos (backend retorna caminhos relativos)
        const uris =
          data.urlPhotos?.map((path) =>
            path.startsWith('http')
              ? path
              : `http://localhost:8080/${path.replace('src/main/resources/static/', '')}`
          ) ?? [];
        setPhotos(uris);

        // Checa se o usuário já curtiu esse dog
        const userId = localStorage.getItem('userId');
        if (userId && data.userLike) {
          if (data.userLike.includes(Number(userId))) {
            setLiked(true);
          }
        }
      } catch (err) {
        setDog(null);
      } finally {
        setLoading(false);
      }
    }
    loadDog();
  }, [dogId]);

  const handleLike = async () => {
    if (liked || isLiking) return;

    setIsLiking(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsLiking(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/dog/userlike/${userId}/${dogId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setLiked(true);
        alert('Você curtiu esse pet!');
      } else {
        alert('Erro ao curtir o pet.');
      }
    } catch {
      alert('Erro ao curtir o pet.');
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div style={styles.loaderContainer}>
        <p>Pet não encontrado.</p>
      </div>
    );
  }

  const displayPhotos = photos.length
    ? photos
    : ['/assets/images/dog_default.jpg'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          Voltar
        </button>
        <h1 style={styles.headerTitle}>{dog.name}</h1>
      </header>

      <div style={styles.carousel}>
        {displayPhotos.map((photo, idx) => (
          <img
            key={idx}
            src={photo}
            alt={`Foto ${idx + 1}`}
            style={styles.image}
          />
        ))}
      </div>

      <div style={styles.infoContainer}>
        <div style={styles.infoHeader}>
          <h2 style={styles.name}>{dog.name}</h2>
          <button
            style={{
              ...styles.likeButton,
              ...(liked ? styles.liked : {}),
            }}
            onClick={handleLike}
            disabled={liked || isLiking}
            title={liked ? 'Você já curtiu esse pet' : 'Curtir'}
          >
            {liked ? 'Curtido ✓' : 'Curtir'}
          </button>
        </div>
        <p style={styles.text}><b>Raça:</b> {dog.breed}</p>
        <p style={styles.text}><b>Idade:</b> {dog.age} anos</p>
        <p style={styles.text}><b>Gênero:</b> {dog.gender}</p>
        <p style={styles.text}><b>Tamanho:</b> {dog.size}</p>
        {dog.description && (
          <p style={styles.text}><b>Sobre:</b> {dog.description}</p>
        )}
      </div>
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
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD54F',
    padding: '10px 20px',
    borderRadius: '10px',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  carousel: {
    display: 'flex',
    overflowX: 'auto' as 'auto',
    marginTop: '20px',
    gap: '10px',
  },
  image: {
    width: '300px',
    height: '300px',
    objectFit: 'cover' as 'cover',
    borderRadius: '10px',
    marginRight: '10px',
    background: '#fff',
  },
  infoContainer: {
    marginTop: '20px',
  },
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  likeButton: {
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: '#111',
    color: '#FFD54F',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 18px',
    fontWeight: 'bold',
    marginLeft: '10px',
    transition: 'background 0.2s, color 0.2s',
  },
  liked: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'default',
  },
  text: {
    fontSize: '16px',
    marginTop: '10px',
    color: '#333',
  },
};