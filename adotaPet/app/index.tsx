import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../assets/components/AdotaPetBackground';
import { globalStyles } from '../assets/constants/styles';

export default function DogProfile() {
  const router = useRouter();

  // Lista de nomes dos botões com ícones correspondentes (Ionicons e FontAwesome)
  const buttonData = [
    { label: "Quero Adotar", icon: "paw", iconPack: 'Ionicons', name: 'VisitanteProfileScreen' },  // Nome da tela de redirecionamento
    { label: "Pets Curtidos", icon: "heart", iconPack: 'Ionicons', name: 'likedPets' },  // Nome da tela de redirecionamento
    { label: "Meus pets para adoção", icon: "dog", iconPack: 'FontAwesome5', name: 'VisitanteProfileScreen' },  // Nome da tela de redirecionamento
    { label: "Cadastrar pet para adoção", icon: "plus-circle", iconPack: 'FontAwesome5', name: 'cadastroDePet' },  // Nome da tela de redirecionamento
  ];
  
  return (
    <AdotaPetBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={globalStyles.title}>{dog.name}</Text>
        <ScrollView horizontal style={styles.photoGallery}>
          {dog.photos.map((photo, index) => (
            <Image key={index} source={photo} style={styles.photo} />
          ))}
        </ScrollView>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Breed: {dog.breed}</Text>
          <Text style={styles.infoText}>Age: {dog.age}</Text>
          <Text style={styles.infoText}>Size: {dog.size}</Text>
          <Text style={styles.infoText}>Gender: {dog.gender}</Text>
        </View>
        <TouchableOpacity style={globalStyles.button}>
          <Text style={globalStyles.buttonText}>Adopt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.back()}>
          <Text style={globalStyles.buttonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </AdotaPetBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  photoGallery: {
    marginVertical: 20,
  },
  photo: {
    width: 200,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});
