import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from "react-native";
import { useRouter } from "expo-router";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../assets/constants/styles";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
  zCode: string;
}

const SignupScreen: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
    zCode: "",
  });

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch("http://192.168.15.132:8080/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.back();
      } else {
        Alert.alert("Erro", data.message || "Erro ao criar conta.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
    }
  };

  return (
    <AdotaPetBackground>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={globalStyles.title}>Criar Conta</Text>

          {[
            { placeholder: "Nome", field: "name" },
            { placeholder: "E-mail", field: "email", keyboardType: "email-address", autoCapitalize: "none" },
            { placeholder: "Senha", field: "password", secureTextEntry: true },
            { placeholder: "Confirmar Senha", field: "confirmPassword", secureTextEntry: true },
            { placeholder: "País", field: "country" },
            { placeholder: "Estado", field: "state" },
            { placeholder: "Cidade", field: "city" },
            { placeholder: "CEP", field: "zCode" },
          ].map(({ placeholder, field, ...rest }) => (
            <TextInput
              key={field}
              placeholder={placeholder}
              placeholderTextColor="#5559"
              value={form[field as keyof SignupForm]}
              onChangeText={(value) => handleChange(field as keyof SignupForm, value)}
              style={styles.input}
              {...(rest as TextInputProps)}
            />
          ))}

          <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
            <Text style={globalStyles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
});

export default SignupScreen;

// export const options = {
//   title: "Cadastro", // texto que aparecerá no topo
// };
