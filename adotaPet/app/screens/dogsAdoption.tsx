import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ImageProps,
  ImageStyle
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../../assets/components/AdotaPetBackground';
import { Ip } from '@/assets/constants/config';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (windowWidth - CARD_MARGIN * 3) / 2;

interface Dog {
  id: number;
  name: string;
  gender: string;
  age: string;
}

interface DogImageProps {
  uri: string;
  style?: ImageStyle;
}

/** Componente que tenta baixar a imagem e, se der erro, cai no default */
const DogImage: React.FC<DogImageProps> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);

  return (
    <Image
      source={
        errored
          ? require('../../assets/images/dog_default.jpg')
          : { uri }
      }
      style={style}
      onError={() => setErrored(true)}
    />
  );
};

export default function CityDogsScreen() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDogsByCity = async () => {
      try {
        const city = await AsyncStorage.getItem('city');
        if (!city) throw new Error('City not found in storage');

        const userIdStr = await AsyncStorage.getItem('userId');
        const currentUserId = userIdStr ? Number(userIdStr) : null;

        const res = await fetch(`http://${Ip}:8080/dog/city/${encodeURIComponent(city)}`);
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
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <AdotaPetBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cães para Adoção</Text>
        </View>

        <FlatList
          data={dogs}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.dogList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dogCard}
              onPress={() => router.push(`/screens/dogs/${item.id}`)}
            >
              {/* aqui usamos o DogImage, que faz fallback */}
              <DogImage
                uri={`http://${Ip}:8080/dog/img/${item.id}`}
                style={styles.dogImage}
              />
              <View style={styles.dogInfo}>
                <Text style={styles.dogName}>{item.name}</Text>
                <View style={styles.separator} />
                <View style={styles.detailsRow}>
                  <Text style={styles.dogGender}>{item.gender}</Text>
                  <Text style={styles.dogAge}>{item.age}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={styles.bottomNavigation}>
          <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.navButton}>
            <Ionicons name="home" size={20} color="#FFD54F" />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/screens/chat/chatListScreen')} style={styles.navButton}>
            <Ionicons name="chatbubble" size={20} color="#FFD54F" />
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </AdotaPetBackground>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 80
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD54F'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  dogList: {
    paddingHorizontal: CARD_MARGIN,
    alignItems: 'center',
    paddingTop: 15
  },
  dogCard: {
    width: CARD_WIDTH,
    marginBottom: 15,
    marginHorizontal: CARD_MARGIN / 2,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFD54F',
    elevation: 2
  },
  dogImage: {
    width: '100%',
    height: 200
  },
  dogInfo: {
    padding: 10,
    alignItems: 'center'
  },
  dogName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 6
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10
  },
  dogGender: { fontSize: 14, color: '#777' },
  dogAge: { fontSize: 14, color: '#555' },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD54F',
    marginLeft: 5
  }
});
