import React, { useEffect, useState } from 'react';

const CARD_MARGIN = 10;
const CARD_WIDTH = `calc((100% - ${CARD_MARGIN * 3}px) / 2)`;

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

  return (
    <img
      src={errored ? '/assets/images/dog_default.jpg' : uri}
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('Usuário não logado');

        const userRes = await fetch(`/api/user/id?id=${userId}`);
        const userJson = await userRes.json();
        setUser(userJson.data);

        const imgRes = await fetch(`/api/user/img/${userId}`);
        const imgJson = await imgRes.json();
        if (imgJson.message === 'OK' && imgJson.data) {
          setUserImgUrl(`/api/${imgJson.data}`);
        }

        const dogRes = await fetch(`/api/user/dogs?userId=${userId}`);
        const dogJson = await dogRes.json();
        const dogArray: any[] = Array.isArray(dogJson.data) ? dogJson.data : [];

        const dogList: Dog[] = dogArray.map(dog => ({
          id: dog.id,
          name: dog.name,
          gender: dog.gender,
          age: `${dog.age} anos`,
          imgUri: `/api/dog/img/${dog.id}`,
        }));

        setDogs(dogList);
      } catch (err) {
        console.error('Erro ao carregar perfil ou pets:', err);
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
    <div style={styles.container}>
      <header style={styles.header}>
        <img
          src={getProfileImage()}
          style={styles.profileImage as React.CSSProperties}
          onError={() => setImgError(true)}
          alt="User"
        />
        <h1 style={styles.name as React.CSSProperties}>{user?.name}</h1>
        <p style={styles.location as React.CSSProperties}>
          {user ? `${user.city} - ${user.state}, ${user.country}` : ''}
        </p>
      </header>

      {dogs.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText as React.CSSProperties}>Nenhum pet cadastrado</p>
        </div>
      ) : (
        <div style={styles.dogList}>
          {dogs.map(dog => (
            <div key={dog.id} style={styles.dogCard as React.CSSProperties}>
              <FallbackImage uri={dog.imgUri} style={styles.dogImage as React.CSSProperties} />
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
      )}
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
    marginBottom: '20px',
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    border: '2px solid #FFD54F',
    marginBottom: '10px',
  },
  name: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: '16px',
    color: '#666',
  },
  dogList: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap', 
    gap: `${CARD_MARGIN}px`,
    justifyContent: 'center' as 'center',
  },
  dogCard: {
    width: CARD_WIDTH,
    marginBottom: '15px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#FFD54F',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  dogImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as 'cover',
  },
  dogInfo: {
    padding: '10px',
    textAlign: 'center' as 'center',
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
  dogGender: {
    fontSize: '14px',
    color: '#777',
  },
  dogAge: {
    fontSize: '14px',
    color: '#555',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  emptyText: {
    fontSize: '16px',
    color: '#555',
  },
};