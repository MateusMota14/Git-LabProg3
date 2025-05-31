import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CARD_MARGIN = 10;
const CARD_WIDTH = `calc((100% - ${CARD_MARGIN * 3}px) / 2)`;

interface Dog {
  id: number;
  name: string;
  gender: string;
  age: string;
}

interface DogImageProps {
  uri: string;
  style?: React.CSSProperties;
}

/** Componente que tenta baixar a imagem e, se der erro, cai no default */
const DogImage: React.FC<DogImageProps> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);

  return (
    <img
      src={errored ? '/assets/images/dog_default.jpg' : uri}
      style={style}
      onError={() => setErrored(true)}
      alt="Dog"
    />
  );
};

export default function DogsAdoption() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogsByCity = async () => {
      try {
        const city = localStorage.getItem('city');
        if (!city) throw new Error('City not found in storage');

        const userIdStr = localStorage.getItem('userId');
        const currentUserId = userIdStr ? Number(userIdStr) : null;

        const res = await fetch(`/api/dog/city/${encodeURIComponent(city)}`);
        const json = await res.json();
        const allDogs: any[] = Array.isArray(json.data) ? json.data : [];

        const filtered = currentUserId
          ? allDogs.filter(d => d.user?.id !== currentUserId)
          : allDogs;

        setDogs(
          filtered.map(dog => ({
            id: dog.id,
            name: dog.name,
            gender: dog.gender,
            age: `${dog.age} anos`,
          }))
        );
      } catch (error) {
        console.error('Erro ao buscar cães por cidade:', error);
        setDogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDogsByCity();
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header as React.CSSProperties}>
        <h1 style={styles.title as React.CSSProperties}>Cães para Adoção</h1>
      </header>

      <div style={styles.dogList as React.CSSProperties}>
        {dogs.map(dog => (
          <div
            key={dog.id}
            style={styles.dogCard as React.CSSProperties}
            onClick={() => navigate(`/dogs/${dog.id}`)}
          >
            <DogImage
              uri={`/api/dog/img/${dog.id}`}
              style={styles.dogImage as React.CSSProperties}
            />
            <div style={styles.dogInfo as React.CSSProperties}>
              <h2 style={styles.dogName as React.CSSProperties}>{dog.name}</h2>
              <div style={styles.separator as React.CSSProperties} />
              <div style={styles.detailsRow as React.CSSProperties}>
                <span style={styles.dogGender as React.CSSProperties}>{dog.gender}</span>
                <span style={styles.dogAge as React.CSSProperties}>{dog.age}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer style={styles.bottomNavigation as React.CSSProperties}>
        <button onClick={() => navigate('/home')} style={styles.navButton as React.CSSProperties}>
          <span style={styles.navButtonText as React.CSSProperties}>Home</span>
        </button>
        <button onClick={() => navigate('/chat')} style={styles.navButton as React.CSSProperties}>
          <span style={styles.navButtonText as React.CSSProperties}>Chat</span>
        </button>
      </footer>
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
    textAlign: 'center' as 'center',
    backgroundColor: '#FFD54F',
    padding: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'black',
  },
  dogList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${CARD_MARGIN}px`,
    justifyContent: 'center',
  },
  dogCard: {
    width: CARD_WIDTH,
    marginBottom: '15px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#FFD54F',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    cursor: 'pointer',
  },
  dogImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as 'cover',
  },
  dogInfo: {
    padding: '10px',
    textAlign: 'center',
  },
  dogName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  separator: {
    width: '100%',
    height: '1px',
    backgroundColor: '#fff',
    margin: '6px 0',
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
  },
  dogGender: { fontSize: '14px', color: '#777' },
  dogAge: { fontSize: '14px', color: '#555' },
  bottomNavigation: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'black',
    borderTop: '1px solid #ddd',
    position: 'fixed',
    bottom: '0',
    width: '100%',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  navButtonText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#FFD54F',
    marginLeft: '5px',
  },
};