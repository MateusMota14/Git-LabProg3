// // src/screens/EditResidenceScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import AdotaPetBackground from "../../assets/components/AdotaPetBackground";
// import { Ip } from "../../assets/constants/config";

// export default function editProfile() {
//   const [city, setCity] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [country, setCountry] = useState("");
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const loadCurrent = async () => {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) return;
//       const res = await fetch(`http://${Ip}:8080/user/id?id=${userId}`);
//       const json = await res.json();
//       const u = json.data;
//       setCity(u.city);
//       setStateName(u.state);
//       setCountry(u.country);
//       setLoading(false);
//     };
//     loadCurrent();
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) throw new Error("Usuário não logado");

//       const res = await fetch(`http://${Ip}:8080/user/residence`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, city, state: stateName, country }),
//       });
//       const json = await res.json();
//       if (json.message === "OK") {
//         Alert.alert("Sucesso", "Moradia atualizada com sucesso.", [
//           { text: "OK", onPress: () => router.back() },
//         ]);
//       } else {
//         throw new Error(json.message || "Erro ao atualizar");
//       }
//     } catch (err: any) {
//       Alert.alert("Erro", err.message);
//     }
//   };

//   if (loading) {
//     return null;
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <AdotaPetBackground>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//           style={styles.container}
//         >
//           <Text style={styles.label}>Cidade</Text>
//           <TextInput
//             style={styles.input}
//             value={city}
//             onChangeText={setCity}
//           />

//           <Text style={styles.label}>Estado</Text>
//           <TextInput
//             style={styles.input}
//             value={stateName}
//             onChangeText={setStateName}
//           />

//           <Text style={styles.label}>País</Text>
//           <TextInput
//             style={styles.input}
//             value={country}
//             onChangeText={setCountry}
//           />

//           <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
//             <Text style={styles.saveButtonText}>Salvar</Text>
//           </TouchableOpacity>
//         </KeyboardAvoidingView>
//       </AdotaPetBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   label: { fontSize: 16, color: "#333", marginTop: 12 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 6,
//     padding: 10,
//     marginTop: 4,
//   },
//   saveButton: {
//     backgroundColor: "#FFD54F",
//     padding: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 24,
//   },
//   saveButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
// });