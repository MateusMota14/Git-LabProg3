import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { Ip } from "../../assets/constants/config";
import { useRouter } from "expo-router";

const windowWidth = Dimensions.get("window").width;

interface Dog {
  id: number;
  name: string;
  gender: string;
  age: string;
  img: any;
}

interface UserProfile {
  name: string;
  city: string;
  state: string;
  country: string;
}

export default function VisitanteProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // 1) pega o ID do usuário logado
        const id = await AsyncStorage.getItem("userId");
        if (!id) throw new Error("Usuário não logado");

        // 2) busca dados do usuário
        const userRes = await fetch(`http://${Ip}:8080/user/id?id=${id}`);
        const userJson = await userRes.json();
        const userData = userJson.data;
        if (!userData) throw new Error("Resposta sem dados de usuário");
        setUser(userData);

        // 3) busca foto do usuário
        const imgRes = await fetch(`http://${Ip}:8080/user/img/${id}`);
        const imgJson = await imgRes.json();
        if (imgJson.message === "OK" && imgJson.data) {
          setUserImgUrl(`http://${Ip}:8080/${imgJson.data}`);
        }

        // 4) busca pets do usuário
        const dogRes = await fetch(`http://${Ip}:8080/user/dogs?userId=${id}`);
        const dogJson = await dogRes.json();
        const dogArray: any[] = Array.isArray(dogJson.data) ? dogJson.data : [];

        const dogList: Dog[] = await Promise.all(
          dogArray.map(async (dog: any) => {
            try {
              const dogImgRes = await fetch(
                `http://${Ip}:8080/dog/img/${dog.id}`
              );
              const dogImgJson = await dogImgRes.json();
              const uri =
                dogImgJson.message === "OK" && dogImgJson.data
                  ? { uri: `http://${Ip}:8080/${dogImgJson.data}` }
                  : require("../../assets/images/dog_default.jpg");

              return {
                id: dog.id,
                name: dog.name,
                gender: dog.gender,
                age: `${dog.age} anos`,
                img: uri,
              };
            } catch {
              return {
                id: dog.id,
                name: dog.name,
                gender: dog.gender,
                age: `${dog.age} anos`,
                img: require("../../assets/images/dog_default.jpg"),
              };
            }
          })
        );
        setDogs(dogList);
      } catch (err) {
        console.error("Erro ao carregar perfil ou pets:", err);
        setDogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFD54F" />
      </SafeAreaView>
    );
  }

  const getProfileImage = () => {
    if (userImgUrl && !imgError) {
      return { uri: userImgUrl };
    }
    return require("../../assets/images/user_default.png");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdotaPetBackground>
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={getProfileImage()}
            style={styles.profileImage}
            onError={() => setImgError(true)}
          />
          <Text style={styles.name}>{user?.name ?? "Nome do usuário"}</Text>
          <Text style={styles.location}>
            {user
              ? `${user.city} - ${user.state}, ${user.country}`
              : "Cidade - Estado, País"}
          </Text>

          <FlatList
            data={dogs}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dogCard}
                onPress={() => router.push(`/dog/${item.id}`)}
              >
                <Image source={item.img} style={styles.dogImage} />
                <View style={styles.dogInfo}>
                  <Text style={styles.dogName}>{item.name}</Text>
                  <View style={styles.separator} />
                  <View style={styles.detailsRow}>
                    <Text style={styles.dogGender}>{item.gender}</Text>
                    <Text style={styles.dogAge}>{item.age}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.dogList}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            )}
          />
        </ScrollView>
      </AdotaPetBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFD54F",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  dogList: {
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  dogCard: {
    width: (windowWidth - 60) / 2,
    minHeight: 100,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFD54F",
    elevation: 2,
  },
  dogImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dogInfo: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  dogName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#fff",
    marginVertical: 6,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  dogGender: {
    fontSize: 14,
    color: "#777",
  },
  dogAge: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
});
