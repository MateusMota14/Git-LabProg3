// app/screens/dogs/meudog/[dogId].tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, FlatList,
  Dimensions, ActivityIndicator, SafeAreaView,
  TouchableOpacity, Platform, StatusBar, ImageStyle, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AdotaPetBackground from '../../../../assets/components/AdotaPetBackground';
import { Ip } from '@/assets/constants/config';

const windowWidth = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (windowWidth - CARD_MARGIN * 3) / 2;

interface UserCard { id: number; name: string; imgUri: string; }
interface FallbackImageProps { uri: string; style?: ImageStyle; }

const FallbackImage: React.FC<FallbackImageProps> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      source={ errored
        ? require('../../../../assets/images/user_default.png')
        : { uri }
      }
      style={style}
      onError={() => setErrored(true)}
    />
  );
};

export default function DogLikesScreen() {
  const { dogId } = useLocalSearchParams<{ dogId: string }>();
  const [users, setUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // busca dog para extrair userLike[]
        const resDog = await fetch(`http://${Ip}:8080/dog/id?id=${dogId}`);
        const { data: dog } = await resDog.json();
        const likedIds: number[] = dog.userLike;

        const cards: UserCard[] = [];
        for (const uid of likedIds) {
          const resUser = await fetch(`http://${Ip}:8080/user/id?id=${uid}`);
          const { data: u } = await resUser.json();
          let path = u.img.replace(/\\/g, '/');
          const idx = path.indexOf('static/');
          if (idx >= 0) path = path.substring(idx + 7);
          const imgUri = `http://${Ip}:8080/${path}`;
          cards.push({ id: u.id, name: u.name, imgUri });
        }
        setUsers(cards);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [dogId]);

  const handleMatch = async (userId: number) => {
    if (processing.includes(userId)) return;
    setProcessing(ps => [...ps, userId]);

    try {
      const resMatch = await fetch(
        `http://${Ip}:8080/dog/usermatch/${userId}/${dogId}`,
        { method: 'POST' }
      );
      const jsonMatch = await resMatch.json();

      if (Array.isArray(jsonMatch.data) && jsonMatch.data.length > 0) {
        await fetch(`http://${Ip}:8080/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userOwner: { id: Number(await AsyncStorage.getItem('userId')) },
            userAdopt: { id: userId }
          })
        });
        router.push('/screens/chat/chatListScreen');
      } else {
        Alert.alert('Match não confirmado', jsonMatch.message);
      }
    } catch (e) {
      console.error('Erro ao dar match:', e);
    } finally {
      setProcessing(ps => ps.filter(id => id !== userId));
    }
  };

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
          <Text style={styles.title}>Quem Curtiu</Text>
          <View style={{ width: 24 }} />
        </View>

        {users.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ainda não há curtidas.</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            numColumns={2}
            keyExtractor={i => i.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <FallbackImage uri={item.imgUri} style={styles.avatar} />
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.likeBtn}
                  onPress={() => handleMatch(item.id)}
                  disabled={processing.includes(item.id)}
                >
                  <Ionicons
                    name="heart"
                    size={24}
                    color={processing.includes(item.id) ? 'gray' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

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
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#555' },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 80
  },
  header: {
    height: 50,
    backgroundColor: '#FFD54F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  title: { fontSize: 20, fontWeight: 'bold', color: 'black' },
  list: {
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 15,
    alignItems: 'center'
  },
  card: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN / 2,
    backgroundColor: '#FFD54F',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
    elevation: 2
  },
  avatar: {
    width: CARD_WIDTH - 20,
    height: CARD_WIDTH - 20,
    borderRadius: (CARD_WIDTH - 20) / 2,
    marginBottom: 8
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  likeBtn: { marginTop: 6 },
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
