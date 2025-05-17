import React from 'react';  
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../assets/components/AdotaPetBackground';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  // Lista de nomes dos botões com ícones correspondentes (Ionicons e FontAwesome)
  const buttonData = [
    { label: "Quero Adotar", icon: "paw", iconPack: 'Ionicons', name: 'VisitanteProfileScreen' },  // Nome da tela de redirecionamento
    { label: "Pets Curtidos", icon: "heart", iconPack: 'Ionicons', name: 'likedPets' },  // Nome da tela de redirecionamento
    { label: "Meus pets para adoção", icon: "dog", iconPack: 'FontAwesome5', name: 'VisitanteProfileScreen' },  // Nome da tela de redirecionamento
    { label: "Cadastrar pet para adoção", icon: "plus-circle", iconPack: 'FontAwesome5', name: 'cadastroDePet' },  // Nome da tela de redirecionamento
  ];
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <AdotaPetBackground>
        
        <View style={styles.header}>
          <Text style={styles.headerText}>Olá, Alfredo</Text>
          <Image
            source={require('../assets/images/Alfredo.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        {/* Botões com ícones e texto */}
        <View style={styles.buttonContainer}>
          {buttonData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => router.push(`/screens/${item.name}`)}  // Navega para a tela com base no nome
            >
              {item.iconPack === 'Ionicons' ? (
                <Ionicons name={item.icon} size={40} color="#222222" />
              ) : (
                <FontAwesome5 name={item.icon} size={40} color="#222222" />
              )}
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Inferior */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 175,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFD54F',
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
    flexDirection: 'row',  // Coloca os botões lado a lado
    flexWrap: 'wrap',  // Permite que quebrem a linha caso não caibam
    justifyContent: 'center',  // Centraliza os botões
    gap: 10, // Espaçamento entre os botões
    marginTop: 60,  // Adiciona um espaço entre o conteúdo
    paddingBottom: 20,  // Padding para que o conteúdo não fique colado na parte inferior
  },
  button: {
    height: 160,
    width: 160,
    backgroundColor: '#FFD54F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 60,
    margin: 5,
    justifyContent: 'center',  // Centraliza o conteúdo do botão
    alignItems: 'center',  // Centraliza o conteúdo no botão
    flexDirection: 'column',  // Coloca o ícone acima do texto
  },
  buttonText: {
    color: '#222222',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',  // Garante que o texto dentro do botão esteja centralizado
    marginTop: 8,  // Espaço entre o ícone e o texto
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderColor: '#ddd',
    position: 'absolute', // Fixa o menu na parte inferior da tela
    bottom: 0, // Garante que ele ficará no final da tela
    width: '100%',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD54F',
    marginLeft: 5,
  },
});
