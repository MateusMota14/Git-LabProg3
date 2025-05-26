// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { Ip } from "../../assets/constants/config";

interface UserProfile {
  name: string;
  city: string;
  state: string;
  country: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) throw new Error("Usuário não logado");

        const res = await fetch(`http://${Ip}:8080/user/id?id=${userId}`);
        const json = await res.json();
        setUser(json.data);

        const imgRes = await fetch(`http://${Ip}:8080/user/img/${userId}`);
        const imgJson = await imgRes.json();
        if (imgJson.data) {
          setAvatarUrl(`http://${Ip}:8080/${imgJson.data}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("Usuário não logado");

      const res = await fetch(
        `http://${Ip}:8080/user/logout/${userId}`,
        { method: "POST" }
      );
      const json = await res.json();

      if (json.data) {
        // limpa credenciais locais
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("authToken");
        // redireciona para tela inicial (ajuste conforme sua rota)
        router.replace("/");
      } else {
        alert(json.message || "Falha no logout");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer logout");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFD54F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdotaPetBackground>
        <ScrollView contentContainerStyle={styles.container}>
          {avatarUrl && (
            <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
          )}
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.location}>
            {user?.city} - {user?.state}, {user?.country}
          </Text>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => router.push("/screens/editProfile")}
          >
            <Text style={styles.updateButtonText}>Atualizar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.logoutButton, logoutLoading && styles.buttonDisabled]}
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </AdotaPetBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, alignItems: "center" },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 4 },
  location: { fontSize: 16, color: "#666", marginBottom: 20 },
  updateButton: {
    backgroundColor: "#FFD54F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
  },
  updateButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutButtonText: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
  buttonDisabled: {
    opacity: 0.6,
  },
});
