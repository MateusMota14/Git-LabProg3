import React, { useEffect, useState } from 'react';
import patas from '../pata.png';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Dog {
  id: number;
  name: string;
  gender: string;
  age: string;
  imgUri: string;
  userId: number;
}

const FallbackImage: React.FC<{ uri: string; style?: React.CSSProperties }> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
        }}
      >
        <span role="img" aria-label="dog" style={{ fontSize: 48, color: '#ccc' }}>🐶</span>
      </div>
    );
  }

  return (
    <img
      src={uri}
      style={style}
      onError={() => setErrored(true)}
      alt="Dog"
    />
  );
};

export default function DogsInCity() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState<number | null>(null);
  const [likedDogs, setLikedDogs] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('Usuário não logado');

        // Busca dados do usuário
        const userRes = await fetch(`http://localhost:8080/user/id?id=${userId}`);
        const userJson = await userRes.json();

        // Busca dogs da cidade do usuário, exceto os do próprio usuário
        const city = userJson.data.city;
        const dogRes = await fetch(`http://localhost:8080/dog/city/${encodeURIComponent(city)}`);
        const dogJson = await dogRes.json();
        const dogArray: any[] = Array.isArray(dogJson.data) ? dogJson.data : [];

        const dogList: Dog[] = dogArray
          .filter(dog => dog.user?.id !== Number(userId))
          .map(dog => ({
            id: dog.id,
            name: dog.name,
            gender: dog.gender?.toLowerCase(),
            age: dog.age,
            imgUri: `http://localhost:8080/dog/img/${dog.id}`,
            userId: dog.user?.id,
          }));

        setDogs(dogList);

        // Checa no backend se cada dog está curtido
        const liked: number[] = [];
        await Promise.all(
          dogList.map(async (dog) => {
            const res = await fetch(`http://localhost:8080/dog/id?id=${dog.id}`);
            const json = await res.json();
            if (json.data && Array.isArray(json.data.userLike) && json.data.userLike.includes(Number(userId))) {
              liked.push(dog.id);
            }
          })
        );
        setLikedDogs(liked);

      } catch (err) {
        setDogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLike = async (dogId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLikeLoading(dogId);
    try {
      await fetch(`http://localhost:8080/dog/userlike/${userId}/${dogId}`, {
        method: 'POST',
      });
      setLikedDogs(prev => [...prev, dogId]);
      alert('Você curtiu esse pet!');
    } catch {
      alert('Erro ao curtir o pet.');
    } finally {
      setLikeLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `url(${patas})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '45px',
      }}
    >
      <Header title="Pets na sua cidade" />
      <Footer />

      {/* Espaço entre header e cards */}
      <div style={{ height: 18 }} />

      {/* Lista de pets */}
      <div style={styles.dogList}>
        {dogs.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText as React.CSSProperties}>Nenhum pet encontrado na sua cidade</p>
          </div>
        ) : (
          dogs.map(dog => (
            <div key={dog.id} style={styles.dogCard}>
              <FallbackImage uri={dog.imgUri} style={styles.dogImage} />
              <div style={styles.dogInfo}>
                <div style={styles.dogName}>{dog.name}</div>
                <div style={styles.dogDetailsRow}>
                  <span style={styles.dogGender}>{dog.gender}</span>
                  <span style={styles.dogAge}>{dog.age} anos</span>
                </div>
                <button
                  style={{
                    ...styles.likeButton,
                    ...(likedDogs.includes(dog.id) ? styles.likedButton : {})
                  }}
                  onClick={() => handleLike(dog.id)}
                  disabled={likedDogs.includes(dog.id) || likeLoading === dog.id}
                >
                  {likedDogs.includes(dog.id)
                    ? 'Curtido ✓'
                    : likeLoading === dog.id
                      ? 'Curtindo...'
                      : 'Curtir'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    position: 'relative' as 'relative',
    paddingBottom: 40,
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  header: {
    width: '100%',
    backgroundColor: '#FFD54F',
    padding: '16px 0 8px 0',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    margin: '0 auto',
  },
  backButton: {
    backgroundColor: '#FFD54F',
    border: 'none',
    borderRadius: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  dogList: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: 16,
    justifyContent: 'center' as 'center',
    marginBottom: 40,
  },
  dogCard: {
    width: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFD54F',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    marginBottom: 12,
  },
  dogImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover' as 'cover',
    background: '#eee',
  },
  dogInfo: {
    padding: '18px 12px 20px 12px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  dogName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center' as 'center',
  },
  dogDetailsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    fontSize: 17,
    color: '#444',
    marginBottom: 14,
    textTransform: 'lowercase' as 'lowercase',
  },
  dogGender: {
    textTransform: 'lowercase' as 'lowercase',
  },
  dogAge: {
    textTransform: 'lowercase' as 'lowercase',
  },
  likeButton: {
    background: '#111',
    color: '#FFD54F',
    border: 'none',
    borderRadius: 8,
    padding: '8px 0',
    width: '90%',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 6,
    cursor: 'pointer',
  },
  likedButton: {
    background: '#4CAF50', // verde ou outra cor de destaque
    color: '#fff',
    border: 'none',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
};