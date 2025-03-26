import React, { ReactNode } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface Props {
  children: ReactNode;
}

const { width, height } = Dimensions.get('window');
const columns = Math.ceil(width / 45);
const rows = Math.ceil(height / 45);

export default function AdotaPetBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Image
          key={index}
          source={require('../images/pata.png')}
          style={{
            position: 'absolute',
            width: 45,
            height: 45,
            top: Math.floor(index / columns) * 45,
            left: (index % columns) * 45,
            opacity: 0.4,
          }}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
