import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../assets/components/AdotaPetBackground';
import { globalStyles } from '../assets/constants/styles';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <AdotaPetBackground>
        {/* Cabeçalho dentro do Background */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Olá, Usuário</Text>
          <Image
            source={require('../assets/images/Alfredo.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>


        <ScrollView contentContainerStyle={styles.buttonContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TouchableOpacity
              key={item}
              style={globalStyles.button}
              onPress={() => console.log(`Botão ${item} pressionado`)}
            >
              <Text style={globalStyles.buttonText}>Botão {item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Inferior Fixo */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity onPress={() => router.push('/home')} style={styles.navButton}>
            <Ionicons name="home" size={20} color="#007AFF" />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/chat')} style={styles.navButton}>
            <Ionicons name="chatbubble" size={20} color="#007AFF" />
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </AdotaPetBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', 
  },
  avatar: {
  width: 120,  
  height: 120, 
  borderRadius: 60, 
},
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 5,
  },
});
