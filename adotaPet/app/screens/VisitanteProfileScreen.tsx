import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";

const windowWidth = Dimensions.get("window").width;

const VisitanteProfileScreen: React.FC = () => {
  const mockDogs = [
    { id: 1, name: "Caramelo", gender: "Macho", age: "3 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 2, name: "Luna", gender: "Fêmea", age: "2 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 3, name: "Thor", gender: "Macho", age: "4 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 4, name: "Mel", gender: "Fêmea", age: "1 ano", img: require("../../assets/images/dog_default.jpg") },
    { id: 5, name: "Rex", gender: "Macho", age: "5 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 6, name: "Nina", gender: "Fêmea", age: "3 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 7, name: "Toby", gender: "Macho", age: "2 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 8, name: "Bela", gender: "Fêmea", age: "6 meses", img: require("../../assets/images/dog_default.jpg") },
    { id: 9, name: "Bob", gender: "Macho", age: "7 anos", img: require("../../assets/images/dog_default.jpg") },
    { id: 10, name: "Lola", gender: "Fêmea", age: "2 anos", img: require("../../assets/images/dog_default.jpg") },
  ];

  return (
    <AdotaPetBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require("../../assets/images/user_default.png")}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Nome do Usuário</Text>
        <Text style={styles.location}>Cidade - Estado, País</Text>

        <FlatList
          data={mockDogs}
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
