import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AppButton({ title, onPress, variant = 'primary', style = {} }) {
  const backgroundColor = variant === 'primary' ? '#007AFF' : variant === 'secondary' ? '#FFA500' : '#007AFF';
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
