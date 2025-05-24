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
  Image,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { globalStyles } from "../../assets/constants/styles";
import AdotaPetBackground from '../../assets/components/AdotaPetBackground';

interface FormData {
  petName: string;
  petAge: string;
  petBreed: string;
  petDescription: string;
  petImages: string[];
}

const AdoptionRegistration: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petAge: '',
    petBreed: '',
    petDescription: '',
    petImages: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const pickImages = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Permissão negada", "Permita o acesso à galeria.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    const uris = result.assets.map(asset => asset.uri);
    setFormData((prev) => ({ ...prev, petImages: uris }));
    if (errors.petImages) setErrors((prev) => ({ ...prev, petImages: false }));
  }
};


  const validateForm = async () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach((field) => {
    const value = formData[field];
    if (typeof value === 'string') {
        if (!value.trim()) newErrors[field] = true;
    } else if (Array.isArray(value)) {
        if (value.length === 0) newErrors[field] = true;
    }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://172.15.2.16:8080/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={globalStyles.title}>Registrar Pet</Text>

          <TextInput
            placeholder="Nome do Pet"
            placeholderTextColor="#555"
            value={formData.petName}
            onChangeText={(value) => handleChange("petName", value)}
            style={[styles.input, errors.petName && styles.inputError]}
          />
          <TextInput
            placeholder="Raça"
            placeholderTextColor="#555"
            value={formData.petBreed}
            onChangeText={(value) => handleChange("petBreed", value)}
            style={[styles.input, errors.petBreed && styles.inputError]}
          />
          <TextInput
            placeholder="Idade do Pet"
            placeholderTextColor="#555"
            value={formData.petAge}
            onChangeText={(value) => handleChange("petAge", value)}
            style={[styles.input, errors.petAge && styles.inputError]}
          />
          <TextInput
            placeholder="Bio"
            placeholderTextColor="#555"
            value={formData.petDescription}
            onChangeText={(value) => handleChange("petDescription", value)}
            style={[styles.input, errors.petDescription && styles.inputError]}
          />

          <TouchableOpacity style={globalStyles.button} onPress={pickImages}>
            <Text style={globalStyles.buttonText}>Selecionar Imagem</Text>
          </TouchableOpacity>

          {formData.petImages.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
                {formData.petImages.map((uri, index) => (
                <Image
                    key={index}
                    source={{ uri }}
                    style={{ width: 100, height: 100, margin: 5, borderRadius: 8 }}
                />
                ))}
            </View>
            )}


          <TouchableOpacity style={globalStyles.button} onPress={validateForm}>
            <Text style={globalStyles.buttonText}>Enviar</Text>
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
    paddingTop: 150
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

export default AdoptionRegistration;
