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

  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, boolean>>>({});

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }

    if (field === "zCode" && value.replace(/\D/g, "").length === 8) {
      fetchAddressFromCEP(value);
    }
  };

  const fetchAddressFromCEP = async (cep: string) => {
    const sanitizedCep = cep.replace(/\D/g, "");

    if (!/^\d{8}$/.test(sanitizedCep)) {
      Alert.alert("CEP inválido", "Informe um CEP brasileiro com 8 números.");
      setErrors((prev) => ({ ...prev, zCode: true }));
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não foi possível encontrar esse CEP.");
        setErrors((prev) => ({ ...prev, zCode: true }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        country: "Brasil",
        state: data.uf,
        city: data.localidade,
      }));
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      Alert.alert("Erro", "Não foi possível buscar o endereço.");
    }
  };

  const handleSignup = async () => {
    const newErrors: Partial<Record<keyof SignupForm, boolean>> = {};

    // valida campos vazios
    (Object.keys(form) as (keyof SignupForm)[]).forEach((field) => {
      if (!form[field].trim()) {
        newErrors[field] = true;
      }
    });

    // valida senha
    if (form.password !== form.confirmPassword) {
      newErrors.password = true;
      newErrors.confirmPassword = true;
      Alert.alert("Erro", "As senhas não coincidem.");
    }

    // valida formato do CEP
    if (!/^\d{8}$/.test(form.zCode.replace(/\D/g, ""))) {
      newErrors.zCode = true;
      Alert.alert("Erro", "Informe um CEP brasileiro válido (8 dígitos).");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://172.15.2.16:8080/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.message === "User created") {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        router.back();
      } else if (data.message === "User already exists") {
        setErrors((prev) => ({ ...prev, email: true }));
        Alert.alert("Erro", "Este e-mail já está em uso. Por favor, tente outro.");
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
            {
              placeholder: "E-mail",
              field: "email",
              keyboardType: "email-address",
              autoCapitalize: "none",
            },
            { placeholder: "Senha", field: "password", secureTextEntry: true },
            {
              placeholder: "Confirmar Senha",
              field: "confirmPassword",
              secureTextEntry: true,
            },
            { placeholder: "CEP", field: "zCode", keyboardType: "numeric" },
          ].map(({ placeholder, field, ...rest }) => (
            <TextInput
              key={field}
              placeholder={placeholder}
              placeholderTextColor="#555"
              value={form[field as keyof SignupForm]}
              onChangeText={(value) => handleChange(field as keyof SignupForm, value)}
              style={[
                styles.input,
                errors[field as keyof SignupForm] && styles.inputError,
              ]}
              {...(rest as TextInputProps)}
            />
          ))}

          <TextInput
            placeholder="País"
            placeholderTextColor="#555"
            value={form.country}
            onChangeText={(value) => handleChange("country", value)}
            style={[styles.input, errors.country && styles.inputError]}
          />
          <TextInput
            placeholder="Estado"
            placeholderTextColor="#555"
            value={form.state}
            onChangeText={(value) => handleChange("state", value)}
            style={[styles.input, errors.state && styles.inputError]}
          />
          <TextInput
            placeholder="Cidade"
            placeholderTextColor="#555"
            value={form.city}
            onChangeText={(value) => handleChange("city", value)}
            style={[styles.input, errors.city && styles.inputError]}
          />

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
  inputError: {
    borderColor: "#FF3B30",
  },
});

export default SignupScreen;
