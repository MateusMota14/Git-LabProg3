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
  Image,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useNavigation, useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "@/assets/constants/styles";
import AdotaPetBackground from "@/assets/components/AdotaPetBackground";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Ip } from "@/assets/constants/config";

interface FormData {
  petName: string;
  petAge: string;
  petBreed: string;
  petImages: string[];
  petGender: string,
  petSize: string,
  userId: number,
  petId: number,
}

const AdoptionRegistration: React.FC = () => {
  const router = useRouter();
  const {dogId} = useLocalSearchParams();

  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petAge: '',
    petBreed: '',
    petImages: [],
    petGender: '',
    petSize:'',
    userId: -1,
    petId:-1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const navigation = useNavigation();
  // buscar userId
  useEffect(() => {
  (async () => {
    
    try {
      const response = await fetch(`http://${Ip}:8080/dog/id?id=${dogId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      // use os dados aqui, por exemplo:
      setFormData({
          petName: data.data.name || "",
          petAge: data.data.age || "",
          petBreed: data.data.breed || "",
          petSize: data.data.size || "",
          petGender: data.data.gender || "",
          petImages:[],
          petId:data.data.id,
          userId: data.data.user.id

        });
      console.log(data.data.id);
    } catch (error) {
      console.error("Erro ao buscar o pet:", error);
    }
  })();
}, []);


  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSelectGender = (value: string) => {
  setFormData((prev) => ({ ...prev, petGender: value }));
  console.log(formData.petGender);
  };


  const handleSelectSize = (value: string) => {
  setFormData((prev) => ({ ...prev, petSize: value }));
  console.log(formData.petSize);

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
    const response = await fetch(`http://${Ip}:8080/dog/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dog: {
          name: formData.petName,
          age: formData.petAge,
          breed: formData.petBreed,
          gender: formData.petGender,
          size: formData.petSize,
          urlPhotos: formData.petImages,
          id: formData.petId,
        },
        userId: formData.userId,
      }),
    });

    const data = await response.json();

    if (response.ok && data.message === "Dog updated") {
      for (const uri of formData.petImages) {
        const base64 = await getBase64FromUri(uri);
        await fetch(`http://${Ip}:8080/dog/upload-photo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: formData.petId,
            photoBase64: base64,
          }),
        });
      }

      router.push("../../home");
    } else {
      Alert.alert("Erro", data.message || "Erro ao atualizar pet.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Falha ao conectar ao servidor.");
  }
};

const getBase64FromUri = async (uri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // remove o prefixo "data:image/jpeg;base64,"
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send();
  });
};

  return (
    <AdotaPetBackground>
      <KeyboardAvoidingView style={{ flex: 1, width: "100%" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={globalStyles.title}>Editar Pet</Text>

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
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10, display: 'flex', flexDirection: 'row', gap: 30, marginLeft: '5%' }}
                selected={formData.petGender}
                onSelected={handleSelectGender}
                radioBackground="#005b97"
              >
                <RadioButtonItem 
                    value={"Macho"} 
                    label={
                      <Text style={{fontFamily: 'Poppins_400Regular'}}>Macho</Text>
                    }
                    />
                  <RadioButtonItem
                    value={"Fêmea"}
                    label={
                      <Text style={{fontFamily: 'Poppins_400Regular'}}>Fêmea</Text>
                    }
                    />

            </RadioButtonGroup>
          </View>
          
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10, display: 'flex', flexDirection: 'row', gap: 30, marginLeft: '5%' }}
                selected={formData.petSize}
                onSelected={handleSelectSize}
                radioBackground="#005b97"
            >
              <RadioButtonItem 
                value={"Pequeno"} 
                label={
                  <Text style={{fontFamily: 'Poppins_400Regular'}}>Pequeno</Text>
                }
                />
              <RadioButtonItem
                value={"Médio"}
                label={
                  <Text style={{fontFamily: 'Poppins_400Regular'}}>Médio</Text>
                }
                />
                <RadioButtonItem
                value={"Grande"}
                label={
                  <Text style={{fontFamily: 'Poppins_400Regular'}}>Grande</Text>
                }
                />


            </RadioButtonGroup>
          </View>

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
