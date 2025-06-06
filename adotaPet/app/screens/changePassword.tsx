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
  currentPassword: string; // senha antiga
  newPassword: string;
  confirmNewPassword: string;
}

const UpdateScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
  id: -1,  
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  
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
        id: userId,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    console.log("Dados carregados:", formData.id);
  })();
}, [userId]);



  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChangePassword = async () => {
  const newErrors: Partial<Record<keyof FormData, boolean>> = {};

  if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
    if (!formData.currentPassword) newErrors.currentPassword = true;
    if (!formData.newPassword) newErrors.newPassword = true;
    if (!formData.confirmNewPassword) newErrors.confirmNewPassword = true;
    Alert.alert("Erro", "Preencha todos os campos de senha.");
    setErrors(newErrors);
    return;
  }

  if (formData.newPassword !== formData.confirmNewPassword) {
    newErrors.newPassword = true;
    newErrors.confirmNewPassword = true;
    Alert.alert("Erro", "As senhas não coincidem.");
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch(`http://${Ip}:8080/user/changepassword?id=${formData.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok && data.message === "Password changed successfully") {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setErrors({});
    } else {
      Alert.alert("Erro", data.message || "Erro ao alterar a senha.");
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
          <Text style={globalStyles.title}></Text>

          {[
            { placeholder: "Senha Atual", field: "currentPassword", secureTextEntry: true },
            { placeholder: "Nova Senha", field: "newPassword", secureTextEntry: true },
            { placeholder: "Confirmar Nova Senha", field: "confirmNewPassword", secureTextEntry: true },
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

          <TouchableOpacity style={globalStyles.button} onPress={handleChangePassword}>
            <Text style={globalStyles.buttonText}>Mudar Senha</Text>
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
