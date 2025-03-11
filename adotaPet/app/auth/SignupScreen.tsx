import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Switch } from "react-native-gesture-handler";

// Definição do tipo para o formulário
interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
  zCode: string;
  isAdopter: boolean;
}

const SignupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
    zCode: "",
    isAdopter: false,
  });

  // Função para manipular mudanças no input
  const handleChange = (field: keyof SignupForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Função para criar conta
  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      // Enviar dados completos para o backend
      const response = await fetch("http://172.15.2.16:8080/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          country: form.country,
          state: form.state,
          city: form.city,
          zCode: form.zCode,
          isAdopter: form.isAdopter,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        navigation.goBack(); // Voltar para a tela anterior
      } else {
        Alert.alert("Erro", data.message || "Erro ao criar conta.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(value) => handleChange("confirmPassword", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="País"
        value={form.country}
        onChangeText={(value) => handleChange("country", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={form.state}
        onChangeText={(value) => handleChange("state", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={form.city}
        onChangeText={(value) => handleChange("city", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={form.zCode}
        onChangeText={(value) => handleChange("zCode", value)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Sou um adotante</Text>
        <Switch
          value={form.isAdopter}
          onValueChange={(value) => handleChange("isAdopter", value)}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Criar Conta</Text>
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
    backgroundColor: "#E3F2FD", // Azul claro
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1E88E5", // Azul escuro
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default SignupScreen;

