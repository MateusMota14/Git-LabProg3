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
  ImageStyle
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
import { Ip } from "../../assets/constants/config";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;

// componente que tenta baixar e cai no default se der erro
const FallbackImage: React.FC<{
  uri: string;
  style?: ImageStyle;
}> = ({ uri, style }) => {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      source={
        errored
          ? require("../../assets/images/dog_default.jpg")
          : { uri }
      }
      style={style}
      onError={() => setErrored(true)}
    />
  );
};

interface Dog {
  id: number;
  name: string;
  gender: string;
  age: string;
  imgUri: string;
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
        const id = await AsyncStorage.getItem("userId");
        if (!id) throw new Error("Usuário não logado");

        // usuário
        const userRes = await fetch(`http://${Ip}:8080/user/id?id=${id}`);
        const userJson = await userRes.json();
        setUser(userJson.data);

        // foto do usuário
        const imgRes = await fetch(`http://${Ip}:8080/user/img/${id}`);
        const imgJson = await imgRes.json();
        if (imgJson.message === "OK" && imgJson.data) {
          setUserImgUrl(`http://${Ip}:8080/${imgJson.data}`);
        }

        // lista de dogs
        const dogRes = await fetch(`http://${Ip}:8080/user/dogs?userId=${id}`);
        const dogJson = await dogRes.json();
        const dogArray: any[] = Array.isArray(dogJson.data) ? dogJson.data : [];

        const dogList: Dog[] = dogArray.map((dog) => ({
          id: dog.id,
          name: dog.name,
          gender: dog.gender,
          age: `${dog.age} anos`,
          imgUri: `http://${Ip}:8080/dog/img/${dog.id}`,
        }));

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

  const getProfileImageSource = () => {
    if (userImgUrl && !imgError) {
      return { uri: userImgUrl };
    }
    return require("../../assets/images/user_default.png");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AdotaPetBackground>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Torna a imagem clicável */}
          <TouchableOpacity
            onPress={() => router.push("/screens/profile")}
            activeOpacity={0.7}
          >
            <Image
              source={getProfileImageSource()}
              style={styles.profileImage}
              onError={() => setImgError(true)}
            />
          </TouchableOpacity>

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.location}>
            {user ? `${user.city} - ${user.state}, ${user.country}` : ""}
          </Text>

          <FlatList
            data={dogs}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.dogCard}>
                {/* imagem do cão */}
                
                <FallbackImage uri={item.imgUri} style={styles.dogImage} />

                <View style={styles.dogInfo}>
                  <Text style={styles.dogName}>{item.name}</Text>
                  <View style={styles.separator} />
                  <View style={styles.detailsRow}>
                    <Text style={styles.dogGender}>{item.gender}</Text>
                    <Text style={styles.dogAge}>{item.age}</Text>
                  </View>
                </View>

                {/* botão de edição abaixo da foto */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/screens/dogs/editarDog/${item.id}`)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.dogList}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum pet cadastrado</Text>
            )}
          />
        </ScrollView>

        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            onPress={() => router.push("/screens/home")}
            style={styles.navButton}
          >
            <Ionicons name="home" size={20} color="#FFD54F" />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/screens/chat/chatListScreen")}
            style={styles.navButton}
          >
            <Ionicons name="chatbubble" size={20} color="#FFD54F" />
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </AdotaPetBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    padding: 20,
    alignItems: "center"
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#FFD54F",
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333"
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20
  },
  dogList: {
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 20
  },
  dogCard: {
    width: (windowWidth - 60) / 2,
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFD54F",
    elevation: 2,
    alignItems: "center",  // centraliza o conteúdo
    paddingBottom: 10      // espaço inferior para o botão
  },
  dogImage: {
    width: "100%",
    height: 200
  },
  dogInfo: {
    padding: 10,
    alignItems: "center"
  },
  dogName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#fff",
    marginVertical: 6
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10
  },
  dogGender: {
    fontSize: 14,
    color: "#777"
  },
  dogAge: {
    fontSize: 14,
    color: "#555"
  },
  editButton: {
    marginTop: 8,
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  editButtonText: {
    color: "#FFD54F",
    fontSize: 14,
    fontWeight: "bold"
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    marginTop: 20
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "black",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFD54F",
    marginLeft: 5
  }
});
