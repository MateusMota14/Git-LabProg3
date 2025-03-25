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
        <Stack>
          <Stack.Screen name="index" options={{ title: "Início" }} />
          <Stack.Screen name="auth/SignupScreen" options={{ title: "Cadastro" }} />
          <Stack.Screen name="auth/Login" options={{ title: "Login" }} />
          <Stack.Screen name="screens/VisitanteProfileScreen" options={{ title: "Perfil de João" }} /> {/* import { useNavigation } from '@react-navigation/native';
                                                                                                            const navigation = useNavigation();
                                                                                                            useEffect(() => {
                                                                                                              navigation.setOptions({ title: user.name });
                                                                                                            }, [user]);*/}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
