import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { globalStyles } from "../../assets/constants/styles";
import { Ip } from "@/assets/constants/config";

// Defina a interface UserProfile para tipagem
interface UserProfile {
  id: number;
  name: string;
  email: string;
  password?: string; // Senha é opcional aqui, pois não é retornada diretamente
  country: string;
  state: string;
  city: string;
  zcode: string; // Corrigido para 'zcode' conforme a entidade UserEntity
}

interface FormData {
  id: number;
  name: string;
  email: string;
  password: string;
  country: string;
  state: string;
  city: string;
  zcode: string; // Usando 'zcode' para o formulário, mas 'zcode' para a entidade
}

const UpdateScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: -1,
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    city: "",
    zcode: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const navigation = useNavigation();
  const [userId, setUserId] = useState<number | null>(null); // Estado para armazenar o userId
  const [user, setUser] = useState<UserProfile | null>(null); // Mantido para caso precise do objeto completo do usuário
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false); // Não usado neste código

  // Buscar userId e dados do usuário na montagem
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (!storedUserId) {
          throw new Error("Usuário não logado");
        }

        const numericUserId = Number(storedUserId); // Converter para número
        setUserId(numericUserId); // Atualiza o estado userId

        // Buscar dados do usuário
        const res = await fetch(`http://${Ip}:8080/user/id?id=${numericUserId}`);
        if (!res.ok) {
          throw new Error(`Erro ao buscar perfil: ${res.statusText}`);
        }
        const json = await res.json();
        const userData: UserProfile = json.data;

        setUser(userData); // Define o objeto UserProfile completo

        // Preenche o formData com os dados do banco de dados
        setFormData({
          id: numericUserId,
          name: userData.name || "",
          email: userData.email || "",
          password: "", // Senha não é preenchida por segurança
          country: userData.country || "",
          state: userData.state || "",
          city: userData.city || "",
          zcode: userData.zcode || "", // Usando 'zcode' da entidade
        });

        // Buscar imagem do usuário
        const imgRes = await fetch(`http://${Ip}:8080/user/img/${numericUserId}`);
        const imgJson = await imgRes.json();
        if (imgJson.data) {
          setAvatarUrl(`http://${Ip}:8080/${imgJson.data}`);
        }

      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
        // Opcional: Redirecionar para a tela de login se o usuário não estiver logado
        // router.replace('/login');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []); // Array de dependências vazio para rodar apenas na montagem


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

  // const pickImages = async () => {
  //   const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (!permission.granted) {
  //     Alert.alert("Permissão negada", "Permita o acesso à galeria.");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsMultipleSelection: false, // Alterado para selecionar apenas uma imagem para perfil
  //     quality: 0.7, // Reduz a qualidade para uploads mais rápidos
  //   });

  //   if (!result.canceled && result.assets.length > 0) {
  //     const selectedImage = result.assets[0];
  //     setLoading(true); // Opcional: iniciar loading para o upload da imagem

  //     if (userId === null) {
  //       Alert.alert("Erro", "ID do usuário não disponível para upload da imagem.");
  //       setLoading(false);
  //       return;
  //     }

  //     const formDataImage = new FormData();
  //     formDataImage.append('file', {
  //       uri: selectedImage.uri,
  //       name: `avatar_${userId}.${selectedImage.uri.split('.').pop()}`, // Nome único para o arquivo
  //       type: selectedImage.type || 'image/jpeg', // Define o tipo de arquivo
  //     } as any); // 'as any' para contornar problemas de tipagem com FormData para arquivos

  //     try {
  //       const response = await fetch(`http://${Ip}:8080/user/img/${userId}`, {
  //         method: 'POST',
  //         body: formDataImage,
  //         headers: {
  //           'Content-Type': 'multipart/form-data', // Importante para envio de arquivos
  //         },
  //       });

  //       const responseData = await response.json();

  //       if (response.ok && responseData.data) {
  //         setAvatarUrl(`http://${Ip}:8080/${responseData.data}`); // Atualiza o avatar na UI imediatamente
  //         Alert.alert("Sucesso", "Imagem de perfil atualizada!");
  //       } else {
  //         Alert.alert("Erro", responseData.message || "Erro ao atualizar a imagem de perfil.");
  //       }
  //     } catch (error) {
  //       console.error("Erro ao enviar imagem:", error);
  //       Alert.alert("Erro", "Falha ao conectar ao servidor para enviar a imagem.");
  //     } finally {
  //       setLoading(false); // Finaliza o loading
  //     }
  //   }
  // };


  const handleSignup = async () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};

    // valida campos vazios
    // Exclua a senha da validação de campo vazio se ela for opcional na atualização
    const fieldsToValidate: (keyof FormData)[] = ["name", "email", "country", "state", "city", "zcode"];

    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && !value.trim()) {
        newErrors[field] = true;
      }
    });

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
        method: "POST", // Geralmente PUT ou PATCH para atualizações
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
    //`http://${{Ip}:8080/user/img/${userId}`)
    // console.log("Tentando upload de imagem para URL:",`http://${Ip}:8080/user/img`) ;
    // console.log("Valor de userId:", userId);
  };

  if (loading) {
    return (
      <AdotaPetBackground>
        <View style={styles.loadingContainer}>
          <Text style={globalStyles.text}>Carregando dados do perfil...</Text>
        </View>
      </AdotaPetBackground>
    );
  }

  return (
    <AdotaPetBackground>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {avatarUrl && (
            // <TouchableOpacity
              //onPress={pickImages}
            //>
              <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
            //</TouchableOpacity>
          )}

          {[
            { placeholder: "Nome", field: "name" },
            {
              placeholder: "E-mail",
              field: "email",
              keyboardType: "email-address",
              autoCapitalize: "none",
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
          <TextInput
            placeholder="Senha Para Confirmar Alterações (Opcional, deixe em branco para não alterar)"
            // O campo "field" na definição da interface TextInputProps não é usado aqui,
            // mas 'secureTextEntry' e 'onChangeText' são importantes.
            secureTextEntry={true}
            placeholderTextColor="#555"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            style={[styles.input, errors.password && styles.inputError]} // Use errors.password
          />

          <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
            <Text style={globalStyles.buttonText}>Editar Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 12 },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UpdateScreen;