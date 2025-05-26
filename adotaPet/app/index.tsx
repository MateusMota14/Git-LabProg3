import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../assets/components/AdotaPetBackground';
import { globalStyles } from '../assets/constants/styles';

export default function HomeScreen() {
  const router = useRouter();

  // Lista de nomes dos botões com ícones correspondentes (Ionicons e FontAwesome)
  const buttonData = [
    { label: "Quero Adotar", icon: "paw", iconPack: 'Ionicons', name: 'dogsAdoption' },  // Nome da tela de redirecionamento
    { label: "Pets Curtidos", icon: "heart", iconPack: 'Ionicons', name: 'likedPets' },  // Nome da tela de redirecionamento
    { label: "Meus pets para adoção", icon: "dog", iconPack: 'FontAwesome5', name: 'meusPets' },  // Nome da tela de redirecionamento
    { label: "Cadastrar pet para adoção", icon: "plus-circle", iconPack: 'FontAwesome5', name: 'cadastroDePet' },  // Nome da tela de redirecionamento
  ];
  
  return (
    <AdotaPetBackground>
      <View style={styles.topSection}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middleSection}>
        <Text style={globalStyles.title}>Bem-vindo ao AdotaPet!</Text>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => router.push('./auth/SignupScreen')}
        >
          <Text style={globalStyles.buttonText}>Criar Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => router.push('./auth/Login')}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </AdotaPetBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 60,
  },
  middleSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
