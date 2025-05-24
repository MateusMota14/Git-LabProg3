import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../../assets/components/AdotaPetBackground';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Ip } from '@/assets/constants/config';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('Usuário não logado');

        const res = await fetch(`http://${Ip}:8080/user/id?id=${userId}`);
        const json = await res.json();
        const user = json.data;
        if (!user) throw new Error('Resposta sem dados de usuário');

        setUserName(user.name);

        const imgRes = await fetch(`http://${Ip}:8080/user/img/${userId}`);
        const imgJson = await imgRes.json();
        if (imgJson.data) {
          setAvatar({ uri: `http://${Ip}:8080/${imgJson.data}` });
        } else {
          setAvatar(require('../../assets/images/user_default.png'));
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setUserName('Visitante');
        setAvatar(require('../../assets/images/user_default.png'));
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFD54F" />
      </SafeAreaView>
    );
  }

  const buttonData = [
    { label: "Quero Adotar", icon: "paw", pack: 'Ionicons', name: 'dogsAdoption' },
    { label: "Pets Curtidos", icon: "heart", pack: 'Ionicons', name: 'likedPets' },
    { label: "Meus pets", icon: "dog", pack: 'FontAwesome5', name: 'meusPets' },
    { label: "Cadastrar pet", icon: "plus-circle", pack: 'FontAwesome5', name: 'cadastroDePet' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AdotaPetBackground>
        <View style={styles.header}>
          <Text style={styles.headerText}>Olá, {userName}</Text>
          {avatar && (
            <TouchableOpacity onPress={() => router.push('/screens/profile')}>
              <Image source={avatar} style={styles.avatar} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {buttonData.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.button}
              onPress={() => router.push(`/screens/${item.name}`)}
            >
              {item.pack === 'Ionicons'
                ? <Ionicons name={item.icon as any} size={40} color="#222" />
                : <FontAwesome5 name={item.icon as any} size={40} color="#222" />
              }
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
      </AdotaPetBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { height: 175, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#FFD54F' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'black' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 60, paddingBottom: 20 },
  button: { height: 160, width: 160, backgroundColor: '#FFD54F', borderRadius: 60, margin: 5, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#222', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
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
