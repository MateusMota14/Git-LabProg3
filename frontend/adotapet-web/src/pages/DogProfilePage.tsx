import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patas from '../pata.png';

interface DogDetail {
  id: number;
  name: string;
  breed: string;
  age: string;
  description?: string;
  gender: string;
  size: string;
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
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    async function loadDog() {
      try {
        // Busca dados do cachorro
        const res = await fetch(`http://localhost:8080/dog/id?id=${dogId}`);
        const json = await res.json();
        const data: DogDetail = json.data;
        setDog(data);

        // Busca fotos do cachorro
        const photosRes = await fetch(`http://localhost:8080/dog/all-photos?dogId=${dogId}`);
        const photosJson = await photosRes.json();
        const photoList: string[] =
          Array.isArray(photosJson.data) && photosJson.data.length > 0
            ? photosJson.data.map((photo: any) =>
                photo.url && photo.url.startsWith('http')
                  ? photo.url
                  : `http://localhost:8080/${photo.url || ''}`
              )
            : [];
        setPhotos(photoList);

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

  // Fotos ou fallback
  const displayPhotos = photos.length
    ? photos
    : [require('../assets/images/dog_default.jpg')];

  // Navegação do carrossel
  const prevPhoto = () => setPhotoIdx(idx => (idx === 0 ? displayPhotos.length - 1 : idx - 1));
  const nextPhoto = () => setPhotoIdx(idx => (idx === displayPhotos.length - 1 ? 0 : idx + 1));

  return (
    <div
      style={{
        ...styles.bg,
        backgroundImage: `url(${patas})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '45px',
      }}
    >
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            ← Voltar
          </button>
        </div>

        {/* Carrossel de fotos */}
        <div style={styles.carouselContainer}>
          {displayPhotos.length > 1 && (
            <button style={{ ...styles.carouselBtn, left: 10, right: undefined }} onClick={prevPhoto} aria-label="Foto anterior">
              ‹
            </button>
          )}
          <img
            src={displayPhotos[photoIdx]}
            alt={`Foto ${photoIdx + 1}`}
            style={styles.image}
            onError={e => (e.currentTarget.src = require('../assets/images/dog_default.jpg'))}
          />
          {displayPhotos.length > 1 && (
            <button style={{ ...styles.carouselBtn, right: 10, left: undefined }} onClick={nextPhoto} aria-label="Próxima foto">
              ›
            </button>
          )}
        </div>

        {/* Informações */}
        <div style={styles.infoCard}>
          <div style={styles.infoHeader}>
            <span style={styles.name}>{dog.name}</span>
          </div>
          <div>
            <button
              style={{
                ...styles.likeButton,
                ...(liked ? styles.liked : {}),
                marginLeft: 0,    // mais à esquerda
                marginTop: 24,    // mais para baixo
                display: 'block', // força nova linha
              }}
              onClick={handleLike}
              disabled={liked || isLiking}
              title={liked ? 'Você já curtiu esse pet' : 'Curtir'}
            >
              {liked ? 'Curtido ✓' : 'Curtir'}
            </button>
          </div>
          <div style={styles.infoRow}><b>Raça:</b> {dog.breed}</div>
          <div style={styles.infoRow}><b>Idade:</b> {dog.age} anos</div>
          <div style={styles.infoRow}><b>Gênero:</b> {dog.gender}</div>
          <div style={styles.infoRow}><b>Tamanho:</b> {dog.size}</div>
          {dog.description && (
            <div style={styles.infoRow}><b>Sobre:</b> {dog.description}</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  bg: {
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 450,
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
    padding: 0,
    margin: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '92%',
    background: '#FFD54F',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
  },
  carouselContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px 0 0 0',
    position: 'relative',
    minHeight: 320,
  },
  image: {
    width: 300,
    height: 300,
    objectFit: 'cover',
    borderRadius: 16,
    background: '#eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  carouselBtn: {
    position: 'absolute',
    top: '35%', // diminua de '50%' para '35%' para subir as setas
    transform: 'translateY(-50%)',
    background: '#FFD54F',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    fontSize: 24,
    color: '#333',
    cursor: 'pointer',
    zIndex: 2,
    userSelect: 'none',
    padding: 0,
    lineHeight: 1,         // <-- Adicione esta linha
    paddingTop: 2,         // <-- E esta linha para subir a seta
  },
  infoCard: {
    width: '100%',
    padding: '24px 24px 32px 350px', // aumente o último valor para mover para a direita
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  likeButton: {
    fontSize: 18,
    cursor: 'pointer',
    backgroundColor: '#111',
    color: '#FFD54F',
    border: 'none',
    borderRadius: 8,
    padding: '8px 18px',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 12, // <-- adiciona espaço acima do botão
    transition: 'background 0.2s, color 0.2s',
  },
  liked: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    cursor: 'default',
  },
  infoRow: {
    fontSize: 17,
    color: '#333',
    margin: '8px 0 0 0',
    width: '100%',
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
};