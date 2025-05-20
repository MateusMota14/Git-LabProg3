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
  StatusBar
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
  img: any;
}

export default function CityDogsScreen() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDogsByCity = async () => {
      try {
        const city = await AsyncStorage.getItem('city');
        if (!city) throw new Error('City not found in storage');

        const res = await fetch(`http://${Ip}:8080/dog/city/${encodeURIComponent(city)}`);
        const json = await res.json();
        const dogsArray = Array.isArray(json.data) ? json.data : [];
        const list: Dog[] = await Promise.all(
          dogsArray.map(async (dog: any) => {
            let uriSource;
            try {
              const imgRes = await fetch(`http://${Ip}:8080/dog/img/${dog.id}`);
              const imgJson = await imgRes.json();
              uriSource = imgJson.message === 'OK' && imgJson.data
                ? { uri: `http://${Ip}:8080/${imgJson.data}` }
                : require('../../assets/images/dog_default.jpg');
            } catch {
              uriSource = require('../../assets/images/dog_default.jpg');
            }
            return {
              id: dog.id,
              name: dog.name,
              gender: dog.gender,
              age: `${dog.age} anos`,
              img: uriSource
            };
          })
        );
        setDogs(list);
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
              onPress={() => router.push(`/dog/${item.id}`)}
            >
              <Image source={item.img} style={styles.dogImage} />
              <View style={styles.dogInfo}>
                <Text style={styles.dogName}>{item.name}</Text>
                <Text style={styles.dogGender}>{item.gender}</Text>
                <Text style={styles.dogAge}>{item.age}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={styles.bottomNavigation}>
          <TouchableOpacity onPress={() => router.push('/screens/home')} style={styles.navButton}>
            <Ionicons name="home" size={20} color="#FFD54F" />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/screens/chatListScreen')} style={styles.navButton}>
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
    paddingHorizontal: 20,
    backgroundColor: '#FFD54F'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  dogList: {
    paddingHorizontal: CARD_MARGIN,
    alignItems: 'center'
  },
  dogCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFD54F',
    elevation: 2
  },
  dogImage: {
    width: '100%',
    height: 120
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
  dogGender: {
    fontSize: 14,
    color: '#777'
  },
  dogAge: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  },
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
