import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface DogDetail {
  id: number;
  name: string;
  breed: string;
  age: number;
  size: string;
  gender: string;
  urlPhotos: string[];
  userLike: Array<{ id: number | string } | number>;
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
        const res = await fetch(`/api/dog/id?id=${dogId}`);
        const json = await res.json();
        const data: DogDetail = json.data;
        setDog(data);

        const uris =
          data.urlPhotos?.map((path) => `/api/${path}`) ?? [];
        setPhotos(uris);

        const userId = localStorage.getItem('userId');
        if (userId) {
          const likedIds = data.userLike.map((u) =>
            typeof u === 'number' ? u : Number(u.id)
          );
          if (likedIds.includes(Number(userId))) {
            setLiked(true);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do cão:', err);
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
      const res = await fetch(`/api/dog/userlike/${userId}/${dogId}`, {
        method: 'POST',
      });
      const body = await res.json();
      if (res.ok) {
        setLiked(true);
      } else {
        console.warn('Erro no like:', body);
      }
    } catch (err) {
      console.error('Falha de rede ao dar like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading || !dog) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
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
          >
            ❤️
          </button>
        </div>
        <p style={styles.text}>Raça: {dog.breed}</p>
        <p style={styles.text}>Idade: {dog.age} anos</p>
        <p style={styles.text}>Gênero: {dog.gender}</p>
        <p style={styles.text}>Tamanho: {dog.size}</p>
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
  },
  image: {
    width: '300px',
    height: '300px',
    objectFit: 'cover' as 'cover',
    borderRadius: '10px',
    marginRight: '10px',
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
    fontSize: '24px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
  },
  liked: {
    color: 'red',
  },
  text: {
    fontSize: '16px',
    marginTop: '10px',
    color: '#333',
  },
};