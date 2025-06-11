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
  ImageStyle
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AdotaPetBackground from '../../../../assets/components/AdotaPetBackground';
import { Ip } from '@/assets/constants/config';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const imageHeight = windowWidth; // manter quadrado

// Componente que tenta carregar da URI e faz fallback na default
const FallbackImage: React.FC<{ uri: string; style?: ImageStyle }> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);
  console.log(uri);
  return (
    <Image
      source={
        errored
          ? require('../../../../assets/images/dog_default.jpg')
          : { uri }
      }
      style={style}
      onError={() => setErrored(true)}
    />
  );
};

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

export default function DogProfileScreen() {
  const router = useRouter();
  const { dogId } = useLocalSearchParams<{ dogId: string }>();

  const [dog, setDog] = useState<DogDetail | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadDog() {
      try {
        // 1) detalhe do dog
        const detailRes = await fetch(`http://${Ip}:8080/dog/id?id=${dogId}`);
        const detailJson = await detailRes.json();
        const data: DogDetail = detailJson.data;
        setDog(data);

        // 2) todas as fotos via seu endpoint
        const photosRes = await fetch(
          `http://${Ip}:8080/dog/all-photos?dogId=${dogId}`
        );
        const photosJson = await photosRes.json();
        const uris: string[] = (photosJson.data as Array<any>).map(entry => {
          let p = (entry.imgUrl as string).replace(/\\/g, '/');
          const idx = p.indexOf('/static/');
          if (idx >= 0) {
            p = p.substring(idx + '/static/'.length);
          }
          return `http://${Ip}:8080/${p}`;
        });
        setPhotos(uris);

        // 3) checa like atual
        const me = await AsyncStorage.getItem('userId');
        const uid = me ? Number(me) : null;
        if (uid !== null) {
          const likedIds = data.userLike.map(u =>
            typeof u === 'number' ? u : Number((u as any).id)
          );
          if (likedIds.includes(uid)) setLiked(true);
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do cão ou fotos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDog();
  }, [dogId]);

  const handleLike = async () => {
    if (liked || isLiking) return;
    setIsLiking(true);
    const me = await AsyncStorage.getItem('userId');
    const uid = me ? Number(me) : null;
    if (!uid) {
      setIsLiking(false);
      return;
    }
    try {
      const res = await fetch(
        `http://${Ip}:8080/dog/userlike/${uid}/${dogId}`,
        { method: 'POST' }
      );
      if (res.ok) setLiked(true);
    } catch (err) {
      console.error('Falha de rede ao dar like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading || !dog) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const displayPhotos = photos.length > 0 ? photos : ['DEFAULT'];

  return (
    <AdotaPetBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{dog.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Carrossel de fotos */}
        <FlatList
          data={displayPhotos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.flatList}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) =>
            item === 'DEFAULT' ? (
              <Image
                source={require('../../../../assets/images/dog_default.jpg')}
                style={styles.image}
              />
            ) : (
              <FallbackImage uri={item} style={styles.image} />
            )
          }
        />

        {/* Informações */}
        <View style={[styles.infoContainer, { top: imageHeight * 1.1 }]}>
          <View style={styles.infoHeader}>
            <Text style={styles.name}>{dog.name}</Text>
            {/* <TouchableOpacity onPress={handleLike} disabled={liked || isLiking}>
              <Ionicons
                name="heart"
                size={28}
                color={liked ? 'red' : 'gray'}
              />
            </TouchableOpacity> */}
          </View>
          <Text style={styles.text}>Raça: {dog.breed}</Text>
          <Text style={styles.text}>Idade: {dog.age} anos</Text>
          <Text style={styles.text}>Gênero: {dog.gender}</Text>
          <Text style={styles.text}>Tamanho: {dog.size}</Text>
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
    backgroundColor: 'transparent'
  },
  header: {
    height: 50 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFD54F',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  flatList: {
    flexGrow: 0
  },
  image: {
    width: windowWidth,
    height: imageHeight,
    resizeMode: 'cover'
  },
  infoContainer: {
    position: 'absolute',
    marginTop: imageHeight-270,
    left: 20,
    right: 20,
    backgroundColor: 'transparent'
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333'
  },
  text: {
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
    backgroundColor: '#FFD54F',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignSelf: 'flex-start'
  }
});
