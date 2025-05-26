import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AdotaPetBackground from '../../assets/components/AdotaPetBackground';
import { globalStyles } from '../../assets/constants/styles';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AdotaPetBackground>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/icon.png')}
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
