import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from 'expo-router'; // Alterando para Expo Router

// Definição do tipo para o formulário de login
interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter(); // Usando o useRouter do Expo Router
  const [login, setLogin] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // Função para manipular mudanças no input
  const handleChange = (field: keyof LoginForm, value: string) => {
    setLogin((prev) => ({ ...prev, [field]: value }));
  };

  // Função para login
  const handleLogin = async () => {
    try {
      const response = await fetch("http://172.15.2.16:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: login.email,
          password: login.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        router.push("/profile"); // Navegar para o perfil ou outra tela
      } else {
        Alert.alert("Erro", data.message || "Email ou senha incorretos.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/SignupScreen")} // Navegando para a tela de signup
      >
        <Text style={styles.linkText}>Não tem uma conta? Crie uma aqui</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E3F2FD",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E88E5",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#64B5F6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    color: "#1E88E5",
    fontSize: 16,
    marginTop: 10,
  },
});

export default Login;
