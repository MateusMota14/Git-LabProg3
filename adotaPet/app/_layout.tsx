import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Importação do GestureHandlerRootView

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Envolva a navegação com GestureHandlerRootView */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerTitle: '',           // sem título
            headerBackTitle: '',       // sem texto ao lado da seta
            headerTransparent: true,   // só a seta, sem barra visível
            headerTintColor: '#000',   // cor da seta (ajuste se precisar)
          }}
        >
          {/* raiz: sem header nenhum */}
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />

          todas as outras mostram só a seta
          <Stack.Screen name="auth/SignupScreen" options={{ title: 'Cadastro' }} />
          <Stack.Screen name="auth/Login" options={{ /* herda só a seta */ }} />
          <Stack.Screen name="screens/meusPets" options={{ title: 'MeusPets' }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
