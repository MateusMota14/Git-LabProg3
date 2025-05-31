import React, { useState } from 'react';

export default function Settings() {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'Luan Passos',
    email: 'luan@example.com',
    country: 'Brasil',
    state: 'RJ',
    city: 'Rio de Janeiro',
    zCode: '20000-000',
    img: null,
  });

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (field: string, value: string) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value,
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileImageContainer}>
        <img
          src={user.img || '/assets/images/user_default.png'}
          alt="User"
          style={styles.profileImage}
        />
        <div style={styles.editIcon}>
          <span style={{ fontSize: '24px', color: '#6200ee' }}>✏️</span>
        </div>
      </div>

      <div style={styles.form}>
        <label style={styles.label}>Nome</label>
        <input
          type="text"
          style={styles.input}
          value={user.name}
          disabled={!editing}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          style={styles.input}
          value={user.email}
          disabled={!editing}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />

        <label style={styles.label}>País</label>
        <input
          type="text"
          style={styles.input}
          value={user.country}
          disabled={!editing}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />

        <label style={styles.label}>Estado</label>
        <input
          type="text"
          style={styles.input}
          value={user.state}
          disabled={!editing}
          onChange={(e) => handleInputChange('state', e.target.value)}
        />

        <label style={styles.label}>Cidade</label>
        <input
          type="text"
          style={styles.input}
          value={user.city}
          disabled={!editing}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />

        <label style={styles.label}>CEP</label>
        <input
          type="text"
          style={styles.input}
          value={user.zCode}
          disabled={!editing}
          onChange={(e) => handleInputChange('zCode', e.target.value)}
        />

        <button style={styles.button} onClick={handleEditToggle}>
          {editing ? 'Salvar' : 'Editar Perfil'}
        </button>
      </div>
    </div>
  );
}

const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f5f5f5',
    },
    profileImageContainer: {
      position: 'relative' as 'relative', 
      display: 'flex',
      justifyContent: 'center' as 'center', 
      marginBottom: '20px',
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '60px',
      border: '2px solid #6200ee',
    },
    editIcon: {
      position: 'absolute' as 'absolute', 
      bottom: '10px',
      right: '10px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '4px',
    },
    form: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    label: {
      fontSize: '16px',
      marginBottom: '5px',
      color: '#333',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      height: '50px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '0 15px',
      marginBottom: '15px',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#6200ee',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
      textAlign: 'center' as 'center', 
    },
  };