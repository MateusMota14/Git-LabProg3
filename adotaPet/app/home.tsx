import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../assets/components/AdotaPetBackground';
import { globalStyles } from '../assets/constants/styles';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AdotaPetBackground>
      <View style={styles.header}>
        <Text style={styles.headerText}>Olá, Usário</Text>
        <Image
          source={require('../assets/images/pata.png')} // Adicione o caminho correto para o ícone de avatar
          style={styles.avatar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity
            key={item}
            style={globalStyles.button}
            onPress={() => console.log(`Botão ${item} pressionado`)} // Substitua por navegação ou ação
          >
            <Text style={globalStyles.buttonText}>Botão {item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.navButton}>
          <Ionicons name="home" size={20} color="#FFD54F" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/chat')} style={styles.navButton}>
          <Ionicons name="chatbubble" size={20} color="#FFD54F" />
          <Text style={styles.navButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </AdotaPetBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    height:100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 200,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonContainer: {
    marginTop: 80, // Ajuste o valor dependendo da altura do cabeçalho fixo
    alignItems: 'center',
    paddingBottom: 20,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
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
