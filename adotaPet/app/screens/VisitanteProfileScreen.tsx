import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";

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

const VisitanteProfileScreen: React.FC = () => {
  const { userIdVisitado } = useLocalSearchParams<{ userIdVisitado: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userImgUrl, setUserImgUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = userIdVisitado || "152";

        const userRes = await fetch(`http://172.15.2.16:8080/user/id?id=${id}`);
        const userData = await userRes.json();
        setUser(userData.data);

        const imgRes = await fetch(`http://172.15.2.16:8080/user/img/${id}`);
        const imgData = await imgRes.json();
        if (imgData.message === "OK" && imgData.data) {
          setUserImgUrl(`http://172.15.2.16:8080/${imgData.data}`);
        }

        // Busca dogs do usuário
        const dogRes = await fetch(`http://172.15.2.16:8080/user/dogs?userId=${id}`);
        const dogData = await dogRes.json();

        const dogList = await Promise.all(
          dogData.data.map(async (dog: any) => {
            try {
              const dogImgRes = await fetch(`http://172.15.2.16:8080/dog/img/${dog.id}`);
              const dogImgData = await dogImgRes.json();

              return {
                id: dog.id,
                name: dog.name,
                gender: dog.gender,
                age: dog.age + " anos",
                img:
                  dogImgData.message === "OK" && dogImgData.data
                    ? { uri: `http://172.15.2.16:8080/${dogImgData.data}` }
                    : require("../../assets/images/dog_default.jpg"),
              };
            } catch (err) {
              return {
                id: dog.id,
                name: dog.name,
                gender: dog.gender,
                age: dog.age + " anos",
                img: require("../../assets/images/dog_default.jpg"),
              };
            }
          })
        );

        setDogs(dogList);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setUserImgUrl(null);
      }
    };

    fetchData();
  }, [userIdVisitado]);

  const getProfileImage = () => {
    if (userImgUrl && !imgError) {
      return { uri: userImgUrl };
    }
    return require("../../assets/images/user_default.png");
  };

  return (
    <AdotaPetBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={getProfileImage()}
          style={styles.profileImage}
          onError={() => setImgError(true)}
        />
        <Text style={styles.name}>{user?.name || "Nome do Usuário"}</Text>
        <Text style={styles.location}>
          {user ? `${user.city} - ${user.state}, ${user.country}` : "Cidade - Estado, País"}
        </Text>

        <FlatList
          data={dogs}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.dogCard}>
              <Image source={item.img} style={styles.dogImage} />
              <View style={styles.dogInfo}>
                <Text style={styles.dogName}>{item.name}</Text>
                <Text style={styles.dogGender}>{item.gender}</Text>
                <Text style={styles.dogAge}>{item.age}</Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.dogList}
          scrollEnabled={false}
        />
      </ScrollView>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFD54F",
    elevation: 2,
  },
  dogImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dogInfo: {
    padding: 10,
    alignItems: "center",
  },
  dogName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dogGender: {
    fontSize: 14,
    color: "#777",
  },
  dogAge: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});

export default VisitanteProfileScreen;
