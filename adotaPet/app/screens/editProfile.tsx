import React, { useState,  useEffect } from "react";
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
import { useRouter, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../assets/constants/styles";
import { Ip } from "@/assets/constants/config";

interface FormData {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  city: string;
  zcode: string;
}

const UpdateScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
  id: -1,  
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
  state: "",
  city: "",
  zcode: "",
});

const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
const navigation = useNavigation();
const [userId, setUserId] = useState<number | null>(null);

// buscar userId
useEffect(() => {
  (async () => {
    const stored = await AsyncStorage.getItem("userId");
    if (!stored) {
      navigation.navigate("Login" as never);
      return;
    }
    const id = parseInt(stored, 10);
    setUserId(id);
  })();
}, []);

// buscar dados do usuário
useEffect(() => {
  if (userId === null) return;

  (async () => {
    const response = await fetch(`http://${Ip}:8080/user/id?id=${userId}`);
    const result = await response.json();
    const data = result.data;
    setFormData({
      id:userId,
      name: data.name || "",
      email: data.email || "",
      password: "",
      confirmPassword: "",
      country: data.country || "",
      state: data.state || "",
      city: data.city || "",
      zcode: data.zcode || "",
    });
    console.log("Dados carregados:", formData.id);
  })();
}, [userId]);



  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }

    if (field === "zcode" && value.replace(/\D/g, "").length === 8) {
      fetchAddressFromCEP(value);
    }
  };

  const fetchAddressFromCEP = async (cep: string) => {
    const sanitizedCep = cep.replace(/\D/g, "");

    if (!/^\d{8}$/.test(sanitizedCep)) {
      Alert.alert("CEP inválido", "Informe um CEP brasileiro com 8 números.");
      setErrors((prev) => ({ ...prev, zcode: true }));
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert("CEP inválido", "Não foi possível encontrar esse CEP.");
        setErrors((prev) => ({ ...prev, zcode: true }));
        return;
      }

      setFormData((prev) => ({
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
  const newErrors: Partial<Record<keyof FormData, boolean>> = {};
  
      // valida campos vazios
      (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
        const value = formData[field];
        if (typeof value === "string" && !value.trim()) {
          newErrors[field] = true;
        }
      });
  
      // valida senha
      if (formData.password !== formData.confirmPassword) {
        newErrors.password = true;
        newErrors.confirmPassword = true;
        Alert.alert("Erro", "As senhas não coincidem.");
      }
  
      // valida formato do CEP
      if (!/^\d{8}$/.test(formData.zcode.replace(/\D/g, ""))) {
        newErrors.zcode = true;
        Alert.alert("Erro", "Informe um CEP brasileiro válido (8 dígitos).");
      }
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  try {
    const response = await fetch(`http://${Ip}:8080/user/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Dados da resposta:", data);

    if (response.ok && (data.message === "User updated" || data.message === "Password changed successfully")) {
        Alert.alert("Sucesso", data.message);
        router.back();
        } else {
        Alert.alert("Erro", data.message || "Erro ao atualizar conta.");
    }
  } catch (error) {
    console.error("Erro no fetch:", error);
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
          <Text style={globalStyles.title}>foto</Text>

          {[
            { placeholder: "Nome", field: "name" },
            {
              placeholder: "E-mail",
              field: "email",
              keyboardType: "email-address",
              autoCapitalize: "none",
            },
            { placeholder: "Alterar Senha", field: "password", secureTextEntry: true },
            {
              placeholder: "Confirmar Senha",
              field: "confirmPassword",
              secureTextEntry: true,
            },
            { placeholder: "CEP", field: "zcode", keyboardType: "numeric" },
          ].map(({ placeholder, field, ...rest }) => (
            <TextInput
              key={field}
              placeholder={placeholder}
              placeholderTextColor="#555"
              value={formData[field as keyof FormData]}
              onChangeText={(value) => handleChange(field as keyof FormData, value)}
              style={[
                styles.input,
                errors[field as keyof FormData] && styles.inputError,
              ]}
              {...(rest as TextInputProps)}
            />
          ))}

          <TextInput
            placeholder="País"
            placeholderTextColor="#555"
            value={formData.country}
            onChangeText={(value) => handleChange("country", value)}
            style={[styles.input, errors.country && styles.inputError]}
          />
          <TextInput
            placeholder="Estado"
            placeholderTextColor="#555"
            value={formData.state}
            onChangeText={(value) => handleChange("state", value)}
            style={[styles.input, errors.state && styles.inputError]}
          />
          <TextInput
            placeholder="Cidade"
            placeholderTextColor="#555"
            value={formData.city}
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
    padding: 40,
    paddingTop: 100
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

export default UpdateScreen;
