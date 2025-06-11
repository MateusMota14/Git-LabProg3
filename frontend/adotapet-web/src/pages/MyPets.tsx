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
}

interface UserProfile {
  name: string;
  city: string;
  state: string;
  country: string;
}

const FallbackImage: React.FC<{ uri: string; style?: React.CSSProperties }> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <img
        src={require('../assets/images/dog_default.jpg')}
        style={style}
        alt="Dog default"
      />
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

export default function MyPets() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('Usuário não logado');

        // Busca dados do usuário
        const userRes = await fetch(`http://localhost:8080/user/id?id=${userId}`);
        const userJson = await userRes.json();
        setUser(userJson.data);

        // Busca imagem do usuário
        const imgRes = await fetch(`http://localhost:8080/user/img/${userId}`);
        const imgJson = await imgRes.json();
        if (imgJson.message === 'OK' && imgJson.data) {
          setUserImgUrl(`http://localhost:8080/${imgJson.data}`);
        }

        // Busca dogs do usuário
        const dogRes = await fetch(`http://localhost:8080/user/dogs?userId=${userId}`);
        const dogJson = await dogRes.json();
        const dogArray: any[] = Array.isArray(dogJson.data) ? dogJson.data : [];

        const dogList: Dog[] = dogArray.map(dog => ({
          id: dog.id,
          name: dog.name,
          gender: dog.gender?.toLowerCase(),
          age: dog.age,
          imgUri: `http://localhost:8080/dog/img/${dog.id}`,
        }));

        setDogs(dogList);
      } catch (err) {
        setDogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  const getProfileImage = () => {
    if (userImgUrl && !imgError) return userImgUrl;
    return '/assets/images/user_default.png';
  };

  return (
    <div
      style={{
        ...styles.page,
        backgroundImage: `url(${patas})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '45px',
      }}
    >
      <Header title="Meus Pets" />
      <Footer />

      {/* Card do perfil do usuário, igual ao Profile */}
      <div style={styles.userCard}>
        <img
          src={getProfileImage()}
          style={styles.profileImage as React.CSSProperties}
          onError={() => setImgError(true)}
          alt="User"
        />
        <h1 style={styles.name}>{user?.name}</h1>
        <p style={styles.location}>
          {user ? `${user.city} - ${user.state}, ${user.country}` : ''}
        </p>
      </div>

      {/* Espaço entre o perfil e os cards dos cachorros */}
      <div style={{ height: 18 }} />

      {/* Lista de pets */}
      <div style={styles.dogList}>
        {dogs.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText as React.CSSProperties}>Nenhum pet cadastrado</p>
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
                  style={styles.editButton}
                  onClick={() => navigate(`/edit-pet/${dog.id}`)}
                >
                  Editar
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
    paddingBottom: 80,
    position: 'relative' as 'relative',
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
  userCard: {
    background: '#FFD54F',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    padding: 24,
    marginBottom: 32,
    width: 220,
    margin: '0 auto',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: '2px solid #fff',
    marginBottom: 12,
    objectFit: 'cover' as 'cover',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#333',
    margin: 0,
  },
  dogList: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: 16,
    justifyContent: 'center' as 'center',
    marginBottom: 80,
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
  editButton: {
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