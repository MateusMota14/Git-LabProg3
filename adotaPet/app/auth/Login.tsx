import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../assets/constants/styles";
import { Ip } from "@/assets/constants/config";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [login, setLogin] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (field: keyof LoginForm, value: string) => {
    setLogin((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${Ip}:8080/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });
      const data = await response.json();
      const message = data.message;

      if (message?.startsWith("Login Sucessfull") && data.data?.id) {
        // guarda o ID do usuário para uso em outras telas
        await AsyncStorage.setItem("userId", String(data.data.id));
        await AsyncStorage.setItem("city", String(data.data.city));

        console.log("Sucesso", "Login realizado com sucesso!");
        router.push("/screens/home");
      } else if (message === "Password incorrect") {
        Alert.alert("Erro", "Senha incorreta. Tente novamente.");
      } else if (message === "User not found") {
        Alert.alert("Erro", "Usuário não encontrado. Verifique o e‑mail.");
      } else {
        Alert.alert("Erro", message || "Erro ao fazer login.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
    }
  };

  return (
    <AdotaPetBackground>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="E‑mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={login.email}
          onChangeText={(value) => handleChange("email", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={login.password}
          onChangeText={(value) => handleChange("password", value)}
        />

        <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/SignupScreen")}>
          <Text style={styles.linkText}>
            Não tem uma conta? Crie uma aqui
          </Text>
        </TouchableOpacity>
      </View>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#FFD54F",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  linkText: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;
