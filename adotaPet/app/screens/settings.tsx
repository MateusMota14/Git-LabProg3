import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AdotaPetBackground from "../../assets/components/AdotaPetBackground";

const SettingsScreen = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Alfredo',
    email: 'alfredo@example.com',
    country: 'Brasil',
    state: 'RJ',
    city: 'Rio de Janeiro',
    zCode: '20000-000',
    img: null,
  });

  return (
    <AdotaPetBackground>
      <ScrollView contentContainerStyle={styles.container}>   
        <TouchableOpacity>
          <Image
            source={user.img ? { uri: user.img } : require('../../assets/images/user_default.png')}
            style={styles.profileImage}
          />
          <MaterialIcons 
            name="edit" 
            size={24} 
            color="#6200ee" 
            style={styles.editIcon}
          />
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            editable={editing}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            editable={editing}
          />

          <Text style={styles.label}>País</Text>
          <TextInput
            style={styles.input}
            value={user.country}
            editable={editing}
          />

          <Text style={styles.label}>Estado</Text>
          <TextInput
            style={styles.input}
            value={user.state}
            editable={editing}
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={user.city}
            editable={editing}
          />

          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            value={user.zCode}
            editable={editing}
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.buttonText}>{editing ? 'Salvar' : 'Editar Perfil'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AdotaPetBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
